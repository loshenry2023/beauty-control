const { connectDB } = require("../../DB_connection_General"); // conexión a la base de datos de trabajo
const deleteReg = require("../../controllers/deleteReg");
const showLog = require("../../functions/showLog");
const checkToken = require('../../functions/checkToken');

const deleteServiceHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const { token } = req.body;
        showLog(`deleteServiceHandler`);
        // Verifico token. Sólo un superAdmin puede eliminar:
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

        const { conn, Service } = await connectDB(checked.dbName);
        await conn.sync();

        const data = {
            tableName: Service,
            id: id,
            tableNameText: "Service",
            tableName2: "",
            tableName3: "",
            userLogged: checked.userName,
            dbName: checked.dbName,
            nameCompany: checked.nameCompany,
        }
        const resp = await deleteReg(data);
        await conn.close();

        if (resp.deleted === 'ok') {
            showLog(`deleteServiceHandler OK`);
            return res.status(200).json({ deleted: "ok" });
        } else {
            showLog(`deleteServiceHandler ERROR-> ${resp.message}`);
            return res.status(404).send(resp.message);
        }
    } catch (err) {
        showLog(`deleteServiceHandler ERROR-> ${err.message}`);
        return res.status(500).send(err.message);
    }
};

module.exports = deleteServiceHandler;
