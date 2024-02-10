const getAllUsers = require("../../controllers/user/getAllUsers");
const showLog = require("../../functions/showLog");
const checkToken = require('../../functions/checkToken');

const getUsersHandler = async (req, res) => {
  try {
    const {
      nameOrLastName,
      attribute,
      order,
      page,
      size,
      branch,
      specialty,
      role,
      createDateEnd,
      createDateStart,
    } = req.query;
    const { token } = req.body;

    showLog(`getUsersHandler - Handler`);

    // Verifico token:
    if (!token) { throw Error("Se requiere token"); }
    const checked = await checkToken(token);
    if (!checked.exist) {
      showLog(checked.mensaje);
      return res.status(checked.code).send(checked.mensaje);
    }
    if (checked.role === "superSuperAdmin") {
      showLog(`Wrong role.`);
      return res.status(401).send(`Sin permiso.`);
    }

    const users = await getAllUsers(
      nameOrLastName,
      attribute,
      order,
      page,
      size,
      branch,
      specialty,
      role,
      createDateEnd,
      createDateStart,
      checked.dbName
    );
    showLog(`getUsersHandler OK`);
    return res.status(200).json(users);
  } catch (err) {
    showLog(`getUsersHandler ERROR-> ${err.message}`);
    return res.status(500).json({ message: err.message });
  }
};

module.exports = getUsersHandler;
