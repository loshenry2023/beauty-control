const { connectDB } = require("../../DB_connection_General"); // conexión a la base de datos de trabajo
const deleteReg = require("../../controllers/deleteReg");
const showLog = require("../../functions/showLog");
const checkToken = require('../../functions/checkToken');

const deleteProductHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const { token, branchId } = req.body;
        showLog(`deleteProductHandler`);
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

        const { conn, Product, Branch } = await connectDB(checked.dbName);
        await conn.sync();

        const dataInc = {
            id: id,
            branchId: branchId
        }

        const data = {
            tableName: Product,
            id: dataInc,
            tableNameText: "Product",
            tableName2: Branch,
            tableName3: "",
            userLogged: checked.userName,
            dbName: checked.dbName,
            nameCompany: checked.nameCompany,
        }

        const resp = await deleteReg(data);
        await conn.close();
        if (resp.deleted === 'ok') {
            showLog(`deleteProductHandler OK`);
            return res.status(200).json({ deleted: "ok" });
        } else {
            showLog(`deleteProductHandler ERROR-> ${resp.message}`);
            return res.status(404).send(resp.message);
        }
    } catch (err) {
        showLog(`deleteProductHandler ERROR-> ${err.message}`);
        return res.status(500).send(err.message);
    }
};

module.exports = deleteProductHandler;
