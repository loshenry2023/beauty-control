const express = require("express");
const router = require("./routes/index");
const server = express();
const cronJobs = require('./cronJobs');

// Acceso sin seguridad (para uso local):
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept,Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});
// Manejo de formato json (body):
server.use(express.json());
// Antepone "/beautycontrol" a las rutas:
server.use("/beautycontrol", router);

module.exports = server;
