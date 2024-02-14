const { Company } = require("../../DB_connection_Main"); // conexión a la base de datos principal
const putReg = require("../../controllers/putReg");
const showLog = require("../../functions/showLog");

const putCompanysHandler = async (req, res) => {
  try {
    const { token, nMode } = req.body;
    showLog(`putCompanysHandler`);
    if (!token) { throw Error("Se requiere token"); }
    if (!nMode) { throw Error("Faltan datos"); }

    const data = {
      tableName: Company,
      tableNameText: "Companys",
      data: req.body,
      id: "",
      conn: "",
      tableName2: "",
      tableName3: "",
      tableName4: "",
      tableName5: "",
      userLogged: "",
      dbName: "",
      nameCompany: ""
    }
    const resp = await putReg(data);

    if (resp.created === 'ok') {
      showLog(`putCompanysHandler OK`);
      return res.status(200).json({ "updated": "ok" });
    } else {
      showLog(`putCompanysHandler ERROR-> ${resp.message}`);
      return res.status(500).send(resp.message);
    }
  } catch (err) {
    showLog(`putCompanysHandler ERROR-> ${err.message}`);
    return res.status(500).send(err.message);
  }
};

module.exports = putCompanysHandler;

