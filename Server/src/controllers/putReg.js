// ! Modifica un registro en tabla.
const showLog = require("../functions/showLog");
const logData = require("../functions/logData");
const { DB_NAME, } = require("../functions/paramsEnv");
const { Op } = require("sequelize");

const putReg = async (dataInc) => {
    const { tableName, tableNameText, data, id, conn = "", tableName2 = "", tableName3 = "", tableName4 = "", tableName5 = "", userLogged, dbName, nameCompany } = dataInc
    let dataLog = {
        nameCompany: nameCompany,
        dbName: dbName,
        userName: userLogged
    }

    //showLog(dataLog)
    try {
        let resp;
        switch (tableNameText) {
            case "Branch":
                resp = await editRegBranch(tableName, data, id, dataLog);
                break;
            case "Payment":
                resp = await editRegPayment(tableName, data, id, dataLog);
                break;
            case "Specialty":
                resp = await editRegSpecialty(tableName, data, id, dataLog);
                break;
            case "CatGastos":
                resp = await editRegCatGastos(tableName, data, id, dataLog);
                break;
            case "Service":
                resp = await editRegService(tableName, data, id, conn, dataLog);
                break;
            case "User":
                resp = await editRegUser(tableName, data, id, conn, dataLog);
                break;
            case "Client":
                resp = await editRegClient(tableName, data, id, conn, dataLog);
                break;
            case "Calendar":
                resp = await editRegCalendar(tableName, data, id, conn, tableName2, tableName3, tableName4, tableName5, dataLog);
                break;
            case "Company":
                resp = await editRegCompany(tableName, data, dataLog);
                break;
            case "Companys":
                resp = await editRegCompanys(tableName, data);
                break;
            default:
                throw new Error("Tabla no válida");
        }
        return { "created": "ok" };
    } catch (err) {
        return { created: "error", message: err.message };
    }
}

async function editRegCompanys(Company, data) {
    const { nMode } = data;
    try {
        if (!nMode) { throw Error("Faltan datos"); }
        await Company.update({
            expireAt: nMode === "0" ? "2010-01-01" : "2040-01-01",
        }, {
            where: {
                dbName: {
                    [Op.ne]: DB_NAME
                }
            }

        });
        logData({ op: "U", nameCompany: ".", dbName: ".", userName: ".", desc: `Exp was applied -> ${nMode}` });
        return;
    } catch (error) {
        throw Error(`${error}`);
    }
}


async function editRegCompany(Company, data, dataLog) {
    const { nameCompany: nCompany, subscribedPlan, expireAt, imgCompany } = data;
    try {
        if (!nCompany || !subscribedPlan || !expireAt) { throw Error("Faltan datos"); }
        await Company.update({
            subscribedPlan: subscribedPlan,
            expireAt: expireAt,
            imgCompany: imgCompany,
        }, {
            where: {
                nameCompany: nCompany
            }
        });
        logData({ op: "U", nameCompany: dataLog.nameCompany, dbName: dataLog.dbName, userName: dataLog.userName, desc: `Company ${nCompany} was modified` });
        return;
    } catch (error) {
        throw Error(`${error}`);
    }
}

async function editRegUser(User, data, id, conn, dataLog) {
    const { name, lastName, role, notificationEmail, phone1, phone2, image, comission, branch, specialty } = data;
    let transaction; // manejo transacciones para evitar registros defectuosos por relaciones mal solicitadas
    try {
        if (!name || !lastName || !role || !notificationEmail || !phone1 || !image || !comission || !branch || !specialty) { throw Error("Faltan datos"); }
        const existingUser = await User.findByPk(id);
        if (!existingUser) {
            throw Error("Usuario no encontrado");
        }
        // Inicio la transacción:
        transaction = await conn.transaction();
        existingUser.name = name;
        existingUser.lastName = lastName;
        existingUser.notificationEmail = notificationEmail;
        existingUser.phoneNumber1 = phone1;
        existingUser.phoneNumber2 = phone2 || null;
        existingUser.image = image;
        existingUser.comission = comission;
        if (existingUser.first !== "1") {
            existingUser.role = role;
        }
        await existingUser.save();
        // Busco las sedes para agregar las relaciones:
        await existingUser.setBranches(branch, { transaction });
        // Busco las especialidades para agregar las relaciones:
        await existingUser.setSpecialties(specialty, { transaction });
        await transaction.commit();
        logData({ op: "U", nameCompany: dataLog.nameCompany, dbName: dataLog.dbName, userName: dataLog.userName, desc: `User ${existingUser.userName} was modified` });
        return;
    } catch (error) {
        if (transaction) await transaction.rollback();
        throw Error(`${error}`);
    }
}

