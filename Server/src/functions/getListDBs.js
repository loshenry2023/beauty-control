//! Obtengo el listado de base de datos correspondiente a las empresas existentes.
const { connMain, Company } = require("../DB_connection_Main");
const { DB_NAME } = require("./paramsEnv");
const showLog = require("./showLog");
const { Op } = require('sequelize');

async function getListDBs() {
    try {
        const existingCompanies = await Company.findAll({
            attributes: [connMain.fn('DISTINCT', connMain.col('dbName')), "dbName"],
            where: {
                dbName: {
                    [Op.ne]: DB_NAME
                }
            }
        });
        const dbNames = existingCompanies.map(company => company.dbName);
        return dbNames;
    }
    catch (error) {
        showLog(`Error obtaining databases: ${error}`);
        throw Error("Error obteniendo listado de empresas: " + error);
    }
}

module.exports = getListDBs;
