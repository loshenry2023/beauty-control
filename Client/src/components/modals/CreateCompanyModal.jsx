import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-hot-toast";
import Loader from '../Loader'

// icons
import { IoClose } from "react-icons/io5";
import { UploadWidgetCompany } from "../UploadWidgetCompany";

// funciones
import serviceValidation from "../../functions/serviceValidation";

// Variables de entorno
import getParamsEnv from "../../functions/getParamsEnv";

const { API_URL_BASE } = getParamsEnv();

const CreateCompanyModal = ({
  aux,
  setAux,
  setShowCreateCompanyModal,
  token,
}) => {
  const dispatch = useDispatch();

  const [company, SetCompany] = useState({
    userName: "",
    name: "",
    plan: null,
    imgCompany: "https://res.cloudinary.com/doyafxwje/image/upload/v1704906320/no-photo_yqbhu3.png",
    expireAt: "",
  });

  const [errors, setErrors] = useState({});
  const [submitLoader, setSubmitLoader] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "plan") {
      if (value === "") {
        SetCompany((prevInfo) => ({
          ...prevInfo,
          [name]: "",
        }));
      } else {
        const parsedValue = JSON.parse(value);
        SetCompany((prevInfo) => ({
          ...prevInfo,
          [name]: {
            name: parsedValue.name,
          },
        }));
      }
    } else {
      SetCompany((prevInfo) => ({
        ...prevInfo,
        [name]: value,
      }));
    }

    // Validaciones en el onChange
    const validationErrors = {
      ...errors,
      [name]: value === "" ? "Este campo es requerido" : "",
    };

    if (name === "userName" && value !== "") {
      // Validación de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        validationErrors[name] = "El formato de correo electrónico no es válido";
      }
    }

    if (name === "name" && value.length > 40) {
      validationErrors[name] = "El nombre debe tener menos de 40 caracteres";
    }

    setErrors(validationErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones en el submit
    const validationErrors = {
      userName: company.userName === "" ? "Este campo es requerido" : "",
      name: company.name === "" ? "Este campo es requerido" : "",
      plan: company.plan === "" || company.plan === null ? "Este campo es requerido" : "",
    };

    if (company.userName !== "") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(company.userName)) {
        validationErrors["userName"] = "El formato de correo electrónico no es válido";
      }
    }

    if (company.name.length > 40) {
      validationErrors["name"] = "El nombre debe tener menos de 40 caracteres";
    }

    setErrors(validationErrors);

    const hasErrors = Object.values(validationErrors).some((error) => error !== "");
    if (!hasErrors) {
      try {
        setDisableSubmit(true);
        setSubmitLoader(true);

        const data = {
          userName: company.userName,
          nameCompany: company.name,
          expireAt: company.expireAt,
          imgCompany: company.imgCompany,
          subscribedPlan: company.plan.name,
          origin: "localhost",
          token: token,
        };

        const response = await axios.post(`${API_URL_BASE}/v1/companyadmin`, data);

        if (response.data.created === "ok") {
          setSubmitLoader(false);
          setAux(!aux);
          toast.success("Empresa creada exitosamente");

          setTimeout(() => {
            closeModal();
            setDisableSubmit(false);
            SetCompany({
              userName: "",
              name: "",
              plan: {},
              imgCompany: "https://res.cloudinary.com/doyafxwje/image/upload/v1704906320/no-photo_yqbhu3.png",
              expireAt: "",
            });
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

  const closeModal = () => {
    setShowCreateCompanyModal(false);
  };

  useEffect(() => {
    const close = (e) => {
      if (e.keyCode === 27) {
        closeModal();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [company]);

  const plans = [{name: "básico"}]

  return (
    <>
      <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full" style={{ background: "rgba(0, 0, 0, 0.70)" }}>
        <div>
          <div className="w-4/5 mx-auto bg-white shadow rounded-lg p-6 md:w-full dark:bg-darkBackground">
            <div className="flex justify-between">
              <h1 className="text-2xl font-semibold mb-4 text-black dark:text-darkText">Agregar nueva Empresa</h1>
              <IoClose onClick={closeModal} className="cursor-pointer mt-2 w-5 h-5 hover:scale-125 dark:text-darkText" />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                <div>
                  <label className="pl-1  font-bold dark:text-darkText">Email del administrador general</label>
                  <input
                    onChange={handleChange}
                    type="text"
                    name="userName"
                    value={company.userName}
                    placeholder="Email de usuario"
                    className={`border border-black p-2 rounded w-full dark:text-darkText dark:bg-darkPrimary`}
                  />
                  {errors.userName !== "" && (
                    <p className="text-red-500">{errors.userName}</p>
                  )}
                </div>
                <div>
                  <label className="pl-1  font-bold dark:text-darkText">Nombre de la Empresa</label>
                  <input
                    onChange={handleChange}
                    type="text"
                    name="name"
                    value={company.name}
                    placeholder="Nombre"
                    className={`border border-black p-2 rounded w-full dark:text-darkText dark:bg-darkPrimary`}
                  />
                  {errors.name !== "" && (
                    <p className="text-red-500">{errors.name}</p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className=" font-bold dark:text-darkText mb-1">Elegir plan</label>
                  <select
                    onChange={handleChange}
                    name="plan"
                    className="w-full border text-gray-500 border-black rounded-md text-md  dark:border-darkText p-2 dark:text-darkText dark:bg-darkPrimary"
                  >
                    <option value="">-- Plan --</option>
                    {plans.map((plan, index) => (
                      <option key={index} value={JSON.stringify(plan)}>
                        {plan.name}
                      </option>
                    ))}
                  </select>
                  {errors.plan !== "" && (
                    <p className="text-red-500">{errors.plan}</p>
                  )}
                </div>
                <div>
                  <label className="pl-1  font-bold dark:text-darkText">Fecha de expiración</label>
                  <input
                    onChange={handleChange}
                    type="date"
                    name="expireAt"
                    value={company.expireAt}
                    placeholder="FECHA DE EXPIRACIÓN"
                    className={`border border-black p-2 rounded w-full dark:text-darkText dark:bg-darkPrimary`}
                    onKeyDown={(e) => e.preventDefault()}
                  />
                  {errors.expireAt !== "" && (
                    <p className="text-red-500">{errors.expireAt}</p>
                  )}
                </div>
              </div>
              <div className="mt-8 mb-2">
                <div>
                  <div className="mt-2 grid grid-cols-1 place-items-center">
                    <UploadWidgetCompany setCompany={SetCompany} />
                    <div className="mt-2 mb-2">
                      <img className="w-20 h-20 rounded" src={company.imgCompany} alt="company-avatar" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center items-center">
                {!submitLoader ? (
                  <button
                    type="submit"
                    disabled={disableSubmit}
                    className="px-4 py-2 w-fit rounded bg-primaryPink shadow shadow-black text-black hover:bg-secondaryColor transition-colors duration-700 dark:text-darkText dark:shadow-darkText dark:bg-darkPrimary dark:hover:bg-zinc-800"
                  >
                    Crear nueva Empresa
                  </button>
                ) : (
                  <Loader />
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateCompanyModal;
