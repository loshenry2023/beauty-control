// ! Obtiene los datos de un usuario para el login. Además se registra el token recibido.
const { Service, Branch, Calendar, Client, User } = require('../DB_connection');
const showLog = require("../functions/showLog");
const sendMail = require("../functions/sendMail");
const { FIRST_SUPERADMIN } = require("../functions/paramsEnv");
const { Op } = require('sequelize');

async function getAppointmentsReminder() {
    showLog(`getAppointmentsReminder`);
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
                    attributes: ["id", "branchName", "address", "phoneNumber"],
                },
            ],
        });
        let cont = 0;
        for (const data of reg) {
            await processData(data);
            cont++;
        }
        showLog(`getAppointmentsReminder OK - ${cont} sent`);
        return { sent: true };
    } catch (err) {
        showLog(`getAppointmentsReminder ERROR-> ${err.message}`);
        return { sent: false, error: err.message };
    }
}

async function processData(reg) {
    const dateApp = reg.date_from.toISOString().slice(0, 10);
    const timeApp = reg.date_from.toISOString().slice(11, 16);
    // Envío mail de recordatorio al cliente:

    const place = reg.Branch.address.includes("Restrepo") ? 'https://maps.app.goo.gl/mjDcG7ZvJjjW6HzGA' : 'https://maps.app.goo.gl/urGxSpTtibWLYTsF8'

    const data = {
        origin: FIRST_SUPERADMIN,
        target: reg.Client.email,
        subject: "Laura Vargas - Recordatorio de Cita",
        html: `<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'> <html dir='ltr' xmlns='http://www.w3.org/1999/xhtml' xmlns:o='urn:schemas-microsoft-com:office:office'> <head> <meta charset='UTF-8'> <meta content='width=device-width, initial-scale=1' name='viewport'> <meta name='x-apple-disable-message-reformatting'> <meta http-equiv='X-UA-Compatible' content='IE=edge'> <meta content='telephone=no' name='format-detection'> <title></title>     <link href='https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i' rel='stylesheet'>  </head> <body> <div dir='ltr' class='es-wrapper-color' style='color:black'>  <table class='es-wrapper' width='100%' cellspacing='0' cellpadding='0'> <tbody> <tr> <td class='esd-email-paddings' valign='top'> <table cellpadding='0' cellspacing='0' class='es-header esd-footer-popover' align='center'> <tbody> <tr> <td class='esd-stripe' align='center' esd-custom-block-id='35507'> <table bgcolor='#ffffff' class='es-header-body' align='center' cellpadding='0' cellspacing='0' width='550' style='border-right:1px solid transparent;border-bottom:1px solid transparent;'> <tbody> <tr> <td class='esd-structure es-p20r es-p20l' align='left'> <table width='100%' cellspacing='0' cellpadding='0'> <tbody> <tr> <td class='esd-container-frame' width='509' valign='top' align='center'> <table width='100%' cellspacing='0' cellpadding='0'> <tbody> <tr> <td class='esd-block-image' align='center' style='font-size: 0px;'><a target='_blank' href='https://laura-vargas-dkpl.vercel.app/'><img src='https://res.cloudinary.com/doyafxwje/image/upload/v1703605216/Logos/LogoLauraVargas_zhiwgn.jpg' alt style='display: block;' class='adapt-img' width='140' height='110'></a></td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> <tr> <td class='esd-structure es-p20r es-p20l' align='left'> <table cellpadding='0' cellspacing='0' width='100%'> <tbody> <tr> <td width='509' class='esd-container-frame' align='center' valign='top'> <table cellpadding='0' cellspacing='0' width='100%'> <tbody> <tr> <td align='left' class='esd-block-text'> <h1 style='text-align: left; font-size: 22px; line-height: 120%;'></h1> <h1 style='text-align: left; font-size: 22px; line-height: 120%;'>Hola, ${reg.Client.name} ${reg.Client.lastName}👋</h1> <h1 style='text-align: left; font-size: 16px; line-height: 120%;'></h1> <p style='text-align: left; font-size: 16px; line-height: 120%;'><strong> Te recordamos tu cita </strong><br>Recuerda asistir a tu cita, no te pierdas los detalles de la misma a continuación.</p> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> <tr> <td class='esd-structure es-p20r es-p20l' align='left'> <table cellpadding='0' cellspacing='0' width='100%'> <tbody> <tr> <td width='509' class='esd-container-frame' align='center' valign='top'> <table cellpadding='0' cellspacing='0' width='100%'> <tbody> <tr> <td align='left' class='esd-block-text' style='font-size:18'> <p style='font-weight:bold; font-size:16px; color:black'>📅 Dia: <span style='font-weight:normal; color:black'> ${dateApp} </span></p> <p style='font-weight:bold; font-size:16px; color:black'> 🕑 Horario: <span style='font-weight:normal; color:black'> ${timeApp} </span></p> <p style='font-weight:bold; font-size:16px; color:black'>🏠 Dirección: <span style='font-weight:normal'> ${reg.Branch.address} </span></p> <p style='font-weight:bold; font-size:16px; color:black'>💄 Servicio: <span style='font-weight:normal; color:black'> ${reg.Service.serviceName} </span></p> <p style='font-weight:bold; font-size:16px; color:black'>🙎‍♀️ Profesional: <span style='font-weight:normal; color:black'> ${reg.User.name} ${reg.User.lastName} </span></p> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> <tr> <td class='esd-structure es-p20r es-p20l' align='left' > <table cellpadding='0' cellspacing='0' width='100%'> <tbody> <tr> <td width='509' class='esd-container-frame' align='center' valign='top'> <table cellpadding='0' cellspacing='0' width='100%'> <tbody> <tr> <td align='left' class='esd-block-text'> <p style='font-size: 16px; margin-bottom: 2px; color:black'>❗<em> Sólo se tolerarán 15 minutos de retraso. Pasado este tiempo el turno se da por cancelado</em></p> <p style='font-size: 16px; margin-bottom: 2px; color:black'> Gracias por confiar en nosotras!</p> <p style='font-size: 16px; margin-bottom: 2px; color:black'> En caso de no poder concurrir, por favor cancela la reserva llamando al  ${reg.Branch.phoneNumber}.</p> <p style='font-size: 16px; margin-bottom: 40px; color:black'> Google Maps: ${place} </p> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> <tr> <td class='esd-structure es-p10b es-p10r es-p5l' align='left'> <table cellpadding='0' cellspacing='0' width='100%'> <tbody> <tr> <td width='534' class='esd-container-frame' align='center' valign='top'> <table cellpadding='0' cellspacing='0' width='100%'> <tbody> <tr> <td class='esd-block-social' align='right' style='font-size: 0px;'> <table class='es-table-not-adapt es-social' cellspacing='0' cellpadding='0' style='margin-top: 10px'> <tbody> <tr> <td class='es-p35r' valign='top' align='center'><a target='_blank' href='https://www.facebook.com/lauravargas.cp/'><img style='margin-right: 10px;' title='Facebook' src='https://ecyarqo.stripocdn.email/content/assets/img/social-icons/circle-colored/facebook-circle-colored.png' alt='Fb' width='32' height='32'></a></td> <td valign='top' align='center'><a target='_blank' href='https://www.instagram.com/lauravargas.cpmu/'><img title='Instagram' src='https://ecyarqo.stripocdn.email/content/assets/img/social-icons/circle-colored/instagram-circle-colored.png' alt='Inst' width='32' height='32'></a></td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </div> </body> </html>`,
    }
    const resp = await sendMail(data);
    if (resp.sent === 'ok') {
        // Marco al registro como ya notificado: reminded=true    
        const existingEvent = await Calendar.findByPk(reg.id, {
        });
        // Inicio la transacción:
        existingEvent.reminded = true;
        await existingEvent.save();
    } else {
        showLog(`getAppointmentsReminder ERROR ${reg.Client.email}-> ${resp.message}`);
    }
}

module.exports = getAppointmentsReminder;