const showLog = require("../../functions/showLog");
const checkToken = require('../../functions/checkToken');
const sendMail = require("../../functions/sendMail");

const sendMailHandler = async (req, res) => {
    try {
        const { token } = req.body;
        showLog(`sendMailHandler`);
        // Verifico token.:
        if (!token) { throw Error("Se requiere token"); }
        const checked = await checkToken(token);
        if (!checked.exist) {
            showLog(checked.mensaje);
            return res.status(checked.code).send(checked.mensaje);
        }
        const resp = await sendMail(req.body);
        if (resp.sent === 'ok') {
            showLog(`sendMailHandler OK`);
            return res.status(200).json({ sent: "ok" });
        } else {
            showLog(`sendMailHandler ERROR-> ${resp.message}`);
            return res.status(404).send(resp.message);
        }
    } catch (err) {
        showLog(`sendMailHandler ERROR-> ${err.message}`);
        return res.status(500).send(err.message);
    }
};

module.exports = sendMailHandler;
