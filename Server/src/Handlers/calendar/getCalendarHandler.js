const { connectDB } = require(".././../DB_connection_General"); // conexión a la base de datos de trabajo
const getReg = require("../../controllers/getReg");
const showLog = require("../../functions/showLog");
const checkToken = require('../../functions/checkToken');

const getCalendarHandler = async (req, res) => {
  try {
    const { token } = req.body;
    showLog(`getCalendarHandler`);
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

    const { conn, Calendar, User, Service, Client, Branch, Specialty } = await connectDB(checked.dbName);
    await conn.sync();

    const data = {
      tableName: Calendar,
      tableNameText: "Calendar",
      tableName2: User,
      tableName3: Service,
      tableName4: Client,
      tableName5: Branch,
      id: "",
      dataQuery: req.query,
      conn: "",
      tableName6: Specialty
    }
    const resp = await getReg(data);
    await conn.close();

    if (resp) {
      showLog(`getCalendarHandler OK`);
      return res.status(200).json(resp);
    } else {
      showLog(`getCalendarHandler ERROR-> Not found`);
      return res.status(404).json({ message: "Not found" });
    }
  } catch (err) {
    showLog(`getCalendarHandler ERROR-> ${err.message}`);
    return res.status(500).send(err.message);
  }
};

module.exports = getCalendarHandler;

