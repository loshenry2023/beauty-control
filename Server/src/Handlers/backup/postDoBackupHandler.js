const doBackup = require("../../controllers/backup/doBackup");
const showLog = require("../../functions/showLog");
const checkToken = require('../../functions/checkToken');
const fs = require('fs');
const path = require('path');

const postDoBackupHandler = async (req, res) => {
    try {
        showLog(`postDoBackupHandler`);
        const { token } = req.body;
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

        const data = {
            data: req.body,
            userLogged: checked.userName,
            dbName: checked.dbName,
            nameCompany: checked.nameCompany,
        }
        const resp = await doBackup(data, res);

        if (resp.created === 'ok') {
            // Envío el archivo al front. Lo recibe como descarga en el navegador.
            const ret = await res.download(resp.file, resp.file, (err) => {
                if (err) {
                    showLog(`postDoBackupHandler ERROR TX-> ${err}`);
                    return res.status(500).send(err);
                } else {
                    // lo elimino localmente:
                    fs.unlinkSync(resp.file);
                }
            });
            showLog(`postDoBackupHandler OK`);
        } else {
            showLog(`postDoBackupHandler ERROR-> ${resp.message}`);
            return res.status(500).send(resp.message);
        }
    } catch (err) {
        showLog(`postDoBackupHandler ERROR -> ${err.message}`);
        return res.status(500).send(err.message);
    }
};

module.exports = postDoBackupHandler;

