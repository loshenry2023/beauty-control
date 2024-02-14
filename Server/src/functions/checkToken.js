//! Verifico que el token pertenezca a un usuario.
const { Company } = require("../DB_connection_Main"); // conexión a la base de datos principal
const { connectDB } = require("../DB_connection_General"); // conexión a la base de datos de trabajo
const { DB_NAME } = require("../functions/paramsEnv");
const showLog = require("../functions/showLog");
const isCompanyCurrent = require("../functions/isCompanyCurrent");
//const { Op } = require('sequelize');

async function checkToken(tokenRec, clearToken = false) {
  console.log(tokenRec, "token en validation")
  try {
    const existingUsrCompany = await Company.findOne({
      where: { token: tokenRec },
    });
    if (existingUsrCompany) {
      // Además de encontrarlo se pide que lo elimine. Se aplica para logout:
      if (clearToken) {
        existingUsrCompany.token = "";
        existingUsrCompany.lastUse = "1900-01-01";
        await existingUsrCompany.save();
        return {
          exist: true,
          cleared: true,
          code: 200,
          userName: existingUsrCompany.userName,
          dbName: existingUsrCompany.dbName,
          nameCompany: existingUsrCompany.nameCompany
        };
      } else {
        // Verifico si el plan de la empresa sigue vigente:
        if (!await isCompanyCurrent(existingUsrCompany.expireAt)) {
          return { exist: false, mensaje: "La suscripción expiró", code: 402 };
        }
        // Verifico si el token sigue siendo vigente, comparando por tiempo transcurrido desde su último uso:
        const currentTime = new Date();
        const lastUseTime = existingUsrCompany.lastUse;
        // Calculo la diferencia en minutos:
        const minutesDifference = Math.floor(
          (currentTime - lastUseTime) / (1000 * 60)
        );
        // Verifico si pasaron 18 hs. desde el último uso:
        if (minutesDifference > 1080) {
          return { exist: false, mensaje: "La sesión expiró", code: 403 };
        }
        // Actualizo la fecha y hora del último uso:
        existingUsrCompany.lastUse = currentTime;
        await existingUsrCompany.save();
        let existingUser;
        let roleFound;
        if (existingUsrCompany.dbName !== DB_NAME) {
          // Obtengo los datos relacionados desde la tabla de usuarios de la base de la empresa:
          const { conn, User } = await connectDB(existingUsrCompany.dbName);
          await conn.sync({ alter: true });
          existingUser = await User.findByPk(existingUsrCompany.id);
          if (!existingUser) {
            await conn.close();
            return { exist: false, mensaje: "No encontrado", code: 401 };
          } else {
            roleFound = existingUser.role;
          }
          await conn.close();
        }

        return {
          exist: true,
          id: existingUsrCompany.id,
          userName: existingUsrCompany.userName,
          role: existingUsrCompany.dbName === DB_NAME ? "superSuperAdmin" : roleFound,
          code: 200,
          dbName: existingUsrCompany.dbName,
          nameCompany: existingUsrCompany.nameCompany,
          //createdAt: existingUsrCompany.createdAt,
          // subscribedPlan: existingUsrCompany.subscribedPlan,
          // expireAt: existingUsrCompany.expireAt,
        };
      }
    } else {
      return { exist: false, mensaje: "Sin permiso", code: 401 };
    }
  } catch (error) {
    showLog(`Error validating token: ${error}`);
    throw Error("Error validando token: " + error);
  }
}

module.exports = checkToken;
