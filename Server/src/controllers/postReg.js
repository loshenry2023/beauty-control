// ! Almacena un nuevo registro en tabla.
const { Op } = require('sequelize');
const showLog = require('../functions/showLog');
const createDBname = require('../functions/createDBname');
const createNewDB = require("../functions/createNewDB");
const createBasicData = require("../functions/createBasicData");
const logData = require("../functions/logData");
const sendMail = require("../functions/sendMail");
const { EMAIL, EMAIL_MAIN } = require("../functions/paramsEnv");

const postReg = async (dataInc) => {
    const { userLogged, tableName, tableNameText, data, conn, tableName2, tableName3, tableName4, tableName5, dbName, nameCompany } = dataInc;
    let dataLog = {
        nameCompany: nameCompany,
        dbName: dbName,
        userName: userLogged
    }
    try {
        let resp;
        switch (tableNameText) {
            case "Branch":
                resp = await AddRegBranch(tableName, data, dataLog);
                return { "created": "ok", "id": resp };
            case "Payment":
                resp = await AddRegPayment(tableName, data, dataLog);
                return { "created": "ok", "id": resp };
            case "Specialty":
                resp = await AddRegSpecialty(tableName, data, dataLog);
                return { "created": "ok", "id": resp };
            case "Service":
                resp = await AddRegService(tableName, data, conn, dataLog);
                return { "created": "ok", "id": resp };
            case "Client":
                resp = await AddRegClient(tableName, data, conn, dataLog);
                return { "created": "ok", "id": resp };
            case "User":
                resp = await AddRegUser(tableName, data, conn, tableName2, dbName, dataLog);
                return { "created": "ok", "id": resp };
            case "Company":
                resp = await AddRegCompany(tableName, data, userLogged, dataLog);
                return { "created": "ok", "id": resp };
            case "CompanyMain":
                resp = await AddRegUserMain(tableName, data, dataLog);
                return { "created": "ok", "id": resp };
            case "CatGastos":
                resp = await AddRegCatGastos(tableName, data, dataLog);
                return { "created": "ok", "id": resp };
            case "HistoryService":
                resp = await AddRegHistoricProc(tableName, data, conn, tableName2, tableName3, tableName4, dataLog);
                return { "created": "ok" };
            case "Calendar":
                resp = await AddRegCalendar(tableName, data, conn, tableName2, tableName3, tableName4, tableName5, dataLog);
                return { "created": "ok" };
            default:
                throw new Error("Tabla no válida");
        }
    } catch (err) {
        return { created: "error", message: err.message };
    }
}

async function AddRegService(Service, data, conn, dataLog) {
    const { serviceName, duration, price, ImageService, specialty } = data;
    let transaction; // manejo transacciones para evitar registros defectuosos por relaciones mal solicitadas
    try {
        if (!serviceName || !duration || !price || !ImageService || !specialty) { throw Error("Faltan datos"); }
        const svcLowercase = serviceName.toLowerCase();
        const existingSpec = await Service.findOne({
            where: { serviceName: { [Op.iLike]: svcLowercase } },
        });
        if (existingSpec) {
            throw Error("El procedimiento ya existe");
        }
        // Inicio la transacción:
        transaction = await conn.transaction();
        const [SvcCreated, created] = await Service.findOrCreate({
            where: { serviceName, duration, price, ImageService },
        });
        // Busco las especialidades para agregar las relaciones:
        for (const spec of specialty) {
            await SvcCreated.addSpecialties(spec, { transaction });
        }
        await transaction.commit();
        // Obtengo el id para devolver:
        const svcCreated = await Service.findOne({
            where: { serviceName: serviceName },
        });
        logData({ op: "C", nameCompany: dataLog.nameCompany, dbName: dataLog.dbName, userName: dataLog.userName, desc: `Service ${serviceName} was created` });
        return svcCreated.id;
    } catch (error) {
        if (transaction) await transaction.rollback();
        throw Error(`${error}`);
    }
}

