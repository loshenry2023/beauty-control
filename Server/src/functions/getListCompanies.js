//! Obtengo el listado de empresas.
const { connMain, Company } = require("../DB_connection_Main");
const { DB_NAME } = require("./paramsEnv");
const showLog = require("./showLog");
const { Op } = require('sequelize');

async function getListCompanies() {
    try {
        const existingCompanies = await Company.findAll({
            attributes: [connMain.fn('DISTINCT', connMain.col('nameCompany')), "nameCompany", "userName", "expireAt"],
            where: {
                dbName: {
                    [Op.ne]: DB_NAME
                }
            }
        });
        return { result: "ok", company: existingCompanies };
    }
    catch (error) {
        showLog(`Error obtaining companies: ${error}`);
        return { result: "error", message: error };
    }
}

module.exports = getListCompanies;
