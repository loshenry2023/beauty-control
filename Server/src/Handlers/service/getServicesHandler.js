const { connectDB } = require("../../DB_connection_General"); // conexión a la base de datos de trabajo
const getReg = require("../../controllers/getReg");
const showLog = require("../../functions/showLog");
const checkToken = require('../../functions/checkToken');

const getServicesHandler = async (req, res) => {
  try {
    const { token } = req.body;
    showLog(`getServicesHandler`);
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


    const { conn, Service, Specialty } = await connectDB(checked.dbName);
    await conn.sync({ alter: true });

    const data = {
      tableName: Service,
      tableNameText: "Service",
      tableName2: Specialty,
      tableName3: "",
      tableName4: "",
      tableName5: "",
      id: "",
      dataQuery: "",
      conn: "",
      tableName6: ""
    }
    const resp = await getReg(data);
    await conn.close(); // cierro la conexión

    if (resp) {
      showLog(`getServicesHandler OK`);
      return res.status(200).json(resp);
    } else {
      showLog(`getServicesHandler ERROR-> Not found`);
      return res.status(404).json({ message: "Not found" });
    }
  } catch (err) {
    showLog(`getServicesHandler ERROR-> ${err.message}`);
    return res.status(500).send(err.message);
  }
};

module.exports = getServicesHandler;

