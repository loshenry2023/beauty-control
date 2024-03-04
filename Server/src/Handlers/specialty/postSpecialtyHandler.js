const { connectDB } = require("../../DB_connection_General"); // conexión a la base de datos de trabajo
const postReg = require("../../controllers/postReg");
const showLog = require("../../functions/showLog");
const checkToken = require('../../functions/checkToken');

const postSpecialtyHandler = async (req, res) => {
    try {
        const { token } = req.body;
        showLog(`postSpecialtyHandler`);
        // Verifico token. Sólo un superAdmin puede agregar:
        if (!token) { throw Error("Se requiere token"); }
        const checked = await checkToken(token);
        if (!checked.exist) {
            showLog(checked.mensaje);
            return res.status(checked.code).send(checked.mensaje);
        }
        if (checked.role !== "superAdmin") {
            showLog(checked.role !== "superAdmin" ? `Wrong role.` : `Wrong token.`);
            return res.status(401).send(`Sin permiso.`);
        }

        const { conn, Specialty } = await connectDB(checked.dbName);
        await conn.sync();


        const data = {
            userLogged: checked.userName,
            tableName: Specialty,
            tableNameText: "Specialty",
            data: req.body,
            conn: "",
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
            showLog(`postSpecialtyHandler OK`);
            return res.status(200).json({ "created": "ok", "id": resp.id });
        } else {
            showLog(`postSpecialtyHandler ERROR-> ${resp.message}`);
            return res.status(500).send(resp.message);
        }
    } catch (err) {
        showLog(`postSpecialtyHandler ERROR-> ${err.message}`);
        return res.status(500).send(err.message);
    }
};

module.exports = postSpecialtyHandler;

