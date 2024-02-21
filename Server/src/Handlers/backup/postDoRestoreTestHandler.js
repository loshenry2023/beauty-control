// ! Sólo para test: prepara un archivo conteniendo los datos a usar para la posterior restauración de prueba. se usa para testear el proceso.
const showLog = require("../../functions/showLog");
const fs = require('fs');
const path = require('path');

const postDoRestoreTestHandler = async (req, res) => {
    try {
        showLog(`postDoRestoreTestHandler`);
        const { userNameTest, dbNameTest, nameCompanyTest } = req.body;

        const filePath = path.join(__dirname, 'Salidatest.dat');
        const directoryPath = path.dirname(filePath);
        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath, { recursive: true });
        }
        let output = `${userNameTest}\n${dbNameTest}\n${nameCompanyTest}\n`;
        fs.writeFileSync(filePath, output, 'utf-8');
        let respu = {};
        if (fs.existsSync(filePath)) {
            showLog(`postDoRestoreTestHandler OK`);
            respu = { created: "ok", file: filePath };
            return res.status(200).json({ respu });
        } else {
            showLog(`postDoRestoreTestHandler ERROR`);
            respu = { created: "error", message: "El archivo no se generó" };
            return res.status(500).send(respu.message);
        }
    } catch (err) {
        showLog(`postDoRestoreTestHandler ERROR -> ${err.message}`);
        return res.status(500).send(err.message);
    }
};

module.exports = postDoRestoreTestHandler;

