const { connectDB } = require(".././../DB_connection_General"); // conexión a la base de datos de trabajo
const postReg = require("../../controllers/postReg");
const showLog = require("../../functions/showLog");
const checkToken = require('../../functions/checkToken');

const postHistoricProcHandler = async (req, res) => {
  try {
    const { token } = req.body;
    showLog(`postHistoricProcHandler`);
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

    const { conn, HistoryService, Client, Incoming, User } = await connectDB(checked.dbName);
    await conn.sync();

    const data = {
      userLogged: checked.userName,
      tableName: HistoryService,
      tableNameText: "HistoryService",
      data: req.body,
      conn: conn,
      tableName2: Client,
      tableName3: Incoming,
      tableName4: User,
      tableName5: "",
      dbName: checked.dbName,
      nameCompany: checked.nameCompany,
    }
    const resp = await postReg(data);
    await conn.close();

    if (resp.created === 'ok') {
      showLog(`postHistoricProcHandler OK`);
      return res.status(200).json({ "created": "ok" });
    } else {
      showLog(`postHistoricProcHandler ERROR-> ${resp.message}`);
      return res.status(500).send(resp.message);
    }
  } catch (err) {
    showLog(`postHistoricProcHandler ERROR-> ${err.message}`);
    return res.status(500).send(err.message);
  }
};

module.exports = postHistoricProcHandler;

