//! Controllers
const router = require("express").Router();
// Únicamente para el deploy:
const getMain = require("../controllers/getMain");
// Usuarios:
const postUserHandler = require("../Handlers/user/postUserHandler");
const putUserHandler = require("../Handlers/user/putUserHandler");
const deleteUserHandler = require("../Handlers/user/deleteUserHandler");
const usersHandler = require("../Handlers/user/usersHandler");
const getUserData = require("../controllers/user/getUserData");
const postUserLogin = require("../controllers/user/postUserLogin");
const postUserLogout = require("../controllers/user/postUserLogout");
// Especialidades:
const postSpecialtyHandler = require("../Handlers/specialty/postSpecialtyHandler");
const putSpecialtyHandler = require("../Handlers/specialty/putSpecialtyHandler");
const deleteSpecialtyHandler = require("../Handlers/specialty/deleteSpecialtyHandler");
const getSpecialtiesHandler = require("../Handlers/specialty/getSpecialtiesHandler");
// Medios de pago:
const postPaymentHandler = require("../Handlers/payment/postPaymentHandler");
const putPaymentHandler = require("../Handlers/payment/putPaymentHandler");
const deletePaymentHandler = require("../Handlers/payment/deletePaymentHandler");
const getPaymentsHandler = require("../Handlers/payment/getPaymentsHandler");
// Sedes:
const postBranchHandler = require("../Handlers/branch/postBranchHandler");
const putBranchHandler = require("../Handlers/branch/putBranchHandler");
const deleteBranchHandler = require("../Handlers/branch/deleteBranchHandler");
const getBranchHandler = require("../Handlers/branch/getBranchHandler");

//! Rutas
// Usuarios:
router.post("/newuser", postUserHandler); //  crea un usuario
router.put("/edituserdata/:id", putUserHandler); //  edita un usuario
router.post("/deleteuserdata/:id", deleteUserHandler); //  elimina un usuario
router.post("/users", usersHandler); // obtiene y devuelve todos los usuarios
router.post("/userdetails/:id", getUserData); // obtiene y devuelve los detalles de un usuario por id
router.post("/userdata", postUserLogin); // obtiene los datos de un usuario para el login, registra el token y devuelve sus datos asociados
router.post("/logoutuser", postUserLogout); // logout de usuario, borra el token registrado
// Especialidades:
router.post("/specialty", postSpecialtyHandler); //  crea una especialidad
router.put("/specialty/:id", putSpecialtyHandler); //  edita una especialidad
router.post("/deletespecialty/:id", deleteSpecialtyHandler); //  elimina una especialidad
router.post("/specialties", getSpecialtiesHandler); // obtiene y devuelve todas las especialidades
// Medios de pago:
router.post("/payment", postPaymentHandler); //  crea un medio de pago
router.put("/payment/:id", putPaymentHandler); //  edita un pago
router.post("/deletepayment/:id", deletePaymentHandler); //  elimina un medio de pago
router.post("/payments", getPaymentsHandler); // obtiene y devuelve todos los medios de pago
// Sedes:
router.post("/branch", postBranchHandler); // crea una sede
router.put("/branch/:id", putBranchHandler); // edita una sede
router.post("/deletebranch/:id", deleteBranchHandler); //  elimina una sede
router.post("/branches", getBranchHandler); // obtiene y devuelve todas las sedes
// Otras:
router.get("/", getMain); // únicamente para el deploy

module.exports = router;
