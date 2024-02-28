import React, { useEffect, useState } from "react";
import { MdDeleteForever } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import CreateBranchModal from "./modals/CreateBranchModal";
import EditBranchModal from "./modals/EditBranchModal";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-hot-toast";
import ToasterConfig from "./Toaster";
import getParamsEnv from "../functions/getParamsEnv";
import { IoIosAddCircle } from "react-icons/io";
import { getBranches, setTokenError } from "../redux/actions";
import Loader from "./Loader";

const { API_URL_BASE } = getParamsEnv();

const BranchTable = ({ branches }) => {
  const [showCreateBranchModal, setShowCreateBranchModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showEditBranchModal, setShowEditBranchModal] = useState(false);
  const [filaBranch, setFilaBranch] = useState(null);
  const [branchId, setBranchId] = useState(null);
  const specialties = useSelector((state) => state?.specialties);
  const token = useSelector((state) => state?.token);
  const tokenError = useSelector((state) => state?.tokenError);
  const [aux, setAux] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();

  let requestMade = false
  useEffect(() => {
    if(!requestMade){
      requestMade = true
      axios.post(API_URL_BASE + `/v1/branches`, {token})
      .then(respuesta => {
        dispatch(getBranches(respuesta.data));
        requestMade = false
        setIsLoading(false)
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
        `${API_URL_BASE}/v1/deletebranch/${branchId}`,
        { token }
      );
      if (response.data.deleted === "ok") {
        setAux(!aux);
        toast.success("Sede eliminado exitosamente");

        setBranchId(null);
      } else {
        toast.error("Hubo un problema al eliminar Sede");
      }
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Ha ocurrido un error";
      toast.error(`${errorMessage}`);
    }
  };

  const handleDeleteModal = (id) => {
    setBranchId(id);
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
    setShowCreateBranchModal(true);
  };

  const handleEditBranchModal = (filaBranch) => {
    setShowEditBranchModal(true);
    setFilaBranch(filaBranch);
  };

  console.log(branches)

  if (tokenError === 401 || tokenError === 402 || tokenError === 403) {
    return (
      <ErrorToken error={tokenError} />
    );
  } else {
    if (!isLoading) {
      return (
        <>
          <div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full  text-left rtl:text-right text-black dark:text-beige dark:border-beige dark:border">
                <thead className="bg-secondaryColor text-black text-left dark:bg-darkPrimary dark:text-darkText dark:border-secondaryColor">
                  <tr>
                    <th scope="col" className="px-4 py-3">
                      Nombre
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Dirección
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Teléfono
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Horario de apertura
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Horario de cierre
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
                {branches
                    .slice()
                    .sort((a, b) => a.branchName.localeCompare(b.branchName))
                    .map((fila, index) => (
                      <tr
                        key={index}
                        className=" group border border-secondaryColor hover:bg-gray-200 transition-colors duration-700 dark:hover:bg-gray-200 dark:hover:text-black"
                      >
                        <td className="px-4 py-4">{fila.branchName}</td>
                        <td className="px-4 py-4">{fila.address}</td>
                        <td className="px-4 py-4">{fila.phoneNumber}</td>
                        {fila.openningHours ? <td className="px-4 py-4">{fila.openningHours} hs.</td> : <td className="px-4 py-4">-</td>}
                        {fila.clossingHours ? <td className="px-4 py-4">{fila.clossingHours} hs.</td> : <td className="px-4 py-4">-</td>}
                        <td className="px-4 py-4">
                          <button
                            className="hover:bg-blue-700 text-black px-2 py-1 rounded mr-2"
                            onClick={() => handleEditBranchModal(fila)}
                          >
                            <MdEdit size={25} className="dark:text-darkText group-hover:text-black dark:group-hover:text-black"/>
                          </button>
                          <button
                            className="hover:bg-red-700 text-black px-2 py-1 rounded"
                            onClick={() => handleDeleteModal(fila.id)}
                          >
                            <MdDeleteForever size={25} className="dark:text-darkText group-hover:text-black dark:group-hover:text-black"/>
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
          {showCreateBranchModal && (
            <CreateBranchModal
              aux={aux}
              setAux={setAux}
              token={token}
              setShowCreateBranchModal={setShowCreateBranchModal}
            />
          )}
          {showEditBranchModal && (
            <EditBranchModal
              aux={aux}
              setAux={setAux}
              filaBranch={filaBranch}
              token={token}
              setShowEditBranchModal={setShowEditBranchModal}
              specialties={specialties}
            />
          )}
          {showDeleteConfirmation && branchId && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div
                className={`bg-white p-6 rounded-lg shadow-lg text-center sm:flex sm:flex-col ${
                  window.innerWidth < 340 ? "max-w-sm" : "max-w-md"
                }`}
              >
                <p className="mb-4  sm:text-base">
                  ¿Estás seguro de que deseas eliminar esta sede?
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
      )
    } else {
      return (
        <div className="mt-20">
          <Loader />
        </div>
      );
    }
  }
};

export default BranchTable;
