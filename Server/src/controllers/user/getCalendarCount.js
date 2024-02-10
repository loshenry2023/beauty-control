// ! Obtiene la cantidad de citas de un usuario para la fecha actual, en la sede indicada.
const { connectDB } = require("../../DB_connection_General"); // conexión a la base de datos de trabajo
const showLog = require("../../functions/showLog");
const checkToken = require('../../functions/checkToken');
const { Op } = require('sequelize');

const getCalendarCount = async (req, res) => {
    const { branchID, userID, token } = req.body;
    showLog(`getCalendarCount`);
    try {
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

        if (!branchID || !userID) { throw Error("Faltan datos"); }
        // Obtengo las sedes relacionadas y las citas que tiene reservadas en cada una para la fecha actual:
        const miDate = new Date();
        const currentDateWithoutTime = miDate.toISOString().slice(0, 10);
        const appointments = await calendarPromises(branchID, currentDateWithoutTime, userID, checked.dbName);
        const userData = {
            count: appointments,
        }
        showLog(`getCalendarCount OK`);
        return res.status(200).json(userData);
    } catch (err) {
        showLog(`getCalendarCount ERROR-> ${err.message}`);
        return res.status(500).send(err.message);
    }
}

async function calendarPromises(branchId, currentDateWithoutTime, idUser, dbName) {
    // Obtengo la cantidad de citas para la sede actual, para la fecha actual:
    const { conn, User, Branch, Calendar } = await connectDB(dbName);
    await conn.sync({ alter: true });
    const result = await Calendar.findAndCountAll({
        attributes: ["id"],
        where: {
            date_from: {
                [Op.gte]: currentDateWithoutTime + " 00:00:00",
                [Op.lte]: currentDateWithoutTime + " 23:59:59",
            },
            current: true,
        },
        include: [
            {
                model: Branch,
                attributes: ["id"],
                where: { id: branchId },
            },
            {
                model: User,
                attributes: ["id"],
                where: idUser ? { id: idUser } : {},
            },
        ],
    });
    const Out = result.count;
    await conn.close();
    return Out;
}

module.exports = getCalendarCount;