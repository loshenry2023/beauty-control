const { connectDB } = require("../../DB_connection_General"); // conexión a la base de datos de trabajo
const postReg = require("../../controllers/postReg");
const showLog = require("../../functions/showLog");
const checkToken = require('../../functions/checkToken');

const postBranchHandler = async (req, res) => {
  try {
    const { token } = req.body;
    showLog(`postBranchHandler`);
    // Verifico token. Sólo un superAdmin puede agregar:
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

    const { conn, Branch } = await connectDB(checked.dbName);
    await conn.sync();

    const data = {
      userLogged: checked.userName,
      tableName: Branch,
      tableNameText: "Branch",
      data: req.body,
      conn: "",
      tableName2: "",
      tableName3: "",
      tableName4: "",
      tableName5: "",
      dbName: checked.dbName,
      nameCompany: checked.nameCompany,
    }
    const resp = await postReg(data);

    await conn.close(); // cierro la conexión

    if (resp.created === 'ok') {
      showLog(`postBranchHandler OK`);
      return res.status(200).json({ "created": "ok", "id": resp.id });
    } else {
      showLog(`postBranchHandler ERROR-> ${resp.message}`);
      return res.status(500).send(resp.message);
    }
  } catch (err) {
    showLog(`postBranchHandler ERROR-> ${err.message}`);
    return res.status(500).send(err.message);
  }
};

module.exports = postBranchHandler;

