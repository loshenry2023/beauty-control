import React, { useEffect, useState } from "react";

// hooks, routers, reducers:
import HistoryServices from "./HistoryServices";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

//components
import Loader from "./Loader.jsx";
import { clearClientId, getClientId } from "../redux/actions.js";

//icons
import { IoMdArrowRoundBack } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";

//variables de entorno
import getParamsEnv from "../functions/getParamsEnv.js";
import HistoryCalendar from "./HistoryCalendar.jsx";
import axios from "axios";
import ToasterConfig from "./Toaster.jsx";
import { toast } from "react-hot-toast";
import EditClient from "./modals/EditClient.jsx";
import converterGMT from "../functions/converteGMT.js";
const { CLIENTSPROFILES, API_URL_BASE } = getParamsEnv();


const ClientInfo = () => {
  const params = useParams();
  const detailId = params.id;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const token = useSelector(state => state?.token)
  const clientInfo = useSelector(state => state?.clientID)
  const user = useSelector(state => state?.user)
  const [clientRender, setClientRender] = useState(false)


  useEffect(() => {
    dispatch(getClientId(detailId, { token: token }))
      .then(() => { setLoading(false) })
  }, [detailId, clientRender]);

  const handleGoBack = () => {
    dispatch(clearClientId());
    navigate(CLIENTSPROFILES);
  };

  const handleShowHistory = () => {
    setShowHistory(!showHistory)
    if (showCalendar === true) {
      setShowCalendar(!showCalendar)
    }
  }

  const handleShowCalendar = () => {
    setShowCalendar(!showCalendar)
    if (showHistory === true) {
      setShowHistory(!showHistory)
    }
  }

  const handleShowEditModal = () => {
    setShowEditModal(true)
  }

  const confirmDelete = () => {
    setShowDeleteConfirmation(true);
  }

  const deleteConfirmed = async (confirmed) => {
    setShowDeleteConfirmation(true);
    if (confirmed) {
      const deletedClient = await axios.post(`${API_URL_BASE}/deleteclient/${detailId}`, { token: token })
      toast.success("Cliente eliminado correctamente");
      setTimeout(() => {
        navigate(CLIENTSPROFILES);
      }, 3000);
    } else {
      setShowDeleteConfirmation(false);
    }
  }
  return (
    <>
      {loading ? <Loader /> : (
        <section className="flex flex-col w-full items-center">
          <div className="relative max-w-screen-sm h-fit mt-10 rounded overflow-hidden shadow-md shadow-black mx-auto">
            <div className="absolute top-0 right-0 mt-1 flex flex-col-reverse sm:flex sm:flex-row">
              <MdEdit
                onClick={handleShowEditModal}
                className="h-8 w-8 hover:text-primaryPink hover:animate-bounce cursor-pointer delay-200 dark:text-darkText dark:hover:text-primaryPink"
              />
              {user.role !== "superAdmin" ? null :
              <MdDelete
                onClick={confirmDelete} className="h-8 w-8 hover:text-red-600 hover:animate-bounce cursor-pointer delay-200 dark:text-darkText dark:hover:text-red-600"
              /> }
            </div>
            <IoMdArrowRoundBack onClick={handleGoBack} className="m-1 absolute top-0 left-0 cursor-pointer h-8 w-8 text-primaryPink  dark:text-darkText" />

            <div className="mx-auto grid grid-1 place-items-center mt-5 sm:place-items-start sm:grid-cols-3 sm:p-5">
              <img
                className="w-40 shadow shadow-black rounded-full sm:col-span-1 sm:w-full "
                src={clientInfo.image}
                alt="client-photo"
              />
              <div className="m-4 sm:col-span-2 sm:ml-10 sm:mt-0 ">
                <p className="text-md tracking-wide font-medium dark:text-darkText"> <span className="font-bold dark:text-darkText">Nombre:</span> {clientInfo.name}</p>
                <p className="text-md tracking-wide font-medium dark:text-darkText"> <span className="font-bold dark:text-darkText">Apellido:</span> {clientInfo.lastName}</p>
                <p className="text-md tracking-wide font-medium dark:text-darkText"><span className="font-bold dark:text-darkText">Email:</span> {clientInfo.email}</p>
                <p className="text-md tracking-wide font-medium dark:text-darkText"> <span className="font-bold dark:text-darkText">Fecha de nacimiento:</span> {clientInfo.birthday ? <span className='font-medium'>{converterGMT(clientInfo.birthday).split(" ")[0]} </span> : <span className='font-light'> - </span>}</p>
                <p className="text-md tracking-wide font-medium dark:text-darkText"> <span className="font-bold dark:text-darkText">ID:</span> {clientInfo.id_pers ? <span className='font-medium'>{clientInfo.id_pers} </span> : <span className='font-light'> - </span>}</p>
                <p className="text-md tracking-wide font-medium dark:text-darkText"><span className="font-bold dark:text-darkText">Teléfono:</span> {clientInfo.phoneNumber1}</p>
                <p className="text-md tracking-wide font-medium dark:text-darkText"><span className="font-bold dark:text-darkText">Teléfono secundario: </span> {clientInfo.phoneNumber2 ? clientInfo.phoneNumber2 : "-"}</p>
                <div className="flex flex-row gap-5 mt-2">
                  <button onClick={handleShowHistory} className="cursor-pointer rounded shadow-sm p-2 my-1 hover:bg-secondaryColor transition-colors duration-700 shadow-black bg-primaryPink dark:bg-darkPrimary dark:text-darkText dark:hover:bg-zinc-800">Procedimientos anteriores</button>
                  <button onClick={handleShowCalendar} className="cursor-pointer rounded shadow-sm p-2 my-1 hover:bg-secondaryColor transition-colors duration-700 shadow-black bg-primaryPink dark:bg-darkPrimary dark:text-darkText dark:hover:bg-zinc-800">Turnos anteriores</button>
                </div>
                <div className="flex gap-5 pt-2">
                </div>
              </div>
            </div>
          </div>
          {showEditModal ? <EditClient setClientRender={setClientRender} clientRender={clientRender} clientInfo={clientInfo} setShowEditModal={setShowEditModal} detailId={detailId} /> : null}
          {showHistory ? <HistoryServices history={clientInfo.HistoryServices} /> : null}
          {showCalendar ? <HistoryCalendar calendars={clientInfo.Calendars} /> : null}
        </section>)}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className={`bg-white p-6 rounded-lg shadow-lg text-center sm:flex sm:flex-col ${window.innerWidth < 340 ? "max-w-sm" : "max-w-md"
              }`}
          >
            <p className="mb-4  sm:text-base">
              ¿Estás seguro de que deseas eliminar este cliente?
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
};

export default ClientInfo;
