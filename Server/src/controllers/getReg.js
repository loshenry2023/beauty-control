// ! Obtiene registros.
const { Op } = require("sequelize");
const showLog = require("../functions/showLog");
const { DB_NAME } = require("../functions/paramsEnv");
const { connectDB } = require("../DB_connection_General"); // conexión a la base de datos de trabajo

const getReg = async (dataInc) => {
    const {
        tableName,
        tableNameText,
        tableName2,
        tableName3,
        tableName4,
        tableName5,
        id,
        dataQuery,
        conn,
        tableName6 } = dataInc;
    try {
        let reg;
        switch (tableNameText) {
            case "Insumos":
                const {
                    productName,
                    description,
                    amount,
                    order: ord,
                    page: pg,
                    size: sze,
                    branchId: brnchId,
                    productCode,
                    supplier,
                    attribute: attr,
                } = dataQuery;
                // Primero obtengo el total de registros sin repetir y sin paginar:
                const resultConTotPr = await tableName.findAndCountAll({
                    attributes: [
                        [conn.fn('DISTINCT', conn.col('productCode')), 'productCode'],
                        "productName",
                        "description",
                        "supplier",
                        "amount",
                    ],
                    where: {
                        [Op.and]: [
                            // Filtro por sede:
                            { branchId: brnchId },
                            // Filtro por nombre de producto:
                            { productName: { [Op.iLike]: `%${productName}%` } },
                            // Filtro por proveedor:
                            { supplier: { [Op.iLike]: `%${supplier}%` } },
                            // Filtro por cantidad:
                            amount !== null ? { amount: amount } : {},
                            // Filtro por código de producto:
                            productCode !== "" ? { productCode: { [Op.iLike]: `%${productCode}%` } } : {},
                            // Filtro por descripción:
                            description !== "" ? { description: { [Op.iLike]: `%${description}%` } } : {},
                        ].filter(Boolean), // elimina los filtros nulos o vacíos
                    },
                });
                const productsCntTotC = resultConTotPr.rows;
                // Cuento la cantidad real de registros encontrados:
                let countTotalP = 0;
                for (const prod of productsCntTotC) {
                    countTotalP++;
                }
                // Ahora obtengo el total con la paginación solicitada. Repito la consulta casi igual, pero es porque me fallaba el contador original si se lo delegaba al control del count:
                const resultPr = await tableName.findAndCountAll({
                    attributes: [
                        [conn.fn('DISTINCT', conn.col('productCode')), 'productCode'],
                        "productName",
                        "description",
                        "supplier",
                        "amount",
                    ],
                    where: {
                        [Op.and]: [
                            // Filtro por sede:
                            { branchId: brnchId },
                            // Filtro por nombre de producto:
                            { productName: { [Op.iLike]: `%${productName}%` } },
                            // Filtro por proveedor:
                            { supplier: { [Op.iLike]: `%${supplier}%` } },
                            // Filtro por cantidad:
                            amount !== null ? { amount: amount } : {},
                            // Filtro por código de producto:
                            productCode !== "" ? { productCode: { [Op.iLike]: `%${productCode}%` } } : {},
                            // Filtro por descripción:
                            description !== "" ? { description: { [Op.iLike]: `%${description}%` } } : {},
                        ].filter(Boolean), // elimina los filtros nulos o vacíos
                    },
                    order: [["productCode", ord]],
                    limit: sze,
                    offset: sze * pg,
                });
                const products = resultPr.rows;
                // Agrego el precio al objeto de productos:
                let prodOut = [];
                let countParcialP = 0;
                for (const product of products) {
                    const latestPriceHistory = await tableName3.findOne({  // PriceHistory
                        where: { prodId: product.productCode, branchId: brnchId },
                        order: [["createdAt", "DESC"]],
                    });
                    dataOut = {
                        productCode: product.productCode,
                        productName: product.productName,
                        description: product.description,
                        price: latestPriceHistory ? latestPriceHistory.price : null,
                        supplier: product.supplier,
                        amount: product.amount,
                    };
                    prodOut.push(dataOut);
                    countParcialP++;
                }
                return { countTotal: countTotalP, countParcial: countParcialP, products: prodOut };
            case "Company":
                const { dateCreateFrom, dateCreateTo, showExpired, page: pgg = 0, size: szee = 10 } = dataQuery;
                let dFrom = dateCreateFrom + " 00:00:00";
                let dTo = dateCreateTo + " 23:59:59";
                const dateNow = new Date();
                // Primero obtengo el total de registros sin repetir y sin paginar:
                const resultConTotC = await tableName.findAndCountAll({
                    attributes: [conn.fn('DISTINCT', conn.col('nameCompany')), "nameCompany", "subscribedPlan", "expireAt", "imgCompany", "dbName"],
                    where: {
                        dbName: {
                            [Op.ne]: DB_NAME
                        },
                        createdAt: {
                            [Op.gte]: dFrom,
                            [Op.lte]: dTo,
                        },
                        expireAt: {
                            [Op.gte]: (showExpired === "0") ? dateNow : "1980-01-01 00:00:00",
                        },
                    },
                });
                const companiesCntTotC = resultConTotC.rows;
                // Cuento la cantidad real de registros encontrados:
                let countTotalC = 0;
                for (const company of companiesCntTotC) {
                    countTotalC++;
                }
                // Ahora obtengo el total con la paginación solicitada. Repito la consulta casi igual, pero es porque me fallaba el contador original si se lo delegaba al control del count:
                const result = await tableName.findAndCountAll({
                    attributes: [conn.fn('DISTINCT', conn.col('nameCompany')), "nameCompany", "subscribedPlan", "expireAt", "imgCompany", "dbName"],
                    where: {
                        dbName: {
                            [Op.ne]: DB_NAME
                        },
                        createdAt: {
                            [Op.gte]: dFrom,
                            [Op.lte]: dTo,
                        },
                        expireAt: {
                            [Op.gte]: (showExpired === "0") ? dateNow : "1980-01-01 00:00:00",
                        },
                    },
                    order: [["nameCompany", "asc"]],
                    limit: szee, //cuántas filas se mostrarán por página.
                    // pgg: página actual que se está visualizando
                    offset: szee * pgg, //cuántas filas se deben omitir antes de comenzar a recuperar las filas para la página actual
                });
                const companies = result.rows;
                // Agrego el usuario principal al objeto de empresas:
                //let processedCompanies = new Set();
                let compOut = [];
                let firstUsr = "";
                let countParcial = 0;
                for (const company of companies) {
                    const { conn, User } = await connectDB(company.dbName);
                    await conn.sync();
                    const userFound = await User.findOne({  // User
                        attributes: [
                            "first",
                            "userName",
                        ],
                        where: { first: '1' },
                    });
                    if (userFound) {
                        firstUsr = userFound.userName;
                    } else {
                        firstUsr = "{no encontrado}";
                    }
                    await conn.close();
                    dataOut = {
                        nameCompany: company.nameCompany,
                        subscribedPlan: company.subscribedPlan,
                        expireAt: company.expireAt,
                        imgCompany: company.imgCompany,
                        firstUser: firstUsr,
                    };
                    compOut.push(dataOut);
                    //processedCompanies.add(company.nameCompany);
                    countParcial++;
                }
                return { countTotal: countTotalC, countParcial: countParcial, rows: compOut };
            case "PriceHistory":
                const { branchId, productCode: prodID } = dataQuery;
                reg = await tableName.findAndCountAll({ //PriceHistory
                    attributes: [
                        ["createdAt", "date"],
                        "price",
                    ],
                    where: { prodId: prodID, branchId: branchId },
                    order: [["createdAt", "DESC"]],
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
