//hooks,reducer, componentes
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-hot-toast";
import Loader from '../Loader'


//icons
import { IoClose } from "react-icons/io5";
import { UploadWidgetCompany } from "../UploadWidgetCompany";

//funciones


//Variables de entorno
import getParamsEnv from "../../functions/getParamsEnv";


const { API_URL_BASE } = getParamsEnv();

const EditCompanyModal = ({
  aux,
  setAux,
  setShowEditCompanyModal,
  filaCompany,
  token,
}) => {
  const dispatch = useDispatch();

  console.log(filaCompany)


  const [company, SetCompany] = useState({
    userName: filaCompany.userName || "",
    name: filaCompany.nameCompany || "",
    plan: filaCompany.subscribedPlan || "",
    imgCompany: filaCompany.imgCompany || "https://res.cloudinary.com/doyafxwje/image/upload/v1704906320/no-photo_yqbhu3.png",
    expireAt: filaCompany.expireAt || "",
  });

  const [errors, setErrors] = useState({});

  const closeModal = () => {
    setShowEditCompanyModal(false);
  };

  const [submitLoader, setSubmitLoader] = useState(false)
  const [disableSubmit, setDisableSubmit] = useState(false)

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
  };

  console.log(company)


  const handleSubmit = async (e) => {
    e.preventDefault();


      try {

        setDisableSubmit(true)
        setSubmitLoader(true)

        const data = {
            nameCompany: company.name,
            expireAt: company.expireAt,
            imgCompany: company.imgCompany,
            subscribedPlan: company.plan,
          token: token,
        };

        console.log(data, "enviando al back")

        const response = await axios.put(`${API_URL_BASE}/v1/companyadmin`, data);
        console.log(response)

        if (response.data.updated === "ok") {
          setSubmitLoader(false)
          setAux(!aux);
          toast.success("Compania modificada exitosamente");

          setTimeout(() => {
            closeModal();
            setDisableSubmit(false)
            SetCompany({
                userName: "",
                name: "",
                plan: {},
                imgCompany: "https://res.cloudinary.com/doyafxwje/image/upload/v1704906320/no-photo_yqbhu3.png",
                expireAt: "",
              });
          }, 3000);
        } else {
          setDisableSubmit(false)
        setSubmitLoader(false)
          toast.error("Hubo un problema con la modificación");
        }
      } catch (error) {
        setDisableSubmit(false)
        setSubmitLoader(false)
        toast.error(`Hubo un problema con la modificación. ${error}`);
      }
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
      <div
        className="fixed top-0 left-0 flex items-center justify-center w-full h-full"
        style={{ background: "rgba(0, 0, 0, 0.70)" }}
      >
        <div>
          <div className="w-4/5 mx-auto bg-white shadow rounded-lg p-6 md:w-full dark:bg-darkBackground">
            <div className="flex justify-between">
              <h1 className="text-2xl font-semibold mb-4 text-black dark:text-darkText">
                Editar Empresa
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
                    value={company.name}
                    placeholder="Nombre"
                    className={`border border-black p-2 rounded w-full ${
                      errors.name !== undefined && "border-2 border-red-500"
                    } dark:text-darkText dark:bg-darkPrimary`}
                  />
                  {errors.name !== "" && (
                    <p className=" text-red-500">{errors.name}</p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className=" font-bold dark:text-darkText mb-1">
                    Plan
                  </label>
                  <select
                    onChange={handleChange}
                    name="plan"
                    className="w-full border text-gray-500 border-black rounded-md text-md  dark:border-darkText p-2 dark:text-darkText dark:bg-darkPrimary"
                  >
                    <option value="">-- Plan --</option>
                    {plans.map((plan, index) => (
                      <option key={index} value={JSON.stringify(plan)}  selected={
                          company.plan ===
                          plan.name
                            ? true
                            : false
                        }>
                        {plan.name}
                      </option>
                    ))}
                  </select>
                  {errors.plan !== "" && (
                    <p className=" text-red-500">{errors.plan}</p>
                  )}
                </div>
                <div>
                  <label className="pl-1  font-bold dark:text-darkText">
                    Expiración
                  </label>
                  <input
                    onChange={handleChange}
                    type="date"
                    name="expireAt"
                    value={company.expireAt.split('T')[0]}
                    placeholder="Expiración"
                    className={`border border-black p-2 rounded w-full ${
                      errors.expireAt !== undefined && "border-2 border-red-500"
                    } dark:text-darkText dark:bg-darkPrimary`}
                    onKeyDown={(e) => e.preventDefault()}
                  />
                  {errors.expireAt !== "" && (
                    <p className=" text-red-500">{errors.expireAt}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                {/* <div>
                  <label className="mb-2  font-bold text-gray-900 dark:text-darkText">
                    Expiracion
                  </label>
                  <input
                    onChange={handleChange}
                    type="text"
                    name="duration"
                    value={service.duration}
                    placeholder="Duración"
                    className={`border text-gray-500 border-black p-2 rounded w-full ${
                      errors.duration !== undefined && "border-2 border-red-500"
                    } dark:text-darkText dark:bg-darkPrimary`}
                  />
                  {errors.duration !== "" && (
                    <p className=" text-red-500">{errors.duration}</p>
                  )}
                </div> */}
              </div>
              <div className="mt-8 mb-2">
                <div>
                  <div className="mt-2 grid grid-cols-1 place-items-center">
                    <UploadWidgetCompany setCompany={SetCompany} />
                    <div className="mt-2 mb-2">
                      <img
                        className="w-20 h-20 rounded"
                        src={company.imgCompany}
                        alt="company-avatar"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center items-center">
              {!submitLoader ?
                                    <button
                                    type="submit"
                                    disabled={disableSubmit}
                                    className="mt-2 px-4 py-2 w-fit rounded bg-primaryPink shadow shadow-black text-black hover:bg-secondaryColor transition-colors duration-700 dark:text-darkText dark:bg-darkPrimary dark:hover:bg-blue-600"
                                >
                                    Editar Empresa
                                </button> :
                <Loader />
              }
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditCompanyModal;
