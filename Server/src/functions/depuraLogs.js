//! Depuro tabla de logs.
const { Log } = require("../DB_connection_Main"); // conexión a la base de datos principal
const showLog = require("./showLog");
const { Op } = require('sequelize');
const logData = require("./logData");

async function depuraLogs(data) {
    showLog(`depuraLogs`);
    try {
        const tenDaysAgo = new Date();
        tenDaysAgo.setDate(tenDaysAgo.getDate() - 5);
        await Log.destroy({
            where: {
                createdAt: {
                    [Op.lt]: tenDaysAgo
                }
            }
        });
        logData({ op: ".", nameCompany: ".", dbName: ".", userName: ".", desc: `Log cleaned` });
        showLog(`depuraLogs OK`);
        return true;
    } catch (error) {
        showLog(`depuraLogs - Error: ${data}`);
    }
}

module.exports = depuraLogs;
