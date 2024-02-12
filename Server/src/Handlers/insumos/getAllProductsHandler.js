const { connectDB } = require("../../DB_connection_General"); // conexión a la base de datos de trabajo
const getReg = require("../../controllers/getReg");
const showLog = require("../../functions/showLog");
const checkToken = require('../../functions/checkToken');

const getAllProductsHandler = async (req, res) => {
  try {
    const {
      productName = "",
      description = "",
      code = null,
      amount = null,
      order = "asc",
      page = 0,
      size = 10,
      branch = "",
      productCode = "",
      token,
      supplier = "",
      attribute = "",
    } = req.body;

    showLog(`getAllProductsHandler`);
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

    const { conn, Product, Branch, PriceHistory } = await connectDB(checked.dbName);
    await conn.sync();

    const dataAdded = {
      productName,
      description,
      code,
      amount,
      order,
      page,
      size,
      branch,
      productCode,
      supplier,
      attribute,
    }

    const data = {
      tableName: Product,
      tableNameText: "Insumos",
      tableName2: Branch,
      tableName3: PriceHistory,
      tableName4: dataAdded,
      tableName5: "",
      id: "",
      dataQuery: "",
      conn: "",
      tableName6: ""
    }
    const resp = await getReg(data);
    await conn.close(); // cierro la conexión

    if (resp) {
      showLog(`getAllProductsHandler OK`);
      return res.status(200).json(resp);
    } else {
      showLog(`getAllProductsHandler ERROR-> Not found`);
      return res.status(404).json({ message: "Not found" });
    }
  } catch (err) {
    showLog(`getAllProductsHandler ERROR-> ${err.message}`);
    return res.status(500).send(err.message);
  }
};

module.exports = getAllProductsHandler;
