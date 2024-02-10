const { Company } = require("../../DB_connection_Main"); // conexión a la base de datos principal
const postReg = require("../../controllers/postReg");
const showLog = require("../../functions/showLog");
const checkToken = require('../../functions/checkToken');

const postCompanyHandler = async (req, res) => {
  try {
    const { token } = req.body;
    showLog(`postCompanyHandler`);
    // Verifico token. Sólo un superSuperAdmin puede agregar:
    if (!token) { throw Error("Se requiere token"); }
    const checked = await checkToken(token);
    if (!checked.exist) {
      return res.status(checked.code).send(checked.mensaje);
    }
    if (checked.role !== "superSuperAdmin") {
      showLog(checked.role !== "superSuperAdmin" ? `Wrong role.` : `Wrong token.`);
      return res.status(401).send(`Sin permiso.`);
    }
    const data = {
      userLogged: checked.userName,
      tableName: Company,
      tableNameText: "Company",
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
    if (resp.created === 'ok') {
      showLog(`postCompanyHandler OK`);
      return res.status(200).json({ "created": "ok", "id": resp.id });
    } else {
      showLog(`postCompanyHandler ERROR-> ${resp.message}`);
      return res.status(500).send(resp.message);
    }
  } catch (err) {
    showLog(`postCompanyHandler ERROR-> ${err.message}`);
    return res.status(500).send(err.message);
  }
};

module.exports = postCompanyHandler;

