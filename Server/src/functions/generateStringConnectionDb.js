//! Genero un string de conexión a base de datos.
const {
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_PORT,
    SECURE,
} = require("./paramsEnv");
const showLog = require("./showLog");

function generateStringConnectionDb(databaseName) {
    let strConn;
    if (databaseName === "") {
        if (SECURE) {
            // conexión segura (para BD remota):
            //strConn = `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}?sslmode=require&dialect=postgres-co`; // cadena para Vercel
            strConn = `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}?sslmode=no-verify&dialect=postgres-co`;
        } else {
            // conexión no segura (para BD local):
            strConn = `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}`;
        }
    } else {
        if (SECURE) {
            // conexión segura (para BD remota):
            //strConn = `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${databaseName}?sslmode=require&dialect=postgres-co`; // cadena para Vercel
            strConn = `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${databaseName}?sslmode=no-verify&dialect=postgres-co`;
        } else {
            // conexión no segura (para BD local):
            strConn = `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${databaseName}`;
        }
    }
    return strConn;
}

module.exports = generateStringConnectionDb;
