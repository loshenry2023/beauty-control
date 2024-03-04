// ! Envía una mail.
const util = require('util');
const showLog = require("../functions/showLog");
const { EMAIL, EMAIL_MAIN, PASSWORD_EMAIL, PASSWORD_EMAIL_MAIN, NODEMAILER_HOST, NODEMAILER_PORT } = require("../functions/paramsEnv");

const sendMail = async (data, option = "") => {
    const { origin, target, subject, text, html } = data;
    if (!origin || !target || !subject || !html) { throw Error("Faltan datos"); }
    try {
        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({
            host: NODEMAILER_HOST,
            port: NODEMAILER_PORT,
            secure: true,
            auth: {
                user: option === "." ? EMAIL_MAIN : EMAIL,
                pass: option === "." ? PASSWORD_EMAIL_MAIN : PASSWORD_EMAIL,
            },
        });
        const sendMailAsync = util.promisify(transporter.sendMail).bind(transporter);
        const mailOptions = {
            from: origin,
            to: target,
            subject: subject,
            // text: text,
            html: html,
        };
        const info = await sendMailAsync(mailOptions);
        showLog(`mail sent to: ${target}`);
        return { sent: 'ok', message: info.response };
    } catch (error) {
        showLog(`Error sending mail: ${error}`);
        throw Error("Error enviando mail: " + error);
    }
}
module.exports = sendMail;
