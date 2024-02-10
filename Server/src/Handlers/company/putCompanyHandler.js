const { Company } = require("../../DB_connection_Main"); // conexión a la base de datos principal
const putReg = require("../../controllers/putReg");
const showLog = require("../../functions/showLog");
const checkToken = require('../../functions/checkToken');

const putCompanyHandler = async (req, res) => {
  try {
    const { token, nameCompany } = req.body;
    showLog(`putCompanyHandler`);
    // Verifico token. Sólo un superSuperAdmin puede modificar:
    if (!token) { throw Error("Se requiere token"); }
    const checked = await checkToken(token);
    if (!checked.exist) {
      return res.status(checked.code).send(checked.mensaje);
    }
    if (checked.role !== "superSuperAdmin") {
      showLog(checked.role !== "superSuperAdmin" ? `Wrong role.` : `Wrong token.`);
      return res.status(401).send(`Sin permiso.`);
    }
    if (!nameCompany) { throw Error("Faltan datos"); }

    const data = {
      tableName: Company,
      tableNameText: "Company",
      data: req.body,
      id: "",
      conn: "",
      tableName2: "",
      tableName3: "",
      tableName4: "",
      tableName5: "",
      userLogged: checked.userName,
      dbName: checked.dbName,
      nameCompany: checked.nameCompany
    }
    const resp = await putReg(data);

    if (resp.created === 'ok') {
      showLog(`putCompanyHandler OK`);
      return res.status(200).json({ "updated": "ok" });
    } else {
      showLog(`putCompanyHandler ERROR-> ${resp.message}`);
      return res.status(500).send(resp.message);
    }
  } catch (err) {
    showLog(`putCompanyHandler ERROR-> ${err.message}`);
    return res.status(500).send(err.message);
  }
};

module.exports = putCompanyHandler;