async function AddRegUser(User, data, conn, Company, dbName, dataLog) {
    const { userName, name, lastName, role, notificationEmail, phone1, phone2, image, comission, branch, specialty } = data;
    let wasCreated = false;
    let transaction;
    try {
        // Es un alta de usuario:
        if (!userName || !name || !lastName || !role || !notificationEmail || !phone1 || !image || !comission || !branch || !specialty) { throw Error('Faltan datos'); }
        const nameLowercase = userName.toLowerCase();
        const existingUser = await Company.findOne({
            where: { userName: { [Op.iLike]: nameLowercase } },
        });
        if (existingUser) {
            throw Error('El usuario ya existe');
        }
        // Obtengo la información relacionada con la empresa:
        const existingData = await Company.findOne({
            where: {
                dbName: dbName
            }
        });
        if (!existingData) {
            throw Error('No se encontró información asociada de la empresa');
        }
        // Primero: lo agrego a la tabla de empresas:
        const regCompanyCreated = await Company.create({
            userName, dbName, nameCompany: existingData.nameCompany, subscribedPlan: existingData.subscribedPlan, imgCompany: existingData.imgCompany, expireAt: existingData.expireAt, token: ''
        });
        wasCreated = true;
        // Obtengo el id para llevar a la tabla de usuarios:
        const companyIdCreated = await Company.findOne({
            where: { userName },
        });
        // Segundo: lo agrego a la tabla de usuarios de la empresa (si falla la transacción debo eliminar el anterior):
        // Inicio la transacción:
        transaction = await conn.transaction();
        const [UserCreated, created] = await User.findOrCreate({
            where: { id: companyIdCreated.id, userName, notificationEmail, name, lastName, phoneNumber1: phone1, phoneNumber2: phone2, image, comission, role, first: "0" },
            transaction,
        });
        // Busco las sedes para agregar las relaciones:
        for (const brnch of branch) {
            await UserCreated.addBranches(brnch, { transaction });
        }
        // Busco las especialidades para agregar las relaciones:
        for (const spec of specialty) {
            await UserCreated.addSpecialties(spec, { transaction });
        }
        await transaction.commit();
        logData({ op: "C", nameCompany: dataLog.nameCompany, dbName: dataLog.dbName, userName: dataLog.userName, desc: `User ${userName} ${role} was created` });

        return companyIdCreated.id;
    } catch (error) {
        // Anulo la operación:
        if (transaction) await transaction.rollback();
        // También elimino el usuario de la tabla de empresas:
        if (wasCreated) {
            const toDelete = await Company.findOne({
                where: { userName },
            });
            await toDelete.destroy();
        }
        throw Error(`${error}`);
    }
}

async function AddRegCompany(Company, data, userLogged, dataLog) {
    // Es un alta de empresa con su usuario inicial:
    const { userName, nameCompany, expireAt, subscribedPlan, imgCompany, origin } = data;
    try {
        if (!userName || !nameCompany || !expireAt || !subscribedPlan || !imgCompany || !origin) { throw Error('Faltan datos'); }
        const nameCompanyLowercase = nameCompany.toLowerCase();
        const existingCompany = await Company.findOne({
            where: { nameCompany: { [Op.iLike]: nameCompanyLowercase } },
        });
        if (existingCompany) {
            throw Error('El nombre de empresa ya existe');
        }
        const userNameLowercase = userName.toLowerCase();
        const existingUser = await Company.findOne({
            where: { userName: { [Op.iLike]: userNameLowercase } },
        });
        if (existingUser) {
            throw Error('El nombre de usuario ya existe');
        }
        const dbName = await createDBname(); // nombre de base de datos aleatorio
        // Lo agrego a la tabla de empresas:
        const regCompanyCreated = await Company.create({
            userName, dbName, nameCompany, subscribedPlan, expireAt, imgCompany
        });
        // Obtengo el id para devolver:
        const companyCreated = await Company.findOne({
            where: { userName },
        });
        // Empiezo a crear la base de datos, las tablas y los datos básicos asociados con la nueva empresa:
        if (await createNewDB(dbName, nameCompany, userLogged)) {
            await createBasicData(dbName, nameCompany, userName, companyCreated.id);
        } else {
            throw Error('No se pudo crear la base de datos de la nueva empresa');
        }
        // Mail de notificación:
        const data = {
            origin: EMAIL_MAIN,
            target: EMAIL_MAIN,
            subject: "¡Bienvenidos a Beauty Control!",
            html: `${nameCompany}: que disfrutes de tu suscripción. -> ${origin}`,
        }
        await sendMail(data, ".");
        const data2 = {
            origin: EMAIL,
            target: userName,
            subject: "¡Bienvenidos a Beauty Control!",
            html: `${nameCompany}: que disfrutes de tu suscripción. Recuerda ingresar con tu cuenta de usuario -> ${userName}`,
        }
        await sendMail(data2);
        logData({ op: "C", nameCompany: dataLog.nameCompany, dbName: dataLog.dbName, userName: dataLog.userName, desc: `Company ${nameCompany}, database ${dbName} was created` });
        return companyCreated.id;
    } catch (error) {
        throw Error(`${error}`);
    }
}

