const server = require("./src/app");
const showLog = require("./src/functions/showLog");
const logData = require("./src/functions/logData");
const { PORT, SECURE, DB_NAME } = require("./src/functions/paramsEnv");
const { connMain } = require("./src/DB_connection_Main"); // mantengo la conexión con la base prinicpal siempre abierta.
const createNewDB = require("./src/functions/createNewDB");
const createNewTable = require("./src/functions/createNewTable");
const createMainUser = require("./src/functions/createMainUser");
const { transporter } = require("./src/nodemailer")

let conSegura = "";
SECURE ? (conSegura = "SECURE") : (conSegura = "NOT SECURE");

(async () => {
  try {
    // Verifico que exista la base de datos inicial antes de iniciar el servidor:
    let doStart = false;
    showLog("Verifying initial database...");
    if (await createNewDB(DB_NAME, ".", ".")) {
      // Base de datos recién creada. Genero la tabla de empresas y el usuario inicial:
      if (await createNewTable(DB_NAME, 'Company')) {
        if (await createMainUser(DB_NAME)) {
          if (await createNewTable(DB_NAME, 'Log')) {
            doStart = true;
          } else {
            showLog("Error creating initial log table to the database. Please check log and restart");
          }
          doStart = true;
        } else {
          showLog("Error creating initial user. Please check log and restart");
        }
      } else {
        showLog("Error creating initial table to the database. Please check log and restart");
      }
    } else {
      doStart = true;
    }
    if (doStart) {
      await connMain.authenticate();
      await connMain.sync({ alter: true });
      const serverInstance = server.listen(PORT, () => {
        logData({ op: ".", nameCompany: ".", dbName: ".", userName: ".", desc: `Server running into ${PORT} Port. DB Connection: ${conSegura}` });
        showLog(`Server running into ${PORT} Port. DB Connection: ${conSegura}`);
      });
      serverInstance.on("listening", async () => {
        try {
          await transporter.verify();
          logData({ op: ".", nameCompany: ".", dbName: ".", userName: ".", desc: `Email service running` });
          showLog(`Email service running`);
        } catch (err) {
          logData({ op: ".", nameCompany: ".", dbName: ".", userName: ".", desc: `Email server: error verifying email transporter: ${err}` });
          showLog(`Email server: error verifying email transporter: ${err}`);
        }
      });
    }
  } catch (err) {
    showLog(`Error starting (Was the database created? Are the email account values correct?). Please check log and restart. ${err}`);
  }
})();
