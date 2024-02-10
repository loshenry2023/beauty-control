// Hooks
import React, { useEffect, useState } from "react";
import axios from "axios";

//icons
import { IoClose } from "react-icons/io5";

//functions
import validateRegisterInput from "../../functions/registerFormValidations";

//Cloudinary
import { UploadWidget } from "../Uploadwidget";
import { Toaster, toast } from "react-hot-toast";
import Loader from "../Loader";

//Variables de entorno
import getParamsEnv from "../../functions/getParamsEnv";
import { useSelector } from "react-redux";
const { API_URL_BASE } = getParamsEnv();

function RegisterForm({
  setShowResgisterFormModal,
  branches,
  specialties,
  tokenID,
  activarNuevoUsuario,
  setActivarNuevoUsuario,
}) {
  const [submitLoader, setSubmitLoader] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(false);

  useEffect(() => {
    const close = (e) => {
      if (e.keyCode === 27) {
        setShowResgisterFormModal(false);
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  const roles = ["superAdmin", "admin", "especialista"];
  const user = useSelector((state) => state?.user);

  const [userData, setUserData] = useState({
    name: "",
    lastName: "",
    userName: "",
    phoneNumber1: "",
    phoneNumber2: "",
    image:
      "https://res.cloudinary.com/doqyrz0sg/image/upload/v1702302836/varpjl2p5dwvpwbmdiui.png",
    specialtyName: [],
    commission: "",
    branch: [],
    rol: "",
    notificationEmail: "",
  });
  const [errors, setErrors] = useState({});

  const closeModal = () => {
    setShowResgisterFormModal(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox" && name === "specialtyName") {
      setUserData((prevInfo) => {
        const updatedSpecialities = checked
          ? [...prevInfo.specialtyName, value]
          : prevInfo.specialtyName.filter((specialty) => specialty !== value);

        return {
          ...prevInfo,
          [name]: updatedSpecialities,
        };
      });
    } else if (type === "checkbox" && name === "branch") {
      setUserData((prevInfo) => {
        const updatedBranches = checked
          ? [...prevInfo.branch, value]
          : prevInfo.branch.filter((branchName) => branchName !== value);

        return {
          ...prevInfo,
          [name]: updatedBranches,
        };
      });
    } else {
      setUserData((prevInfo) => ({
        ...prevInfo,
        [name]: value,
      }));
    }

    setUserData((prevInfo) => {
      const validationErrors = validateRegisterInput({
        ...prevInfo,
        [name]: value,
      });
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: validationErrors[name],
      }));
      return prevInfo;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateRegisterInput(userData);
    setErrors(validationErrors);

    const hasErrors = Object.values(validationErrors).some(
      (error) => error !== undefined
    );

    if (hasErrors) {
    } else {
      try {
        setSubmitLoader(true);
        setDisableSubmit(true);

        const data = {
          name: userData.name,
          lastName: userData.lastName,
          userName: userData.userName,
          specialty: userData.specialtyName,
          branch: userData.branch,
          phone1: userData.phoneNumber1,
          phone2: userData.phoneNumber2,
          role: userData.rol,
          notificationEmail: userData.notificationEmail,
          image: userData.image,
          comission: userData.commission,
          token: tokenID,
        };
        const response = await axios.post(`${API_URL_BASE}/v1/newuser`, data);

        const sendEmail = {
          origin: user.userName,
          target: userData.notificationEmail,
          subject: "Laura Vargas - Alta de usuario",
          html: `<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'> <html dir='ltr' xmlns='http://www.w3.org/1999/xhtml' xmlns:o='urn:schemas-microsoft-com:office:office'> <head> <meta charset='UTF-8'> <meta content='width=device-width, initial-scale=1' name='viewport'> <meta name='x-apple-disable-message-reformatting'> <meta http-equiv='X-UA-Compatible' content='IE=edge'> <meta content='telephone=no' name='format-detection'> <title></title>     <link href='https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i' rel='stylesheet'>  </head> <body> <div dir='ltr' class='es-wrapper-color'>  <table class='es-wrapper' width='100%' height='100%' cellspacing='0' cellpadding='0'> <tbody> <tr> <td class='esd-email-paddings' valign='top'> <table cellpadding='0' cellspacing='0' class='es-header esd-footer-popover' align='center'> <tbody> <tr> <td class='esd-stripe' align='center' esd-custom-block-id='35507'> <table bgcolor='#ffffff' class='es-header-body' align='center' cellpadding='0' cellspacing='0' width='550' style='border-right:1px solid transparent;border-bottom:1px solid transparent;'> <tbody> <tr> <td class='esd-structure es-p20r es-p20l' align='left'> <table width='100%' cellspacing='0' cellpadding='0'> <tbody> <tr> <td class='esd-container-frame' width='509' valign='top' align='center'> <table width='100%' cellspacing='0' cellpadding='0'> <tbody> <tr> <td class='esd-block-image' align='center' style='font-size: 0px;'><img src='https://res.cloudinary.com/doyafxwje/image/upload/v1703605216/Logos/LogoLauraVargas_zhiwgn.jpg' alt='lauraLogo' style='display: block;' width='150' height='100'></td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> <tr> <td class='esd-structure es-p20r es-p20l' align='left'> <table cellpadding='0' cellspacing='0' width='100%'> <tbody> <tr> <td width='509' class='esd-container-frame' align='center' valign='top'> <table cellpadding='0' cellspacing='0' width='100%'> <tbody> <tr> <td align='center' class='esd-block-text es-p15' > <h1 style='text-align: center; font-size: 18px; color: black; margin-bottom: 2px;'><span style='font-size:22px;'> Hola, ${data.name} ${data.lastName}! 👋</h1> <p style='text-align: center; font-size: 16px; color: black;'> Ya tienes habilitado el acceso al sistema. </p> <p style='text-align: center; font-size: 16px; color: black;'>¡Ingresa con tu cuenta de Gmail haciendo click <a href='https://laura-vargas-dkpl.vercel.app/'>aquí</a>! </p> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> <tr> <td class='esd-structure es-p5' style='background-color: transparent;' bgcolor='transparent' align='left'> <table width='100%' cellspacing='0' cellpadding='0'> <tbody> <tr> <td class='esd-container-frame' width='539' valign='top' align='center'> <table width='100%' cellspacing='0' cellpadding='0'> <tbody> <tr> <td class='esd-block-social' align='center' style='font-size: 0px;'> <table class='es-table-not-adapt es-social' cellspacing='0' cellpadding='0'> <tbody> <tr > <td valign='top' align='center'><a target='_blank' href='https://www.facebook.com/lauravargas.cp/'><img style='margin-right: 10px;' title='Facebook' src='https://ecyarqo.stripocdn.email/content/assets/img/social-icons/circle-colored/facebook-circle-colored.png' alt='Fb' width='40' height='40'></a></td> <td valign='top' align='center'><a target='_blank' href='https://www.instagram.com/lauravargas.cpmu/'><img title='Instagram' src='https://ecyarqo.stripocdn.email/content/assets/img/social-icons/circle-colored/instagram-circle-colored.png' alt='Inst' width='40' height='40'></a></td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </div> </body> </html>`,
          token: tokenID,
        };

        if (response.data.created === "ok") {
          setSubmitLoader(false);

          toast.success("Usuario creado exitosamente");
          setActivarNuevoUsuario(!activarNuevoUsuario);
          setTimeout(() => {
            setUserData({
              name: "",
              lastName: "",
              userName: "",
              phoneNumber1: "",
              phoneNumber2: "",
              image:
                "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-vector-260nw-2271804793.jpg",
              specialtyName: [],
              commission: "",
              branch: [],
              rol: "",
              notificationEmail: "",
            });
            setDisableSubmit(false);
            closeModal();

            axios.post(`${API_URL_BASE}/v1/sendmail`, sendEmail);
          }, 3000);
        } else {
          setDisableSubmit(false);
          setSubmitLoader(false);
          toast.error("Hubo un problema con la creación");
        }
      } catch (error) {
        setDisableSubmit(false);
        setSubmitLoader(false);
        toast.error(`Hubo un problema con la creacion. ${error.response.data}`);
      }
    }
  };

  return (
    <>
      <div
        className="absolute top-0 left-0 flex items-center justify-center w-full h-full"
        style={{ background: "rgba(0, 0, 0, 0.70)" }}
      >
        <div className="w-5/5 my-10 bg-white shadow rounded-lg p-4 pt-2 pb-2 md:w-3/4 2xl:w-1/3 scale-90 dark:bg-darkBackground">
          <div className="flex justify-between">
            <h1 className="text-2xl font-semibold mb-4 text-black dark:text-darkText">
              Agregar nuevo usuario
            </h1>
            <IoClose
              onClick={closeModal}
              className="cursor-pointer hover:scale-125 mt-1 w-5 h-5 dark:text-darkText"
            />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="first-letter:grid grid-cols-1 mb-1">
              <label className="pl-1  font-bold dark:text-darkText">
                Cuenta de usuario (Email)
              </label>
              <input
                placeholder="Cuenta de usuario"
                className="border border-black p-2 rounded w-full dark:text-darkText dark:bg-darkPrimary"
                onChange={handleChange}
                type="email"
                name="userName"
                value={userData.userName}
              />
              {errors.userName !== "" && (
                <p className=" text-red-500">{errors.userName}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-1">
              <div>
                <label className="pl-1  font-bold dark:text-darkText">
                  Nombre
                </label>
                <input
                  onChange={handleChange}
                  type="text"
                  name="name"
                  value={userData.name}
                  placeholder="Nombre"
                  className="border border-black p-2 rounded w-full dark:text-darkText dark:bg-darkPrimary"
                />
                {errors.name !== "" && (
                  <p className=" text-red-500">{errors.name}</p>
                )}
              </div>
              <div>
                <label className="pl-1  font-bold dark:text-darkText">
                  Apellido
                </label>
                <input
                  type="text"
                  placeholder="Apellido"
                  className="border border-black p-2 rounded w-full dark:text-darkText dark:bg-darkPrimary"
                  onChange={handleChange}
                  name="lastName"
                  value={userData.lastName}
                />
                {errors.lastName !== "" && (
                  <p className=" text-red-500">{errors.lastName}</p>
                )}
              </div>
            </div>
            <label className="pl-1  font-bold dark:text-darkText">
              Email para notificaciones
            </label>
            <div className="first-letter:grid grid-cols-1 gap-4 mb-1">
              <input
                placeholder="Email para notificaciones"
                className="border border-black p-2 rounded w-full dark:text-darkText dark:bg-darkPrimary"
                onChange={handleChange}
                type="email"
                name="notificationEmail"
                value={userData.notificationEmail}
              />
              {errors.notificationEmail !== "" && (
                <p className=" text-red-500">
                  {errors.notificationEmail}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-1">
              <div>
                <label className="pl-1  font-bold dark:text-darkText">
                  Telefono
                </label>
                <input
                  placeholder="Telefono 1"
                  className="border border-black p-2 rounded w-full dark:text-darkText dark:bg-darkPrimary"
                  onChange={handleChange}
                  type="text"
                  name="phoneNumber1"
                  value={userData.phoneNumber1}
                />
                {errors.phoneNumber1 !== "" && (
                  <p className=" text-red-500">{errors.phoneNumber1}</p>
                )}
              </div>
              <div>
                <label className="pl-1  font-bold dark:text-darkText">
                  Telefono alternativo
                </label>
                <input
                  onChange={handleChange}
                  type="text"
                  name="phoneNumber2"
                  value={userData.phoneNumber2}
                  placeholder="Telefono 2"
                  className="border border-black p-2 rounded w-full dark:text-darkText dark:bg-darkPrimary"
                />
                {errors.phoneNumber2 !== "" && (
                  <p className=" text-red-500">{errors.phoneNumber2}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-1">
              <div>
                <label className="pl-1  font-bold dark:text-darkText">
                  % de Comisión
                </label>
                <input
                  onChange={handleChange}
                  type="text"
                  name="commission"
                  value={userData.commission}
                  placeholder="Comision"
                  className="border border-black p-2 rounded w-full dark:text-darkText dark:bg-darkPrimary"
                />
                {errors.commission !== "" && (
                  <p className=" text-red-500 ">{errors.commission}</p>
                )}
              </div>
              <div>
                <label className="pl-1  font-bold dark:text-darkText">
                  Rol
                </label>
                <select
                  onChange={handleChange}
                  name="rol"
                  value={userData.rol}
                  className={`bg-gray-50 border border-black text-black sm: rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:text-darkText dark:bg-darkPrimary`}
                >
                  <option value="" disabled hidden>
                    Selecciona un rol
                  </option>
                  {roles.map((rol, index) => (
                    <option key={index} value={rol}>
                      {rol}
                    </option>
                  ))}
                </select>
                {errors.rol !== "" && (
                  <p className=" text-red-500">{errors.rol}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-2">
              <div className="mb-1">
                <label className="pl-1  font-bold dark:text-darkText">
                  Especialidad
                </label>
                {specialties.map((specialty, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="checkbox"
                      id={specialty}
                      name="specialtyName"
                      value={specialty.id}
                      checked={userData.specialtyName.includes(specialty.id)}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <label
                      htmlFor={specialty}
                      className=" text-gray-900 dark:text-darkText"
                    >
                      {specialty.specialtyName}
                    </label>
                  </div>
                ))}
                {errors.specialtyName !== "" && (
                  <p className=" text-red-500">{errors.specialtyName}</p>
                )}
              </div>
              <div>
                <label className="pl-1  font-bold dark:text-darkText">
                  Sede
                </label>
                {branches.map((branch, index) => (
                  <div key={index} className="flex items-center pb-1">
                    <input
                      type="checkbox"
                      id={branch}
                      name="branch"
                      value={branch.id}
                      checked={userData.branch.includes(branch.id)}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <label
                      htmlFor={branch}
                      className=" text-gray-900 dark:text-darkText"
                    >
                      {branch.branchName}
                    </label>
                  </div>
                ))}
                {errors.branch !== "" && (
                  <span className=" text-red-500">{errors.branch}</span>
                )}
              </div>
            </div>
            <div>
              <div className="flex flex-col w-full items-center mb-1">
                <UploadWidget setUserData={setUserData} />
                <div className="hidden sm:block mt-1 mb-1">
                  <img
                    className="w-20 h-20 my-2 rounded"
                    src={userData.image}
                    alt="user-avatar"
                  />
                </div>
              </div>
            </div>
            {!submitLoader ? (
              <div className="h-10 flex w-full justify-center">
                <button
                  type="submit"
                  id="theme-toggle"
                  className="px-4 py-2 w-fit rounded-md bg-primaryPink shadow shadow-black text-black hover:bg-secondaryColor transition-colors duration-700 dark:text-darkText dark:bg-darkPrimary dark:hover:bg-blue-600"
                  disabled={disableSubmit}
                >
                  Crear nuevo usuario
                </button>
              </div>
            ) : (
              <Loader />
            )}
          </form>
        </div>
      </div>
    </>
  );
}

export default RegisterForm;