async function AddRegUserMain(Company, data, dataLog) {
    // Es un alta de usuario superSuperAdmin:
    const { userName, dbName, nameCompany, expireAt, subscribedPlan, imgCompany } = data;
    let transaction;
    try {
        if (!userName || !dbName || !nameCompany || !expireAt || !subscribedPlan || !imgCompany) { throw Error('Faltan datos'); }
        const nameLowercase = userName.toLowerCase();
        const existingUser = await Company.findOne({
            where: { userName: { [Op.iLike]: nameLowercase } },
        });
        if (existingUser) {
            throw Error('El usuario ya existe');
        }
        // Lo agrego a la tabla de empresas:
        const regCompanyCreated = await Company.create({
            userName, dbName, nameCompany, subscribedPlan, expireAt, imgCompany
        });
        // Obtengo el id para devolver:
        const userCreated = await Company.findOne({
            where: { userName },
        });
        return userCreated.id;
    } catch (error) {
        throw Error(`${error}`);
    }
}

async function AddRegCalendar(Calendar, data, conn, User, Service, Client, Branch, dataLog) {
    const { idUser, idService, idClient, idBranch, date_from, date_to, obs } = data;
    let transaction; // manejo transacciones para evitar registros defectuosos por relaciones mal solicitadas
    try {
        if (!idUser || !idService || !idClient || !idBranch || !date_from || !date_to || !obs) { throw Error("Faltan datos"); }
        // Inicio la transacción:
        transaction = await conn.transaction();
        const regCreated = await Calendar.create({
            date_from, date_to, obs, current: true, BranchId: idBranch, reminded: false,
        }, { transaction });
        const user = await User.findByPk(idUser);
        if (!user) {
            throw Error("Usuario no encontrado");
        }
        await regCreated.setUser(user, { transaction });
        // Relación: Asocio el Calendar con el Service:
        const service = await Service.findByPk(idService);
        if (!service) {
            throw Error("Servicio no encontrado");
        }
        await regCreated.setService(service, { transaction });
        // Relación: Asocio el Calendar con el Client:
        const client = await Client.findByPk(idClient);
        if (!client) {
            throw Error("Cliente no encontrado");
        }
        await regCreated.setClient(client, { transaction });
        // Relación: Asocio el Calendar con la Branch:
        const branch = await Branch.findByPk(idBranch);
        if (!branch) {
            throw Error("Sede no encontrada");
        }
        await regCreated.setBranch(branch, { transaction });
        await transaction.commit();
        logData({ op: "C", nameCompany: dataLog.nameCompany, dbName: dataLog.dbName, userName: dataLog.userName, desc: `Calendar event usr ${idUser}, svc ${idService}, clnt ${idClient}, bnch ${idBranch}, dte ${date_from} was created` });
        return;
    } catch (error) {
        if (transaction) await transaction.rollback();
        throw Error(`${error}`);
    }
}

