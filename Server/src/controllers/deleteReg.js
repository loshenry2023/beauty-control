// ! Elimina un registro.
const showLog = require("../functions/showLog");
const { Company } = require("../DB_connection_Main"); // conexión a la base de datos principal
const logData = require("../functions/logData");
const deleteDB = require("../functions/deleteDB");

const deleteReg = async (dataInc) => {
    const { tableName, id, tableNameText, tableName2, tableName3, dbName, nameCompany, userLogged } = dataInc
    let dataLog = {
        nameCompany: nameCompany,
        dbName: dbName,
        userName: userLogged
    }
    try {
        if (!id) { throw Error("Faltan datos"); }
        let regDelete;
        let regToDelete;
        let count = 0;
        if (tableNameText !== "Company" && tableNameText !== "Client" && tableNameText !== "Calendar") {
            regToDelete = await tableName.findByPk(id);
            if (!regToDelete) { throw Error("Registro no encontrado"); }
            if (await tableName.count() < 2) { throw Error("No se puede eliminar porque es el único disponible"); }
        }
        switch (tableNameText) {
            case "Company":
                // la empresa se elimina de la tabla Company y también se borra la base de datos asignada.
                count = await Company.count({
                    where: {
                        nameCompany: id
                    }
                });
                if (count === 0) { throw Error("Registro no encontrado"); }
                reg = await Company.findOne({
                    attributes: [
                        "dbName",
                    ],
                    where: { nameCompany: id },
                });
                const res = await deleteDB(reg.dbName);
                if (res.deleted === true) {
                    const companies = await Company.destroy({
                        where: {
                            nameCompany: id
                        }
                    });
                    logData({ op: "D", nameCompany: dataLog.nameCompany, dbName: dataLog.dbName, userName: dataLog.userName, desc: `Company ${id} was deleted` });
                } else {
                    throw Error(`No se pudo eliminar: ${res.error}`);
                }
                break;
            case "Branch":
                // Verifico que no haya citas agendadas antes de permitir el borrado:
                const resultCal = await tableName2.findAndCountAll({
                    where: {
                        current: true,
                    },
                    include: [
                        {
                            model: tableName, // Branch
                            attributes: ["id"],
                            where: { id: regToDelete.id },
                        },
                    ],
                });
                const countCalendar = resultCal.count;
                if (countCalendar > 0) { throw Error(`No se pudo eliminar: existe al menos una cita en calendario asociada a la sede.`); }

                // Verifico que no haya usuarios antes de permitir el borrado:
                const resultUsr = await tableName3.findAndCountAll({ // User
                    include: [
                        {
                            model: tableName, // Branch
                            attributes: ["id"],
                            where: { id: regToDelete.id },
                        },
                    ],
                });
                const countUser = resultUsr.count;
                if (countUser > 0) { throw Error(`No se pudo eliminar: existe al menos un usuario asociado a la sede.`); }

                regDelete = regToDelete.branchName;
                await regToDelete.destroy();
                logData({ op: "D", nameCompany: dataLog.nameCompany, dbName: dataLog.dbName, userName: dataLog.userName, desc: `Branch ${regDelete} was deleted` });
                break;
            case "Payment":
                regDelete = regToDelete.paymentMethodName;
                await regToDelete.destroy();
                logData({ op: "D", nameCompany: dataLog.nameCompany, dbName: dataLog.dbName, userName: dataLog.userName, desc: `Payment method ${regDelete} was deleted` });
                break;
            case "User":
                // Verifico que no haya citas agendadas antes de permitir el borrado:
                const resultCalUsr = await tableName2.findAndCountAll({ // Calendar
                    where: {
                        current: true,
                    },
                    include: [
                        {
                            model: tableName, //user
                            attributes: ["id"],
                            where: { id: regToDelete.id },
                        },
                    ],
                });
                const countCalendarUser = resultCalUsr.count;
                if (countCalendarUser > 0) { throw Error(`No se pudo eliminar: existe al menos una cita en calendario asociada al usuario.`); }

                regDelete = regToDelete.userName;
                if (regToDelete.first === "1") { throw Error("Sin permiso"); }
                // Elimino la relación con sedes:
                await regToDelete.removeBranches();
                // Elimino la relación con especialidades:
                await regToDelete.removeSpecialties();
                await regToDelete.destroy();

                // Elimino el usuario de la tabla de empresas:
                const regCompanyToDelete = await Company.findByPk(id);
                if (regCompanyToDelete) {
                    await regCompanyToDelete.destroy();
                }
                logData({ op: "D", nameCompany: dataLog.nameCompany, dbName: dataLog.dbName, userName: dataLog.userName, desc: `User ${regDelete} was deleted` });
                break;
            case "Service":
                regDelete = regToDelete.serviceName;
                // Elimino la relación con especialidades:
                await regToDelete.removeSpecialties();
                await regToDelete.destroy();
                logData({ op: "D", nameCompany: dataLog.nameCompany, dbName: dataLog.dbName, userName: dataLog.userName, desc: `Service ${regDelete} was deleted` });
                break;
            case "Client":
                // Elimino la relación con el cliente:
                regDelete = regToDelete.name + " " + regToDelete.lastName + regToDelete.email;
                const calendars = await regToDelete.getCalendars();
                if (calendars && calendars.length > 0) {
                    // Elimino la relación con calendarios
                    await regToDelete.setCalendars(null);
                }

                await regToDelete.destroy();
                logData({ op: "D", nameCompany: dataLog.nameCompany, dbName: dataLog.dbName, userName: dataLog.userName, desc: `Client ${regDelete} was deleted` });
                break;
            case "Calendar":
                regDelete = regToDelete.id + " " + regToDelete.date_from + regToDelete.email;
                // Elimino la relación con el usuario:
                const users = await regToDelete.getUser();
                if (users && users.length > 0) {
                    await regToDelete.setUsers(null);
                }
                // Elimino la relación con el cliente:
                const clients = await regToDelete.getClient();
                if (clients && clients.length > 0) {
                    await regToDelete.setClient(null);
                }
                // Elimino la relación con el procedimiento:
                const proc = await regToDelete.getService();
                if (proc && proc.length > 0) {
                    await regToDelete.setService(null);
                }
                // Elimino la relación con la sede:
                const branch = await regToDelete.getBranch();
                if (branch && branch.length > 0) {
                    await regToDelete.setBranch(null);
                }

                await regToDelete.destroy();
                logData({ op: "D", nameCompany: dataLog.nameCompany, dbName: dataLog.dbName, userName: dataLog.userName, desc: `Calendar event ${regDelete} was deleted` });
                break;
            case "Specialty":
                // Verifico que no haya procedimientos relacionados antes de permitir el borrado:
                const resultCalSvc = await tableName2.findAndCountAll({ // Service
                    include: [
                        {
                            model: tableName, //Specialty
                            attributes: ["id"],
                            where: { id: regToDelete.id },
                        },
                    ],
                });
                const countCalendarSvc = resultCalSvc.count;
                if (countCalendarSvc > 0) { throw Error(`No se pudo eliminar: existe al menos un procedimiento asociado a la especialidad.`); }

                regDelete = regToDelete.specialtyName;
                await regToDelete.destroy();
                logData({ op: "D", nameCompany: dataLog.nameCompany, dbName: dataLog.dbName, userName: dataLog.userName, desc: `Specialty ${regDelete} was deleted` });
                break;
            case "CatGastos":
                regDelete = regToDelete.catName;
                await regToDelete.destroy();
                logData({ op: "D", nameCompany: dataLog.nameCompany, dbName: dataLog.dbName, userName: dataLog.userName, desc: `Expense category ${regDelete} was deleted` });
                break;
            default:
                throw new Error("Tabla no válida");
        }
        return { "deleted": "ok" };
    } catch (err) {
        //showLog(`deleteReg -> error: ${err.message}`);
        return { deleted: "error", message: err.message };
    }
}
module.exports = deleteReg;
