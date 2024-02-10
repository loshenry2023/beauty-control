//hooks,reducer, componentes
import React, { useEffect, useState } from "react";

import axios from "axios";
import { toast } from "react-hot-toast";
import Loader from '../Loader'

//icons
import { IoClose } from "react-icons/io5";

//funciones

//Variables de entorno
import getParamsEnv from "../../functions/getParamsEnv";

const { API_URL_BASE } = getParamsEnv();

const CreateSpecialtyModal = ({
  aux,
  setAux,
  setShowEditSpecialtyModal,
  token,
  filaSpecialty,
}) => {
  const [Specialty, setSpecialty] = useState({
    name: filaSpecialty.specialtyName,
  });

  const [submitLoader, setSubmitLoader] = useState(false)
    const [disableSubmit, setDisableSubmit] = useState(false)

  const [errors, setErrors] = useState({});

  const closeModal = () => {
    setShowEditSpecialtyModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSpecialty((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));

    if (value.length > 30) {
      setErrors({
        name: "El nombre no puede superar los 30 caracteres",
      });
    } else if (value.length === 0) {
      setErrors({
        name: "El nombre no puede estar vacío",
      });
    } else {
      setErrors({
        name: undefined,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (Specialty.name.length > 30) {
      setErrors({
        name: "El nombre no puede superar los 30 caracteres",
      });
      return;
    } else if (Specialty.name.length === 0) {
      setErrors({
        name: "El nombre no puede estar vacío",
      });
      return;
    } else {
      setErrors({
        name: undefined,
      });
    }
  
    // Create an object with the initial values for comparison
    const initialSpecialty = {
      name: filaSpecialty.specialtyName,
    };
  
    // Check if there are modifications
    if (JSON.stringify(Specialty) === JSON.stringify(initialSpecialty)) {
      toast.error("Debes modificar al menos un campo");
      return;
    }
  
    try {
      setDisableSubmit(true);
      setSubmitLoader(true);
  
      const data = {
        specialtyName: Specialty.name,
        token: token,
      };
  
      const response = await axios.put(
        `${API_URL_BASE}/v1/specialty/${filaSpecialty.id}`,
        data
      );
  
      if (response.data.updated === "ok") {
        setSubmitLoader(false);
        setAux(!aux);
        toast.success("Especialidad modificada exitosamente");
  
        setTimeout(() => {
          closeModal();
          setDisableSubmit(false);
          setSpecialty({
            name: "",
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

  useEffect(() => {
    const close = (e) => {
      if (e.keyCode === 27) {
        closeModal();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [Specialty]);

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
                Modificar Especialidad
              </h1>
              <IoClose
                onClick={closeModal}
                className=" ml-5 cursor-pointer mt-2 w-5 h-5 hover:scale-125 dark:text-darkText"
              />
            </div>
            <form onSubmit={handleSubmit}>
              <div className=" mb-2">
                <div>
                  <label className="pl-1  font-bold dark:text-darkText">
                    Nombre
                  </label>
                  <input
                    onChange={handleChange}
                    type="text"
                    name="name" // Make sure this line is present
                    value={Specialty.name}
                    placeholder="Nombre"
                    className={`border border-black p-2 rounded w-full ${
                      errors.name !== undefined && "border-2 border-red-500"
                    } dark:text-darkText dark:bg-darkPrimary`}
                  />
                  {Object.keys(errors).map(
                    (key) =>
                      errors[key] && (
                        <p key={key} className=" text-red-500">
                          {errors[key]}
                        </p>
                      )
                  )}
                </div>
              </div>

              <div className="flex justify-center items-center">
              {!submitLoader ?
                                    <button
                                    type="submit"
                                    disabled={disableSubmit}
                                    className="mt-2 px-4 py-2 w-full rounded bg-primaryPink shadow shadow-black text-black hover:bg-secondaryColor transition-colors duration-700 dark:text-darkText dark:bg-darkPrimary dark:hover:bg-blue-600"
                                >
                                    Modificar Especialidad
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

export default CreateSpecialtyModal;
