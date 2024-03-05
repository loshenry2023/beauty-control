//! Ejecuta una vez por día. Esto no funciona en Vercel porque tiene su propio cron, configurado en vercel.json. Dos funciones:
//! - Notifica por mail a los pacientes los próximos turnos.
//! - Notifica por mail a las empresas que tienen la suscripción cercana a expirar.
//! - Depura la tabla de logs.
const cron = require('node-cron');
const getAppointmentsReminder = require("../src/functions/getAppointmentsReminder");
const getListCompanies = require("../src/functions/getListCompanies");
const notificExpiration = require("../src/functions/notificExpiration");
const getListDBs = require("../src/functions/getListDBs");
const depuraLogs = require("../src/functions/depuraLogs");
const showLog = require("../src/functions/showLog");

async function notificarTurnos() {
    // Obtengo la lista de base de datos de las empresas:
    const listDBs = await getListDBs();
    for (const dbName of listDBs.dbNames) {
        // Hago el envío, una empresa a la vez:
        await getAppointmentsReminder(dbName);
    }
}

async function notificarExpiraciones() {
    // Obtengo la lista de empresas:
    const listCompanies = await getListCompanies();
    for (const company of listCompanies.company) {
        // Hago el envío, una empresa a la vez:
        await notificExpiration(company);
    }
}

async function DailyProcess() {
    await notificarTurnos();
    await notificarExpiraciones();
    await depuraLogs();
}

// ! ATENCIÓN: se debe entregar con el cron corriendo una vez al día.
//cron.schedule('*/10 * * * * *', () => { // para pruebas de envíos frecuentes
//cron.schedule('0 * * * *', () => { // una vez x hora
//cron.schedule('0 9,17 * * *', () => { // a las 9hs y a las 17hs de Colombia
cron.schedule('0 8 * * *', () => { // una vez al día a las 8hs de Colombia - este es el que debe quedar habilitado !!
    DailyProcess();
}, {
    scheduled: true,
    timezone: 'America/Bogota'
});

module.exports = cron;