// ! Obtiene todos los usuarios. Llamado desde el handler. Acá no se verifica token porque lo hace el handler.
const { connectDB } = require("../../DB_connection_General"); // conexión a la base de datos de trabajo
const { Op } = require("sequelize");
const showLog = require("../../functions/showLog");

const getAllUsers = async (
  nameOrLastName = "",
  attribute = "createdAt",
  order = "desc",
  page = 0,
  size = 10,
  branch = "",
  specialty = "",
  role = "",
  createDateEnd = "",
  createDateStart = "",
  dbName
) => {
  const { conn, User, Specialty, Branch } = await connectDB(dbName);
  await conn.sync({ alter: true });
  try {
    const { count, rows } = await User.findAndCountAll({
      include: [
        {
          model: Specialty,
          where: { specialtyName: { [Op.iLike]: `%${specialty}%` } },
          as: "Specialties",
          through: { attributes: [] },
          attributes: ["id", "specialtyName"],
        },
        {
          model: Branch,
          where: { branchName: { [Op.iLike]: `%${branch}%` } },
          as: "Branches",
          through: { attributes: [] },
          attributes: ["id", "branchName"],
        },
      ],
      attributes: ["id", "name", "lastName", "userName", "role", "createdAt", "comission"],
      distinct: true,
      where: {
        [Op.or]: [
          //filtro por nombres
          { name: { [Op.iLike]: `%${nameOrLastName}%` } },
          { lastName: { [Op.iLike]: `%${nameOrLastName}%` } },
        ],
        role: role ? role : [`especialista`, `superAdmin`, `admin`],
        createdAt: {
          //para la fecha de creación
          [Op.gte]: createDateStart || "1900-01-01",
          [Op.lte]: createDateEnd || new Date(),
        },
      },
      order: [[attribute, order]],
      limit: size,
      offset: size * page,
    });

    await conn.close();
    return {
      count,
      rows,
    };
  } catch (err) {
    // Cierro la conexión:
    if (conn) {
      await conn.close();
    }
    showLog(`usersHandler -> getAllUsers error: ${err.message}`);
    return { message: err.message };
  }
};

module.exports = getAllUsers;
