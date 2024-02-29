//hooks, reducer
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-hot-toast";
import { setTokenError } from "../redux/actions";

//components
import CreateCompanyModal from "./modals/CreateCompanyModal";
import EditCompanyModal from "./modals/EditCompanyModal";
import ErrorToken from "../views/ErrorToken";
import ToasterConfig from "./Toaster";
import Loader from "./Loader";

//icons
import { MdDeleteForever } from "react-icons/md";
import { IoIosAddCircle } from "react-icons/io";
import { FaCalendarPlus } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

//variables de entorno
import getParamsEnv from "../functions/getParamsEnv";
import Pagination from "./Pagination";
const { API_URL_BASE } = getParamsEnv();

const ControlCompany = () => {
  const [showCreateCompanyModal, setShowCreateCompanyModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showEditCompanyModal, setShowEditCompanyModal] = useState(false);
  const [filaCompany, setFilaCompany] = useState(null);
  const [companyName, setCompanyName] = useState(null);
  const [showExtendPlan, setShowExtendPlan] = useState(false);
  const [newFila, setFila] = useState({});
  const [loaderExtend, setLoaderExtend] = useState(false);

  const token = useSelector((state) => state?.token);
  const tokenError = useSelector((state) => state?.tokenError);
  const dispatch = useDispatch();
  const [aux, setAux] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [companies, setCompanies] = useState();
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");
  const actualDate = `${year}-${month}-${day}`;
  const startingDate = `${year}-01-01`;
  const [size, setSize] = useState(10);
  const [totalCount, setTotalCount] = useState(10);
  const [countParcial, setCountParcial] = useState(10);
  const [page, setPage] = useState(0);

  const [data, setData] = useState({
    dateCreateFrom: startingDate,
    dateCreateTo: actualDate,
    showExpired: 1,
    page: page,
    size: size,
    token: token,
  });

  let requestMade = false;
  useEffect(() => {
    if (!requestMade) {
      requestMade = true;
      axios
        .post(`${API_URL_BASE}/v1/companyadminlist`, data)
        .then((response) => {
          setCompanies(response.data);
          setTotalCount(response.data.countTotal);
          setCountParcial(response.data.countParcial)
          setIsLoading(false);
        })
        .catch((error) => {
          if (
            error.request.status === 401 ||
            error.request.status === 402 ||
            error.request.status === 403
          ) {
            setIsLoading(false);
            dispatch(setTokenError(error.request.status));
          } else {
            let errorMessage = "";
            if (!error.response) {
              errorMessage = error.message;
            } else {
              errorMessage = `${error.response.status} ${
                error.response.statusText
              } - ${error.response.data.split(":")[1]}`;
            }
            toast.error(errorMessage);
          }
        });
    }
  }, [aux, data]);

  useEffect(() => {
    if (!requestMade) {
      setData((prevData) => ({
        ...prevData,
        size: size,
        page: page,
      }));
    }
    setIsLoading(true);
  }, [size, page]);

  const handleDelete = async () => {
    try {
      const response = await axios.post(`${API_URL_BASE}/v1/companyadmindel`, {
        token,
        nameCompany: companyName,
      });
      if (response.data.deleted === "ok") {
        setAux(!aux);
        toast.success("Empresa eliminada exitosamente");

        setCompanyName(null);
      } else {
        toast.error("Hubo un problema al eliminar la empresa");
      }
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "An error occurred";
      toast.error(`Hubo un problema al eliminar la empresa. ${errorMessage}`);
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

  const handleData = (e) => {
    const { name, value } = e.target;
    setData((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
    setIsLoading(true);
  };

  const confirmExtendPlan = (fila) => {
    setFila(fila);
    setShowExtendPlan(true);
  };

  const extendConfirmed = (confirmed) => {
    if (confirmed) {
      extendPlan(newFila);
      setShowExtendPlan(false);
    } else {
      setShowExtendPlan(false);
    }
  };

  const extendPlan = (newFila) => {
    setLoaderExtend(true);
    // let modifiedDate = new Date(newFila.expireAt);

    let modifiedDate = new Date();
    modifiedDate.setDate(modifiedDate.getDate() + 30);
    let newDate = modifiedDate.toISOString().split("T")[0];

    const data = {
      nameCompany: newFila.nameCompany,
      expireAt: newDate,
      subscribedPlan: newFila.subscribedPlan,
      imgCompany: newFila.imgCompany,
      token: token,
    };

    axios
      .put(`${API_URL_BASE}/v1/companyadmin`, data)
      .then((respuesta) => setAux(!aux))
      .catch((error) => {
        const errorMessage = error.response
          ? error.response.data
          : "An error occurred";
      });

    setTimeout(() => {
      setLoaderExtend(false);
    }, 3000);
  };

  if (tokenError === 401 || tokenError === 402 || tokenError === 403) {
    return (
      <ErrorToken error={tokenError} />
    );
  } else {
    if (!isLoading) {
      return (
        <>
          <div
            className="flex flex-col gap-1"
            style={countParcial == 10 ? { height: "100vh" } : { height: `calc(100vh - 100px)` }}
          >
            <section className="flex flex-col w-4/5 gap-2 mx-auto sm:flex-row sm:justify-between sm:items-center mb-5">
              <div className="flex flex-col gap-1">
                <label className="hidden md:inline dark:text-darkText">
                  Filtrado por fecha de creación de empresa
                </label>
                <div className="flex flex-row gap-5">
                  <input
                    name="dateCreateFrom"
                    onChange={handleData}
                    type="date"
                    defaultValue={startingDate}
                    className="w-full text-center border rounded-md border-black px-2  sm:w-fit dark:invert"
                    onKeyDown={(e) => e.preventDefault()}
                  />
                  <input
                    name="dateCreateTo"
                    onChange={handleData}
                    type="date"
                    defaultValue={actualDate}
                    className="w-full text-center border rounded-md border-black px-2 sm:w-fit dark:invert"
                    onKeyDown={(e) => e.preventDefault()}
                  />
                </div>
              </div>
              <div className="mr-40 font-bold shadow-sm shadow-black border-black p-2 text-xl rounded-xl text-center dark:text-darkText dark:shadow-darkText">
                Total empresas: {totalCount}
              </div>
              <div className="flex justify-end">
                <select
                  onChange={handleData}
                  name="showExpired"
                  value={data.showExpired}
                  className="border border-black w-full rounded-md text-center px-2 dark:text-darkText dark:bg-darkPrimary sm:w-40 h-fit"
                >
                  <option value="1" className="text-center sm:text-left">
                    Todos los abonos
                  </option>
                  <option value="0" className="text-center  sm:text-left">
                    Abonos activos
                  </option>
                </select>
              </div>
            </section>
            <div className=" w-4/5  mx-auto relative overflow-x-auto sm:rounded-lg"> 
              <table className="w-full text-left text-black dark:text-beige dark:border-beige dark:border">
                <thead className="bg-controlColor text-black text-left dark:bg-darkPrimary dark:text-darkText dark:border-secondaryColor">
                  <tr>
                    <th scope="col" className="px-4 py-3">
                      Nombre empresa
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Administrador general
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Imagen
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Plan actual
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Finalización del plan
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Estado del plan
                    </th>
                    <th scope="col" className="px-4 py-1">
                      <button
                        className="flex flex-row gap-1 p-2 rounded-full hover:bg-primaryPink hover:text-black dark:hover:bg-darkText"
                        onClick={handleShowCreateModal}
                      >
                        <IoIosAddCircle size={20} /> Agregar
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {companies &&
                    companies.rows
                      // .slice()
                      .sort((a, b) =>
                        a.nameCompany.localeCompare(b.CompanyName)
                      )
                      .map((fila, index) => (
                        <tr
                          key={index}
                          className="group border border-secondaryColor hover:bg-gray-200 transition-colors duration-700 dark:hover:bg-gray-200 dark:hover:text-black"
                        >
                          <td className="px-4">{fila.nameCompany}</td>
                          <td className="px-4">{fila.firstUser}</td>
                          <td className="px-4">
                            <img
                              className="h-8 w-8 rounded-2xl"
                              src={fila.imgCompany}
                              alt="imagen_empresa"
                            />
                          </td>
                          <td className="px-4">{fila.subscribedPlan}</td>
                          <td className="px-4 py-4 flex flex-row items-center mt-1.5 gap-5">
                            {!loaderExtend ? (
                              <>
                                {fila.expireAt.split("T")[0]}{" "}
                                <FaCalendarPlus
                                  onClick={() => confirmExtendPlan(fila)}
                                  className="cursor-pointer mt-0.5"
                                />
                              </>
                            ) : (
                              <div className="mt-2 flex items-center text-xl dark:text-darkText">
                                <div role="status">
                                  <svg
                                    aria-hidden="true"
                                    class="w-6 h-6 me-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-500"
                                    viewBox="0 0 100 101"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                      fill="currentColor"
                                    />
                                    <path
                                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                      fill="currentFill"
                                    />
                                  </svg>
                                  <span className="sr-only">Loading...</span>
                                </div>
                                <span className="text-sm">
                                  {" "}
                                  Actualizando planes...{" "}
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="w-26 px-4 py-4">
                            {actualDate < fila.expireAt.split("T")[0] && (
                              <span className="border rounded-2xl shadow-black shadow-sm bg-green-600 text-center p-2 px-4 dark:shadow-darkText">
                                {" "}
                                Activo{" "}
                              </span>
                            )}
                            {actualDate > fila.expireAt.split("T")[0] && (
                              <span className="border rounded-2xl shadow-black shadow-sm bg-red-600 text-center p-2 dark:shadow-darkText">
                                {" "}
                                Expirado{" "}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <button
                              className=" hover:bg-blue-700 text-black px-2 py-1 rounded mr-2"
                              onClick={() => handleEditCompanyModal(fila)}
                            >
                              <MdEdit
                                size={25}
                                className="dark:text-darkText group-hover:text-black dark:group-hover:text-black"
                              />
                            </button>
                            <button
                              className=" hover:bg-red-700 text-black px-2 py-1 rounded"
                              onClick={() =>
                                handleDeleteModal(fila.nameCompany)
                              }
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
            <div className="mt-[-30px]">
              <Pagination
                page={page}
                setPage={setPage}
                size={size}
                setSize={setSize}
                count={totalCount}
                data={data}
              />
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
                  ¿Estás seguro de que deseas eliminar esta empresa?
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
          {showExtendPlan && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div
                className={`bg-white p-6 rounded-lg shadow-lg text-center sm:flex sm:flex-col ${
                  window.innerWidth < 340 ? "max-w-sm" : "max-w-md"
                }`}
              >
                <p className="mb-4  sm:text-base">
                  ¿Estás seguro de que deseas extender el abono por 30 días?
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => extendConfirmed(true)}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600  sm:text-base"
                  >
                    Aceptar
                  </button>
                  <button
                    onClick={() => extendConfirmed(false)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600  sm:text-base"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      );
    } else {
      return (
        <div
          className="flex justify-center items-center"
          style={{ height: `calc(100vh - 100px)` }}
        >
          <Loader />
        </div>
      );
    }
  }
};

export default ControlCompany;
