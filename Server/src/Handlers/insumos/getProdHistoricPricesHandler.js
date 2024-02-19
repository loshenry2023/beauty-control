const { connectDB } = require("../../DB_connection_General"); // conexión a la base de datos de trabajo
const getReg = require("../../controllers/getReg");
const showLog = require("../../functions/showLog");
const checkToken = require('../../functions/checkToken');

const getProdHistoricPricesHandler = async (req, res) => {
    try {
        const { token, branchId, productCode } = req.body;
        showLog(`getProdHistoricPricesHandler`);
        // Verifico token:
        if (!token) { throw Error("Se requiere token"); }
        const checked = await checkToken(token);
        if (!checked.exist) {
            showLog(checked.mensaje);
            return res.status(checked.code).send(checked.mensaje);
        }
        if (checked.role !== "superAdmin") {
            showLog(`Wrong role.`);
            return res.status(401).send(`Sin permiso.`);
        }

        if (!branchId || !productCode) { throw Error("Faltan datos"); }

        const { conn, PriceHistory } = await connectDB(checked.dbName);
        await conn.sync();
        const data = {
            tableName: PriceHistory,
            tableNameText: "PriceHistory",
            tableName2: "",
            tableName3: "",
            tableName4: "",
            tableName5: "",
            id: "",
            dataQuery: req.body,
            conn: "",
            tableName6: ""
        }
        const resp = await getReg(data);
        await conn.close();

        if (resp) {
            showLog(`getProdHistoricPricesHandler OK`);
            return res.status(200).json(resp);
        } else {
            showLog(`getProdHistoricPricesHandler ERROR-> Not found`);
            return res.status(404).json({ message: "Not found" });
        }
    } catch (err) {
        showLog(`getProdHistoricPricesHandler ERROR-> ${err.message}`);
        return res.status(500).send(err.message);
    }
};

module.exports = getProdHistoricPricesHandler;
