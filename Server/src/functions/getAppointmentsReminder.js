// ! Genera los recordatorios de turnos para el día siguiente.
const { Company } = require("../DB_connection_Main"); // conexión a la base de datos principal
const { connectDB } = require("../DB_connection_General"); // conexión a la base de datos de trabajo
const showLog = require("../functions/showLog");
const sendMail = require("../functions/sendMail");
const { EMAIL } = require("../functions/paramsEnv");
const { Op } = require('sequelize');
const logData = require("../functions/logData");

async function getAppointmentsReminder(dbName) {
    //showLog(`getAppointmentsReminder`);
    const { conn, Service, Branch, Calendar, Client, User } = await connectDB(dbName);
    await conn.sync();

    try {
        // Establezco la fecha de mañana:
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const currentDateWithoutTime = tomorrow.toISOString().slice(0, 10);
        reg = await Calendar.findAll({
            attributes: ["id", "date_from"],
            where: {
                date_from: {
                    [Op.gte]: currentDateWithoutTime + " 00:00:00",
                    [Op.lte]: currentDateWithoutTime + " 23:59:59",
                },
                current: true,
                reminded: false,
            },
            include: [
                {
                    model: User,
                    attributes: ["id", "name", "lastName"],
                },
                {
                    model: Service,
                    attributes: [
                        "id",
                        "serviceName",
                    ],
                },
                {
                    model: Client,
                    attributes: [
                        "id",
                        "email",
                        "name",
                        "lastName",
                    ],
                },
                {
                    model: Branch,
                    attributes: ["id", "branchName", "address", "coordinates", "phoneNumber", "linkFb", "linkIg", "linkTk"],
                },
            ],
        });
        // Obtengo los datos de la empresa (logo, nombre) para el formateo del mail:
        let imgCompany = "";
        let nameCompany = "";
        const regCompany = await Company.findOne({
            attributes: [
                "imgCompany",
                "nameCompany"
            ],
            where: { dbName: dbName },
        });
        if (!regCompany) {
            showLog(`getAppointmentsReminder - DB ${dbName} not found`);
        } else {
            nameCompany = regCompany.nameCompany;
            imgCompany = regCompany.imgCompany;
        }
        let cont = 0;
        for (const data of reg) {
            await processData(data, Calendar, nameCompany, imgCompany);
            cont++;
        }
        await conn.close(); // cierro la conexión
        //showLog(`getAppointmentsReminder OK -> ${dbName} - ${cont} sent`);
        return { sent: true };
    } catch (err) {
        // Cierro la conexión:
        if (conn) {
            await conn.close();
        }
        showLog(`getAppointmentsReminder ERROR-> ${err.message}`);
        return { sent: false, error: err.message };
    }
}

