import React, { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

import getParamsEnv from '../../functions/getParamsEnv';

import validateEditAppointment from '../../functions/editAppointment';
import { useNavigate } from 'react-router-dom';
import Loader from '../Loader';

const { API_URL_BASE } = getParamsEnv();

const EditAppointment = ({ setShowEditAppointment, setSpecialty, token, date, services, users, setRefrescarCita, refrescarCita, chosenClient }) => {
  const [validationErrors, setValidationErrors] = useState({});

  const userSpecialist = useSelector((state) => state?.user)
  const workingBranch = useSelector((state) => state?.workingBranch)
  // const startTime = new Date(date.date_from);
  // const startHour = startTime.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
  // const endTime = new Date(date.date_to);
  // const endHour = endTime.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });

  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [initialAppointmentInfo, setInitialAppointmentInfo] = useState({});
  const navigate = useNavigate()
  const onlyDate = date.date_from
  const dateTime = onlyDate.split(",")[0];
  const dispatch = useDispatch();
  const currentDate = new Date();
  const allBranches = useSelector((state) => state?.branches);

  const filteredBranch = allBranches.find(branch => branch.branchName === workingBranch.branchName)
  const address = filteredBranch.address
  const phoneNumber = filteredBranch.phoneNumber

  const [AppointmentInfo, setAppointmentInfo] = useState({
    clientName: date.Client.name || "",
    clientLastName: date.Client.lastName || "",
    branch: {
      id: date.Branch.id || "",
      name: date.Branch.branchName || "",
    },
    service: {
      id: date.Service.id || "",
      name: date.Service.serviceName || ""
    },
    date: dateTime.split(" ")[0] || "",
    specialist: {
      id: date.User.id || "",
      name: `${date.User.name} ${date.User.lastName}` || ""
    },
    date_from: date.date_from.split(" ")[1] || "", //startHour
    date_to: date.date_to.split(" ")[1] || "", //endHour
    obs: date.obs || ""
  });

  const [submitLoader, setSubmitLoader] = useState(false)
  const [disableSubmit, setDisableSubmit] = useState(false)


  useEffect(() => {
    setInitialAppointmentInfo({ ...AppointmentInfo });
  }, [date]);

  const deepEqual = (obj1, obj2) => {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (const key of keys1) {
      const val1 = obj1[key];
      const val2 = obj2[key];

      if (typeof val1 === 'object' && val1 !== null && typeof val2 === 'object' && val2 !== null) {
        if (!deepEqual(val1, val2)) {
          return false;
        }
      } else if (Array.isArray(val1) && Array.isArray(val2)) {
        if (!arraysEqual(val1, val2)) {
          return false;
        }
      } else if (val1 !== val2) {
        return false;
      }
    }

    return true;
  };

  const arraysEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) {
      return false;
    }

    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }

    return true;
  };

  const isAppointmentInfoChanged = () => {
    return !deepEqual(initialAppointmentInfo, AppointmentInfo);
  };

  const closeModal = () => {
    //navigate(0)
    setShowEditAppointment(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let error = "";

    if (name === "date") {
      setAppointmentInfo((prevInfo) => ({
        ...prevInfo,
        date: value
      }));

      const data = {
        date: value,
      };

      error = validateEditAppointment(data)[name];
    } else

      if (name === "date_from" || name === "date_to") {
        const data = {
          date_from: name === "date_from" ? value : AppointmentInfo.date_from,
          date_to: name === "date_to" ? value : AppointmentInfo.date_to,
        };

        error = validateEditAppointment(data)[name];
      }

    if (name === 'branch') {
      const parsedValue = JSON.parse(value);

      setAppointmentInfo((prevInfo) => ({
        ...prevInfo,
        branch: {
          id: parsedValue.id,
          name: parsedValue.branchName,
        }
      }));
    } else if (name === 'specialist') {
      if (value === "null") {
        setAppointmentInfo((prevInfo) => ({
          ...prevInfo,
          specialist: {
            id: "",
            name: "",
          }
        }));
        const data = {
          specialist: value,
        };

        error = validateEditAppointment(data)[name];

      } else {


        const parsedValue = JSON.parse(value);

        setAppointmentInfo((prevInfo) => ({
          ...prevInfo,
          specialist: {
            id: parsedValue.id,
            name: `${parsedValue.name} ${parsedValue.lastName}`,
          }
        }));
      }
    } else if (name === 'service') {
      if (value === "null") {
        setAppointmentInfo((prevInfo) => ({
          ...prevInfo,
          service: {
            id: "",
            name: "",
          }
        }));
        const data = {
          specialist: value,
        };

        error = validateEditAppointment(data)[name];
      } else {
        const parsedValue = JSON.parse(value);

        setAppointmentInfo((prevInfo) => ({
          ...prevInfo,
          service: {
            id: parsedValue.id,
            name: parsedValue.serviceName,
          }
        }));

        setAppointmentInfo((prevInfo) => ({
          ...prevInfo,
          specialist: {
            id: "",
            name: "",
          }
        }));

        setSpecialty(parsedValue.Specialties[0].specialtyName)
      }
    } else {
      setAppointmentInfo((prevInfo) => ({
        ...prevInfo,
        [name]: value,
      }));
    }

    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  useEffect(() => {
    const close = (e) => {
      if(e.keyCode === 27){
        closeModal()
      }
    }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [AppointmentInfo, initialAppointmentInfo])

  const handleSubmit = async (e) => {
    e.preventDefault();



    if (!isAppointmentInfoChanged()) {
      toast.error("No se ha modificado ningún campo. Debes modificar al menos un campo para editar la cita.");
      return;
    }

    const formattedDateFrom = `${AppointmentInfo.date} ${AppointmentInfo.date_from}`;
    const formattedDateTo = `${AppointmentInfo.date} ${AppointmentInfo.date_to}`;

    const data = {
      date_from: formattedDateFrom,
      date_to: formattedDateTo,
      obs: AppointmentInfo.obs,
      idBranch: AppointmentInfo.branch.id,
      idUser: AppointmentInfo.specialist.id,
      idService: AppointmentInfo.service.id,
      idClient: date.Client.id,
      current: true,
      token: token
    };

    const dataErrors = {
      date: AppointmentInfo.date,
      date_from: formattedDateFrom.split(" ")[1],
      date_to: formattedDateTo.split(" ")[1],
      obs: AppointmentInfo.obs,
      idBranch: AppointmentInfo.branch.id,
      idUser: AppointmentInfo.specialist.id,
      idService: AppointmentInfo.service.id,
      idClient: date.Client.id,
      current: true,
      token: token
    };


    const errors = validateEditAppointment(dataErrors);

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }


    try {

      setDisableSubmit(true)
      setSubmitLoader(true)


      const response = await axios.put(`${API_URL_BASE}/calendar/${date.id}`, data);

      const place = address.includes("Restrepo") ? 'https://maps.app.goo.gl/mjDcG7ZvJjjW6HzGA' : 'https://maps.app.goo.gl/urGxSpTtibWLYTsF8'
      const facebook = 'https://www.facebook.com/lauravargas.cp/'
      // const instagram = address.includes("Restrepo") ? 'https://www.instagram.com/lauravargas.cpmu/' : 'https://www.instagram.com/fucsiainsumos/'
      const instagram = 'https://www.instagram.com/lauravargas.cpmu/'

      const sendEmail = {
        origin: userSpecialist.userName,
        target: date.Client.email,
        subject: "Laura Vargas - Modificación de Cita",
        html: `<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'> <html dir='ltr' xmlns='http://www.w3.org/1999/xhtml' xmlns:o='urn:schemas-microsoft-com:office:office'> <head> <meta charset='UTF-8'> <meta content='width=device-width, initial-scale=1' name='viewport'> <meta name='x-apple-disable-message-reformatting'> <meta http-equiv='X-UA-Compatible' content='IE=edge'> <meta content='telephone=no' name='format-detection'> <title></title>     <link href='https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i' rel='stylesheet'>  </head> <body> <div dir='ltr' class='es-wrapper-color' style='color:black'>  <table class='es-wrapper' width='100%' cellspacing='0' cellpadding='0'> <tbody> <tr> <td class='esd-email-paddings' valign='top'> <table cellpadding='0' cellspacing='0' class='es-header esd-footer-popover' align='center'> <tbody> <tr> <td class='esd-stripe' align='center' esd-custom-block-id='35507'> <table bgcolor='#ffffff' class='es-header-body' align='center' cellpadding='0' cellspacing='0' width='550' style='border-right:1px solid transparent;border-bottom:1px solid transparent;'> <tbody> <tr> <td class='esd-structure es-p20r es-p20l' align='left'> <table width='100%' cellspacing='0' cellpadding='0'> <tbody> <tr> <td class='esd-container-frame' width='509' valign='top' align='center'> <table width='100%' cellspacing='0' cellpadding='0'> <tbody> <tr> <td class='esd-block-image' align='center' style='font-size: 0px;'><a target='_blank' href='https://laura-vargas-dkpl.vercel.app/'><img src='https://res.cloudinary.com/doyafxwje/image/upload/v1703605216/Logos/LogoLauraVargas_zhiwgn.jpg' alt style='display: block;' class='adapt-img' width='140' height='110'></a></td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> <tr> <td class='esd-structure es-p20r es-p20l' align='left'> <table cellpadding='0' cellspacing='0' width='100%'> <tbody> <tr> <td width='509' class='esd-container-frame' align='center' valign='top'> <table cellpadding='0' cellspacing='0' width='100%'> <tbody> <tr> <td align='left' class='esd-block-text'> <h1 style='text-align: left; font-size: 22px; line-height: 120%;'></h1> <h1 style='text-align: left; font-size: 22px; line-height: 120%;'>Hola, ${date.Client.name} ${date.Client.lastName}👋</h1> <h1 style='text-align: left; font-size: 16px; line-height: 120%;'></h1> <p style='text-align: left; font-size: 16px; line-height: 120%;'><strong>Tu cita ha sido modificada</strong><br>A continuacion te dejamos los detalles de tu nueva cita: </p> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> <tr> <td class='esd-structure es-p20r es-p20l' align='left'> <table cellpadding='0' cellspacing='0' width='100%'> <tbody> <tr> <td width='509' class='esd-container-frame' align='center' valign='top'> <table cellpadding='0' cellspacing='0' width='100%'> <tbody> <tr> <td align='left' class='esd-block-text' style='font-size:18'> <p style='font-weight:bold; font-size:16px; color:black'>📅 Dia: <span style='font-weight:normal; color:black'> ${formattedDateFrom.split(" ")[0]} </span></p> <p style='font-weight:bold; font-size:16px; color:black'> 🕑 Horario: <span style='font-weight:normal; color:black'> ${formattedDateFrom.split(" ")[1]} </span></p> <p style='font-weight:bold; font-size:16px; color:black'>🏠 Dirección: <span style='font-weight:normal'> ${address} </span></p> <p style='font-weight:bold; font-size:16px; color:black'>💄 Servicio: <span style='font-weight:normal; color:black'> ${AppointmentInfo.service.name} </span></p> <p style='font-weight:bold; font-size:16px; color:black'>🙎‍♀️ Profesional: <span style='font-weight:normal; color:black'> ${AppointmentInfo.specialist.name}</span></p> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> <tr> <td class='esd-structure es-p20r es-p20l' align='left' > <table cellpadding='0' cellspacing='0' width='100%'> <tbody> <tr> <td width='509' class='esd-container-frame' align='center' valign='top'> <table cellpadding='0' cellspacing='0' width='100%'> <tbody> <tr> <td align='left' class='esd-block-text'> <p style='font-size: 16px; margin-bottom: 2px; color:black'>❗<em> Sólo se tolerarán 15 minutos de retraso. Pasado este tiempo el turno se da por cancelado</em></p> <p style='font-size: 16px; margin-bottom: 2px; color:black'> Gracias por confiar en nosotras!</p> <p style='font-size: 16px; margin-bottom: 2px; color:black'> En caso de no poder concurrir, por favor cancela la reserva llamando al  ${phoneNumber}.</p><p style='font-size: 16px; margin-bottom: 40px; color:black'> Google Maps: ${place} </p> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> <tr> <td class='esd-structure es-p10b es-p10r es-p5l' align='left'> <table cellpadding='0' cellspacing='0' width='100%'> <tbody> <tr> <td width='534' class='esd-container-frame' align='center' valign='top'> <table cellpadding='0' cellspacing='0' width='100%'> <tbody> <tr> <td class='esd-block-social' align='right' style='font-size: 0px;'> <table class='es-table-not-adapt es-social' cellspacing='0' cellpadding='0' style='margin-top: 10px'> <tbody> <tr> <td class='es-p35r' valign='top' align='center'><a target='_blank' href=${facebook}><img style='margin-right: 10px;' title='Facebook' src='https://ecyarqo.stripocdn.email/content/assets/img/social-icons/circle-colored/facebook-circle-colored.png' alt='Fb' width='32' height='32'></a></td> <td valign='top' align='center'><a target='_blank' href=${instagram}><img title='Instagram' src='https://ecyarqo.stripocdn.email/content/assets/img/social-icons/circle-colored/instagram-circle-colored.png' alt='Inst' width='32' height='32'></a></td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </div> </body> </html>`,
        token: token
      }


      if (response.data.updated === "ok") {
        setSubmitLoader(false)
        toast.success("Cita actualizada exitosamente");
        setTimeout(() => {
          closeModal();
          setDisableSubmit(false)
        }, 3000);

        axios.post(`${API_URL_BASE}/sendmail`, sendEmail)
        setRefrescarCita(!refrescarCita);
      } else {
        setDisableSubmit(false)
      setSubmitLoader(false)

        toast.error("Hubo un problema al modificar la cita");
      }
    } catch (error) {
      setDisableSubmit(false)
      setSubmitLoader(false)

      const errorMessage = error.response ? error.response.data : 'An error occurred';
      toast.error(`Hubo un problema al modificar la cita. ${errorMessage}`);
    }
  };


  return (
    <div>
      <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black" style={{ background: "rgba(0, 0, 0, 0.70)" }}>
          <div className="w-96 bg-white  shadow rounded-lg p-6 md:mx-auto md:w-1/2 2xl:w-1/3 dark:bg-darkBackground">
            <div className='flex justify-between'>
              <h1 className="text-2xl font-semibold mb-4 text-black dark:text-darkText">Editar Cita</h1>
              <IoClose onClick={closeModal} className='cursor-pointer hover:scale-125 mt-2 w-5 h-5 dark:text-darkText' />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-2">
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
                <div>
                  <label className='pl-1  font-bold dark:text-darkText'>Sede</label>
                  <input
                    placeholder="Sede"
                    className="border border-black p-2 rounded w-full bg-gray-200 dark:text-darkText dark:bg-darkPrimary"
                    onChange={handleChange}
                    type="text"
                    name="branchName"
                    value={workingBranch.branchName}
                    disabled
                  />
                </div>
                <div className="first-letter:grid grid-cols-1 mb-2">
                  <label className='pl-1  font-bold dark:text-darkText'>Procedimiento</label>
                  <select
                    name="service"
                    onChange={handleChange}
                    className="w-full border border-black rounded-md  dark:text-darkText dark:bg-darkPrimary p-2.5"
                  >
                    <option value="null">Procedimientos</option>
                    {services.map((service, index) => (
                      <option key={index} value={JSON.stringify(service)} selected={AppointmentInfo.service.name === service.serviceName ? true : false} >
                        {service.serviceName}
                      </option>
                    ))}
                  </select>
                  {validationErrors.service && (
                    <div className="text-red-500">{validationErrors.service}</div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-2">
                <div className="first-letter:grid grid-cols-1 mb-2">
                  <label className='pl-1  font-bold dark:text-darkText'>Fecha</label>
                  <input
                    placeholder="Fecha"
                    className="border border-black p-2 rounded w-full dark:text-darkText dark:bg-darkPrimary"
                    onChange={handleChange}
                    type="text"
                    name="date"
                    value={AppointmentInfo.date}
                  />
                  {validationErrors.date && (
                    <div className="text-red-500">{validationErrors.date}</div>
                  )}
                </div>
                <div className="first-letter:grid grid-cols-1 mb-2">
                  <label className='pl-1  font-bold dark:text-darkText'>Especialista</label>
                  <select
                    name="specialist"
                    onChange={handleChange}
                    className="w-full border border-black rounded-md  dark:text-darkText dark:bg-darkPrimary p-2.5"
                  >
                    <option value="null">Especialista</option>
                    {users.map((user, index) => (
                      <option key={index} value={JSON.stringify(user)} selected={AppointmentInfo.specialist.id === user.id ? true : false}>
                        {`${user.name} ${user.lastName}`}
                      </option>
                    ))}
                  </select>
                  {validationErrors.specialist && (
                    <div className="text-red-500">{validationErrors.specialist}</div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-2">
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
                    <div className="text-red-500">{validationErrors.date_from}</div>
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
                    <div className="text-red-500">{validationErrors.date_to}</div>
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
                {validationErrors.obs && (
                  <div className="text-red-500">{validationErrors.obs}</div>
                )}
              </div>

              {!submitLoader ?
                <button
                  type="submit"
                  id="theme-toggle"
                  disabled={disableSubmit}
                  className="px-4 py-2 w-full rounded bg-primaryPink shadow shadow-black text-black hover:bg-secondaryColor transition-colors duration-700 dark:text-darkText dark:bg-darkPrimary dark:hover:bg-blue-600"
                >
                  Editar Cita
                </button> :
                <Loader />
              }
            </form>
        </div>
      </div>

    </div>
  );
};

export default EditAppointment;