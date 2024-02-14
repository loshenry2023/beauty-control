// ! Esta función crea una base de datos:
const { Sequelize } = require('sequelize');
const showLog = require("./showLog");
const generateStringConnectionDb = require("./generateStringConnectionDb");

async function deleteDB(databaseName) {
  const strConn = generateStringConnectionDb("");
  const sequelize = new Sequelize(strConn);
  try {
    // Elimino la base de datos:
    await sequelize.query(`DROP DATABASE ${databaseName};`);
    showLog(`Database ${databaseName} was deleted`);
    return { deleted: true };
  } catch (error) {
    return { deleted: false, error: error.message };
  } finally {
    // Cierro la conexión:
    await sequelize.close();
  }
}

module.exports = deleteDB;