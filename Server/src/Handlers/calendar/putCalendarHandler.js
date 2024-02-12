const { connectDB } = require(".././../DB_connection_General"); // conexión a la base de datos de trabajo
const putReg = require("../../controllers/putReg");
const showLog = require("../../functions/showLog");
const checkToken = require('../../functions/checkToken');

const putCalendarHandler = async (req, res) => {

  try {
    const { token } = req.body;
    const { id } = req.params;
    showLog(`putCalendarHandler`);
    // Verifico token:
    if (!token) { throw Error("Se requiere token"); }
    const checked = await checkToken(token);
    if (!checked.exist) {
      showLog(checked.mensaje);
      return res.status(checked.code).send(checked.mensaje);
    }
    if (checked.role === "superSuperAdmin") { // no le permito meterse a las tablas internas de las empresas
      showLog(`Wrong role.`);
      return res.status(401).send(`Sin permiso.`);
    }

    if (!id) { throw Error("Faltan datos"); }

    const { conn, Calendar, User, Service, Client, Branch } = await connectDB(checked.dbName);
    await conn.sync();
    const data = {
      tableName: Calendar,
      tableNameText: "Calendar",
      data: req.body,
      id: id,
      conn: conn,
      tableName2: User,
      tableName3: Service,
      tableName4: Client,
      tableName5: Branch,
      userLogged: checked.userName,
      dbName: checked.dbName,
      nameCompany: checked.nameCompany,
      userLogged: checked.userName,
      dbName: checked.dbName,
      nameCompany: checked.nameCompany

    }
    const resp = await putReg(data);
    await conn.close(); // cierro la conexión

    if (resp.created === 'ok') {
      showLog(`putCalendarHandler OK`);
      return res.status(200).json({ "updated": "ok" });
    } else {
      showLog(`putCalendarHandler ERROR-> ${resp.message}`);
      return res.status(500).send(resp.message);
    }
  } catch (err) {
    showLog(`putCalendarHandler ERROR-> ${err.message}`);
    return res.status(500).send(err.message);
  }
};

module.exports = putCalendarHandler;

