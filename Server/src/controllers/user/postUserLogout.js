// ! Logout: elimino el token del usuario.
const showLog = require('../../functions/showLog');
const checkToken = require('../../functions/checkToken');
const logData = require("../../functions/logData");

const postUserLogout = async (req, res) => {
    const { token } = req.body;
    showLog(`postUserLogout`);
    try {
        // Verifico token, con parámetro de indicación de borrado:
        if (!token) { throw Error("Se requiere token"); }
        const checked = await checkToken(token, true);
        logData({ op: "O", nameCompany: checked.nameCompany, dbName: checked.dbName, userName: checked.userName, desc: `User was logged out` });
        return res.status(200).json({ updated: 'ok', });
    } catch (err) {
        showLog(`postUserLogout ERROR -> ${err.message}`);
        return res.status(500).send(err.message);
    }
};

module.exports = postUserLogout;