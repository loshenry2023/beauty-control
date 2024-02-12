const { connectDB } = require("../../DB_connection_General"); // conexión a la base de datos de trabajo
const getReg = require("../../controllers/getReg");
const showLog = require("../../functions/showLog");
const checkToken = require('../../functions/checkToken');

const getClientHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { token } = req.body;
    showLog(`getClientHandler`);
    // Verifico token:
    if (!token) { throw Error("Se requiere token"); }
    const checked = await checkToken(token);
    if (!checked.exist) {
      showLog(checked.mensaje);
      return res.status(checked.code).send(checked.mensaje);
    }
    if (checked.role === "superSuperAdmin") {
      showLog(`Wrong role.`);
      return res.status(401).send(`Sin permiso.`);
    }

    if (!id) { throw Error("Faltan datos"); }

    const { conn, Client, Calendar, HistoryService } = await connectDB(checked.dbName);
    await conn.sync();

    const data = {
      tableName: Client,
      tableNameText: "Client",
      tableName2: Calendar,
      tableName3: HistoryService,
      tableName4: "",
      tableName5: "",
      id: id,
      dataQuery: "",
      conn: "",
      tableName6: ""
    }
    const resp = await getReg(data);
    await conn.close(); // cierro la conexión

    if (resp) {
      showLog(`getClientHandler OK`);
      return res.status(200).json(resp);
    } else {
      showLog(`getClientHandler ERROR-> Not found`);
      return res.status(404).json({ message: "Not found" });
    }
  } catch (err) {
    showLog(`getClientHandler ERROR-> ${err.message}`);
    return res.status(500).send(err.message);
  }
};

module.exports = getClientHandler;