async function processData(reg, Calendar, nameCompany, imgCompany, dbName) {
    const dateApp = reg.date_from.toISOString().slice(0, 10);
    const timeApp = reg.date_from.toISOString().slice(11, 16);
    const clientName = reg.Client.name
    const clientLastName = reg.Client.lastName
    const service = reg.Service.serviceName
    const telBranch = reg.Branch.phoneNumber
    const branchAddress = reg.Branch.address
    // const branchName = reg.Branch.branchName
    const branchCoordinates = reg.Branch.coordinates
    const branchFb = reg.Branch.linkFb
    const branchIg = reg.Branch.linkIg
    const specialistName = reg.User.name
    const specialistLastName = reg.User.lastName

    // Envío mail de recordatorio al cliente:
    const data = {
        origin: EMAIL,
        target: reg.Client.email,
        subject: nameCompany + " - Recordatorio de Cita",
        html: `<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'> <html dir='ltr' xmlns='http://www.w3.org/1999/xhtml' xmlns:o='urn:schemas-microsoft-com:office:office'> <head> <meta charset='UTF-8'> <meta content='width=device-width, initial-scale=1' name='viewport'> <meta name='x-apple-disable-message-reformatting'> <meta http-equiv='X-UA-Compatible' content='IE=edge'> <meta content='telephone=no' name='format-detection'> <title></title>     <link href='https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i' rel='stylesheet'>  </head> <body> <div dir='ltr' class='es-wrapper-color' style='color:black'>  <table class='es-wrapper' width='100%' cellspacing='0' cellpadding='0'> <tbody> <tr> <td class='esd-email-paddings' valign='top'> <table cellpadding='0' cellspacing='0' class='es-header esd-footer-popover' align='center'> <tbody> <tr> <td class='esd-stripe' align='center' esd-custom-block-id='35507'> <table bgcolor='#ffffff' class='es-header-body' align='center' cellpadding='0' cellspacing='0' width='550' style='border-right:1px solid transparent;border-bottom:1px solid transparent;'> <tbody> <tr> <td class='esd-structure es-p20r es-p20l' align='left'> <table width='100%' cellspacing='0' cellpadding='0'> <tbody> <tr> <td class='esd-container-frame' width='509' valign='top' align='center'> <table width='100%' cellspacing='0' cellpadding='0'> <tbody> <tr> <td class='esd-block-image' align='center' style='font-size: 0px;'><a target='_blank' href='https://laura-vargas-dkpl.vercel.app/'><img src=${imgCompany} alt style='display: block;' class='adapt-img' width='140' height='110'></a></td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> <tr> <td class='esd-structure es-p20r es-p20l' align='left'> <table cellpadding='0' cellspacing='0' width='100%'> <tbody> <tr> <td width='509' class='esd-container-frame' align='center' valign='top'> <table cellpadding='0' cellspacing='0' width='100%'> <tbody> <tr> <td align='left' class='esd-block-text'> <h1 style='text-align: left; font-size: 22px; line-height: 120%;'></h1> <h1 style='text-align: left; font-size: 22px; line-height: 120%;'>Hola, ${clientName} ${clientLastName}👋</h1> <h1 style='text-align: left; font-size: 16px; line-height: 120%;'></h1> <p style='text-align: left; font-size: 16px; line-height: 120%;'><strong> Te recordamos tu cita </strong><br>Recuerda asistir a tu cita, no te pierdas los detalles de la misma a continuación.</p> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> <tr> <td class='esd-structure es-p20r es-p20l' align='left'> <table cellpadding='0' cellspacing='0' width='100%'> <tbody> <tr> <td width='509' class='esd-container-frame' align='center' valign='top'> <table cellpadding='0' cellspacing='0' width='100%'> <tbody> <tr> <td align='left' class='esd-block-text' style='font-size:18'> <p style='font-weight:bold; font-size:16px; color:black'>📅 Dia: <span style='font-weight:normal; color:black'> ${dateApp} </span></p> <p style='font-weight:bold; font-size:16px; color:black'> 🕑 Horario: <span style='font-weight:normal; color:black'> ${timeApp} </span></p> <p style='font-weight:bold; font-size:16px; color:black'>🏠 Dirección: <span style='font-weight:normal'> ${branchAddress} </span></p> <p style='font-weight:bold; font-size:16px; color:black'>💄 Servicio: <span style='font-weight:normal; color:black'> ${service} </span></p> <p style='font-weight:bold; font-size:16px; color:black'>🙎‍♀️ Profesional: <span style='font-weight:normal; color:black'> ${specialistName} ${specialistLastName} </span></p> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> <tr> <td class='esd-structure es-p20r es-p20l' align='left' > <table cellpadding='0' cellspacing='0' width='100%'> <tbody> <tr> <td width='509' class='esd-container-frame' align='center' valign='top'> <table cellpadding='0' cellspacing='0' width='100%'> <tbody> <tr> <td align='left' class='esd-block-text'> <p style='font-size: 16px; margin-bottom: 2px; color:black'>❗<em> Sólo se tolerarán 15 minutos de retraso. Pasado este tiempo el turno se da por cancelado</em></p> <p style='font-size: 16px; margin-bottom: 2px; color:black'> Gracias por confiar en nosotros!</p> <p style='font-size: 16px; margin-bottom: 2px; color:black'> En caso de no poder concurrir, por favor cancela la reserva llamando al  ${telBranch}.</p> <p style='font-size: 16px; margin-bottom: 40px; color:black'> Google Maps: ${branchCoordinates} </p> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> <tr> <td class='esd-structure es-p10b es-p10r es-p5l' align='left'> <table cellpadding='0' cellspacing='0' width='100%'> <tbody> <tr> <td width='534' class='esd-container-frame' align='center' valign='top'> <table cellpadding='0' cellspacing='0' width='100%'> <tbody> <tr> <td class='esd-block-social' align='right' style='font-size: 0px;'> <table class='es-table-not-adapt es-social' cellspacing='0' cellpadding='0' style='margin-top: 10px'> <tbody> <tr> <td class='es-p35r' valign='top' align='center'><a target='_blank' href=${branchFb}><img style='margin-right: 10px;' title='Facebook' src='https://ecyarqo.stripocdn.email/content/assets/img/social-icons/circle-colored/facebook-circle-colored.png' alt='Fb' width='32' height='32'></a></td> <td valign='top' align='center'><a target='_blank' href=${branchIg}><img title='Instagram' src='https://ecyarqo.stripocdn.email/content/assets/img/social-icons/circle-colored/instagram-circle-colored.png' alt='Inst' width='32' height='32'></a></td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </div> </body> </html>`,
    }
    const resp = await sendMail(data);
    if (resp.sent === 'ok') {
        // Marco al registro como ya notificado: reminded=true
        const existingEvent = await Calendar.findByPk(reg.id, {
        });
        // Inicio la transacción:
        existingEvent.reminded = true;
        await existingEvent.save();
        logData({ op: "S", nameCompany: nameCompany, dbName: dbName, userName: ".", desc: `Appointment reminder sent to ${reg.Client.email}` });
        showLog(`getAppointmentsReminder OK -> sent to ${nameCompany}, ${reg.Client.email}`);
    } else {
        showLog(`getAppointmentsReminder ERROR ${reg.Client.email}-> ${resp.message}`);
    }
}

module.exports = getAppointmentsReminder;