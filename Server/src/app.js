const express = require("express");
const router = require("./routes/index");
const server = express();
const cronJobs = require('./cronJobs');

// Middleware para tener acceso sin seguridad (uso local):
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});
// Middleware para manejar formato json (body):
server.use(express.json());
// Middleware para anteponerle "/beautycontrol" a las rutas:
server.use("/beautycontrol", router);

module.exports = server;
