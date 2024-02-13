import React, { useEffect, useState } from "react";
import { MdDeleteForever } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import CreateBranchModal from "./modals/CreateBranchModal";
import EditSpecialtyModal from "./modals/EditSpecialtyModal";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-hot-toast";
import getParamsEnv from "../functions/getParamsEnv";
import ToasterConfig from "./Toaster";
import { IoIosAddCircle } from "react-icons/io";
import CreateSpecialtyModal from "./modals/CreateSpecialtyModal";
import { getSpecialties } from "../redux/actions";
import Loader from "./Loader";

const { API_URL_BASE } = getParamsEnv();

const SpecialtiesTable = ({ branches }) => {
  const [showCreateSpecialtyModal, setShowCreateSpecialtyModal] =
    useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showEditSpecialtyModal, setShowEditSpecialtyModal] = useState(false);
  const [filaSpecialty, setFilaSpecialty] = useState(null);
  const [specialtyId, setSpecialtyId] = useState(null);
  const specialties = useSelector((state) => state?.specialties);
  const token = useSelector((state) => state?.token);
  const [isLoading, setIsLoading] = useState(true);
  const [aux, setAux] = useState();

  const dispatch = useDispatch();

  let requestMade = false;
  useEffect(() => {
    if(!requestMade){
      requestMade = true
      axios.post(API_URL_BASE + `/v1/specialties`, {token})
      .then(respuesta => {
        dispatch(getSpecialties(respuesta.data))
        requestMade = false;
        setIsLoading(false);
      })
    }}, [aux]);


  const handleDelete = async () => {
    try {
      const response = await axios.post(
        `${API_URL_BASE}/v1/deletespecialty/${specialtyId}`,
        { token }
      );
      if (response.data.deleted === "ok") {
        setAux(!aux);
        toast.success("Especialidad eliminado exitosamente");

        setSpecialtyId(null);
      } else {
        toast.error("Hubo un problema al eliminar Especialidad");
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error.response
        ? error.response.data
        : "An error occurred";
      toast.error(`Hubo un problema al eliminar Especialiad. ${errorMessage}`);
    }
  };

  const handleDeleteModal = (id) => {
    setSpecialtyId(id);
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
    setShowCreateSpecialtyModal(true);
  };

  const handleEditSpecialtyModal = (filaSpecialty) => {
    setShowEditSpecialtyModal(true);
    setFilaSpecialty(filaSpecialty);
  };

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
                  <button
                    className="flex flex-row gap-1 p-2 rounded-full hover:bg-primaryPink hover:text-black"
                    onClick={handleShowCreateModal}
                  >
                    <IoIosAddCircle size={20} /> Agregar
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
            {specialties
                .slice()
                .sort((a, b) => a.specialtyName.localeCompare(b.specialtyName))
                .map((fila, index) => (
                  <tr
                    key={index}
                    className=" border border-secondaryColor hover:bg-gray-200 transition-colors duration-700 dark:hover:bg-gray-200 dark:hover:text-black"
                  >
                    <td className="px-4 py-4">{fila.specialtyName}</td>

                    <td className="px-4 py-4">
                      <button
                        className="hover:bg-blue-700 text-black px-2 py-1 rounded mr-2"
                        onClick={() => handleEditSpecialtyModal(fila)}
                      >
                        <MdEdit size={25} className="dark:text-darkText group-hover:text-black dark:group-hover:text-black" />
                      </button>
                      <button
                        className="hover:bg-red-700 text-black px-2 py-1 rounded"
                        onClick={() => handleDeleteModal(fila.id)}
                      >
                        <MdDeleteForever size={25} className="dark:text-darkText group-hover:text-black dark:group-hover:text-black" />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      {showCreateSpecialtyModal && (
        <CreateSpecialtyModal
          aux={aux}
          setAux={setAux}
          token={token}
          setShowCreateSpecialtyModal={setShowCreateSpecialtyModal}
        />
      )}
      {showEditSpecialtyModal && (
        <EditSpecialtyModal
          aux={aux}
          setAux={setAux}
          filaSpecialty={filaSpecialty}
          token={token}
          setShowEditSpecialtyModal={setShowEditSpecialtyModal}
          specialties={specialties}
        />
      )}
      {showDeleteConfirmation && specialtyId && (
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
    </>)} else {
    return (
      <div className="mt-20">
        <Loader />
      </div>
    )
  }
};

export default SpecialtiesTable;
