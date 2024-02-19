//! Ejecuta una vez por día. Esto no funciona en Vercel porque tiene su propio cron, configurado en vercel.json. Dos funciones:
//! - Notifica por mail a los pacientes los próximos turnos.
//! - Depura la tabla de logs.
const cron = require('node-cron');
const getAppointmentsReminder = require("../src/functions/getAppointmentsReminder");
const getListDBs = require("../src/functions/getListDBs");
const depuraLogs = require("../src/functions/depuraLogs");

async function notificarTurnos() {
    // Obtengo la lista de base de datos de las empresas:
    const listDBs = await getListDBs();
    for (const dbName of listDBs) {
        // Hago el envío, una empresa a la vez:
        await getAppointmentsReminder(dbName);
    }
}

async function DailyProcess() {
    await notificarTurnos();
    await depuraLogs();
}

// ! PENDIENTE: se debe entregar con el cron corriendo una vez al día.
cron.schedule('*/10 * * * * *', () => { // para pruebas de envíos frecuentes
    //cron.schedule('0 * * * *', () => { // una vez x hora
    //cron.schedule('0 9,17 * * *', () => { // a las 9hs y a las 17hs de Colombia
    //cron.schedule('0 8 * * *', () => { // una vez al día a las 8hs de Colombia - este es el que debe quedar habilitado !!
    DailyProcess();
}, {
    scheduled: true,
    timezone: 'America/Bogota'
});

module.exports = cron;