// ! Obtiene los datos de un usuario para el login. Además se registra el token recibido.
const showLog = require("../../functions/showLog");
const { Op } = require('sequelize');
const { Company } = require("../../DB_connection_Main"); // conexión a la base de datos principal
const { connectDB } = require("../../DB_connection_General"); // conexión a la base de datos de trabajo
const { DB_NAME } = require("../../functions/paramsEnv");
const logData = require("../../functions/logData");
const isCompanyCurrent = require("../../functions/isCompanyCurrent");

const postUserLogin = async (req, res) => {
    const { nameUser, idUser } = req.body;
    showLog(`postUserLogin`);
    try {
        if (!nameUser || !idUser) { throw Error("Faltan datos"); }
        // Obtengo de la base de empresas a qué empresa y base de datos pertenece el usuario:
        const nameLowercase = nameUser.toLowerCase();
        const existingUserCompany = await Company.findOne({
            where: { userName: { [Op.iLike]: nameLowercase } },
        });
        if (!existingUserCompany) {
            showLog(`postUserLogin: user ${nameUser} not found`);
            return res.status(404).send(`Usuario ${nameUser} no encontrado.`);
        }
        // Verifico si el plan de la empresa sigue vigente:
        if (!await isCompanyCurrent(existingUserCompany.expireAt)) {
            showLog(`postUserLogin: user ${nameUser}: the subscription expired`);
            return res.status(402).send(`La suscripción expiró.`);
        }
        // Actualizo la marca que indica que la próxima vez ya no será su primer ingreso:
        const isFirst = (existingUserCompany.firstLogin === "0") ? "0" : "1";
        existingUserCompany.firstLogin = "0";
        // Actualizo el token:
        existingUserCompany.token = idUser;
        // Establezco la hora de login, para calcular el tiempo de inactividad en los próximos llamados:
        const currentTime = new Date();
        existingUserCompany.lastUse = currentTime;
        await existingUserCompany.save();
        if (existingUserCompany.dbName === DB_NAME) {
            // El usuario superSuperAdmin no requiere seguir validando otros datos.
            const userDataCompany = {
                id: existingUserCompany.id,
                userName: existingUserCompany.userName,
                role: "superSuperAdmin",
                firstLogin: isFirst,
                createdAt: existingUserCompany.createdAt,
                companySubscribedPlan: existingUserCompany.subscribedPlan,
                companyName: existingUserCompany.nameCompany,
                companyExpireAt: existingUserCompany.expireAt,
                companyImg: existingUserCompany.imgCompany,
                token: idUser,
            }
            logData({ op: "L", nameCompany: existingUserCompany.nameCompany, dbName: existingUserCompany.dbName, userName: existingUserCompany.userName, desc: `User was logged in - superSuperAdmin` });
            showLog(`postUserLogin OK`);
            return res.status(200).json(userDataCompany);
        }
        // Una vez que ya tengo el nombre de la base de datos de trabajo, obtengo los datos del usuario a partir de la base de datos de la empresa:
        const { conn, User, Specialty, Branch } = await connectDB(existingUserCompany.dbName);
        await conn.sync({ alter: true });
        const existingUser = await User.findByPk(existingUserCompany.id, {
            include: [
                {
                    model: Specialty,
                    through: 'user_specialty',
                },
                {
                    model: Branch,
                    through: 'user_branch',
                },
            ],
        });
        if (!existingUser) {
            showLog(`postUserLogin: user ${nameUser} not found`);
            return res.status(404).send(`Usuario ${nameUser} no encontrado.`);
        }
        // Obtengo las sedes relacionadas:
        const userBranches = existingUser.Branches.map(branch => ({ id: branch.id, branchName: branch.branchName }));
        // Obtengo las especialidades relacionadas:
        const userSpecialties = existingUser.Specialties.map(specialty => ({ id: specialty.id, specialtyName: specialty.specialtyName }));
        const userData = {
            id: existingUserCompany.id,
            userName: existingUser.userName,
            name: existingUser.name,
            lastName: existingUser.lastName,
            role: existingUser.role,
            firstLogin: isFirst,
            createdAt: existingUser.createdAt,
            companySubscribedPlan: existingUserCompany.subscribedPlan,
            companyName: existingUserCompany.nameCompany,
            companyExpireAt: existingUserCompany.expireAt,
            companyImg: existingUserCompany.imgCompany,
            notificationEmail: existingUser.notificationEmail,
            phone1: existingUser.phoneNumber1,
            phone2: existingUser.phoneNumber2,
            image: existingUser.image,
            comission: existingUser.comission,
            branches: userBranches,
            specialties: userSpecialties,
            token: idUser,
        }
        await conn.close();
        logData({ op: "L", nameCompany: existingUserCompany.nameCompany, dbName: existingUserCompany.dbName, userName: existingUser.userName, desc: `User was logged in - ${existingUser.role}` });
        showLog(`postUserLogin OK`);
        return res.status(200).json(userData);
    } catch (err) {
        showLog(`postUserLogin ERROR -> ${err.message}`);
        return res.status(500).send(err.message);
    }
}

module.exports = postUserLogin;