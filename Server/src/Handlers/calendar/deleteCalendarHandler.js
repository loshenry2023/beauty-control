const { connectDB } = require(".././../DB_connection_General"); // conexión a la base de datos de trabajo
const deleteReg = require("../../controllers/deleteReg");
const showLog = require("../../functions/showLog");
const checkToken = require('../../functions/checkToken');

const deleteCalendarHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { token } = req.body;
    showLog(`deleteCalendarHandler`);
    // Verifico token. Sólo un superAdmin puede eliminar:
    if (!token) { throw Error("Se requiere token"); }
    const checked = await checkToken(token);
    if (!checked.exist) {
      showLog(checked.mensaje);
      return res.status(checked.code).send(checked.mensaje);
    }
    if (checked.role !== "superAdmin") {
      showLog(checked.role !== "superAdmin" ? `Wrong role.` : `Wrong token.`);
      return res.status(401).send(`Sin permiso.`);
    }

    const { conn, Calendar } = await connectDB(checked.dbName);
    await conn.sync({ alter: true });

    const data = {
      tableName: Calendar,
      id: id,
      tableNameText: "Calendar",
      userLogged: checked.userName,
      dbName: checked.dbName,
      nameCompany: checked.nameCompany,
    }
    const resp = await deleteReg(data);
    await conn.close(); // cierro la conexión

    if (resp.deleted === 'ok') {
      showLog(`deleteCalendarHandler OK`);
      return res.status(200).json({ deleted: "ok" });
    } else {
      showLog(`deleteCalendarHandler ERROR-> ${resp.message}`);
      return res.status(404).send(resp.message);
    }
  } catch (err) {
    showLog(`deleteCalendarHandler ERROR-> ${err.message}`);
    return res.status(500).send(err.message);
  }
};

module.exports = deleteCalendarHandler;
