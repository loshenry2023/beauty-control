// ! Elimina un registro.
const showLog = require("../functions/showLog");
const { Company } = require("../DB_connection_Main"); // conexión a la base de datos principal
const logData = require("../functions/logData");
const deleteDB = require("../functions/deleteDB");

const deleteReg = async (dataInc) => {
    const { tableName, id, tableNameText, dbName, nameCompany, userLogged } = dataInc
    let dataLog = {
        nameCompany: nameCompany,
        dbName: dbName,
        userName: userLogged
    }
    try {
        if (!id) { throw Error("Faltan datos"); }
        let regDelete;
        let regToDelete;
        if (tableNameText !== "Company") {
            regToDelete = await tableName.findByPk(id);
            if (!regToDelete) { throw Error("Registro no encontrado"); }
        }
        switch (tableNameText) {
            case "Company":
                // la empresa se elimina de la tabla Company y también se borra la base de datos asignada.
                reg = await Company.findOne({
                    attributes: [
                        "dbName",
                    ],
                    where: { nameCompany: id },
                });
                await deleteDB(reg.dbName);
                const companies = await Company.destroy({
                    where: {
                        nameCompany: id
                    }
                });
                logData({ op: "D", nameCompany: dataLog.nameCompany, dbName: dataLog.dbName, userName: dataLog.userName, desc: `Company ${id} was deleted` });
                break;
            case "Branch":
                regDelete = regToDelete.branchName;
                logData({ op: "D", nameCompany: dataLog.nameCompany, dbName: dataLog.dbName, userName: dataLog.userName, desc: `Branch ${regDelete} was deleted` });
                break;
            case "Payment":
                regDelete = regToDelete.paymentMethodName;
                logData({ op: "D", nameCompany: dataLog.nameCompany, dbName: dataLog.dbName, userName: dataLog.userName, desc: `Payment method ${regDelete} was deleted` });
                break;
            case "User":
                regDelete = regToDelete.userName;
                if (regToDelete.first === "1") { throw Error("Sin permiso"); }
                // Elimino la relación con sedes:
                await regToDelete.removeBranches();
                // Elimino la relación con especialidades:
                await regToDelete.removeSpecialties();
                logData({ op: "D", nameCompany: dataLog.nameCompany, dbName: dataLog.dbName, userName: dataLog.userName, desc: `User ${regDelete} was deleted` });
                break;
            case "Service":
                regDelete = regToDelete.serviceName;
                // Elimino la relación con especialidades:
                await regToDelete.removeSpecialties();
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
                logData({ op: "D", nameCompany: dataLog.nameCompany, dbName: dataLog.dbName, userName: dataLog.userName, desc: `Calendar event ${regDelete} was deleted` });
                break;
            case "Specialty":
                regDelete = regToDelete.specialtyName;
                logData({ op: "D", nameCompany: dataLog.nameCompany, dbName: dataLog.dbName, userName: dataLog.userName, desc: `Specialty ${regDelete} was deleted` });
                break;
            case "CatGastos":
                regDelete = regToDelete.catName;
                logData({ op: "D", nameCompany: dataLog.nameCompany, dbName: dataLog.dbName, userName: dataLog.userName, desc: `Expense category ${regDelete} was deleted` });
                break;
            default:
                throw new Error("Tabla no válida");
        }
        if (tableNameText !== "Company") {
            await regToDelete.destroy();
        }
        if (tableNameText === "User") {
            // Elimino el usuario de la tabla de empresas:
            const regCompanyToDelete = await Company.findByPk(id);
            if (!regCompanyToDelete) { throw Error("Registro de base empresa no encontrado"); }
            await regCompanyToDelete.destroy();
        }
        return { "deleted": "ok" };
    } catch (err) {
        showLog(`deleteReg -> error: ${err.message}`);
        return { deleted: "error", message: err.message };
    }
}
module.exports = deleteReg;
