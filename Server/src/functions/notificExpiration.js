// ! Genera un mail de recordatorio cuando la suscripción está por expirar.
const showLog = require("./showLog");
const sendMail = require("./sendMail");
const { EMAIL } = require("./paramsEnv");
const logData = require("./logData");

async function notificExpiration(company) {
    try {
        const today = new Date();
        today.setHours(23, 59, 59); // Establece la hora a las 23:59:59 del día actual
        const expCompDate = new Date(company.expireAt.toISOString().slice(0, 10) + "T23:59:59");
        const differenceInMs = expCompDate.getTime() - today.getTime();
        const differenceInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));
        if (differenceInDays > 0 && differenceInDays < 6) {
            await processData(company.nameCompany, company.userName, company.expireAt.toISOString().slice(0, 10));
        }
        return { sent: true };
    } catch (err) {
        showLog(`notificExpiration ERROR-> ${err.message}`);
        return { sent: false, error: err.message };
    }
}

async function processData(nameCompany, userName, dateExp) {
    const data = {
        origin: EMAIL,
        target: userName,
        subject: "Beauty Control - Tu suscripción va a expirar",
        html: `${nameCompany}: Tu suscripción expirará el día ${dateExp}. Recuerda renovarla.`,
    }
    await sendMail(data);

    logData({ op: "S", nameCompany: nameCompany, dbName: ".", userName: ".", desc: `Expire subscription reminder sent to ${userName}` });
    showLog(`notificExpiration OK -> sent to ${nameCompany}, ${userName}`);
}

module.exports = notificExpiration;