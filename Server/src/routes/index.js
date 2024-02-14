// Todo - Controllers
const router = require("express").Router();
// Únicamente para el deploy:
const getMain = require("../controllers/getMain");
//! Empresas:
const postCompanyHandler = require("../Handlers/company/postCompanyHandler");
const putCompanyHandler = require("../Handlers/company/putCompanyHandler");
const putCompanysHandler = require("../Handlers/company/putCompanysHandler");
const getCompanyHandler = require("../Handlers/company/getCompanyHandler");
const deleteCompanyHandler = require("../Handlers/company/deleteCompanyHandler");
//! Usuarios:
const postUserHandler = require("../Handlers/user/postUserHandler");
const putUserHandler = require("../Handlers/user/putUserHandler");
const deleteUserHandler = require("../Handlers/user/deleteUserHandler");
const getUsersHandler = require("../Handlers/user/getUsersHandler");
const getUserData = require("../controllers/user/getUserData");
const postUserLogin = require("../controllers/user/postUserLogin");
const postUserLogout = require("../controllers/user/postUserLogout");
const getCalendarCount = require("../controllers/user/getCalendarCount");
const getSpecialistsHandler = require("../Handlers/user/getSpecialistsHandler");
//! Especialidades:
const postSpecialtyHandler = require("../Handlers/specialty/postSpecialtyHandler");
const putSpecialtyHandler = require("../Handlers/specialty/putSpecialtyHandler");
const deleteSpecialtyHandler = require("../Handlers/specialty/deleteSpecialtyHandler");
const getSpecialtiesHandler = require("../Handlers/specialty/getSpecialtiesHandler");
//! Medios de pago:
const postPaymentHandler = require("../Handlers/payment/postPaymentHandler");
const putPaymentHandler = require("../Handlers/payment/putPaymentHandler");
const deletePaymentHandler = require("../Handlers/payment/deletePaymentHandler");
const getPaymentsHandler = require("../Handlers/payment/getPaymentsHandler");
//! Sedes:
const postBranchHandler = require("../Handlers/branch/postBranchHandler");
const putBranchHandler = require("../Handlers/branch/putBranchHandler");
const deleteBranchHandler = require("../Handlers/branch/deleteBranchHandler");
const getBranchHandler = require("../Handlers/branch/getBranchHandler");
//! Otros:
const sendMail = require("../Handlers/mail/sendMailHandler");
//! Procedimientos:
const putServiceHandler = require("../Handlers/service/putServiceHandler");
const deleteServiceHandler = require("../Handlers/service/deleteServiceHandler");
const getServicesHandler = require("../Handlers/service/getServicesHandler");
const postServiceHandler = require("../Handlers/service/postServiceHandler");
//! Clientes:
const postClientHandler = require("../Handlers/client/postClientHandler");
const deleteClientHandler = require("../Handlers/client/deleteClientHandler");
const putClientHandler = require("../Handlers/client/putClientHandler");
const getClientHandler = require("../Handlers/client/getClientHandler");
const getAllClientHandler = require("../Handlers/client/getAllClientHandler");
//! Histórico de procedimientos:
const postHistoricProcHandler = require("../Handlers/historicServices/postHistoricProcHandler");
const getHistoricByClientHandler = require("../Handlers/historicServices/getHistoricByClientHandler");
const getHistoricByUsertHandler = require("../Handlers/historicServices/getHistoricByUsertHandler");
//! Calendario:
const postCalendarHandler = require("../Handlers/calendar/postCalendarHandler");
const deleteCalendarHandler = require("../Handlers/calendar/deleteCalendarHandler");
const putCalendarHandler = require("../Handlers/calendar/putCalendarHandler");
const getCalendarHandler = require("../Handlers/calendar/getCalendarHandler");
//! Categorías de gastos:
const postCatHandler = require("../Handlers/catGastos/postCatHandler");
const putCatHandler = require("../Handlers/catGastos/putCatHandler");
const deleteCatHandler = require("../Handlers/catGastos/deleteCatHandler");
const getCatHandler = require("../Handlers/catGastos/getCatHandler");
//! Insumos:
const getAllProductsHandler = require("../Handlers/insumos/getAllProductsHandler");
const postProductHandler = require("../Handlers/insumos/postProductHandler");
const putProductHandler = require("../Handlers/insumos/putProductHandler");
const getProdHistoricPricesHandler = require("../Handlers/insumos/getProdHistoricPricesHandler");
//! Balance y comisiones:
const getBalance = require("../Handlers/balance/getBalance");

