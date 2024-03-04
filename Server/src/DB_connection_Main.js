// ! Configuración de modelos de la conexión principal.
require("pg"); // requerido por Vercel para el deploy
const { Sequelize } = require("sequelize");
const generateStringConnectionDb = require("./functions/generateStringConnectionDb");
const { DB_NAME, } = require("./functions/paramsEnv");
// Definición de modelos:
const CompanyModel = require("./models/Company");
const LogModel = require("./models/Log");

const strConn = generateStringConnectionDb(DB_NAME);
const database = new Sequelize(strConn, { logging: false, native: false });
CompanyModel(database);
LogModel(database);

const {
    Company,
    Log,
} = database.models;

module.exports = {
    Company,
    Log,
    connMain: database,
};
