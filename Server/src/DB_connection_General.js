// ! Configuración de modelos de las bases de datos de cada empresa. Obtiene las tablas para la bases de datos indicada por parámetro.
require("pg"); // requerido por Vercel para el deploy
const { Sequelize } = require("sequelize");
const generateStringConnectionDb = require("./functions/generateStringConnectionDb");
let database;

async function connectDB(databaseName) {
    const strConn = generateStringConnectionDb(databaseName);
    database = new Sequelize(strConn, { logging: false, native: false });

    const BranchModel = require("./models/Branch");
    const ClientModel = require("./models/Client");
    const HistoryServiceModel = require("./models/HistoryService");
    const PaymentModel = require("./models/Payment");
    const ServiceModel = require("./models/Service");
    const SpecialtyModel = require("./models/Specialty");
    const UserModel = require("./models/User");
    const CalendarModel = require("./models/Calendar");
    const IncomingModel = require("./models/Incoming");
    const CatGastosModel = require("./models/CatGastos");
    const ProductModel = require("./models/Product");
    const PriceHistoryModel = require("./models/PriceHistory");

    BranchModel(database);
    ClientModel(database);
    HistoryServiceModel(database);
    PaymentModel(database);
    ServiceModel(database);
    SpecialtyModel(database);
    UserModel(database);
    CalendarModel(database);
    IncomingModel(database);
    CatGastosModel(database);
    ProductModel(database);
    PriceHistoryModel(database);
    // Relacionar modelos:
    const {
        Branch,
        Client,
        HistoryService,
        Payment,
        Service,
        Specialty,
        User,
        Calendar,
        Incoming,
        CatGastos,
        Product,
        PriceHistory,
    } = database.models;

    // Relaciones:
    Client.hasMany(Calendar); //un cliente puede tener muchas citas agendadas
    Client.hasMany(HistoryService); //un cliente puede tener muchos procedimientos hechos
    User.belongsToMany(Specialty, { through: "user_specialty" }); // muchos usuarios pertenecen a muchas epecialidades
    User.belongsToMany(Branch, { through: "user_branch" }); // muchos usuarios pertenecen a muchas sedes
    Service.belongsToMany(Specialty, { through: "service_specialty" }); // muchos services pertenecen a muchas especialidades
    Calendar.belongsTo(Service); // un Calendar pertenece a un único service
    Calendar.belongsTo(User); // un Calendar pertenece a un único usuario
    Calendar.belongsTo(Client); // un Calendar pertenece a un único cliente
    Calendar.belongsTo(Branch); // un Calendar pertenece a una única sede
    Incoming.belongsToMany(Payment, { through: "incoming_payment" }); // muchos ingresos pertenecen a muchos medios de pago
    HistoryService.hasMany(Incoming); //un registro histórico puede tener muchos pagos hechos

    return { conn: database, Branch, Client, HistoryService, Payment, Service, Specialty, User, Calendar, Incoming, CatGastos, Product, PriceHistory };
}

module.exports = {
    connectDB,
};