async function editRegCalendar(Calendar, data, id, conn, User, Service, Client, Branch, dataLog) {
    const { idUser, idService, idClient, idBranch, date_from, date_to, obs, current } = data;
    let transaction; // manejo transacciones para evitar registros defectuosos por relaciones mal solicitadas
    try {
        if (!idUser || !idService || !idClient || !idBranch || !date_from || !date_to || !obs || current === null) {
            throw Error("Faltan datos");
        }
        const existingEvent = await Calendar.findByPk(id, {
            include: [
                { model: User },
                { model: Service },
                { model: Client },
                { model: Branch },
            ],
        });
        if (!existingEvent) {
            throw Error("Evento de calendario no encontrado");
        }
        // Inicio la transacción:
        transaction = await conn.transaction();
        existingEvent.date_from = date_from;
        existingEvent.date_to = date_to;
        existingEvent.obs = obs;
        existingEvent.current = current;
        existingEvent.reminded = false;
        await existingEvent.save();
        // Relación con User:
        const user = await User.findByPk(idUser);
        if (user) {
            await existingEvent.setUser(user, { transaction });
        }
        // Relación con Service:
        const service = await Service.findByPk(idService);
        if (service) {
            await existingEvent.setService(service, { transaction });
        }
        // Relación con Client:
        const client = await Client.findByPk(idClient);
        if (client) {
            await existingEvent.setClient(client, { transaction });
        }
        // Relación con Branch:
        const branch = await Branch.findByPk(idBranch);
        if (branch) {
            await existingEvent.setBranch(branch, { transaction });
        }
        logData({ op: "U", nameCompany: dataLog.nameCompany, dbName: dataLog.dbName, userName: dataLog.userName, desc: `Calendar event usr ${idUser}, svc ${idService}, clnt ${idClient}, bnch ${idBranch}, dte ${date_from} was modified` });
        await transaction.commit();
        return;
    } catch (error) {
        if (transaction) await transaction.rollback();
        throw Error(`${error}`);
    }
}

async function editRegClient(Client, data, id, conn, dataLog) {
    const { email, name, lastName, id_pers, phone1, phone2, image, birthday } = data;
    let transaction; // manejo transacciones para evitar registros defectuosos por relaciones mal solicitadas
    try {
        if (!email || !name || !lastName || !phone1 || !image) { throw Error("Faltan datos"); }
        const existingClient = await Client.findByPk(id);
        if (!existingClient) {
            throw Error("Cliente no encontrado");
        }
        // Inicio la transacción:
        transaction = await conn.transaction();
        existingClient.name = name;
        existingClient.lastName = lastName;
        existingClient.email = email;
        existingClient.id_pers = id_pers || null;
        existingClient.phoneNumber1 = phone1;
        existingClient.phoneNumber2 = phone2 || null;
        existingClient.image = image;
        existingClient.birthday = birthday !== "" ? birthday : null;
        existingClient.dayBirthday = birthday ? birthday.split('-')[2] : null;
        existingClient.monthBirthday = birthday ? birthday.split('-')[1] : null;
        await existingClient.save();
        await transaction.commit();
        logData({ op: "U", nameCompany: dataLog.nameCompany, dbName: dataLog.dbName, userName: dataLog.userName, desc: `Client ${name} ${lastName} ${email} was modified` });
        return;
    } catch (error) {
        if (transaction) await transaction.rollback();
        throw Error(`${error}`);
    }
}

