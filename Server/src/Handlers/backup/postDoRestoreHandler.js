const doRestore = require("../../controllers/backup/doRestore");
const showLog = require("../../functions/showLog");
const checkToken = require('../../functions/checkToken');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);

async function readAndProcessFile(filePath) {
    try {
        let isTest = false;
        let dataInc = {};
        if (fs.existsSync(filePath)) {
            const data = await readFileAsync(filePath, 'utf8');
            const [userNameTest, dbNameTest, nameCompanyTest] = data.split('\n');
            isTest = true;
            dataInc = {
                userLogged: userNameTest,
                dbName: dbNameTest,
                nameCompany: nameCompanyTest,
            }
        }
        return { isTest, dataInc };
    } catch (error) {
        throw error;
    }
}

const postDoRestoreHandler = async (req, res) => {
    try {
        showLog(`postDoRestoreHandler`);
        const { token } = req.body;
        // Para saber si es una restauración en modo test, verifico la existencia del file de datos de prueba:
        const filePath = path.join(__dirname, 'Salidatest.dat');
        let data = {};
        readAndProcessFile(filePath)
            .then(async ({ isTest, dataInc }) => {
                if (isTest) {
                    // Se trata de un test desde el cliente de pruebas. Tomo manualmente los datos que me indican:
                    showLog(`Es restauración en modo test`);
                    data = dataInc;
                } else {
                    // Funcionamiento normal.
                    // Verifico token. Sólo un superAdmin tiene permiso:
                    if (!token) { throw Error("Se requiere token"); }
                    const checked = await checkToken(token);
                    if (!checked.exist) {
                        showLog(checked.mensaje);
                        return res.status(checked.code).send(checked.mensaje);
                    }
                    if (checked.role !== "superAdmin") {
                        showLog(checked.role !== "superAdmin" ? `Wrong role.` : `Wrong token.`);
                        return res.status(401).send(`Sin permiso.`);
                    }
                    data = {
                        userLogged: checked.userName,
                        dbName: checked.dbName,
                        nameCompany: checked.nameCompany,
                    }
                }
                const respu = await doRestore(data, req, res);
                // Elimino el archivo de test:
                fs.unlinkSync(filePath);

                if (respu.restored === 'ok') {
                    showLog(`postDoRestoreHandler OK`);
                    return res.status(200).json(respu);
                } else {
                    showLog(`postDoRestoreHandler ERROR-> ${respu.message.message}`);
                    return res.status(500).send(respu.message.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    } catch (err) {
        showLog(`postDoRestoreHandler ERROR -> ${err.message}`);
        return res.status(500).send(err.message);
    }
};

module.exports = postDoRestoreHandler;

