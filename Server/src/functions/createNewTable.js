// ! Esta función crea una nueva tabla en la base de datos indicada:
const { Sequelize } = require('sequelize');
const showLog = require("./showLog");
const generateStringConnectionDb = require("./generateStringConnectionDb");

async function createNewTable(databaseName, TableName) {
    let sequelize;
    try {
        const TableModel = require(`../models/${TableName}`);
        const strConn = generateStringConnectionDb(databaseName);
        sequelize = new Sequelize(strConn, { logging: false, native: false });
        TableModel(sequelize, Sequelize);
        await sequelize.sync();
        showLog(`Table ${TableName} was created`);
        return true;
    } catch (error) {
        showLog(`Error creating table ${TableName}: ${error.message}`);
    } finally {
        // Cierro la conexión:
        if (sequelize) {
            await sequelize.close();
        }
    }
}

module.exports = createNewTable;