const doRestore = require("../../controllers/backup/doRestore");
const showLog = require("../../functions/showLog");
const checkToken = require('../../functions/checkToken');

const postDoRestoreHandler = async (req, res) => {
    try {
        showLog(`postDoRestoreHandler`);
        const { token } = req.body;

        // ! ANULAR CONTROL DE TOKEN AL PROBAR DESDE APP CLIENTE EXTERNA:
        // Verifico token. Sólo un superAdmin tiene permiso:
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
        //! HARDCODEAR LOS DATOS AL PROBAR DESDE APP CLIENTE EXTERNA:
        const data = {
            data: req.body,
            userLogged: checked.userName,
            dbName: checked.dbName,
            nameCompany: checked.nameCompany,
        }
        // const data = {
        //   data: req.body,
        //   userLogged: "prueba@gmail.com",
        //   dbName: "db1708113391376_vqjdwz", // buscar cuál es la base de datos asignada.
        //   nameCompany: "Nueva empresa 1",
        // }

        const respu = await doRestore(data, req, res);

        if (respu.restored === 'ok') {
            showLog(`postDoRestoreHandler OK`);
            return res.status(200).json(respu);
        } else {
            showLog(`postDoRestoreHandler ERROR-> ${respu.message.message}`);
            return res.status(500).send(respu.message.message);
        }
    } catch (err) {
        showLog(`postDoRestoreHandler ERROR -> ${err.message}`);
        return res.status(500).send(err.message);
    }
};

module.exports = postDoRestoreHandler;

