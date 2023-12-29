const { conn, User } = require('../../DB_connection');
const putReg = require("../../controllers/putReg");
const showLog = require("../../functions/showLog");
const checkToken = require('../../functions/checkToken');

const putUserHandler = async (req, res) => {
  try {
    const { token } = req.body;
    const { id } = req.params;
    showLog(`putUserHandler`);
    // Verifico token. Sólo un superAdmin puede modificar:
    if (!token) { throw Error("Se requiere token"); }
    const checked = await checkToken(token);
    if (!checked.exist || checked.role !== "superAdmin") {
      showLog(checked.role !== "superAdmin" ? `Wrong role.` : `Wrong token.`);
      return res.status(401).send(`Sin permiso.`);
    }
    if (!id) { throw Error("Faltan datos"); }
    const resp = await putReg(User, "User", req.body, id, conn);
    if (resp.created === 'ok') {
      showLog(`putUserHandler OK`);
      return res.status(200).json({ "updated": "ok" });
    } else {
      showLog(`putUserHandler ERROR-> ${resp.message}`);
      return res.status(500).send(resp.message);
    }
  } catch (err) {
    showLog(`putUserHandler ERROR-> ${err.message}`);
    return res.status(500).send(err.message);
  }
};

module.exports = putUserHandler;

