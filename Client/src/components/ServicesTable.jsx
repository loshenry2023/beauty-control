//components y hooks
import React, { useState, useEffect } from "react";
import CreateServiceModal from "./modals/CreateServiceModal";
import EditServiceModal from "./modals/EditServiceModal";
import ToasterConfig from "./Toaster";
import { getServices, getSpecialties, setTokenError } from "../redux/actions";
import Loader from "./Loader";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";

//icons
import { MdDeleteForever } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { IoIosAddCircle } from "react-icons/io";


//variables de entorno y functiones
import getParamsEnv from "../functions/getParamsEnv";
const { API_URL_BASE } = getParamsEnv();



const ServicesTable = () => {
  const [showCreateServiceModal, setShowCreateServiceModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showEditServiceModal, setShowEditServiceModal] = useState(false);
  const [filaService, setFilaService] = useState(null);
  const [serviceId, setServiceId] = useState(null);
  const specialties = useSelector((state) => state?.specialties);
  const services = useSelector((state) => state?.services);
  const token = useSelector((state) => state?.token);
  const tokenError = useSelector((state) => state?.tokenError);
  const dispatch = useDispatch();
  const [aux, setAux] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  let requestMade = false;
  useEffect(() => {
    if (!requestMade) {
    requestMade = true;
    axios.post(API_URL_BASE + "/v1/specialties", { token })
    .then(respuesta => {
      dispatch(getSpecialties(respuesta.data))
      return axios.post(API_URL_BASE + "/v1/getservices", { token })
    })
    .then((respuesta2) => {
        dispatch(getServices(respuesta2.data))
        requestMade = false;
        setIsLoading(false);
      })
      .catch(error => { 
        if (error.request.status === 401 || error.request.status === 402 || error.request.status === 403) {
          setIsLoading(false)
           dispatch(setTokenError(error.request.status))
        } else {
          let errorMessage= ""     
          if (!error.response) {
            errorMessage = error.message;
          } else {
            errorMessage = `${error.response.status} ${error.response.statusText} - ${error.response.data.split(":")[1]}`
          }
          toast.error(errorMessage);
        }
      })}
  }, [token, tokenError, aux]);

  const handleDelete = async () => {
    try {
      const response = await axios.post(
        `${API_URL_BASE}/v1/deleteservice/${serviceId}`,
        { token }
      );
      if (response.data.deleted === "ok") {
        setAux(!aux);
        toast.success("Procedimiento eliminado exitosamente");
        setServiceId(null);
      } else {
        toast.error("Hubo un problema al eliminar procedimiento");
      }
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Ha ocurrido un error";
      toast.error(
        `${errorMessage}`
      );
    }
  };

  const handleDeleteModal = (id) => {
    setServiceId(id);
    setShowDeleteConfirmation(true);
  };

  const deleteConfirmed = (confirmed) => {
    if (confirmed) {
      setShowDeleteConfirmation(false);
      handleDelete();
    } else {
      setShowDeleteConfirmation(false);
    }
  };

  const handleShowCreateModal = () => {
    setShowCreateServiceModal(true);
  };

  const handleEditServiceModal = (filaService) => {
    setShowEditServiceModal(true);
    setFilaService(filaService);
  };

  if (tokenError === 401 || tokenError === 402 || tokenError === 403) {
    return (
      <ErrorToken error={tokenError} />
    );
  } else {
    if (!isLoading) {
      return (
        <>
          <div>
            <div className=" overflow-auto max-h-[700px] relative overflow-x-auto shadow-md sm:rounded-lg ">
              <table className="w-full  text-left rtl:text-right text-black dark:text-beige dark:border-beige dark:border">
                <thead className="bg-secondaryColor text-black text-left dark:bg-darkPrimary dark:text-darkText dark:border-secondaryColor">
                  <tr>
                    <th scope="col" className="px-4 py-3">
                      Nombre
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Especialidad
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Duracion
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Precio
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Imagen
                    </th>
                    <th scope="col" className="px-4 py-3">
                      <button
                        className="flex flex-row gap-1 p-2 rounded-full hover:bg-secondaryColor hover:text-black"
                        onClick={handleShowCreateModal}
                      >
                        <IoIosAddCircle size={20} /> Agregar
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {services
                    .slice()
                    .sort((a, b) => a.serviceName.localeCompare(b.serviceName))
                    .map((fila, index) => (
                      <tr
                        key={index}
                        className="group border border-secondaryColor hover:bg-gray-200 transition-colors duration-700 dark:hover:bg-gray-200 dark:hover:text-black"
                      >
                        <td className="px-4 py-4">{fila.serviceName}</td>
                        <td className="px-4 py-4">
                          {fila.Specialties[0]?.specialtyName || "-"}
                        </td>
                        <td className="px-4 py-4">{fila.duration} Mins</td>
                        <td className="px-4 py-4">${fila.price}</td>
                        <td className="px-4 py-4">
                          <img
                            className="h-8 w-8 rounded-2xl"
                            src={fila.ImageService}
                            alt={fila.serviceName}
                          />
                        </td>
                        <td className="px-4 py-4">
                          <button
                            className=" hover:bg-blue-700 text-black px-2 py-1 rounded mr-2"
                            onClick={() => handleEditServiceModal(fila)}
                          >
                            <MdEdit
                              size={25}
                              className="dark:text-darkText group-hover:text-black dark:group-hover:text-black"
                            />
                          </button>
                          <button
                            className=" hover:bg-red-700 text-black px-2 py-1 rounded"
                            onClick={() => handleDeleteModal(fila.id)}
                          >
                            <MdDeleteForever
                              size={25}
                              className="dark:text-darkText group-hover:text-black dark:group-hover:text-black"
                            />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
          {showCreateServiceModal && (
            <CreateServiceModal
              aux={aux}
              setAux={setAux}
              token={token}
              setShowCreateServiceModal={setShowCreateServiceModal}
              specialties={specialties}
            />
          )}
          {showEditServiceModal && (
            <EditServiceModal
              aux={aux}
              setAux={setAux}
              filaService={filaService}
              token={token}
              setShowEditServiceModal={setShowEditServiceModal}
              specialties={specialties}
            />
          )}
          {showDeleteConfirmation && serviceId && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div
                className={`bg-white p-6 rounded-lg shadow-lg text-center sm:flex sm:flex-col ${
                  window.innerWidth < 340 ? "max-w-sm" : "max-w-md"
                }`}
              >
                <p className="mb-4  sm:text-base">
                  ¿Estás seguro de que deseas eliminar esta cita?
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => deleteConfirmed(true)}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600  sm:text-base"
                  >
                    Aceptar
                  </button>
                  <button
                    onClick={() => deleteConfirmed(false)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600  sm:text-base"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
          <ToasterConfig />
        </>
      );
    } else {
      return (
        <div className="mt-20">
          <Loader />
        </div>
      );
    }
  }
};

export default ServicesTable;
