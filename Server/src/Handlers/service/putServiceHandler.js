const { connectDB } = require("../../DB_connection_General"); // conexión a la base de datos de trabajo
const putReg = require("../../controllers/putReg");
const showLog = require("../../functions/showLog");
const checkToken = require('../../functions/checkToken');

const putServiceHandler = async (req, res) => {
  try {
    const { token } = req.body;
    const { id } = req.params;
    showLog(`putServiceHandler`);
    // Verifico token. Sólo un superAdmin puede modificar:
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
    if (!id) { throw Error("Faltan datos"); }

    const { conn, Service } = await connectDB(checked.dbName);
    await conn.sync();

    const data = {
      tableName: Service,
      tableNameText: "Service",
      data: req.body,
      id: id,
      conn: conn,
      tableName2: "",
      tableName3: "",
      tableName4: "",
      tableName5: "",
      userLogged: checked.userName,
      dbName: checked.dbName,
      nameCompany: checked.nameCompany
    }
    const resp = await putReg(data);
    await conn.close();

    if (resp.created === 'ok') {
      showLog(`putServiceHandler OK`);
      return res.status(200).json({ "updated": "ok" });
    } else {
      showLog(`putServiceHandler ERROR-> ${resp.message}`);
      return res.status(500).send(resp.message);
    }
  } catch (err) {
    showLog(`putServiceHandler ERROR-> ${err.message}`);
    return res.status(500).send(err.message);
  }
};

module.exports = putServiceHandler;