async function editRegService(Service, data, id, conn, dataLog) {
    const { serviceName, duration, price, ImageService, specialty } = data;
    let transaction; // manejo transacciones para evitar registros defectuosos por relaciones mal solicitadas
    try {
        if (!serviceName || !duration || !price || !ImageService || !specialty) { throw Error("Faltan datos"); }
        const existingService = await Service.findByPk(id);
        if (!existingService) {
            throw Error("Procedimiento no encontrado");
        }
        // Inicio la transacción:
        transaction = await conn.transaction();
        existingService.serviceName = serviceName;
        existingService.duration = duration;
        existingService.price = price;
        existingService.ImageService = ImageService;
        await existingService.save();
        // Busco las especialidades para agregar las relaciones:
        await existingService.setSpecialties(specialty, { transaction });
        await transaction.commit();
        logData({ op: "U", nameCompany: dataLog.nameCompany, dbName: dataLog.dbName, userName: dataLog.userName, desc: `Service ${serviceName} was modified` });
        return;
    } catch (error) {
        if (transaction) await transaction.rollback();
        throw Error(`${error}`);
    }
}

async function editRegBranch(Branch, data, id, dataLog) {
    const { branchName, coordinates, address, phoneNumber, openningHours, clossingHours, workingDays, linkFb = "", linkIg = "", linkTk = "" } = data;
    try {
        if (!branchName || !phoneNumber || !address) { throw Error("Faltan datos"); }
        const existingBranch = await Branch.findByPk(id);
        if (!existingBranch) {
            throw Error("Sede no encontrada");
        }
        existingBranch.branchName = branchName;
        existingBranch.coordinates = coordinates;
        existingBranch.address = address;
        existingBranch.phoneNumber = phoneNumber;
        existingBranch.openningHours = openningHours;
        existingBranch.clossingHours = clossingHours;
        existingBranch.workingDays = workingDays;
        existingBranch.linkFb = linkFb;
        existingBranch.linkIg = linkIg;
        existingBranch.workingDays = linkTk;
        await existingBranch.save();
        logData({ op: "U", nameCompany: dataLog.nameCompany, dbName: dataLog.dbName, userName: dataLog.userName, desc: `Branch ${branchName} ${id} was modified` });
        return;
    } catch (error) {
        throw Error(`${error}`);
    }
}

async function editRegPayment(Payment, data, id, dataLog) {
    const { paymentMethodName } = data;
    try {
        if (!paymentMethodName) { throw Error("Faltan datos"); }
        const existingPay = await Payment.findByPk(id);
        if (!existingPay) {
            throw Error("Medio de pago no encontrado");
        }
        existingPay.paymentMethodName = paymentMethodName;
        await existingPay.save();
        logData({ op: "U", nameCompany: dataLog.nameCompany, dbName: dataLog.dbName, userName: dataLog.userName, desc: `Payment method ${paymentMethodName} ${id} was modified` });
        return;
    } catch (error) {
        throw Error(`${error}`);
    }
}

async function editRegSpecialty(Specialty, data, id, dataLog) {
    const { specialtyName } = data;
    try {
        if (!specialtyName) { throw Error("Faltan datos"); }
        const existingSpec = await Specialty.findByPk(id);
        if (!existingSpec) {
            throw Error("Especialidad no encontrada");
        }
        existingSpec.specialtyName = specialtyName;
        await existingSpec.save();
        logData({ op: "U", nameCompany: dataLog.nameCompany, dbName: dataLog.dbName, userName: dataLog.userName, desc: `Specialty ${specialtyName} ${id} was modified` });
        return;
    } catch (error) {
        throw Error(`${error}`);
    }
}

async function editRegCatGastos(CatGastos, data, id, dataLog) {
    const { catName } = data;
    try {
        if (!catName) { throw Error("Faltan datos"); }
        const existingCat = await CatGastos.findByPk(id);
        if (!existingCat) {
            throw Error("Categoría no encontrada");
        }
        existingCat.catName = catName;
        await existingCat.save();
        logData({ op: "U", nameCompany: dataLog.nameCompany, dbName: dataLog.dbName, userName: dataLog.userName, desc: `Expense category ${catName} ${id} was modified` });
        return;
    } catch (error) {
        throw Error(`${error}`);
    }
}

module.exports = putReg;