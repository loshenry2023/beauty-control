const { connMain, Company } = require("../../DB_connection_Main"); // conexión a la base de datos principal
const getReg = require("../../controllers/getReg");
const showLog = require("../../functions/showLog");
const checkToken = require('../../functions/checkToken');

const getCompanyHandler = async (req, res) => {
  try {
    const { token } = req.body;
    showLog(`getCompanyHandler`);
    // Verifico token:
    if (!token) { throw Error("Se requiere token"); }
    const checked = await checkToken(token);
    if (!checked.exist) {
      showLog(checked.mensaje);
      return res.status(checked.code).send(checked.mensaje);
    }
    if (checked.role !== "superSuperAdmin") {
      showLog(checked.role !== "superSuperAdmin" ? `Wrong role.` : `Wrong token.`);
      return res.status(401).send(`Sin permiso.`);
    }

    const data = {
      tableName: Company,
      tableNameText: "Company",
      tableName2: "",
      tableName3: "",
      tableName4: "",
      tableName5: "",
      id: "",
      dataQuery: "",
      conn: connMain,
      tableName6: ""
    }
    const resp = await getReg(data);

    if (resp) {
      showLog(`getCompanyHandler OK`);
      return res.status(200).json(resp);
    } else {
      showLog(`getCompanyHandler ERROR-> Not found`);
      return res.status(404).json({ message: "Not found" });
    }
  } catch (err) {
    showLog(`getCompanyHandler ERROR-> ${err.message}`);
    return res.status(500).send(err.message);
  }
};

module.exports = getCompanyHandler;
