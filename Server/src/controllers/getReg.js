// ! Obtiene registros.
const { Op } = require("sequelize");
const showLog = require("../functions/showLog");
const { DB_NAME } = require("../functions/paramsEnv");

const getReg = async (dataInc) => {
  const {
    tableName,
    tableNameText,
    tableName2 = "",
    tableName3 = "",
    tableName4 = "",
    tableName5 = "",
    id = "",
    dataQuery = "",
    conn,
    tableName6 = "" } = dataInc;
  try {
    let reg;
    switch (tableNameText) {
      case "Company":
        reg = await tableName.findAndCountAll({ //Company
          attributes: [
            [conn.fn('DISTINCT', conn.col('nameCompany')), 'nameCompany'],
            "subscribedPlan",
            "expireAt",
            "imgCompany",
          ],
          where: {
            dbName: {
              [Op.ne]: DB_NAME
            },
          },
          order: [["nameCompany", "asc"]],
        });
        break;
      case "Specialists":
        const { branchWorking } = dataQuery;
        reg = await tableName.findAll({
          include: [
            {
              model: tableName2, //Branch,
              where: { branchName: { [Op.iLike]: `%${branchWorking}%` } },
              as: "Branches",
              through: { attributes: [] },
              attributes: ["id", "branchName"],
            },
          ],
          where: {
            role: `especialista`,
          },
          order: [["lastName", "asc"]],
          attributes: [
            "id",
            "name",
            "lastName",
            "userName",
            "role",
            "createdAt",
            "comission",
          ],
        });
        break;
      case "Branch":
        reg = await tableName.findAll({
          attributes: [
            "id",
            "branchName",
            "coordinates",
            "address",
            "phoneNumber",
            "openningHours",
            "clossingHours",
            "workingDays",
            "linkFb",
            "linkIg",
            "linkTk",
          ],
        });
        break;
      case "Payment":
        reg = await tableName.findAll({
          attributes: ["id", "paymentMethodName"],
        });
        break;
      case "Specialty":
        reg = await tableName.findAll({
          attributes: ["id", "specialtyName"],
        });
        break;
      case "CatGastos":
        reg = await tableName.findAll({
          attributes: ["id", "catName"],
        });
        break;
      case "Service":
        reg = await tableName.findAll({
          attributes: [
            "id",
            "serviceName",
            "duration",
            "price",
            "ImageService",
          ],
          include: [
            {
              model: tableName2,
              as: "Specialties",
              attributes: ["id", "specialtyName"],
              through: { attributes: [] },
            },
          ],
        });
        break;
      case "Client":
        reg = await tableName.findOne({
          attributes: [
            "id",
            "email",
            "name",
            "lastName",
            "id_pers",
            "phoneNumber1",
            "phoneNumber2",
            "image",
            "birthday",
          ],
          where: { id: id },
          include: [
            {
              model: tableName2,
              attributes: ["id", "date_from", "date_to", "obs"],
            },
            {
              model: tableName3,
              attributes: [
                "id",
                "date",
                "serviceName",
                "imageServiceDone",
                "conformity",
                "branchName",
                "attendedBy",
              ],
            },
          ],
        });
        break;
      case "Clients":
        const {
          nameOrLastName = "",
          attribute = "createdAt",
          attribute2 = "dayBirthday",
          order = "desc",
          page = 0,
          size = 10,
          createDateEnd = "",
          createDateStart = "",
          birthdaysMonth = "",
        } = dataQuery;
        reg = await tableName.findAndCountAll({
          attributes: [
            "id",
            "email",
            "name",
            "lastName",
            "id_pers",
            "phoneNumber1",
            "phoneNumber2",
            "image",
            "createdAt",
            "birthday",
            "monthBirthday",
          ],
          where: birthdaysMonth
            ? {
              [Op.or]: [
                //filtro por nombres
                { name: { [Op.iLike]: `%${nameOrLastName}%` } },
                { lastName: { [Op.iLike]: `%${nameOrLastName}%` } },
              ],
              //filtro por mes de cumpleaños
              monthBirthday: { [Op.iLike]: `%${birthdaysMonth}%` },
              createdAt: {
                //para la fecha de creación
                [Op.gte]: createDateStart || "1900-01-01",
                [Op.lte]: createDateEnd || new Date(),
              },
            }
            : {
              [Op.or]: [
                //filtro por nombres

                { name: { [Op.iLike]: `%${nameOrLastName}%` } },
                { lastName: { [Op.iLike]: `%${nameOrLastName}%` } },
              ],
              createdAt: {
                //para la fecha de creación
                [Op.gte]: createDateStart || "1900-01-01",
                [Op.lte]: createDateEnd || new Date(),
              },
            },
          order: [
            [attribute, order],
            [attribute2, order],
          ],
          limit: size,
          offset: size * page,
        });
        break;
      case "HistoryServiceClient":
        reg = await tableName.findAll({
          attributes: [
            "id",
            "imageServiceDone",
            "date",
            "conformity",
            "branchName",
            "serviceName",
            "attendedBy",
            "email",
            "name",
            "lastName",
            "id_pers",
            "ClientId",
          ],
          where: id ? { ClientId: id } : {},
          include: [
            {
              // incoming
              model: tableName2,
              attributes: ["id", "amount", "DateIncoming", "paymentMethodName"],
            },
          ],
        });
        break;
      case "HistoryServiceUser":
        reg = await tableName.findAll({
          attributes: [
            "id",
            "imageServiceDone",
            "date",
            "conformity",
            "branchName",
            "serviceName",
            "attendedBy",
            "email",
            "name",
            "lastName",
            "id_pers",
            "ClientId",
          ],
          where: id ? { idUser: id } : {},
          include: [
            {
              // incoming
              model: tableName2,
              attributes: ["id", "amount", "DateIncoming", "paymentMethodName"],
            },
          ],
        });
        break;
      case "Calendar":
        // Preparo los filtros previos a la consulta:
        const { dateFrom, dateTo, userId, branch } = dataQuery;

        reg = await tableName.findAll({
          // Calendar
          attributes: ["id", "date_from", "date_to", "obs", "current"],
          where: {
            date_from: {
              [Op.gte]: dateFrom,
              [Op.lte]: dateTo,
            },
          },
          order: [["date_from", "asc"]],
          include: [
            {
              // user
              model: tableName2,
              attributes: ["id", "userName", "name", "lastName"],
              where: userId ? { id: userId } : {},
              include: [
                {
                  model: tableName6, // Specialty
                  attributes: ["id", "specialtyName"],
                },
              ],
            },
            {
              // Service
              model: tableName3,
              attributes: [
                "id",
                "serviceName",
                "duration",
                "price",
                "ImageService",
              ],
            },
            {
              // Client
              model: tableName4,
              attributes: [
                "id",
                "email",
                "name",
                "lastName",
                "id_pers",
                "phoneNumber1",
                "phoneNumber2",
                "image",
              ],
            },
            {
              // Branch
              model: tableName5,
              attributes: ["id", "branchName"],
              where: branch ? { id: branch } : {},
            },
          ],
        });
        break;
      default:
        throw new Error("Tabla no válida");
    }
    return reg;
  } catch (err) {
    showLog(`getReg -> error: ${err.message}`);
    return err.message;
  }
};
module.exports = getReg;
