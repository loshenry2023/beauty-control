const { connectDB } = require(".././../DB_connection_General"); // conexión a la base de datos de trabajo
const getReg = require("../../controllers/getReg");
const showLog = require("../../functions/showLog");
const checkToken = require('../../functions/checkToken');

const getHistoricByClientHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const { token } = req.body;
        showLog(`getHistoricByClientHandler`);
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

        const { conn, HistoryService, Incoming, Client } = await connectDB(checked.dbName);
        await conn.sync();

        const data = {
            tableName: HistoryService,
            tableNameText: "HistoryServiceClient",
            tableName2: Incoming,
            tableName3: Client,
            tableName4: "",
            tableName5: "",
            id: id,
            dataQuery: "",
            conn: "",
            tableName6: ""
        }
        const resp = await getReg(data);
        await conn.close();

        if (resp) {
            showLog(`getHistoricByClientHandler OK`);
            return res.status(200).json(resp);
        } else {
            showLog(`getHistoricByClientHandler ERROR-> Not found`);
            return res.status(404).json({ message: "Not found" });
        }
    } catch (err) {
        showLog(`getHistoricByClientHandler ERROR-> ${err.message}`);
        return res.status(500).send(err.message);
    }
};

module.exports = getHistoricByClientHandler;

