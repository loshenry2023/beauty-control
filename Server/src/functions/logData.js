//! Registro log en tabla.
const { Log } = require("../DB_connection_Main"); // conexión a la base de datos principal
const showLog = require("./showLog");

async function logData(data) {
    try {
        const regCreated = await Log.create({
            nameCompany: data.nameCompany,
            dbName: data.dbName,
            userName: data.userName,
            desc: data.desc,
            op: data.op,
        });
    } catch (error) {
        showLog(`logData - Error: ${data}`);
    }
}

module.exports = logData;