async function AddRegHistoricProc(HistoryService, data, conn, Client, Incoming, User, dataLog) {

    //(tableName, data, conn, tableName2, tableName3, tableName4, dataLog);
    const { idUser, idClient, imageServiceDone, date, amount1, amount2, conformity, branchName, paymentMethodName1, paymentMethodName2, serviceName, attendedBy, email, name, lastName, id_pers } = data;
    let transaction; // manejo transacciones para evitar registros defectuosos por relaciones mal solicitadas
    try {
        if (!idUser || !idClient || !imageServiceDone || !date || !branchName || !paymentMethodName1 || !paymentMethodName2 || !serviceName || !attendedBy || !email || !name || !lastName || !amount1 || !amount2) { throw Error("Faltan datos"); }
        // Inicio la transacción:
        transaction = await conn.transaction();
        const client = await Client.findByPk(idClient);
        if (!client) { throw Error("Cliente no encontrado"); }
        const regCreated = await HistoryService.create({
            imageServiceDone, date, conformity, branchName, serviceName, attendedBy, email, name, lastName, id_pers, idUser,
        }, { transaction });
        // Registro los dos posibles medios de pago:
        await Incoming.create({ amount: amount1, paymentMethodName: paymentMethodName1, DateIncoming: date, HistoryServiceId: regCreated.id }, { transaction });
        await Incoming.create({ amount: amount2, paymentMethodName: paymentMethodName2, DateIncoming: date, HistoryServiceId: regCreated.id }, { transaction });
        // Relación: asocio el historial de servicio con el cliente:
        await client.addHistoryService(regCreated, { transaction });
        await transaction.commit();
        //showLog(`dataLog ${dataLog}`)

        logData({ op: "C", nameCompany: dataLog.nameCompany, dbName: dataLog.dbName, userName: dataLog.userName, desc: `Historic proc usr ${idUser}, clnt ${idClient}, mnt1 ${amount1}, mnt2 ${amount2}, bnch ${branchName}, pay1 ${paymentMethodName1} pay2 ${paymentMethodName2} was created` });
        return;
    } catch (error) {
        if (transaction) await transaction.rollback();
        throw Error(`${error}`);
    }
}

async function AddRegClient(User, data, conn, dataLog) {
    const { email, name, lastName, id_pers, phone1, phone2, image, birthday } = data;
    let transaction; // manejo transacciones para evitar registros defectuosos por relaciones mal solicitadas
    try {
        if (!email || !name || !lastName || !phone1 || !image) { throw Error("Faltan datos"); }
        const nameLowercase = name.toLowerCase();
        const lastNameLowercase = lastName.toLowerCase();
        const existingClient = await User.findOne({
            // no comparo con el id_pers (DNI) porque no es un dato obligatorio
            where: { name: { [Op.iLike]: nameLowercase }, lastName: { [Op.iLike]: lastNameLowercase }, email: email },
        });
        if (existingClient) {
            throw Error("El cliente ya existe");
        }
        //const formattedBirthday = birthday !== "" ? new Date(birthday) : null;
        transaction = await conn.transaction();
        const [ClientCreated, created] = await User.findOrCreate({
            where: { email, name, lastName, id_pers, phoneNumber1: phone1, phoneNumber2: phone2, image, birthday: birthday || null, monthBirthday: birthday ? birthday.split('-')[1] : null, dayBirthday: birthday ? birthday.split('-')[2] : null },
            transaction,
        });
        await transaction.commit();
        // Obtengo el id para devolver:
        const clientCreated = await User.findOne({
            where: { name: name, lastName: lastName, email: email },
        });
        logData({ op: "C", nameCompany: dataLog.nameCompany, dbName: dataLog.dbName, userName: dataLog.userName, desc: `Client ${email} ${name} ${lastName} ${id_pers} was created` });

        return clientCreated.id;
    } catch (error) {
        if (transaction) await transaction.rollback();
        throw Error(`${error}`);
    }
}

