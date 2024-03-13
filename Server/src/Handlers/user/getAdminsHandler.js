const { connectDB } = require("../../DB_connection_General"); // conexión a la base de datos de trabajo
const getReg = require("../../controllers/getReg");
const showLog = require("../../functions/showLog");
const checkToken = require('../../functions/checkToken');

const getAdminsHandler = async (req, res) => {
    try {
        const { token } = req.body;
        showLog(`getAdminsHandler`);
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

        const { conn, User, Branch } = await connectDB(checked.dbName);
        await conn.sync();
        const data = {
            tableName: User,
            tableNameText: "Admins",
            tableName2: Branch,
            tableName3: "",
            tableName4: "",
            tableName5: "",
            id: "",
            dataQuery: req.query,
            conn: "",
            tableName6: ""
        }
        const resp = await getReg(data);
        await conn.close();

        if (resp) {
            showLog(`getAdminsHandler OK`);
            return res.status(200).json(resp);
        } else {
            showLog(`getAdminsHandler ERROR-> Not found`);
            return res.status(404).json({ message: "Not found" });
        }
    } catch (err) {
        showLog(`getAdminsHandler ERROR-> ${err.message}`);
        return res.status(500).send(err.message);
    }
};

module.exports = getAdminsHandler;
