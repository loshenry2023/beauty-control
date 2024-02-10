// hooks, routers, reducers:
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { clearUserId, deleteUser, getUserId } from "../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { Toaster, toast } from "react-hot-toast";
import EditModal from "./modals/EditModal.jsx";
import Loader from "./Loader.jsx";
import "./loading.css";

//icons
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { IoMdArrowRoundBack } from "react-icons/io";

//variables de entorno
import getParamsEnv from "../functions/getParamsEnv.js";
import ToasterConfig from "./Toaster.jsx";
const { USERPROFILES } = getParamsEnv();

const UserInfo = () => {
  const params = useParams();
  const detailId = params.id;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [loading, setLoading] = useState(true);

  const specialties = useSelector((state) => state?.specialties);
  const branches = useSelector((state) => state?.branches);
  const userID = useSelector((state) => state?.userID);
  const user = useSelector((state) => state?.user);

  const token = { token: user.token };
  const tokenID = user.token;

  useEffect(() => {
    dispatch(getUserId(detailId, token))
    .then(() => {setLoading(false)})
  }, [detailId]);

  const confirmDelete = (detailId) => {
    if (userID?.userName === "loshenry2023@gmail.com") {
      toast.error("Este usuario no puede ser eliminado");
    } else {
      setShowDeleteConfirmation(true);
    }
  };

  const deleteConfirmed = (confirmed) => {
    setShowDeleteConfirmation(false);
    if (confirmed) {
      dispatch(deleteUser(detailId, user.token));
      toast.success("Usuario eliminado correctamente");
      setTimeout(() => {
        navigate(USERPROFILES);
      }, 3000);
    }
  };

  const createdAtInBogotaTimezone = new Date(user.createdAt).toLocaleString(
    "en-US",
    {
      timeZone: "America/Bogota",
    }
  );

  const handleGoBack = () => {
    dispatch(clearUserId());
    navigate(USERPROFILES);
  };

  const especialidades = userID?.specialties;
  const sedes = userID?.branches;

    return (
      <>
        {loading ? <Loader /> : (
        <div className="relative w-full flex justify-center items-center dark:bg-darkBackground">
          <div className=" bg-secondaryColor border-4 border-black border-double mx-auto sm:w-3/5 lg:w-3/5 lg:grid lg:grid-cols-2 rounded-lg shadow-md shadow-secondaryColor dark:border-white dark:shadow-black dark:bg-darkPrimary ">
            <div className="flex items-center">
              <img
                className=" w-full shadow-md shadow-black rounded-xl border-secondaryColor object-cover sm:mx-2 sm:h-80"
                src={userID?.image}
              />
            </div>
            <div className="py-4 px-4 gap-2 bg-secondaryColor text-gray-800 flex flex-col sm:items-start sm:justify-between dark:bg-darkPrimary">
              <div className="flex gap-2">
                <IoMdArrowRoundBack
                  onClick={handleGoBack}
                  className="h-5 w-5 mt-1.5 cursor-pointer dark:text-darkText"
                />
                <h1 className="underline font-semibold text-2xl leading-tight dark:text-darkText">
                  {userID?.name} {userID?.lastName}
                </h1>
              </div>
              <h3 className="text-lg font-bold leading-tight dark:text-darkText">
                Usuario:{" "}
                <span className="text-md tracking-wide font-medium text-black">
                  {userID?.userName}
                </span>
              </h3>
              <h3 className="flex text-lg font-bold leading-tight dark:text-darkText">
                Rol:{" "}
                <span className="pl-1 text-md tracking-wide ">
                  {" "}
                  {userID?.role === "superAdmin" ? "Admin General" : `${userID.role .charAt(0).toUpperCase()}${userID.role .slice(1)}`}
                </span>
              </h3>
              <h3 className="text-lg leading-tight font-bold dark:text-darkText">
                Teléfono:{" "}
                <span className="text-md tracking-wide font-medium dark:text-darkText">
                  {userID?.phone1}
                </span>
              </h3>
              <h3 className="text-lg leading-tight font-bold dark:text-darkText">
                Email:{" "}
                <span className="text-md tracking-wide font-medium dark:text-darkText">
                  {" "}
                  {userID?.notificationEmail}{" "}
                </span>
              </h3>
              <h3 className="text-lg leading-tight font-bold dark:text-darkText">
                Comisión:{" "}
                <span className="text-md tracking-wide font-medium ">
                  {userID?.comission}%
                </span>
              </h3>
              <h3 className="text-lg leading-tight font-bold sm:text-base lg:text-lg dark:text-darkText">
                Especialidades:
                {especialidades &&
                  especialidades.map((specialt, index) => (
                    <span
                      className="text-md tracking-wide font-medium"
                      key={index}
                    >
                      {" "}
                      {specialt.specialtyName}
                    </span>
                  ))}
              </h3>
              <h3 className="text-lg leading-tight font-bold first-line: dark:text-darkText">
                Sede:{" "}
                <span className="text-md tracking-wide font-medium dark:text-darkText">
                  {sedes &&
                    sedes.map((sede, index) => (
                      <span
                        className="text-md tracking-wide font-medium"
                        key={index}
                      >
                        {" "}
                        {sede.branchName}
                      </span>
                    ))}
                </span>
              </h3>
              <h3 className="text-lg leading-tight font-bold dark:text-darkText">
                Fecha de creación:{" "}
                <span className="text-md tracking-wide font-medium ">
                  {createdAtInBogotaTimezone.split(",")[0]}
                </span>
              </h3>
              {user.role == "superAdmin" && (
                <div className="flex gap-5">
                  <MdEdit
                    onClick={() => setShowEditModal(true)}
                    className="h-6 w-6 hover:text-primaryPink hover:animate-bounce cursor-pointer delay-200 dark:text-darkText dark:hover:text-primaryPink"
                  />
                  <MdDelete
                    onClick={() => confirmDelete(detailId)}
                    className="h-6 w-6 hover:text-red-600 hover:animate-bounce cursor-pointer delay-200 dark:text-darkText dark:hover:text-red-600"
                  />
                </div>
              )}
            </div>
          </div>
        </div>)}

        {showEditModal ? (
          <EditModal
            setShowEditModal={setShowEditModal}
            specialties={specialties}
            branches={branches}
            userId={userID}
            tokenID={tokenID}
          />
        ) : null}

        {showDeleteConfirmation && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div
              className={`bg-white p-6 rounded-lg shadow-lg text-center sm:flex sm:flex-col ${
                window.innerWidth < 340 ? "max-w-sm" : "max-w-md"
              }`}
            >
              <p className="mb-4  sm:text-base">
                ¿Estás seguro de que deseas eliminar este usuario?
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
  } 


export default UserInfo;
