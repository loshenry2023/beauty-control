const getRegBalance = require("../../controllers/balance/getRegBalance");
const showLog = require("../../functions/showLog");
const checkToken = require('../../functions/checkToken');

const getBalanceHandler = async (req, res) => {
    try {
        const { token } = req.body;
        showLog(`getBalanceHandler`);
        // Verifico token:
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
        const resp = await getRegBalance(req.body, checked.dbName);
        if (resp) {
            showLog(`getBalanceHandler OK`);
            return res.status(200).json(resp);
        } else {
            showLog(`getBalanceHandler ERROR-> Not found`);
            return res.status(404).json({ message: "Not found" });
        }
    } catch (err) {
        showLog(`getBalanceHandler ERROR-> ${err.message}`);
        return res.status(500).send(err.message);
    }
};

module.exports = getBalanceHandler;

