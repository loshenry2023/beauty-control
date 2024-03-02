//hooks,reducer, componentes
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import branchValidation from "../../functions/createBranchValidations";
import { IoClose } from "react-icons/io5";
import getParamsEnv from "../../functions/getParamsEnv";
import Loader from '../Loader'

const { API_URL_BASE } = getParamsEnv();

const EditBranchModal = ({
  aux,
  setAux,
  setShowEditBranchModal,
  token,
  filaBranch,
}) => {
  const [newBranch, setNewBranch] = useState({
    name: filaBranch.branchName || "",
    address: filaBranch.address || "",
    phone: filaBranch.phoneNumber || "",
    coordinates: filaBranch.coordinates || "",
    openningHours: filaBranch.openningHours || "",
    clossingHours: filaBranch.clossingHours || "",
    workingDays: filaBranch.workingDays || "",
    linkFb: filaBranch.linkFb || "",
    linkIg: filaBranch.linkIg || "",
    linkTk: filaBranch.linkTk || "",
  });

  const [errors, setErrors] = useState({});
  const [submitLoader, setSubmitLoader] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(false);

  const closeModal = () => {
    setShowEditBranchModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setNewBranch((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));

    setNewBranch((prevInfo) => {
      const validationErrors = branchValidation({ ...prevInfo, [name]: value });
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: validationErrors[name],
      }));
      return prevInfo;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validación de los nuevos campos: Instagram, Facebook y TikTok
    const validationErrors = branchValidation(newBranch);
  
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    const isFormModified =
    newBranch.name !== filaBranch.branchName ||
    newBranch.address !== filaBranch.address ||
    newBranch.phone !== filaBranch.phoneNumber ||
    newBranch.coordinates !== filaBranch.coordinates ||
    newBranch.openningHours !== filaBranch.openningHours ||
    newBranch.clossingHours !== filaBranch.clossingHours ||
    newBranch.instagramLink !== filaBranch.instagramLink ||
    newBranch.facebookLink !== filaBranch.facebookLink ||
    newBranch.tiktokLink !== filaBranch.tiktokLink;
  
    if (!isFormModified) {
      toast.error("Debes modificar al menos un campo para editar la sede");
      return;
    }
  
    try {
      setDisableSubmit(true);
      setSubmitLoader(true);
  
      const data = {
        branchName: newBranch.name,
        address: newBranch.address,
        phoneNumber: newBranch.phone,
        coordinates: newBranch.coordinates || "",
        openningHours: newBranch.openningHours,
        clossingHours: newBranch.clossingHours,
        workingDays: newBranch.workingDays,
        instagramLink: newBranch.instagramLink,
        facebookLink: newBranch.facebookLink,
        tiktokLink: newBranch.tiktokLink,
        token: token,
      };
  
      const response = await axios.put(
        `${API_URL_BASE}/v1/branch/${filaBranch.id}`,
        data
      );
  
      if (response.data.updated === "ok") {
        setSubmitLoader(false);
        setAux(!aux);
        toast.success("Sede editada exitosamente");
  
        setTimeout(() => {
          closeModal();
          setDisableSubmit(false);
          setNewBranch({
            name: "",
            address: "",
            phone: "",
            coordinates: "",
            instagramLink: "",
            facebookLink: "",
            tiktokLink: "",
          });
        }, 3000);
      } else {
        setDisableSubmit(false);
        setSubmitLoader(false);
  
        toast.error("Hubo un problema con la edición");
      }
    } catch (error) {
      setDisableSubmit(false);
      setSubmitLoader(false);
      toast.error(error.response.data ? error.response.data : `Hubo un problema con la edición. ${error}`);
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
  }, [newBranch]);

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
                Editar Sede
              </h1>
              <IoClose
                onClick={closeModal}
                className="ml-5 cursor-pointer mt-2 w-5 h-5 hover:scale-125 dark:text-darkText"
              />
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div>
                <label className="pl-1 font-bold dark:text-darkText">
                  Nombre de la Sede
                </label>
                <input
                  onChange={handleChange}
                  type="text"
                  name="name"
                  value={newBranch.name}
                  placeholder="Nombre"
                  className={`border border-black p-2 rounded w-full ${
                    errors.name !== undefined && "border-2 border-red-500"
                  } dark:text-darkText dark:bg-darkPrimary`}
                />
                {errors.name !== "" && (
                  <p className="text-red-500 p-1">{errors.name}</p>
                )}
              </div>
              <div>
                <label className="pl-1 font-bold dark:text-darkText">
                  Dirección
                </label>
                <input
                  onChange={handleChange}
                  type="text"
                  name="address"
                  value={newBranch.address}
                  placeholder="Dirección"
                  className={`border border-black p-2 rounded w-full ${
                    errors.address !== undefined && "border-2 border-red-500"
                  } dark:text-darkText dark:bg-darkPrimary`}
                />
                {errors.address !== "" && (
                  <p className="text-red-500 p-1">{errors.address}</p>
                )}
              </div>

              <div>
                <label className="pl-1 font-bold dark:text-darkText">
                  Teléfono
                </label>
                <input
                  onChange={handleChange}
                  type="text"
                  name="phone"
                  value={newBranch.phone}
                  placeholder="Phone"
                  className={`border border-black p-2 rounded w-full ${
                    errors.phone !== undefined && "border-2 border-red-500"
                  } dark:text-darkText dark:bg-darkPrimary`}
                />
                {errors.phone !== "" && (
                  <p className="text-red-500 p-1">{errors.phone}</p>
                )}
              </div>
              <div>
                <label className="pl-1 font-bold dark:text-darkText">
                  Link de Google Maps
                </label>
                <input
                  onChange={handleChange}
                  type="text"
                  name="coordinates"
                  value={newBranch.coordinates}
                  placeholder="Ingresa el link de Google Maps"
                  className={`border border-black p-2 rounded w-full ${
                    errors.coordinates !== undefined &&
                    "border-2 border-red-500"
                  } dark:text-darkText dark:bg-darkPrimary`}
                />
                {errors.coordinates !== "" && (
                  <p className="text-red-500 p-1">
                    {errors.coordinates}
                  </p>
                )}
              </div>
              <div>
                <label className="pl-1 font-bold dark:text-darkText">
                  Hora de apertura
                </label>
                <input
                  placeholder="Hora de inicio"
                  className="border border-black p-2 rounded w-full dark:text-darkText dark:bg-darkPrimary dark:[color-scheme:dark]"
                  onChange={handleChange}
                  type="time"
                  name="openningHours"
                  value={newBranch.openningHours}
                />
                {errors.openningHours && (
                  <div className="text-red-500 ">{errors.openningHours}</div>
                )}
              </div>
              <div>
                <label className="pl-1 font-bold dark:text-darkText">
                  Hora de cierre
                </label>
                <input
                  placeholder="Hora de finalización"
                  className="border border-black p-2 rounded w-full dark:text-darkText dark:bg-darkPrimary dark:[color-scheme:dark]"
                  onChange={handleChange}
                  type="time"
                  name="clossingHours"
                  value={newBranch.clossingHours}
                />
                {errors.clossingHours && (
                  <div className="text-red-500 ">{errors.clossingHours}</div>
                )}
              </div>

              <div>
                <label className="pl-1 font-bold dark:text-darkText">
                  Link de Instagram
                </label>
                <input
                  onChange={handleChange}
                  type="text"
                  name="instagramLink"
                  value={newBranch.linkIg}
                  placeholder="Link de Instagram"
                  className={`border border-black p-2 rounded w-full ${
                    errors.instagramLink !== undefined &&
                    "border-2 border-red-500"
                  } dark:text-darkText dark:bg-darkPrimary`}
                />
                {errors.instagramLink !== "" && (
                  <p className="text-red-500 p-1">{errors.instagramLink}</p>
                )}
              </div>
              <div>
                <label className="pl-1 font-bold dark:text-darkText">
                  Link de Facebook
                </label>
                <input
                  onChange={handleChange}
                  type="text"
                  name="facebookLink"
                  value={newBranch.linkFb}
                  placeholder="Link de Facebook"
                  className={`border border-black p-2 rounded w-full ${
                    errors.facebookLink !== undefined &&
                    "border-2 border-red-500"
                  } dark:text-darkText dark:bg-darkPrimary`}
                />
                {errors.facebookLink !== "" && (
                  <p className="text-red-500 p-1">{errors.facebookLink}</p>
                )}
              </div>

              {/* Nuevo campo para el enlace de TikTok */}
              <div>
                <label className="pl-1 font-bold dark:text-darkText">
                  Link de TikTok
                </label>
                <input
                  onChange={handleChange}
                  type="text"
                  name="tiktokLink"
                  value={newBranch.linkTk}
                  placeholder="Link de TikTok"
                  className={`border border-black p-2 rounded w-full ${
                    errors.tiktokLink !== undefined &&
                    "border-2 border-red-500"
                  } dark:text-darkText dark:bg-darkPrimary`}
                />
                {errors.tiktokLink !== "" && (
                  <p className="text-red-500 p-1">{errors.tiktokLink}</p>
                )}
              </div>

              <div className="col-span-2 flex justify-center items-center pt-4">
                {!submitLoader ? (
                  <button
                    type="submit"
                    disabled={disableSubmit}
                    className="px-4 py-2 w-full rounded bg-primaryPink shadow shadow-black text-black hover:bg-secondaryColor transition-colors duration-700 dark:text-darkText dark:bg-darkPrimary dark:hover:bg-blue-600"
                  >
                    Editar sede
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

export default EditBranchModal;