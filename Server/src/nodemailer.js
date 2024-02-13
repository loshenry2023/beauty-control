// ! Componente encargado del envío de mails.
const nodemailer = require("nodemailer");
const { EMAIL, PASSWORD_EMAIL, NODEMAILER_HOST, NODEMAILER_PORT } = require("../src/functions/paramsEnv");
const transporter = nodemailer.createTransport({
    host: NODEMAILER_HOST,
    port: NODEMAILER_PORT,
    secure: true,
    auth: {
        user: EMAIL,
        pass: PASSWORD_EMAIL
    }
});

module.exports = transporter;
