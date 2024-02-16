// ! Recorro el archivo de backup y los cargo en las tablas de la empresa.
const { Company } = require("../../DB_connection_Main"); // conexión a la base de datos principal
const { connectDB } = require("../../DB_connection_General");
const showLog = require("../../functions/showLog");
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const { Op } = require("sequelize");
const logData = require("../../functions/logData");

const doRestore = async (data, req, res) => {
  const { conn, Branch, Calendar, CatGastos, Client, HistoryService, Incoming, Payment, PriceHistory, Product, Service, Specialty, User } = await connectDB(data.dbName);
  await conn.sync();

  try {
    showLog('doRestore');
    let regToDelete;
    await Branch.destroy({ where: {}, force: true });
    await CatGastos.destroy({ where: {}, force: true });
    await Client.destroy({ where: {}, force: true });
    await Payment.destroy({ where: {}, force: true });
    await PriceHistory.destroy({ where: {}, force: true });
    await Product.destroy({ where: {}, force: true });
    await Service.destroy({ where: {}, force: true });
    await Specialty.destroy({ where: {}, force: true });

    // Recupero el nombre del primer usuario, para conservarlo:
    let regSave = "";
    regToDelete = await User.findAll();
    for (const reg of regToDelete) {
      if (reg.first === '1') {
        regSave = reg.userName;
      }
    }

    await User.destroy({
      where: {
        first: {
          [Op.ne]: "1"
        }
      },
      force: true
    });

    // Conservar la empresa si el nombre de usuario coincide con el del primer usuario:
    regToDelete = await Company.findAll();
    for (const reg of regToDelete) {
      if (reg.userName !== regSave && reg.nameCompany === data.nameCompany) {
        await reg.destroy();
      } else {
      }
    }

    await new Promise((resolve, reject) => {
      // Cargo el archivo de texto:
      upload.single('file')(req, res, async function (err) {
        if (err) {
          showLog('doRestore Error: Error processing file.');
          reject({ restored: "error", message: err });
        }
        const file = req.file;
        if (!file) {
          showLog('doRestore Error: File not found.');
          reject({ restored: "error", message: "Archivo no encontrado" });
          return;
        }
        const fileContent = file.buffer.toString('utf-8');
        const lines = fileContent.split('\n');
        // Verifico formato y versión:
        if (lines.length === 0) {
          showLog('doRestore Error: Wrong format.');
          reject({ restored: "error", message: "Formato incorrecto de archivo (sin contenido)" });
          return;
        }
        let firstVerific = true;
        let imIntoMain = "";
        let imIntoSubMain = "";
        let regCreated;
        let regSvcCreated;
        let regUserCreated;
        let saltaRelacUser = false;
        for (let index = 0; index < lines.length; index++) {
          const line = lines[index];
          if (firstVerific) {
            // Verifico formato y obtengo versión:
            firstVerific = false;
            const firstFourChars = line.substring(0, 4);
            if (firstFourChars === "~~~v") {
              showLog(`v${line.substring(4, 8)}`);
            } else {
              showLog('doRestore Error: Wrong format.');
              reject({ restored: "error", message: "Formato incorrecto de archivo" });
              return;
            }
          } else {
            switch (line) {
              case "~~Branch":
                imIntoMain = "Branch";
                break;
              case "~~Specialty":
                imIntoMain = "Specialty";
                break;
              case "~~CatGastos":
                imIntoMain = "CatGastos";
                break;
              case "~~Payment":
                imIntoMain = "Payment";
                break;
              case "~~PriceHistory":
                imIntoMain = "PriceHistory";
                break;
              case "~~Product":
                imIntoMain = "Product";
                break;
              case "~~Service":
                imIntoMain = "Service";
                break;
              case "~~User":
                imIntoMain = "User";
                break;
              case "~~Client":
                imIntoMain = "Client";
                break;
              case "~~~~~~~~~~~~":
                //imIntoMain = "?";
                break;
              case "~~~F~~~~~~~~":
                imIntoSubMain = ""; // limpio la subsección
                break;
              case "~~~FIN":
                imIntoMain = ".";
                break;
              case "~~~user_specialty":
                imIntoSubMain = "user_specialty"; // subsección
                break;
              case "~~~user_branch":
                imIntoSubMain = "user_branch"; // subsección
                break;
              case "~~~service_specialty":
                imIntoSubMain = "service_specialty"; // subsección
                break;
              case "~~~FIN":
                imIntoMain = ".";
                break;
              default:
                if (imIntoMain === "Branch") {
                  const fields = line.split('\t');
                  regCreated = await Branch.create({
                    branchName: fields[0], coordinates: fields[1], address: fields[2], phoneNumber: fields[3], openningHours: fields[4], clossingHours: fields[5], workingDays: fields[6], linkFb: fields[7], linkIg: fields[8], linkTk: fields[9],
                  });
                }
                if (imIntoMain === "Specialty") {
                  const fields = line.split('\t');
                  regCreated = await Specialty.create({
                    specialtyName: fields[0],
                  });
                }
                if (imIntoMain === "CatGastos") {
                  const fields = line.split('\t');
                  regCreated = await CatGastos.create({
                    catName: fields[0],
                  });
                }
                if (imIntoMain === "Payment") {
                  const fields = line.split('\t');
                  regCreated = await Payment.create({
                    paymentMethodName: fields[0],
                  });
                }
                if (imIntoMain === "PriceHistory") {
                  const fields = line.split('\t');
                  // Obtengo el id branch para restaurar el dato en la sede correcta:
                  const regBranch = await Branch.findOne({
                    where: { branchName: fields[0] },
                  });
                  regCreated = await PriceHistory.create({
                    branchId: regBranch.id, prodId: fields[1], price: fields[2],
                  });
                }
                if (imIntoMain === "Product") {
                  const fields = line.split('\t');
                  // Obtengo el id branch para restaurar el dato en la sede correcta:
                  const regBranch = await Branch.findOne({
                    where: { branchName: fields[2] },
                  });
                  regCreated = await Product.create({
                    branchId: regBranch.id, productCode: fields[0], productName: fields[1], description: fields[3], supplier: fields[4], amount: fields[5],
                  });
                }
                if (imIntoMain === "Service") {
                  if (imIntoSubMain === "service_specialty") {
                    // Restauro las relaciones: obtengo el id de especialidad para restaurar el dato en el servicio correcto:
                    const fields = line.split('\t');
                    const regSpec = await Specialty.findOne({
                      where: { specialtyName: fields[0] },
                    });
                    await regSvcCreated.addSpecialties(regSpec);
                  } else {
                    const fields = line.split('\t');
                    regSvcCreated = await Service.create({
                      serviceName: fields[0], duration: fields[1], price: fields[2], ImageService: fields[3],
                    });
                  }
                }
                if (imIntoMain === "User") {
                  if (imIntoSubMain === "user_specialty") {
                    // Restauro las relaciones: obtengo el id de especialidad para restaurar el dato en el servicio correcto:
                    if (!saltaRelacUser) {
                      const fields = line.split('\t');
                      // showLog(`indice ${fields[0]}`);
                      const regSpec = await Specialty.findOne({
                        where: { specialtyName: fields[0] },
                      });
                      //showLog(`----> rel Specialty ${fields[0]}`);
                      if (regUserCreated[0]) {
                        await regUserCreated[0].addSpecialty(regSpec);
                      } else {
                        //showLog(`----> rel Specialty was not created`);
                      }
                    } else {
                      //showLog(`----> rel Specialty jumped`);
                    }
                  } else if (imIntoSubMain === "user_branch") {
                    // Restauro las relaciones: obtengo el id de sede para restaurar el dato en el servicio correcto:
                    if (!saltaRelacUser) {
                      const fields = line.split('\t');
                      const regBrnch = await Branch.findOne({
                        where: { branchName: fields[0] },
                      });
                      //showLog(`----> rel Branch  ${fields[0]}`);
                      if (regUserCreated[0]) {
                        await regUserCreated[0].addBranches(regBrnch);
                      } else {
                        //showLog(`----> rel Branch was not created`);
                      }
                    } else {
                      //showLog(`----> rel branch jumped`);
                    }
                  } else {

                    const fields = line.split('\t');
                    // Verifico que el usuario no exista previamente en la tabla de empresas, porque ese sería un resguardo antiguo y no le debería permitir continuar:
                    //showLog(`-> User ${fields[0]}`);
                    saltaRelacUser = false;
                    const regDataCheck = await Company.findOne({
                      where: { userName: fields[0] },
                    });
                    if (regDataCheck) {
                      saltaRelacUser = true;
                      //showLog(`User ${fields[0]} not restored: already exists!`);
                    } else {
                      // Obtengo los datos de la empresa a restaurar:
                      const regData = await Company.findOne({
                        where: { nameCompany: data.nameCompany },
                      });
                      // Agrego el usuario en la empresa:
                      const [UsrCreated, created] = await Company.findOrCreate({
                        where: { userName: fields[0], dbName: data.dbName, nameCompany: data.nameCompany, imgCompany: regData.imgCompany, subscribedPlan: regData.subscribedPlan, firstLogin: "0", expireAt: regData.expireAt, lastUse: "1900-01-01" },
                      });
                      // Obtengo el id creado:
                      const regIdUser = await Company.findOne({
                        where: { userName: fields[0] },
                      });
                      //showLog(`- User ${fields[0]}`);
                      // Agrego el usuario en la tabla interna:
                      regUserCreated = await User.findOrCreate({
                        where: { id: regIdUser.id, userName: fields[0], notificationEmail: fields[1], name: fields[2], lastName: fields[3], phoneNumber1: fields[4], phoneNumber2: fields[5], image: fields[6], comission: fields[7], role: fields[8], first: '0' },
                      });
                      //showLog(`- User Company ${fields[0]}`);
                    }
                  }
                }

                if (imIntoMain === "Client") {
                  const fields = line.split('\t');
                  regCreated = await Client.create({
                    email: fields[0], name: fields[1], lastName: fields[2], id_pers: fields[3], phoneNumber1: fields[4], phoneNumber2: fields[5], image: fields[6], birthday: fields[7],
                  });
                }
                if (imIntoMain === "") {
                  showLog(`Wrong data in file -> *${line}*`);
                }
            }
          }
        };
        logData({ op: ".", nameCompany: data.nameCompany, dbName: data.dbName, userName: data.userLogged, desc: `Backup was restored` });
        resolve({ restored: "ok" });
      });
    });
    if (conn) {
      await conn.close();
    }
    return { restored: "ok" };
  } catch (error) {
    return { restored: "error", message: error };
  } finally {
    if (conn) {
      await conn.close();
    }
  }
};

module.exports = doRestore;