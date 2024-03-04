//hooks, reducer, components
import React, { useState, useEffect } from 'react'
import axios from "axios"
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom';

//icons
import { IoClose } from 'react-icons/io5';

//functions
import validateCreateAppointment from '../../functions/createAppointmentValidations';
import formatDate from '../../functions/formatDate';

//var de entorno
import getParamsEnv from '../../functions/getParamsEnv';
const { API_URL_BASE, AGENDA } = getParamsEnv()
import Loader from '../Loader'


const CreateAppointment = ({ setShowAppointmentModal, setChosenClient, dateInfo, setDateInfo, token, formattedDate, setRefrescarCita, refrescarCita, chosenClient, branches }) => {

    const navigate = useNavigate()

    useEffect(() => {
        const close = (e) => {
            if (e.keyCode === 27) {
                closeModal()
            }
        }
        window.addEventListener('keydown', close)
        return () => window.removeEventListener('keydown', close)
    }, [])

    const [submitLoader, setSubmitLoader] = useState(false)
    const [disableSubmit, setDisableSubmit] = useState(false)
    const userSpecialist = useSelector((state) => state?.user)
    const workingBranch = useSelector((state) => state?.workingBranch)
    const [validationErrors, setValidationErrors] = useState({});
    const specialistName = `${dateInfo.specialist.name} ${dateInfo.specialist.lastName}`
    const currentDate = new Date();



    const [AppointmentInfo, setAppointmentInfo] = useState({
        clientName: dateInfo.client.name || "",
        clientLastName: dateInfo.client.lastName || "",
        branch: dateInfo.branch.branchName || "",
        service: dateInfo.service.name || "",
        date: formatDate(dateInfo.dateTime.$d) || formatDate(currentDate),
        specialist: specialistName || "",
        date_from: "",
        date_to: "",
        obs: ""
    })

    const [rememberDate, setRememberDate] = useState(AppointmentInfo.date)


    const closeModal = () => {
        setShowAppointmentModal(false)
        setAppointmentInfo(
            {
                clientName: dateInfo.client.name || "",
                clientLastName: dateInfo.client.lastName || "",
                branch: dateInfo.branch.branchName || "",
                service: dateInfo.service.name || "",
                date: formatDate(dateInfo.dateTime.$d) || formatDate(currentDate),
                specialist: specialistName || "",
                date_from: "",
                date_to: "",
                obs: ""
            }
        )
    }

    const filteredBranch = branches.find(branch => branch.branchName === workingBranch.branchName)
    const address = filteredBranch.address
    const phoneNumber = filteredBranch.phoneNumber
    let facebook = filteredBranch.linkFb
    let instagram = filteredBranch.linkIg
    let place = filteredBranch.coordinates

    const handleChange = (e) => {
        const { name, value } = e.target;


        setAppointmentInfo((prevInfo) => ({
            ...prevInfo,
            [name]: value,
        }));


        const validationErrors = validateCreateAppointment({
            ...AppointmentInfo,
            [name]: value,
        });


        setValidationErrors((prevErrors) => ({
            ...prevErrors,
            [name]: validationErrors[name],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateCreateAppointment(AppointmentInfo);
        setValidationErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            toast.error("Por favor, corrige los errores de validación antes de enviar el formulario");
            return;
        }

        const formattedDateFrom = `${AppointmentInfo.date} ${AppointmentInfo.date_from}`;
        const formattedDateTo = `${AppointmentInfo.date} ${AppointmentInfo.date_to}`;



        try {

            setDisableSubmit(true)
            setSubmitLoader(true)

            const data = {
                date_from: formattedDateFrom,
                date_to: formattedDateTo,
                obs: AppointmentInfo.obs || " ",
                idBranch: dateInfo.branch.id,
                idUser: dateInfo.specialist.id,
                idService: dateInfo.service.id,
                idClient: dateInfo.client.id,
                token: token
            };

            const response = await axios.post(`${API_URL_BASE}/v1/newcalendar`, data);

            if (!place) {
                place = "No hemos cargado aún el link a googlemaps "
            } //Si no hay coordinates cargadas manda un ""
            if (!facebook || facebook == "¡Carga un link de tu red social!") {
                facebook = "https://www.facebook.com/"
            } //Si no hay facebook o no cargó manda a la página de facebook
            if (!instagram || instagram == "¡Carga un link de tu red social!") {
                instagram = "https://www.instagram.com/"
            } //Si no hay instagram o no cargó manda a la página de facebook



            const sendEmail = {
                origin: userSpecialist.userName,
                target: chosenClient.email,
                subject: `${userSpecialist.companyName} - Reserva de Cita`,
                html: `<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'> <html dir='ltr' xmlns='http://www.w3.org/1999/xhtml' xmlns:o='urn:schemas-microsoft-com:office:office'> <head> <meta charset='UTF-8'> <meta content='width=device-width, initial-scale=1' name='viewport'> <meta name='x-apple-disable-message-reformatting'> <meta http-equiv='X-UA-Compatible' content='IE=edge'> <meta content='telephone=no' name='format-detection'> <title></title>     <link href='https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i' rel='stylesheet'>  </head> <body> <div dir='ltr' class='es-wrapper-color' style='color:black'>  <table class='es-wrapper' width='100%' cellspacing='0' cellpadding='0'> <tbody> <tr> <td class='esd-email-paddings' valign='top'> <table cellpadding='0' cellspacing='0' class='es-header esd-footer-popover' align='center'> <tbody> <tr> <td class='esd-stripe' align='center' esd-custom-block-id='35507'> <table bgcolor='#ffffff' class='es-header-body' align='center' cellpadding='0' cellspacing='0' width='550' style='border-right:1px solid transparent;border-bottom:1px solid transparent;'> <tbody> <tr> <td class='esd-structure es-p20r es-p20l' align='left'> <table width='100%' cellspacing='0' cellpadding='0'> <tbody> <tr> <td class='esd-container-frame' width='509' valign='top' align='center'> <table width='100%' cellspacing='0' cellpadding='0'> <tbody> <tr> <td class='esd-block-image' align='center' style='font-size: 0px;'><img src=${userSpecialist.companyImg} alt="logoCompania" style='display: block;' class='adapt-img' width='150' ></td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> <tr> <td class='esd-structure es-p20r es-p20l' align='left'> <table cellpadding='0' cellspacing='0' width='100%'> <tbody> <tr> <td width='509' class='esd-container-frame' align='center' valign='top'> <table cellpadding='0' cellspacing='0' width='100%'> <tbody> <tr> <td align='left' class='esd-block-text'> <h1 style='text-align: left; font-size: 22px; line-height: 120%;'></h1> <h1 style='text-align: left; font-size: 22px; line-height: 120%;'>Hola, ${chosenClient.name} ${chosenClient.lastName}👋</h1> <h1 style='text-align: left; font-size: 16px; line-height: 120%;'></h1> <p style='text-align: left; font-size: 16px; line-height: 120%;'><strong> Confirmamos tu cita </strong><br>Tu cita en ${dateInfo.branch.branchName} fue confirmada, no te pierdas los detalles de la misma a continuación.</p> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> <tr> <td class='esd-structure es-p20r es-p20l' align='left'> <table cellpadding='0' cellspacing='0' width='100%'> <tbody> <tr> <td width='509' class='esd-container-frame' align='center' valign='top'> <table cellpadding='0' cellspacing='0' width='100%'> <tbody> <tr> <td align='left' class='esd-block-text' style='font-size:18'> <p style='font-weight:bold; font-size:16px; color:black'>📅 Dia: <span style='font-weight:normal; color:black'> ${formattedDateFrom.slice(0, 11)} </span></p> <p style='font-weight:bold; font-size:16px; color:black'> 🕑 Horario: <span style='font-weight:normal; color:black'> ${formattedDateFrom.slice(11, 16)} </span></p> <p style='font-weight:bold; font-size:16px; color:black'>🏠 Dirección: <span style='font-weight:normal'> ${address} </span></p> <p style='font-weight:bold; font-size:16px; color:black'>💄 Servicio: <span style='font-weight:normal; color:black'> ${AppointmentInfo.service} </span></p> <p style='font-weight:bold; font-size:16px; color:black'>🙎‍♀️ Profesional: <span style='font-weight:normal; color:black'> ${AppointmentInfo.specialist}</span></p> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> <tr> <td class='esd-structure es-p20r es-p20l' align='left' > <table cellpadding='0' cellspacing='0' width='100%'> <tbody> <tr> <td width='509' class='esd-container-frame' align='center' valign='top'> <table cellpadding='0' cellspacing='0' width='100%'> <tbody> <tr> <td align='left' class='esd-block-text'> <p style='font-size: 16px; margin-bottom: 2px; color:black'>❗<em> Sólo se tolerarán 15 minutos de retraso. Pasado este tiempo el turno se da por cancelado</em></p> <p style='font-size: 16px; margin-bottom: 2px; color:black'> Gracias por confiar en nosotros!</p> <p style='font-size: 16px; margin-bottom: 2px; color:black'> En caso de no poder concurrir, por favor cancela la reserva llamando al  ${phoneNumber}.</p> <p style='font-size: 16px; margin-bottom: 40px; color:black'> Google Maps: ${place} </p> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> <tr> <td class='esd-structure es-p10b es-p10r es-p5l' align='left'> <table cellpadding='0' cellspacing='0' width='100%'> <tbody> <tr> <td width='534' class='esd-container-frame' align='center' valign='top'> <table cellpadding='0' cellspacing='0' width='100%'> <tbody> <tr> <td class='esd-block-social' align='right' style='font-size: 0px;'> <table class='es-table-not-adapt es-social' cellspacing='0' cellpadding='0' style='margin-top: 10px'> <tbody> <tr> <td class='es-p35r' valign='top' align='center'><a target='_blank' href=${facebook}><img style='margin-right: 10px;' title='Facebook' src='https://ecyarqo.stripocdn.email/content/assets/img/social-icons/circle-colored/facebook-circle-colored.png' alt='Fb' width='32' height='32'></a></td> <td valign='top' align='center'><a target='_blank' href=${instagram}><img title='Instagram' src='https://ecyarqo.stripocdn.email/content/assets/img/social-icons/circle-colored/instagram-circle-colored.png' alt='Inst' width='32' height='32'></a></td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </div> </body> </html>`,
                token: token
            }

            if (response.data.created === "ok") {
                setSubmitLoader(false)
                toast.success("Cita creada exitosamente");
                setTimeout(() => {
                    closeModal();
                    setDisableSubmit(true)
                }, 3000);
                setDateInfo({
                    ...dateInfo,
                    client: {
                        id: "",
                        name: "",
                        lastName: "",
                    },
                    branch: {
                        id: workingBranch.id,
                        branchName: workingBranch.branchName
                    },
                    service: {
                        id: "",
                        serviceName: ""
                    },
                    specialist: {
                        id: "",
                        name: "",
                        lastName: ""
                    },

                })
                setChosenClient({ name: "Elige", lastName: "cliente" })
                axios.post(`${API_URL_BASE}/v1/sendmail`, sendEmail);
                setRefrescarCita(!refrescarCita);
            } else {
                setSubmitLoader(false)
                setDisableSubmit(false)
            }
        } catch (error) {
            const errorMessage = error.response ? error.response.data : 'Ocurrió un error';
            toast.error(`Hubo un problema con la creación. ${errorMessage}`);
        }
    };


    return (

        <div>
            <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black" style={{ background: "rgba(0, 0, 0, 0.70)" }}>
                <div className="w-full bg-white shadow rounded-lg p-6 md:mx-auto md:w-1/2 2xl:w-1/3 dark:bg-darkBackground">
                    <div className='flex justify-between'>
                        <h1 className="text-2xl font-semibold mb-4 text-black dark:text-darkText">Agregar Cita</h1>
                        <IoClose onClick={closeModal} className='cursor-pointer hover:scale-125 mt-2 w-5 h-5 dark:text-darkText' />
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                            <div>
                                <label className='pl-1  font-bold dark:text-darkText'>Nombre de cliente</label>
                                <input
                                    placeholder="Nombre de cliente"
                                    className="border border-black p-2 rounded w-full bg-gray-200 dark:text-darkText dark:bg-darkPrimary"
                                    onChange={handleChange}
                                    type="text"
                                    name="clientName"
                                    value={AppointmentInfo.clientName}
                                    disabled
                                />
                            </div>
                            <div>
                                <label className='pl-1  font-bold dark:text-darkText'>Apellido del cliente</label>
                                <input
                                    placeholder="Nombre de cliente"
                                    className="border border-black p-2 rounded w-full bg-gray-200 dark:text-darkText dark:bg-darkPrimary"
                                    onChange={handleChange}
                                    type="text"
                                    name="clientLastName"
                                    value={AppointmentInfo.clientLastName}
                                    disabled
                                />

                            </div>

                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">

                            <div className="first-letter:grid grid-cols-1 mb-2">
                                <label className='pl-1  font-bold dark:text-darkText'>Sede</label>
                                <input
                                    placeholder="Sede"
                                    className="border border-black p-2 rounded w-full bg-gray-200 dark:text-darkText dark:bg-darkPrimary"
                                    onChange={handleChange}
                                    type="text"
                                    name="branch"
                                    value={AppointmentInfo.branch}
                                    disabled
                                />

                            </div>
                            <div className="first-letter:grid grid-cols-1 mb-2">
                                <label className='pl-1  font-bold dark:text-darkText'>Procedimiento</label>
                                <input
                                    placeholder="Procedimiento"
                                    className="w-full border border-black rounded-md  dark:text-darkText dark:bg-darkPrimary p-2.5"
                                    onChange={handleChange}
                                    type="text"
                                    name="service"
                                    value={AppointmentInfo.service}
                                    disabled
                                />

                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                            <div className="first-letter:grid grid-cols-1 mb-2">
                                <label className='pl-1  font-bold dark:text-darkText'>Fecha</label>
                                <input
                                    placeholder="Fecha"
                                    className="border border-black p-2 rounded w-full dark:text-darkText dark:bg-darkPrimary"
                                    onChange={handleChange}
                                    type="text"
                                    name="date"
                                    value={AppointmentInfo.date}
                                    disabled
                                />

                            </div>
                            <div className="first-letter:grid grid-cols-1 mb-2">
                                <label className='pl-1  font-bold dark:text-darkText'>Especialista</label>
                                <input
                                    placeholder="Especialista"
                                    className="w-full border border-black rounded-md  dark:text-darkText dark:bg-darkPrimary p-2.5"
                                    onChange={handleChange}
                                    type="text"
                                    name="specialist"
                                    value={AppointmentInfo.specialist}
                                    disabled
                                />

                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                            <div className="first-letter:grid grid-cols-1 mb-2">
                                <label className='pl-1  font-bold dark:text-darkText'>Hora de inicio</label>
                                <input
                                    placeholder="Hora de inicio"
                                    className="border border-black p-2 rounded w-full dark:text-darkText dark:bg-darkPrimary dark:[color-scheme:dark]"
                                    onChange={handleChange}
                                    type="time"
                                    name="date_from"
                                    value={AppointmentInfo.date_from}
                                />
                                {validationErrors.date_from && (
                                    <div className="text-red-500 ">{validationErrors.date_from}</div>
                                )}

                            </div>
                            <div className="first-letter:grid grid-cols-1 mb-2">
                                <label className='pl-1  font-bold dark:text-darkText'>Hora de finalización</label>
                                <input
                                    placeholder="Hora de finalización"
                                    className="border border-black p-2 rounded w-full dark:text-darkText dark:bg-darkPrimary dark:[color-scheme:dark]"
                                    onChange={handleChange}
                                    type="time"
                                    name="date_to"
                                    value={AppointmentInfo.date_to}
                                />
                                {validationErrors.date_to && (
                                    <div className="text-red-500 ">{validationErrors.date_to}</div>
                                )}

                            </div>
                        </div>
                        <div className="first-letter:grid grid-cols-1 mb-2">
                            <label className='pl-1  font-bold dark:text-darkText'>Observaciones</label>
                            <textarea
                                placeholder="Observaciones"
                                className="border border-black p-2 rounded w-full dark:text-darkText dark:bg-darkPrimary"
                                onChange={handleChange}
                                name="obs"
                                value={AppointmentInfo.obs}
                            />
                        </div>


                        {!submitLoader ?
                            <button
                                type="submit"
                                id="theme-toggle"
                                disabled={disableSubmit}
                                className="px-4 py-2 w-full rounded bg-primaryPink shadow shadow-black text-black hover:bg-secondaryColor transition-colors duration-700 dark:text-darkText dark:bg-darkPrimary dark:hover:bg-blue-600"
                            >
                                Crear Cita
                            </button> :
                            <Loader />
                        }
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CreateAppointment