async function AddRegBranch(Branch, data, dataLog) {
    const { branchName, coordinates, address, phoneNumber, openningHours, clossingHours, workingDays, linkFb = "", linkIg = "", linkTk = "" } = data;
    try {
        if (!branchName || !phoneNumber || !address) { throw Error("Faltan datos"); }
        const branchLowercase = branchName.toLowerCase();
        const existingBranch = await Branch.findOne({
            where: { branchName: { [Op.iLike]: branchLowercase } },
        });
        if (existingBranch) {
            throw Error("La sede ya existe");
        }
        const [BranchCreated, created] = await Branch.findOrCreate({
            where: { branchName, phoneNumber, address, coordinates, openningHours, clossingHours, workingDays, linkFb, linkIg, linkTk },
        });
        // Obtengo el id para devolver:
        const branchCreated = await Branch.findOne({
            where: { branchName: branchName },
        });
        logData({ op: "C", nameCompany: dataLog.nameCompany, dbName: dataLog.dbName, userName: dataLog.userName, desc: `Branch ${branchName} was created` });
        return branchCreated.id;
    } catch (error) {
        throw Error(`${error}`);
    }
}

async function AddRegPayment(Payment, data, dataLog) {
    const { paymentMethodName } = data;
    try {
        if (!paymentMethodName) { throw Error("Faltan datos"); }
        const payLowercase = paymentMethodName.toLowerCase();
        const existingPayment = await Payment.findOne({
            where: { paymentMethodName: { [Op.iLike]: payLowercase } },
        });
        if (existingPayment) {
            throw Error("El medio de pago ya existe");
        }
        const [PayCreated, created] = await Payment.findOrCreate({
            where: { paymentMethodName },
        });
        // Obtengo el id para devolver:
        const payCreated = await Payment.findOne({
            where: { paymentMethodName: paymentMethodName },
        });
        logData({ op: "C", nameCompany: dataLog.nameCompany, dbName: dataLog.dbName, userName: dataLog.userName, desc: `Payment method ${paymentMethodName} was created` });
        return payCreated.id;
    } catch (error) {
        throw Error(`${error}`);
    }
}

async function AddRegSpecialty(Specialty, data, dataLog) {
    const { specialtyName } = data;
    try {
        if (!specialtyName) { throw Error("Faltan datos"); }
        const specLowercase = specialtyName.toLowerCase();
        const existingSpec = await Specialty.findOne({
            where: { specialtyName: { [Op.iLike]: specLowercase } },
        });
        if (existingSpec) {
            throw Error("La especialidad ya existe");
        }
        const [SpecCreated, created] = await Specialty.findOrCreate({
            where: { specialtyName },
        });
        // Obtengo el id para devolver:
        const specCreated = await Specialty.findOne({
            where: { specialtyName: specialtyName },
        });
        logData({ op: "C", nameCompany: dataLog.nameCompany, dbName: dataLog.dbName, userName: dataLog.userName, desc: `Specialty ${specialtyName} was created` });
        return specCreated.id;
    } catch (error) {
        throw Error(`${error}`);
    }
}

async function AddRegCatGastos(CatGastos, data, dataLog) {
    const { catName } = data;
    try {
        if (!catName) { throw Error("Faltan datos"); }
        const catLowercase = catName.toLowerCase();
        const existingCat = await CatGastos.findOne({
            where: { catName: { [Op.iLike]: catLowercase } },
        });
        if (existingCat) {
            throw Error("La categoría ya existe");
        }
        const [CatCreated, created] = await CatGastos.findOrCreate({
            where: { catName },
        });
        // Obtengo el id para devolver:
        const catCreated = await CatGastos.findOne({
            where: { catName: catName },
        });
        logData({ op: "C", nameCompany: dataLog.nameCompany, dbName: dataLog.dbName, userName: dataLog.userName, desc: `Expense category ${catName} was created` });
        return catCreated.id;
    } catch (error) {
        throw Error(`${error}`);
    }
}

module.exports = postReg;