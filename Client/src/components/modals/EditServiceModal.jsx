//hooks,reducer, componentes
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-hot-toast";
import Loader from "../Loader";

//icons
import { IoClose } from "react-icons/io5";
import { UploadWidgetService } from "../UploadWidgetService";

//funciones
import serviceValidation from "../../functions/serviceValidation";

//Variables de entorno
import getParamsEnv from "../../functions/getParamsEnv";

const { API_URL_BASE } = getParamsEnv();

const EditServiceModal = ({
  aux,
  setAux,
  filaService,
  setShowEditServiceModal,
  specialties,
  token,
}) => {
  const [service, setService] = useState({
    name: filaService.serviceName,
    specialty: {
      id: filaService.Specialties[0].id,
      specialtyName: filaService.Specialties[0].specialtyName,
    },
    duration: filaService.duration,
    price: filaService.price,
    image:
      filaService.ImageService ||
      "https://res.cloudinary.com/doyafxwje/image/upload/v1704906320/no-photo_yqbhu3.png",
  });

  useEffect(() => {
    const close = (e) => {
      if (e.keyCode === 27) {
        closeModal();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [service]);

  const [submitLoader, setSubmitLoader] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(false);

  const [errors, setErrors] = useState({});

  const closeModal = () => {
    setShowEditServiceModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "specialty") {
      if (value === "") {
        setService((prevInfo) => ({
          ...prevInfo,
          [name]: "",
        }));
      } else {
        const parsedValue = JSON.parse(value);
        setService((prevInfo) => ({
          ...prevInfo,
          [name]: {
            id: parsedValue.id,
            specialtyName: parsedValue.specialtyName,
          },
        }));
      }
    } else {
      setService((prevInfo) => ({
        ...prevInfo,
        [name]: value,
      }));
    }

    setService((prevInfo) => {
      const validationErrors = serviceValidation({
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

    // Check if there are any changes in the form fields
    const isFormModified =
      service.name !== filaService.serviceName ||
      service.specialty.id !== filaService.Specialties[0].id ||
      service.duration !== filaService.duration ||
      service.price !== filaService.price ||
      service.image !== filaService.ImageService;

    if (!isFormModified) {
      toast.error(
        "Debes modificar al menos un campo para modificar el procedimiento"
      );
      return;
    }

    // Validate the form data
    const validationErrors = serviceValidation(service);
    setErrors(validationErrors);
    const hasErrors = Object.values(validationErrors).some(
      (error) => error !== undefined
    );

    if (hasErrors) {
      return;
    }

    try {
      setDisableSubmit(true);
      setSubmitLoader(true);

      const data = {
        serviceName: service.name,
        duration: service.duration,
        price: service.price,
        ImageService: service.image,
        specialty: [service.specialty.id],
        token: token,
      };

      const response = await axios.put(
        `${API_URL_BASE}/service/${filaService.id}`,
        data
      );

      if (response.data.updated === "ok") {
        setSubmitLoader(false);
        setAux(!aux);
        toast.success("Procedimiento modificado exitosamente");

        setTimeout(() => {
          closeModal();
          setDisableSubmit(false);
          setService({
            name: "",
            specialty: {
              id: "",
              specialtyName: "",
            },
            duration: "",
            price: "",
            image: "",
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
              <h1 className="text-xl font-semibold mb-4 text-black dark:text-darkText">
                Editar procedimiento
              </h1>
              <IoClose
                onClick={closeModal}
                className="cursor-pointer mt-2 w-5 h-5 hover:scale-125 dark:text-darkText"
              />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                <div>
                  <label className="pl-1 text-sm font-bold dark:text-darkText">
                    Nombre
                  </label>
                  <input
                    onChange={handleChange}
                    type="text"
                    name="name"
                    value={service.name}
                    placeholder="Nombre"
                    className={`border border-black p-2 rounded w-full ${
                      errors.name !== undefined && "border-2 border-red-500"
                    } dark:text-darkText dark:bg-darkPrimary`}
                  />
                  {errors.name !== "" && (
                    <p className="text-xs text-red-500">{errors.name}</p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-bold dark:text-darkText mb-1">
                    Especialidad
                  </label>
                  <select
                    onChange={handleChange}
                    name="specialty"
                    className="w-full border border-black rounded-md text-md  dark:border-darkText p-2 dark:text-darkText dark:bg-darkPrimary"
                  >
                    <option value="">-- Especialidad --</option>
                    {specialties.map((specialty, index) => (
                      <option
                        key={index}
                        value={JSON.stringify(specialty)}
                        selected={
                          service.specialty.specialtyName ===
                          specialty.specialtyName
                            ? true
                            : false
                        }
                      >
                        {specialty.specialtyName}
                      </option>
                    ))}
                  </select>
                  {errors.specialty !== "" && (
                    <p className="text-xs text-red-500">{errors.specialty}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                <div>
                  <label className="mb-2 text-sm font-bold text-gray-900 dark:text-darkText">
                    Duración
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
                    <p className="text-xs text-red-500">{errors.duration}</p>
                  )}
                </div>
                <div>
                  <label className="mb-2 text-sm font-bold text-gray-900 dark:text-darkText">
                    Precio
                  </label>
                  <input
                    placeholder="Precio"
                    className={`border border-black p-2 rounded w-full ${
                      errors.price !== undefined && "border-2 border-red-500"
                    } dark:text-darkText dark:bg-darkPrimary`}
                    onChange={handleChange}
                    type="text"
                    name="price"
                    value={service.price}
                  />
                  {errors.price !== "" && (
                    <p className="text-xs text-red-500">{errors.price}</p>
                  )}
                </div>
              </div>
              <div className="mt-8 mb-2">
                <div>
                  <div className="mt-2 grid grid-cols-1 place-items-center">
                    <UploadWidgetService setService={setService} />
                    <div className="mt-2 mb-2">
                      <img
                        className="w-20 h-20 rounded"
                        src={service.image}
                        alt="user-avatar"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center items-center">
                {!submitLoader ? (
                  <button
                    type="submit"
                    disabled={disableSubmit}
                    className="px-4 py-2 w-fit rounded bg-primaryPink shadow shadow-black text-black hover:bg-secondaryColor transition-colors duration-700 focus:outline-none dark:text-darkText dark:bg-darkPrimary dark:hover:bg-blue-600"
                  >
                    Editar procedimiento
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

export default EditServiceModal;
