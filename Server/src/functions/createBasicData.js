// ! Nueva empresa: esta función crea los datos mínimos necesarios para que el sistema funcione.
const { connectDB } = require("../DB_connection_General"); // conexión a la base de datos de trabajo
const showLog = require("../functions/showLog");

async function createBasicData(dbName, nameCompany, userName, idUser) {
    const { conn, Branch, Payment, Service, Specialty, User, CatGastos } = await connectDB(dbName);
    await conn.sync();
    try {
        // TODO Creo las sedes:
        const firstBranchName = `${nameCompany}, sede 1 (¡ponle un nombre!)`;
        const branchesList = [
            {
                branchName: firstBranchName,
                address: "Carga un domicilio",
                phoneNumber: "0000000000",
                coordinates: "¡Carga el link de Google Maps apuntando a tu sucursal!",
                linkFb: "¡Carga un link de tu red social!",
                linkIg: "¡Carga un link de tu red social!",
                linkTk: "¡Carga un link de tu red social!",
            },
            {
                branchName: `${nameCompany}, sede 2 (¡ponle un nombre!)`,
                address: "Carga un domicilio",
                phoneNumber: "0000000000",
                coordinates: "¡Carga el link de Google Maps apuntando a tu sucursal!",
                linkFb: "¡Carga el link de tu red social!",
                linkIg: "¡Carga el link de tu red social!",
                linkTk: "¡Carga el link de tu red social!",
            },
        ];
        let branchCrtd;
        for (const branch of branchesList) {
            const [branchCreated, created] = await Branch.findOrCreate({
                where: {
                    branchName: branch.branchName,
                    address: branch.address,
                    phoneNumber: branch.phoneNumber,
                    linkFb: branch.linkFb,
                    linkIg: branch.linkIg,
                    linkTk: branch.linkTk
                },
            });
            branchCrtd = branchCreated;
        }
        showLog(`... branches created`);
        // TODO Creo los métodos de pago:
        const paymentList = [
            "Nequi",
            "DaviPlata",
            "Bancolombia",
            "efectivo",
            "banco de bogota",
            "wompi",
        ];
        for (let i = 0; i < paymentList.length; i++) {
            const [paymentCreated, created] = await Payment.findOrCreate({
                where: {
                    paymentMethodName: paymentList[i],
                },
            });
        }
        showLog(`... payments created`);
        // TODO Creo las especialidades:
        const specialityList = [
            "Especialidad 1",
            "Especialidad 2",
            "Especialidad 3",
            "Especialidad 4",
            "Especialidad 5",
            "Administración",
        ];
        let specCrtd;
        for (let i = 0; i < specialityList.length; i++) {
            const [specialityCreated, created] = await Specialty.findOrCreate({
                where: {
                    specialtyName: specialityList[i],
                },
            });
            specCrtd = specialityCreated;
        }
        showLog(`... specialties created`);
        // TODO Creo las categorías de gastos:
        const catList = [
            "Comisiones",
            "Personal",
            "Salario",
            "Insumos",
            "Arriendos",
        ];
        let catCrtd;
        for (let i = 0; i < catList.length; i++) {
            const [catCreated, created] = await CatGastos.findOrCreate({
                where: {
                    catName: catList[i],
                },
            });
            catCrtd = catCreated;
        }
        showLog(`... expense categories created`);
        // TODO Creo los procedimientos y sus relaciones:
        let serviceList;
        let spec;
        // Parte 1:
        serviceList = [
            "Procedimiento 1",
            "Procedimiento 2",
        ];
        for (let i = 0; i < serviceList.length; i++) {
            const [serviceCreated1, created] = await Service.findOrCreate({
                where: {
                    serviceName: serviceList[i],
                    duration: 30,
                    price: 0,
                    ImageService:
                        "https://res.cloudinary.com/ddlwjsfml/image/upload/v1702984759/cejas_nype4m.jpg",
                },
            });
            spec = await Specialty.findAll({
                where: { specialtyName: "Especialidad 1" },
            });
            await serviceCreated1.addSpecialty(spec);
        }
        // Parte 2:
        serviceList = [
            "Procedimiento 3",
            "Procedimiento 4",
        ];
        for (let i = 0; i < serviceList.length; i++) {
            const [serviceCreated1, created] = await Service.findOrCreate({
                where: {
                    serviceName: serviceList[i],
                    duration: 30,
                    price: 0,
                    ImageService:
                        "https://res.cloudinary.com/ddlwjsfml/image/upload/v1702984852/pesta_tuejpe.jpg",
                },
            });
            spec = await Specialty.findAll({
                where: { specialtyName: "Especialidad 2" },
            });
            await serviceCreated1.addSpecialty(spec);
        }
        // Parte 3:
        serviceList = [
            "Procedimiento 5",
            "Procedimiento 6",
        ];
        for (let i = 0; i < serviceList.length; i++) {
            const [serviceCreated1, created] = await Service.findOrCreate({
                where: {
                    serviceName: serviceList[i],
                    duration: 30,
                    price: 0,
                    ImageService:
                        "https://res.cloudinary.com/ddlwjsfml/image/upload/v1702984891/labios_ib7eet.jpg",
                },
            });
            spec = await Specialty.findAll({
                where: { specialtyName: "Especialidad 3" },
            });
            serviceCreated1.addSpecialty(spec);
        }

        // Parte 4:
        serviceList = [
            "Procedimiento 7",
            "Procedimiento 8",
        ];
        for (let i = 0; i < serviceList.length; i++) {
            const [serviceCreated1, created] = await Service.findOrCreate({
                where: {
                    serviceName: serviceList[i],
                    duration: 30,
                    price: 0,
                    ImageService:
                        "https://res.cloudinary.com/ddlwjsfml/image/upload/v1702984891/labios_ib7eet.jpg",
                },
            });
            spec = await Specialty.findAll({
                where: { specialtyName: "Especialidad 4" },
            });
            serviceCreated1.addSpecialty(spec);
        }

        serviceList = [
            "Procedimiento 9",
            "Procedimiento 10",
        ];
        for (let i = 0; i < serviceList.length; i++) {
            const [serviceCreated1, created] = await Service.findOrCreate({
                where: {
                    serviceName: serviceList[i],
                    duration: 30,
                    price: 0,
                    ImageService:
                        "https://res.cloudinary.com/ddlwjsfml/image/upload/v1702984891/labios_ib7eet.jpg",
                },
            });
            spec = await Specialty.findAll({
                where: { specialtyName: "Especialidad 5" },
            });
            serviceCreated1.addSpecialty(spec);
        }
        showLog(`... services created`);
        // TODO Creo el usuario inicial:
        const [existingUserHenry, userCreated] = await User.findOrCreate({
            where: {
                id: idUser, // es el mismo id que en la tabla Company
                userName: userName,
                notificationEmail: userName,
                name: "Usuario",
                lastName: "Maestro",
                phoneNumber1: "0000000000",
                image: "https://res.cloudinary.com/doyafxwje/image/upload/v1707517244/Logos/beuatycontrol-logo_hlmilv.png",
                comission: 0,
                role: "superAdmin",
                first: "1",
            },
        });
        // Relación a sedes:
        let brnchCreated = await Branch.findAll({
            where: { branchName: firstBranchName },
        });
        await existingUserHenry.addBranch(brnchCreated);
        // Relación a especialidades:
        let specCreated = await Specialty.findAll({
            where: { specialtyName: "Administración" },
        });
        await existingUserHenry.addSpecialty(specCreated);
        showLog(`... superAdmin user created`);
    } catch (error) {
        showLog(`Error creating basic data: ${error}`);
        throw Error("Error creando datos básicos: " + error);
    } finally {
        if (conn) {
            await conn.close();
        }
    }
}

module.exports = createBasicData;
