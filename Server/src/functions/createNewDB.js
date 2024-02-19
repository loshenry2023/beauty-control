// ! Esta función crea una base de datos:
const { Sequelize } = require('sequelize');
const showLog = require("./showLog");
const generateStringConnectionDb = require("./generateStringConnectionDb");

async function databaseExists(databaseName, strConn) {
    const sequelize = new Sequelize(strConn);
    try {
        // Consulto el listado de bases de datos disponibles:
        const result = await sequelize.query(
            'SELECT datname FROM pg_database;',
            { type: sequelize.QueryTypes.SELECT }
        );
        const basesDeDatos = result.map(row => row.datname);
        // Devuelvo el resultado de coincidencia de nombre en el listado:
        return basesDeDatos.includes(databaseName.toLowerCase());
    } catch (error) {
        showLog(`Error while verifying the existence of the database ${databaseName}: ${error.message}`);
    } finally {
        // Cierro la conexión:
        await sequelize.close();
    }
}

async function createNewDB(databaseName) {
    const strConn = generateStringConnectionDb("");
    const sequelize = new Sequelize(strConn);
    try {
        const esExistente = await databaseExists(databaseName, strConn);
        if (!esExistente) {
            // Creo la base de datos:
            await sequelize.query(`CREATE DATABASE ${databaseName};`);
            showLog(`Database ${databaseName} was created`);
            return true;
        } else { return false }
    } catch (error) {
        showLog(`Error creating database ${databaseName}: ${error.message}`);
    } finally {
        // Cierro la conexión:
        await sequelize.close();
    }
}

module.exports = createNewDB;