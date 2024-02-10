const deleteReg = require("../../controllers/deleteReg");
const showLog = require("../../functions/showLog");
const checkToken = require('../../functions/checkToken');

const deleteCompanyHandler = async (req, res) => {
  try {
    const { token, nameCompany } = req.body;
    showLog(`deleteCompanyHandler`);
    // Verifico token. Sólo un superSuperAdmin puede eliminar:
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
      tableName: "",
      id: nameCompany,
      tableNameText: "Company",
      userLogged: checked.userName,
      dbName: checked.dbName,
      nameCompany: checked.nameCompany,
    }
    const resp = await deleteReg(data);

    if (resp.deleted === 'ok') {
      showLog(`deleteCompanyHandler OK`);
      return res.status(200).json({ deleted: "ok" });
    } else {
      showLog(`deleteCompanyHandler ERROR-> ${resp.message}`);
      return res.status(404).send(resp.message);
    }
  } catch (err) {
    showLog(`deleteCompanyHandler ERROR-> ${err.message}`);
    return res.status(500).send(err.message);
  }
};

module.exports = deleteCompanyHandler;
