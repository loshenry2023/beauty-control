// ! Obtiene los datos de un usuario.
const { Company } = require("../../DB_connection_Main"); // conexión a la base de datos principal
const { connectDB } = require("../../DB_connection_General"); // conexión a la base de datos de trabajo
const showLog = require("../../functions/showLog");
const checkToken = require('../../functions/checkToken');
const { DB_NAME } = require("../../functions/paramsEnv");
//const { Op } = require('sequelize');

const getUserData = async (req, res) => {
    const { id } = req.params;
    const { token } = req.body;
    let userData = {};
    showLog(`getUserData`);
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

        if (!id) { throw Error("Faltan datos"); }
        // Obtengo los datos de la empresa:
        const existingUserCompany = await Company.findByPk(id);
        if (!existingUserCompany) {
            return res.status(404).send(`${id} no encontrado.`);
        }
        if (!existingUserCompany) {
            showLog(`getUserData: ${id} not found.`);
            return res.status(404).send(`${id} no encontrado.`);
        }
        if (existingUserCompany.dbName !== DB_NAME) {
            // Obtengo el resto de los datos:
            const { conn, User, Branch, Specialty } = await connectDB(existingUserCompany.dbName);
            await conn.sync({ alter: true });
            const existingUser = await User.findByPk(id, {
                include: [
                    {
                        model: Specialty,
                        as: 'Specialties',
                        attributes: ['id', 'specialtyName'],
                        through: { attributes: [] }
                    },
                    {
                        model: Branch,
                        as: 'Branches',
                        attributes: ['id', 'branchName'],
                        through: { attributes: [] }
                    },
                ],
            });
            if (!existingUser) {
                showLog(`getUserData: ${id} not found.`);
                return res.status(404).send(`${id} no encontrado.`);
            }
            // Obtengo la sede relacionada:
            const branchData = existingUser.Branch ? { id: existingUser.Branch.id, branchName: existingUser.Branch.branchName } : null;
            // Devuelvo los datos del usuario:
            userData = {
                id: id,
                userName: existingUser.userName,
                branches: existingUser.Branches,
                name: existingUser.name,
                lastName: existingUser.lastName,
                role: existingUser.role,
                notificationEmail: existingUser.notificationEmail,
                phone1: existingUser.phoneNumber1,
                phone2: existingUser.phoneNumber2,
                image: existingUser.image,
                comission: existingUser.comission,
                specialties: existingUser.Specialties,
                createdAt: existingUserCompany.createdAt,
                companyName: existingUserCompany.nameCompany,
                subscribedPlan: existingUserCompany.subscribedPlan,
                expireAt: existingUserCompany.expireAt
            }
            await conn.close();
        } else {
            // Devuelvo lo de la tabla de empresas porque no existen registros en users
            userData = {
                id: id,
                role: "superSuperAdmin",
                createdAt: existingUserCompany.createdAt,
                companyName: existingUserCompany.nameCompany,
                subscribedPlan: existingUserCompany.subscribedPlan,
                expireAt: existingUserCompany.expireAt
            }
        }
        showLog(`getUserData OK`);
        return res.status(200).json(userData);
    } catch (err) {
        showLog(`getUserData ERROR-> ${err.message}`);
        return res.status(500).send(err.message);
    }
}
module.exports = getUserData;