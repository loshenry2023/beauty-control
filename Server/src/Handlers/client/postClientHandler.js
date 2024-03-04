const { connectDB } = require("../../DB_connection_General"); // conexión a la base de datos de trabajo
const postReg = require("../../controllers/postReg");
const showLog = require("../../functions/showLog");
const checkToken = require('../../functions/checkToken');

const postClientHandler = async (req, res) => {
    try {
        const { token } = req.body;
        showLog(`postClientHandler`);
        // Verifico token. Sólo un superAdmin o admin puede agregar:
        if (!token) { throw Error("Se requiere token"); }
        const checked = await checkToken(token);
        if (!checked.exist) {
            showLog(checked.mensaje);
            return res.status(checked.code).send(checked.mensaje);
        }
        if (checked.role === "especialista" || checked.role === "superSuperAdmin") {
            showLog((checked.role === "especialista" || checked.role === "superSuperAdmin") ? `Wrong role.` : `Wrong token.`);
            return res.status(401).send(`Sin permiso.`);
        }

        const { conn, Client } = await connectDB(checked.dbName);
        await conn.sync();

        const data = {
            userLogged: checked.userName,
            tableName: Client,
            tableNameText: "Client",
            data: req.body,
            conn: conn,
            tableName2: "",
            tableName3: "",
            tableName4: "",
            tableName5: "",
            dbName: checked.dbName,
            nameCompany: checked.nameCompany,
        }
        const resp = await postReg(data);
        await conn.close();

        if (resp.created === 'ok') {
            showLog(`postClientHandler OK`);
            return res.status(200).json({ "created": "ok", "id": resp.id });
        } else {
            showLog(`postClientHandler ERROR-> ${resp.message}`);
            return res.status(500).send(resp.message);
        }
    } catch (err) {
        showLog(`postClientHandler ERROR-> ${err.message}`);
        return res.status(500).send(err.message);
    }
};

module.exports = postClientHandler;

