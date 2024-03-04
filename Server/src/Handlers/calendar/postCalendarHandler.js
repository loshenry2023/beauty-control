const { connectDB } = require(".././../DB_connection_General"); // conexión a la base de datos de trabajo
const postReg = require("../../controllers/postReg");
const showLog = require("../../functions/showLog");
const checkToken = require('../../functions/checkToken');

const postCalendarHandler = async (req, res) => {
    try {
        const { token } = req.body;
        showLog(`postCalendarHandler`);
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

        const { conn, Calendar, User, Service, Client, Branch } = await connectDB(checked.dbName);
        await conn.sync();
        const data = {
            userLogged: checked.userName,
            tableName: Calendar,
            tableNameText: "Calendar",
            data: req.body,
            conn: conn,
            tableName2: User,
            tableName3: Service,
            tableName4: Client,
            tableName5: Branch,
            dbName: checked.dbName,
            nameCompany: checked.nameCompany,
        }
        const resp = await postReg(data);
        await conn.close();

        if (resp.created === 'ok') {
            showLog(`postCalendarHandler OK`);
            return res.status(200).json({ "created": "ok" });
        } else {
            showLog(`postCalendarHandler ERROR-> ${resp.message}`);
            return res.status(500).send(resp.message);
        }
    } catch (err) {
        showLog(`postCalendarHandler ERROR-> ${err.message}`);
        return res.status(500).send(err.message);
    }
};

module.exports = postCalendarHandler;