// Todo - Rutas
//! Empresas:
router.post("/v1/companyadmin", postCompanyHandler); // crea una nueva empresa
router.put("/v1/companyadmin", putCompanyHandler); // edita una empresa
router.put("/v1/companyadmins", putCompanysHandler); // edita y devuelve una empresa 
router.post("/v1/companyadminlist", getCompanyHandler); //obtiene y devuelve todas las empresas
router.post("/v1/companyadmindel", deleteCompanyHandler); // elimina una empresa
//! Usuarios:
router.post("/v1/newuser", postUserHandler); //  crea un usuario
router.put("/v1/edituserdata/:id", putUserHandler); //  edita un usuario
router.post("/v1/deleteuserdata/:id", deleteUserHandler); //  elimina un usuario
router.post("/v1/users", getUsersHandler); // obtiene y devuelve todos los usuarios
router.post("/v1/userdetails/:id", getUserData); // obtiene y devuelve los detalles de un usuario por id
router.post("/v1/userdata", postUserLogin); // obtiene los datos de un usuario para el login, registra el token y devuelve sus datos asociados
router.post("/v1/logoutuser", postUserLogout); // logout de usuario, borra el token registrado
router.post("/v1/getcalendarcount", getCalendarCount); // obtiene y devuelve la cantidad de citas para un usuario en una sede
router.post("/v1/specialists", getSpecialistsHandler); // obtiene todos los usuario con rol de especialista
//! Especialidades:
router.post("/v1/specialty", postSpecialtyHandler); //  crea una especialidad
router.put("/v1/specialty/:id", putSpecialtyHandler); //  edita una especialidad
router.post("/v1/deletespecialty/:id", deleteSpecialtyHandler); //  elimina una especialidad
router.post("/v1/specialties", getSpecialtiesHandler); // obtiene y devuelve todas las especialidades
//! Medios de pago:
router.post("/v1/payment", postPaymentHandler); //  crea un medio de pago
router.put("/v1/payment/:id", putPaymentHandler); //  edita un pago
router.post("/v1/deletepayment/:id", deletePaymentHandler); //  elimina un medio de pago
router.post("/v1/payments", getPaymentsHandler); // obtiene y devuelve todos los medios de pago
//! Sedes:
router.post("/v1/branch", postBranchHandler); // crea una sede
router.put("/v1/branch/:id", putBranchHandler); // edita una sede
router.post("/v1/deletebranch/:id", deleteBranchHandler); //  elimina una sede
router.post("/v1/branches", getBranchHandler); // obtiene y devuelve todas las sedes
//! Otras:
router.get("/", getMain); // únicamente para el deploy
router.post("/v1/sendmail", sendMail); // envía un mail
//! Procedimientos:
router.post("/v1/service", postServiceHandler); //  crea un procedimiento
router.put("/v1/service/:id", putServiceHandler); //  edita un procedimiento
router.post("/v1/deleteservice/:id", deleteServiceHandler); //  elimina un procedimiento
router.post("/v1/getservices", getServicesHandler); // obtiene y devuelve todos los procedimientos
//! Clientes:
router.post("/v1/newclient", postClientHandler); //  crea un cliente
router.put("/v1/client/:id", putClientHandler); //  edita un cliente
router.post("/v1/deleteclient/:id", deleteClientHandler); //  elimina un cliente
router.post("/v1/getclient/:id", getClientHandler); // obtiene y devuelve los detalles de un cliente
router.post("/v1/getclients", getAllClientHandler); // obtiene y devuelve los datos principales de todos los clientes
//! Histórico de procedimientos:
router.post("/v1/newhistoricproc", postHistoricProcHandler); //  crea un registro en el histórico de procedimientos
router.post("/v1/gethistoricbyclient/:id", getHistoricByClientHandler); // obtiene y devuelve el histórico de los procedimientos. Filtra por client id
router.post("/v1/gethistoricbyuser/:id", getHistoricByUsertHandler); // obtiene y devuelve el histórico de los procedimientos. Filtra por usuario
//! Calendario:
router.post("/v1/newcalendar", postCalendarHandler); //  crea un evento en calendario
router.put("/v1/calendar/:id", putCalendarHandler); //  edita un evento en calendario
router.post("/v1/deletecalendar/:id", deleteCalendarHandler); //  elimina un evento en calendario
router.post("/v1/getcalendar", getCalendarHandler); // obtiene y devuelve todos los eventos en calendario. Filtra por fecha y por especialista por query
//! Categorías de gastos:
router.post("/v1/catgasto", postCatHandler); // crea una categoría
router.put("/v1/catgastos/:id", putCatHandler); // edita una categoría
router.post("/v1/deletecatgastos/:id", deleteCatHandler); //  elimina una categoría
router.post("/v1/catgastos", getCatHandler); // obtiene y devuelve todas las categorías
//! Insumos:
router.post("/v1/products", getAllProductsHandler); // obtiene y devuelve todos los insumos del inventario
router.post("/v1/productsCreate", postProductHandler); // crea un nuevo insumo
router.put("/v1/products/:id", putProductHandler); // edita un insumo
router.post("/v1/productsHist", getProdHistoricPricesHandler); // obtiene y devuelve el histórico de precios de un inusmo
//! Balance y comisiones:
router.post("/v1/getbalance", getBalance); // obtiene todos los usuarios para el balance y comisiones

module.exports = router;
