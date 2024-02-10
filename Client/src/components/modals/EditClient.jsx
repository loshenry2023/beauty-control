//hooks,reducer, componentes
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-hot-toast";
import ToasterConfig from "../Toaster";
import Loader from "../Loader";

//icons
import { IoClose } from "react-icons/io5";
import { UploadWidget } from "../Uploadwidget";

//funciones
import validateClientInput from "../../functions/registerClient";
import getParamsEnv from "../../functions/getParamsEnv";
import converterGMT from "../../functions/converteGMT";
const { API_URL_BASE } = getParamsEnv();

const EditClient = ({
  setShowEditModal,
  clientInfo,
  setClientRender,
  clientRender,
  detailId,
}) => {
  useEffect(() => {
    const close = (e) => {
      if (e.keyCode === 27) {
        closeModal();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  const token = useSelector((state) => state?.token);
  const [client, setClient] = useState({
    email: clientInfo.email,
    name: clientInfo.name,
    lastName: clientInfo.lastName,
    id_pers: clientInfo.id_pers,
    phoneNumber1: clientInfo.phoneNumber1,
    phoneNumber2: clientInfo.phoneNumber2,
    birthday:
      clientInfo.birthday === null
        ? null
        : converterGMT(clientInfo.birthday).split(" ")[0],
    image: clientInfo.image,
    token: token,
  });

  const [errors, setErrors] = useState({});

  const [submitLoader, setSubmitLoader] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(false);

  const closeModal = () => {
    setShowEditModal(false);
    setClientRender(!clientRender);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setClient((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));

    setClient((prevInfo) => {
      const validationErrors = validateClientInput({
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
    const validationErrors = validateClientInput(client);
    setErrors(validationErrors);

    const hasErrors = Object.values(validationErrors).some(
      (error) => error !== undefined
    );

    if (hasErrors) {
      // Handle validation errors
    } else {
      const checkClient = {
        email: clientInfo.email,
        name: clientInfo.name,
        lastName: clientInfo.lastName,
        id_pers: clientInfo.id_pers,
        phoneNumber1: clientInfo.phoneNumber1,
        phoneNumber2: clientInfo.phoneNumber2,
        birthday:
          clientInfo.birthday === null
            ? null
            : converterGMT(clientInfo.birthday).split(" ")[0],
        image: clientInfo.image,
        token: token,
      };
      // Check if any field has been modified
      const isModified = Object.keys(client).some((key) => {
        // console.log(key, client[key], checkClient[key]);
        return client[key] !== checkClient[key];
      });

      //console.log('isModified:', isModified);

      if (!isModified) {
        // Display toast if no fields have been modified
        toast.error("Debes modificar al menos un campo");
        return;
      }

      try {
        setDisableSubmit(true);
        setSubmitLoader(true);

        const data = {
          email: client.email,
          name: client.name,
          id_pers: client.id_pers,
          lastName: client.lastName,
          phone1: client.phoneNumber1,
          phone2: client.phoneNumber2,
          birthday: client.birthday,
          image: client.image,
          token: client.token,
        };

        const response = await axios.put(
          `${API_URL_BASE}/client/${detailId}`,
          data
        );

        if (response.data.updated === "ok") {
          setSubmitLoader(false);
          toast.success("Cliente modificado exitosamente");
          setTimeout(() => {
            closeModal();
            setDisableSubmit(false);
            setClient({
              email: "",
              name: "",
              lastName: "",
              phone1: "",
              phone2: "",
              image: "",
              id_pers: "",
              token: "",
            });
          }, 3000);
        } else {
          setDisableSubmit(false);
          setSubmitLoader(false);
          toast.error("Hubo un problema con la modificación");
        }
      } catch (error) {
        setDisableSubmit(false);
        setSubmitLoader(false);
        toast.error(
          `Hubo un problema con la modificación. ${error.response.data}`
        );
      }
    }
  };

  return (
    <>
      <div
        className="fixed top-0 left-0 flex items-center justify-center w-full h-full"
        style={{ background: "rgba(0, 0, 0, 0.70)" }}
      >
        <div>
          <div className="w-4/5 mx-auto bg-white shadow rounded-lg p-6 md:w-full dark:bg-darkBackground">
            <div className="flex justify-between">
              <h1 className="text-2xl font-semibold mb-4 text-black dark:text-darkText">
                Modificar cliente
              </h1>
              <IoClose
                onClick={closeModal}
                className="cursor-pointer mt-2 w-5 h-5 hover:scale-125 dark:text-darkText"
              />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                <div>
                  <label className="pl-1  font-bold dark:text-darkText">
                    Nombre
                  </label>
                  <input
                    onChange={handleChange}
                    type="text"
                    name="name"
                    value={client.name}
                    placeholder="Nombre"
                    className="cursor-not-allowed border bg-gray-200 text-gray-500 border-black p-2 rounded w-full dark:text-darkText dark:bg-darkPrimary"
                    disabled
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
                    onChange={handleChange}
                    type="text"
                    name="lastName"
                    value={client.lastName}
                    placeholder="Apellido"
                    className="cursor-not-allowed border bg-gray-200 text-gray-500 border-black p-2 rounded w-full dark:text-darkText dark:bg-darkPrimary"
                    disabled
                  />
                  {errors.lastName !== "" && (
                    <p className=" text-red-500">{errors.lastName}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                <div>
                  <label className="mb-2  font-bold text-gray-900 dark:text-darkText">
                    Email cliente
                  </label>
                  <input
                    onChange={handleChange}
                    type="email"
                    name="email"
                    value={client.email}
                    placeholder="Email cliente"
                    className="cursor-not-allowed border bg-gray-200 text-gray-500 border-black p-2 rounded w-full dark:text-darkText dark:bg-darkPrimary"
                    disabled
                  />
                  {errors.email !== "" && (
                    <p className=" text-red-500">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label className="mb-2  font-bold text-gray-900 dark:text-darkText">
                    ID de persona
                  </label>
                  <input
                    placeholder="ID"
                    className={`border border-black p-2 rounded w-full ${
                      errors.id_pers !== undefined && "border-2  border-red-500"
                    } dark:text-darkText dark:bg-darkPrimary`}
                    onChange={handleChange}
                    type="text"
                    name="id_pers"
                    value={client.id_pers}
                  />
                  {errors.id_pers !== "" && (
                    <p className=" text-red-500">{errors.id_pers}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                <div>
                  <label className="pl-1  font-bold dark:text-darkText">
                    Telefono
                  </label>
                  <input
                    placeholder="Telefono 1"
                    className={`border border-black p-2 rounded w-full ${
                      errors.phoneNumber1 !== undefined &&
                      "border-2  border-red-500"
                    } dark:text-darkText dark:bg-darkPrimary`}
                    onChange={handleChange}
                    type="text"
                    name="phoneNumber1"
                    value={client.phoneNumber1}
                  />
                  {errors.phoneNumber1 !== "" && (
                    <p className=" text-red-500">
                      {errors.phoneNumber1}
                    </p>
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
                    value={client.phoneNumber2}
                    placeholder="Telefono 2"
                    className={`border border-black p-2 rounded w-full ${
                      errors.phoneNumber2 !== undefined &&
                      "border-2 border-red-500"
                    } dark:text-darkText dark:bg-darkPrimary`}
                  />
                  {errors.phoneNumber2 !== "" && (
                    <p className=" text-red-500">
                      {errors.phoneNumber2}
                    </p>
                  )}
                </div>
              </div>
              <div className="first-letter:grid grid-cols-1 mb-2">
                <label className="pl-1  font-bold dark:text-darkText">
                  Fecha de nacimiento
                </label>
                <input
                  placeholder="Fecha de nacimiento"
                  className={`border border-black p-2 rounded w-full ${
                    errors.birthday !== undefined && "border-2 border-red-500"
                  } dark:text-darkText dark:bg-darkPrimary dark:[color-scheme:dark]`}
                  onChange={handleChange}
                  type="date"
                  name="birthday"
                  value={client.birthday}
                />
                {errors.birthday && (
                  <p className=" text-red-500">{errors.birthday}</p>
                )}
              </div>
              <div>
                <div className="mt-2 grid grid-cols-1 place-items-center">
                  <UploadWidget setUserData={setClient} />
                  <div className="mt-2 mb-2">
                    <img
                      className="w-20 h-20 rounded"
                      src={client.image}
                      alt="user-avatar"
                    />
                  </div>
                </div>
              </div>
              {!submitLoader ? (
                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={disableSubmit}
                    className="mt-2 px-6 py-2 w-fit rounded bg-primaryPink shadow shadow-black text-black hover:bg-secondaryColor transition-colors duration-700 dark:text-darkText dark:bg-darkPrimary dark:hover:bg-blue-600"
                  >
                    Modificar cliente
                  </button>
                </div>
              ) : (
                <Loader />
              )}
            </form>
          </div>
        </div>
      </div>
      <ToasterConfig />
    </>
  );
};

export default EditClient;
