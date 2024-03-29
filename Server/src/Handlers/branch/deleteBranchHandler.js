const { connectDB } = require("../../DB_connection_General"); // conexión a la base de datos de trabajo
const deleteReg = require("../../controllers/deleteReg");
const showLog = require("../../functions/showLog");
const checkToken = require('../../functions/checkToken');

const deleteBranchHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const { token } = req.body;
        showLog(`deleteBranchHandler`);
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

        const { conn, Branch, Calendar, User } = await connectDB(checked.dbName);
        await conn.sync();

        const data = {
            tableName: Branch,
            id: id,
            tableNameText: "Branch",
            tableName2: Calendar,
            tableName3: User,
            userLogged: checked.userName,
            dbName: checked.dbName,
            nameCompany: checked.nameCompany,
        }
        const resp = await deleteReg(data);
        await conn.close();

        if (resp.deleted === 'ok') {
            showLog(`deleteBranchHandler OK`);
            return res.status(200).json({ deleted: "ok" });
        } else {
            showLog(`deleteBranchHandler ERROR-> ${resp.message}`);
            return res.status(404).send(resp.message);
        }
    } catch (err) {
        showLog(`deleteBranchHandler ERROR-> ${err.message}`);
        return res.status(500).send(err.message);
    }
};

module.exports = deleteBranchHandler;
