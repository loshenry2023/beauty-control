// ! Esta función crea un usuario superSuperAdmin en la base de datos principal:
const { connMain, Company } = require("../DB_connection_Main"); // conexión a la base de datos principal
const { FIRST_SUPERSUPERADMIN, EMAIL_MAIN, DB_NAME } = require("../functions/paramsEnv");
const postReg = require("../controllers/postReg");
const showLog = require("./showLog");

async function createMainUser(databaseName) {
  try {
    const dataUser = {
      "userName": FIRST_SUPERSUPERADMIN,
      "dbName": DB_NAME,
      "nameCompany": ".",
      "subscribedPlan": "none",
      "expireAt": "2080-12-31",
      "imgCompany": "https://res.cloudinary.com/dvptbowso/image/upload/v1707602963/beuatycontrol-logo_fullv_knombo.png",
    }
    const data = {
      userLogged: ".",
      tableName: Company,
      tableNameText: "CompanyMain",
      data: dataUser,
      conn: connMain,
      tableName2: "",
      tableName3: "",
      tableName4: "",
      tableName5: "",
      dbName: "",
      nameCompany: "",
    }
    const resp = await postReg(data);

    const dataUser2 = {
      "userName": EMAIL_MAIN,
      "dbName": DB_NAME,
      "nameCompany": ".",
      "subscribedPlan": "none",
      "expireAt": "2080-12-31",
      "imgCompany": "https://res.cloudinary.com/dvptbowso/image/upload/v1707602963/beuatycontrol-logo_fullv_knombo.png",
    }
    const data2 = {
      userLogged: ".",
      tableName: Company,
      tableNameText: "CompanyMain",
      data: dataUser2,
      conn: connMain,
      tableName2: "",
      tableName3: "",
      tableName4: "",
      tableName5: "",
      dbName: "",
      nameCompany: "",
    }
    const resp2 = await postReg(data2);

    if (resp.created === 'ok') {
      showLog(`Main user ${FIRST_SUPERSUPERADMIN} was created`);
      return true;
    } else {
      showLog(`Error creating user ${FIRST_SUPERSUPERADMIN}: ${resp.message}`);
      return false;
    }
  } catch (error) {
    showLog(`Error creating user ${FIRST_SUPERSUPERADMIN}: ${error.message}`);
  }
}

module.exports = createMainUser;