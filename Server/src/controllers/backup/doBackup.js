// ! Resguardo en txt las tablas de la empresa. No se resguarda el calendario de citas ni el historial.
const { connectDB } = require("../../DB_connection_General"); // conexión a la base de datos de trabajo
//const { Op } = require("sequelize");
const showLog = require("../../functions/showLog");
const fs = require('fs');
const path = require('path');
const logData = require("../../functions/logData");

const doBackup = async (dataInc, res) => {
    const { data, userLogged, dbName, nameCompany } = dataInc
    showLog('doBackup');
    const { conn, Branch, Calendar, CatGastos, Client, HistoryService, Incoming, Payment, PriceHistory, Product, Service, Specialty, User } = await connectDB(dbName);
    await conn.sync();
    try {
        const filePath = path.join(__dirname, 'Salida.dat');
        const directoryPath = path.dirname(filePath);
        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath, { recursive: true });
        }
        const today = new Date();

        // Sedes:
        const regBranch = await Branch.findAll({
        });
        let output = `~~~v1.0 - Beauty Control - Resguardo de datos ${today}.\n~~Branch\n`;
        regBranch.map(async (reg, index) => {
            const formattedOutput = `${reg?.branchName ?? ''}\t${reg?.coordinates ?? ''}\t${reg?.address ?? ''}\t${reg?.phoneNumber ?? ''}\t${reg?.openningHours ?? ''}\t${reg?.clossingHours ?? ''}\t${reg?.workingDays ?? ''}\t${reg?.linkFb ?? ''}\t${reg?.linkIg ?? ''}\t${reg?.linkTk ?? ''}\t\n`;
            output += formattedOutput;
        });
        output += "~~~~~~~~~~~~\n";

        //Specialty:
        const regSpec = await Specialty.findAll({
            // where: { id: idBranch },
        });
        output += "~~Specialty\n";
        regSpec.map(async (reg, index) => {
            const formattedOutput = `${reg?.specialtyName ?? ''}\t\n`;
            output += formattedOutput;
        });
        output += "~~~~~~~~~~~~\n";

        // Calendario:
        // const regCal = await Calendar.findAll({
        //     // where: { id: idBranch },
        // });
        // output += "~~Calendar\n";
        // regCal.map((reg, index) => {
        //     //showLog(reg?.linkTk);
        //     const formattedOutput = `${reg?.date_from ?? ''}\t${reg?.date_to ?? ''}\t${reg?.obs ?? ''}\t${reg?.current ?? ''}\t${reg?.reminded ?? ''}\t\n`;
        //     output += formattedOutput;
        // });
        // output += "~~~~~~~~~~~~\n";

        // Cat. gastos:
        const regCatGast = await CatGastos.findAll({
        });
        output += "~~CatGastos\n";
        regCatGast.map(async (reg, index) => {
            //showLog(reg?.linkTk);
            const formattedOutput = `${reg?.catName ?? ''}\t\n`;
            output += formattedOutput;
        });
        output += "~~~~~~~~~~~~\n";

        // Payment:
        const regPayment = await Payment.findAll({
            // where: { id: idBranch },
        });
        output += "~~Payment\n";
        regPayment.map(async (reg, index) => {
            //showLog(reg?.linkTk);
            const formattedOutput = `${reg?.paymentMethodName ?? ''}\t\n`;
            output += formattedOutput;
        });
        output += "~~~~~~~~~~~~\n";

        // Incoming:
        // const regIncoming = await Incoming.findAll({
        //     include: [Payment],
        // });
        // output += "~~Incoming\n";
        // regIncoming.map(async(reg, index) => {
        //     showLog(`--- incoming ${reg?.paymentMethodName}`);
        //     const formattedOutput = `${reg?.amount ?? ''}\t${reg?.paymentMethodName ?? ''}\t${reg?.DateIncoming ?? ''}\t\n`;
        //     output += formattedOutput;
        //     // Obtengo los pagos relacionados:
        //     output += "~~~incoming_payment\n";
        //     if (reg?.Payments && reg.Payments.length > 0) {
        //         reg.Payments.forEach(payment => {
        //             showLog(`------ meth ${payment.paymentMethodName}`);
        //             output += `${payment.paymentMethodName}\t`;
        //         });
        //         output += `\n`;
        //     }
        //     output += "~~~F~~~~~~~~\n";
        // });
        // output += "~~~~~~~~~~~~\n";

        // PriceHistory:
        const regPriceHistory = await PriceHistory.findAll({
        });
        output += "~~PriceHistory\n";
        regPriceHistory.map(async (reg, index) => {
            const regBranch = await Branch.findOne({
                where: { id: reg.branchId },
            });
            const formattedOutput = `${regBranch?.branchName ?? ''}\t${reg?.prodId ?? ''}\t${reg?.price ?? ''}\t\n`;
            output += formattedOutput;
        });

        // Product:
        const regProduct = await Product.findAll({
        });
        output += "~~~~~~~~~~~~\n"; // cierro acá para que respete el orden de formación de archivo
        output += "~~Product\n";
        regProduct.map(async (reg, index) => {
            const regBranch = await Branch.findOne({
                where: { id: reg.branchId },
            });
            const formattedOutput = `${reg?.productCode ?? ''}\t${reg?.productName ?? ''}\t${regBranch?.branchName ?? ''}\t${reg?.description ?? ''}\t${reg?.supplier ?? ''}\t${reg?.amount ?? ''}\t\n`;
            output += formattedOutput;
        });

        // Service:
        const regService = await Service.findAll({
            include: [Specialty],
        });
        output += "~~~~~~~~~~~~\n"; // cierro acá para que respete el orden de formación de archivo
        output += "~~Service\n";
        regService.map(async (reg, index) => {
            //showLog(`--- svc ${reg?.serviceName}`);
            const formattedOutput = `${reg?.serviceName ?? ''}\t${reg?.duration ?? ''}\t${reg?.price ?? ''}\t${reg?.ImageService ?? ''}\t\n`;
            output += formattedOutput;
            // Obtengo las especialidades relacionadas:
            output += "~~~service_specialty\n";
            if (reg?.Specialties && reg.Specialties.length > 0) {
                reg.Specialties.forEach(specialty => {
                    //showLog(`------ espec ${specialty.specialtyName}`);
                    output += `${specialty.specialtyName}\t`;
                });
                output += `\n`;
            }
            output += "~~~F~~~~~~~~\n";
        });
        output += "~~~~~~~~~~~~\n";

        // User:
        const regUser = await User.findAll({
            include: [Specialty, Branch],
        });
        output += "~~User\n";
        regUser.map(async (reg, index) => {
            //showLog(`--- user ${reg?.userName}`);
            const formattedOutput = `${reg?.userName ?? ''}\t${reg?.notificationEmail ?? ''}\t${reg?.name ?? ''}\t${reg?.lastName ?? ''}\t${reg?.phoneNumber1 ?? ''}\t${reg?.phoneNumber2 ?? ''}\t${reg?.image ?? ''}\t${reg?.comission ?? ''}\t${reg?.role ?? ''}\t\n`;
            output += formattedOutput;
            // Obtengo las especialidades relacionadas:
            output += "~~~user_specialty\n";
            if (reg?.Specialties && reg.Specialties.length > 0) {
                reg.Specialties.forEach(specialty => {
                    //showLog(`------ espec ${specialty.specialtyName}`);
                    output += `${specialty.specialtyName}\t`;
                });
                output += `\n`;
            }
            output += "~~~F~~~~~~~~\n";
            // Obtengo las sedes relacionadas:
            output += "~~~user_branch\n";
            if (reg?.Branches && reg.Branches.length > 0) {
                reg.Branches.forEach(branch => {
                    //showLog(`---------- brnch ${branch.branchName}`);
                    output += `${branch.branchName}\t`;
                });
                output += `\n`;
            }
            output += "~~~F~~~~~~~~\n";
        });
        output += "~~~~~~~~~~~~\n";

        // Cliente:
        const regClient = await Client.findAll({
            // where: { id: idBranch },
        });
        output += "~~Client\n";
        regClient.map(async (reg, index) => {
            //showLog(reg?.linkTk);
            const formattedOutput = `${reg?.email ?? ''}\t${reg?.name ?? ''}\t${reg?.lastName ?? ''}\t${reg?.id_pers ?? ''}\t${reg?.phoneNumber1 ?? ''}\t${reg?.phoneNumber2 ?? ''}\t${reg?.image ?? ''}\t${reg?.birthday ?? ''}\t\n`;
            output += formattedOutput;
        });
        output += "~~~~~~~~~~~~\n";

        // HistoryService:
        // const regHistoryService = await HistoryService.findAll({
        //     // where: { id: idBranch },
        // });
        // output += "~~HistoryService\n";
        // regHistoryService.map(async(reg, index) => {
        //     //showLog(reg?.linkTk);
        //     const formattedOutput = `${reg?.imageServiceDone ?? ''}\t${reg?.date ?? ''}\t${reg?.conformity ?? ''}\t${reg?.branchName ?? ''}\t${reg?.serviceName ?? ''}\t${reg?.attendedBy ?? ''}\t${reg?.email ?? ''}\t${reg?.name ?? ''}\t${reg?.lastName ?? ''}\t${reg?.id_pers ?? ''}\t${reg?.idUser ?? ''}\t\n`;
        //     output += formattedOutput;
        // });
        // output += "~~~~~~~~~~~~\n";
        output += "~~~FIN\n";

        fs.writeFileSync(filePath, output, 'utf-8');
        if (fs.existsSync(filePath)) {

            logData({ op: ".", nameCompany: nameCompany, dbName: dbName, userName: userLogged, desc: `Backup was created` });
            return { created: "ok", file: filePath };
        } else {
            return { created: "error", message: "El archivo no se generó" };
        }
    } catch (error) {
        showLog(`doBackup -> error: ${error.message}`);
        return { created: "error", message: error.message };
    } finally {
        if (conn) {
            await conn.close();
        }
    }
}

module.exports = doBackup;