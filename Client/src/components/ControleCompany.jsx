import React, { useState, useEffect } from "react";
import { MdDeleteForever } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import CreateCompanyModal from "./modals/CreateCompanyModal";
import EditServiceModal from "./modals/EditServiceModal";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-hot-toast";
import getParamsEnv from "../functions/getParamsEnv";
import ToasterConfig from "./Toaster";
import { IoIosAddCircle } from "react-icons/io";
import EditCompanyModal from "./modals/EditCompanyModal";
const { API_URL_BASE } = getParamsEnv();



const ControlCompany = () => {
  const [showCreateCompanyModal, setShowCreateCompanyModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showEditCompanyModal, setShowEditCompanyModal] = useState(false);
  const [filaCompany, setFilaCompany] = useState(null);
  const [companyName, setCompanyName] = useState(null);

  const token = useSelector((state) => state?.token);
  const dispatch = useDispatch();
  const [aux, setAux] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [companies, setCompanies] = useState()

  useEffect(() => {
    axios.post(`${API_URL_BASE}/v1/companyadminlist`, { token: token })
      .then(response => {
        setCompanies(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, [aux]);


  const handleDelete = async () => {
    try {
      const response = await axios.post(
        `${API_URL_BASE}/v1/companyadmindel`,
        { token, nameCompany: companyName }
      );
      if (response.data.deleted === "ok") {
        setAux(!aux);
        toast.success("Procedimiento eliminado exitosamente");

        setCompanyName(null);
      } else {
        toast.error("Hubo un problema al eliminar procedimiento");
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error.response
        ? error.response.data
        : "An error occurred";
      toast.error(
        `Hubo un problema al eliminar procedimiento. ${errorMessage}`
      );
    }
  };

  const handleDeleteModal = (name) => {
    setCompanyName(name);
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
    setShowCreateCompanyModal(true);
  };

  const handleEditCompanyModal = (filaCompany) => {
    setShowEditCompanyModal(true);
    setFilaCompany(filaCompany);
  };

  console.log(companies)

  if (!isLoading) {
    return (
      <>
        <div>
          <div className=" overflow-auto max-h-[700px] relative overflow-x-auto shadow-md sm:rounded-lg ">
            <table className="w-full  text-left rtl:text-right text-black dark:text-beige dark:border-beige dark:border">
              <thead className="bg-controlColor text-black text-left dark:bg-darkPrimary dark:text-darkText dark:border-secondaryColor">
                <tr>
                  <th scope="col" className="px-4 py-3">
                    Nombre de la Empresa
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Email del administrador general
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Plan actual
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Finalización del plan
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Imagen
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
             {companies && companies.rows
                  .slice()
                  .sort((a, b) => a.nameCompany.localeCompare(b.CompanyName))
                  .map((fila, index) => ( 
                    <tr
                      key={index}
                      className=" border border-secondaryColor hover:bg-gray-200 transition-colors duration-700 dark:hover:bg-gray-200 dark:hover:text-black"
                    >
                      <td className="px-4 py-4">{fila.nameCompany}</td>
                      <td className="px-4 py-4">{fila.userName}</td>
                      <td className="px-4 py-4">{fila.subscribedPlan}</td>
                      <td className="px-4 py-4">{fila.expireAt.split('T')[0]}</td>
                      <td className="px-4 py-4">
                        <img className='h-8 w-8' src="https://res.cloudinary.com/dvptbowso/image/upload/v1701979529/HenryPF/ses9qbgrnytwd9l1ovcu.png" alt={fila.CompanyName} />
                      </td>
                      
                      <td className="px-4 py-4">
                        <button
                          className=" hover:bg-blue-700 text-black px-2 py-1 rounded mr-2"
                          onClick={() => handleEditCompanyModal(fila)}
                        >
                          <MdEdit size={25} className="dark:text-darkText group-hover:text-black dark:group-hover:text-black"/>
                        </button>
                        <button
                          className=" hover:bg-red-700 text-black px-2 py-1 rounded"
                          onClick={() => handleDeleteModal(fila.nameCompany)}
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
        {showCreateCompanyModal && (
          <CreateCompanyModal
            aux={aux}
            setAux={setAux}
            token={token}
            setShowCreateCompanyModal={setShowCreateCompanyModal}
          />
        )}
        {showEditCompanyModal && (
          <EditCompanyModal
            aux={aux}
            setAux={setAux}
            filaCompany={filaCompany}
            token={token}
            setShowEditCompanyModal={setShowEditCompanyModal}
          />
        )}
        {showDeleteConfirmation && companyName && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div
              className={`bg-white p-6 rounded-lg shadow-lg text-center sm:flex sm:flex-col ${
                window.innerWidth < 340 ? "max-w-sm" : "max-w-md"
              }`}
            >
              <p className="mb-4  sm:text-base">
                ¿Estás seguro de que deseas eliminar esta Empresa?
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
    return <p>cargando</p>;
  }
};

export default ControlCompany;
