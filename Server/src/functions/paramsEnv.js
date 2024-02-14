//! Unico lugar donde obtengo las variables de entorno.
require("dotenv").config();

const DB_USER = process.env.DB_USER || "postgres";
const DB_PASSWORD = process.env.DB_PASSWORD || "admin";
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = process.env.DB_PORT || 5432;
const DB_NAME = process.env.DB_NAME || "beautycontrol";
const SECURE = process.env.SECURE || false;
const PORT = process.env.PORT || 3001;
const FIRST_SUPERSUPERADMIN = process.env.FIRST_SUPERSUPERADMIN || "loshenry2023@gmail.com";
const EMAIL = process.env.EMAIL || "loshenry2023@gmail.com";
const PASSWORD_EMAIL = process.env.PASSWORD_EMAIL || "nswm kmyt rgdf pjry";
const EMAIL_MAIN = process.env.EMAIL_MAIN || "erraticless@gmail.com";
const PASSWORD_EMAIL_MAIN = process.env.PASSWORD_EMAIL_MAIN || "kjpz oxne brrp ytju";
const NODEMAILER_HOST = process.env.NODEMAILER_HOST || "smtp.gmail.com";
const NODEMAILER_PORT = process.env.NODEMAILER_PORT || 465;

module.exports = {
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_NAME,
  SECURE,
  PORT,
  FIRST_SUPERSUPERADMIN,
  EMAIL,
  PASSWORD_EMAIL,
  EMAIL_MAIN,
  PASSWORD_EMAIL_MAIN,
  NODEMAILER_HOST,
  NODEMAILER_PORT
};
