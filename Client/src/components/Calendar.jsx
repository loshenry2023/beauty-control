import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { generateDate, months } from "../functions/calendar";
import cn from "../functions/cn";
import converterGMT from "../functions/converteGMT";
import converter12Hrs from "../functions/converte12Hrs";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import Loader from "../components/Loader";
import EditAppointment from "./modals/EditAppoinment";
import { Link } from "react-router-dom";
import getParamsEnv from "../functions/getParamsEnv";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";

//icons
import { FaEye } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { getCalendar, getspecialists } from "../redux/actions";

const { API_URL_BASE, DATEDETAILBASE } = getParamsEnv();

const Calendar = ({
  setDateInfo,
  services,
  users,
  setSpecialty,
  branches,
  refrescarCita,
  setRefrescarCita,
  user,
  dateInfo,
  setShowEditAppointment,
  showEditAppointment,
  setLoadingToProps,
  loadingToProps
}) => {
  const dispatch = useDispatch();

  const [date, setDate] = useState({});
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [citaId, setCitaId] = useState(null);
  
  const days = ["D", "L", "M", "M", "J", "V", "S"];
  const currentDate = dayjs();
  const workingBranch = useSelector((state) => state?.workingBranch);
  const specialists = useSelector((state) => state?.specialists);
  const workingBranchID = workingBranch.id;
  const branchWorking= workingBranch.branchName;
  const token = useSelector((state) => state?.token);
  const calendar = useSelector((state) => state?.calendar);
  const [today, setToday] = useState(currentDate);
  const [selectDate, setSelectDate] = useState(currentDate);
  const [userId, setUserId] = useState(
    user.role === "especialista" ? user.id : ""
  );
  const [branch, setBranch] = useState(workingBranchID);
  const dateNow = new Date();
  const day =
    dateNow.getDate() < 10 ? `0${dateNow.getDate()}` : dateNow.getDate();
  const month =
    dateNow.getMonth() + 1 < 10
      ? `0${dateNow.getMonth() + 1}`
      : dateNow.getMonth() + 1;
  const firstDateFrom = `${dateNow.getFullYear()}-${month}-${day} 00:00:00`;
  const firstDateTo = `${dateNow.getFullYear()}-${month}-${day} 23:59:59`;
  const [dateFrom, setDateFrom] = useState(firstDateFrom);
  const [dateTo, setDateTo] = useState(firstDateTo);
  const [dayRange, setDayRange] = useState(
    `${dateNow.getFullYear()}-${month}-${day}`
  );
  const [activeButton, setactiveButton] = useState({
    range1: false,
    range2: false,
    range3: false,
  });
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formatedDate = selectDate.toDate().toLocaleDateString("es-ES", options);
  const capitalizedDate = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  const [effectControl, setEffectControl] = useState(false);

  const range = [
    { hourFrom: "06:00:00", hourTo: "09:59:59" },
    { hourFrom: "10:00:00", hourTo: "13:59:59" },
    { hourFrom: "14:00:00", hourTo: "20:00:00" },
  ];

  const handleDelete = async () => {
    try {
      const response = await axios.post(
        `${API_URL_BASE}/v1/deletecalendar/${citaId}`,
        { token }
      );
      if (response.data.deleted === "ok") {
        toast.success("Cita eliminada exitosamente");

        setCitaId(null);
      } else {
        toast.error("Hubo un problema con la creación");
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error.response
        ? error.response.data
        : "An error occurred";
      toast.error(`Hubo un problema con la creacion. ${errorMessage}`);
    }
  };

  let requestMade = false;
  useEffect(() => {
    // dispatch(getspecialists(branchWorking, { token: token }));
    // setEffectControl(true);
    // dispatch(getCalendar(branch, dateFrom, dateTo, userId, { token: token }));
    // setLoading(false);
    // if (showEditAppointment) {
    //   setSpecialty(date.User.Specialties[0].specialtyName);
    // }else {
    // setSpecialty(dateInfo.service.specialtyName);
    // }
    // setEffectControl(false);
    if (!requestMade) { // evito llamados en paralelo al pedir los datos iniciales
      requestMade = true;
      axios.post(API_URL_BASE + "/v1/specialists?branchWorking=" + branchWorking.branchName, { token })
        .then(respuesta => {
          dispatch(getspecialists(respuesta.data)); 
          return axios.post(API_URL_BASE + `/v1/getcalendar?branch=${branch}&dateFrom=${dateFrom}&dateTo=${dateTo}&userId=${userId}`, { token });
        })
        .then(respuesta2 => {
          dispatch(getCalendar(respuesta2.data));
          setLoadingToProps(false);
          if (showEditAppointment) {
            setSpecialty(date.User.Specialties[0].specialtyName);
          }else {
          setSpecialty(dateInfo.service.specialtyName);
          }
          setEffectControl(false);
        })
        .catch(error => {
          // PENDIENTE - HACER UN MEJOR MANEJO DE ERRORES:
          let msg = '';
          if (!error.response) {
            msg = error.message;
          } else {
            msg = "Error fetching data: " + error.response.status + " - " + error.response.data;
          }
          console.log("ERROR!!! " + msg);
        });
  }}, [
    workingBranch.id,
    dateFrom,
    dateTo,
    citaId,
    refrescarCita,
    showEditAppointment,
    userId
  ]);

  const handleShowEditAppointment = (date) => {
    const parsedDate = JSON.parse(date);
    setDate(parsedDate);
    setShowEditAppointment(true);
  };

 

  const handleModal = (id) => {
    setCitaId(id);
    setShowDeleteConfirmation(true);
  };

  const hideDeleteModal = () => {
    setShowDeleteConfirmation(false);
  };

  const deleteConfirmed = (confirmed) => {
    if (confirmed) {
      hideDeleteModal();
      handleDelete();
    } else {
      hideDeleteModal();
    }
  };

  return (
    <div >
      {loadingToProps ? (
        <Loader />
      ) : (
        <div className="mt-10  flex flex-col gap-10 justify-center items-center w-full sm:w-full xl:flex-row">
          <div className="w-72 sm:w-96 sm:h-96 md:w-[550px]">
            <div className="flex justify-between items-center scale-90">
              <h2 className="text-xl select-none font-semibold dark:text-darkText">
                {months[today.month()]}, {today.year()}
              </h2>
              <div className="flex gap-10 items-center ">
                <GrFormPrevious
                  className="w-5 h-5 cursor-pointer hover:scale-105 transition-all dark:text-darkText"
                  onClick={() => {
                    setToday(today.month(today.month() - 1));
                  }}
                />
                <h2
                  className="text-xl cursor-pointer hover:scale-105 transition-all dark:text-darkText"
                  onClick={() => {
                    setToday(currentDate);
                  }}
                >
                  Hoy
                </h2>
                <GrFormNext
                  className="w-5 h-5 cursor-pointer hover:scale-105 transition-all dark:text-darkText"
                  onClick={() => {
                    setToday(today.month(today.month() + 1));
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-7 scale-90">
              {days.map((day, index) => {
                return (
                  <h1
                    key={index}
                    className="ml-3 text-center h-14 w-14 grid place-content-center text-gray-500 select-none"
                  >
                    {day}
                  </h1>
                );
              })}
            </div>

            <div className=" grid grid-cols-7 scale-90 mb-0 ">
              {generateDate(today.month(), today.year()).map(
                ({ date, currentMonth, today }, index) => {
                  return (
                    <div
                      key={index}
                      className="font-medium p-2 text-center h-14 grid place-content-center text-sm border-t dark:text-darkText"
                    >
                      <h1
                        className={cn(
                          currentMonth ? "" : "text-gray-400",
                          today ? "bg-red-600 text-white " : "",
                          selectDate.toDate().toDateString() ===
                            date.toDate().toDateString()
                            ? "bg-black text-white dark:bg-darkText dark:text-black"
                            : "",
                          "h-10 w-10 rounded-full grid place-content-center hover:bg-black hover:text-white dark:hover:bg-darkText dark:hover:text-black file:transition-all cursor-pointer select-none"
                        )}
                        onClick={() => {
                          setSelectDate(date);
                          let day = `${date.$y}-${
                            date.$M + 1 < 10 ? `0${date.$M + 1}` : date.$M + 1
                          }-${date.$D < 10 ? `0${date.$D}` : date.$D}`;
                          setDateFrom(`${day} 00:00:00`);
                          setDateTo(`${day} 23:59:59`);
                          setDayRange(day);
                          setactiveButton({
                            range1: false,
                            range2: false,
                            range3: false,
                          });
                          setDateInfo((prevInfo) => ({
                            ...prevInfo,
                            dateTime: date,
                          }));
                        }}
                      >
                        {date.date()}
                      </h1>
                    </div>
                  );
                }
              )}
            </div>
          </div>
          <div className="flex flex-col w-72 sm:px-5 overflow-auto sm:w-96 sm:h-96 md:w-[600px]">
            {/* // se pued eponer mas con h-full // */}
            <h2 className="text-2xl font-semibold mb-2 dark:text-darkText">
              {capitalizedDate(formatedDate)} 
            </h2>
            <p className="text-sm dark:text-darkText"> Los rangos horarios son de uso exclusivo para filtrar citas</p>
            <div className="flex flex-row gap-2 mt-0.5 mb-3">
              <button
                onClick={
                  activeButton.range1
                    ? () => {
                        setDateFrom(`${dayRange} 00:00:00`);
                        setDateTo(`${dayRange} 23:59:59`);
                        setactiveButton({
                          range1: false,
                          range2: false,
                          range3: false,
                        });
                      }
                    : () => {
                        setDateFrom((prevDateFrom) => {
                          const newDateFrom = `${dayRange} ${range[0].hourFrom}`;
                          return newDateFrom;
                        });

                        setDateTo((prevDateTo) => {
                          const newDateTo = `${dayRange} ${range[0].hourTo}`;
                          return newDateTo;
                        });
                        setactiveButton({
                          range1: true,
                          range2: false,
                          range3: false,
                        });
                      }
                }
                className={
                  activeButton.range1
                    ? "focus:ring-[3px] ring-black focus:border-none border border-black px-1 rounded-md dark:text-darkText dark:border dark:border-beige dark:bg-darkPrimary"
                    : "border border-black px-1 rounded-md dark:text-darkText dark:border dark:border-beige dark:bg-darkPrimary"
                }
              >
                6:00 AM - 10:00 AM
              </button>

              <button
                onClick={
                  activeButton.range2
                    ? () => {
                        setDateFrom(`${dayRange} 00:00:00`);
                        setDateTo(`${dayRange} 23:59:59`);

                        setactiveButton({
                          range1: false,
                          range2: false,
                          range3: false,
                        });
                      }
                    : () => {
                        setDateFrom((prevDateFrom) => {
                          const newDateFrom = `${dayRange} ${range[1].hourFrom}`;
                          return newDateFrom;
                        });

                        setDateTo((prevDateTo) => {
                          const newDateTo = `${dayRange} ${range[1].hourTo}`;
                          return newDateTo;
                        });
                        setactiveButton({
                          range1: false,
                          range2: true,
                          range3: false,
                        });
                      }
                }
                className={
                  activeButton.range2
                    ? "focus:ring-[3px] ring-black focus:border-none border border-black px-1 rounded-md dark:text-darkText dark:border dark:border-beige dark:bg-darkPrimary"
                    : "border border-black px-1 rounded-md dark:text-darkText dark:border dark:border-beige dark:bg-darkPrimary"
                }
              >
                10:00 AM - 2:00 PM
              </button>

              <button
                onClick={
                  activeButton.range3
                    ? () => {
                        setDateFrom(`${dayRange} 00:00:00`);
                        setDateTo(`${dayRange} 23:59:59`);
                        setactiveButton({
                          range1: false,
                          range2: false,
                          range3: false,
                        });
                      }
                    : () => {
                        setDateFrom((prevDateFrom) => {
                          const newDateFrom = `${dayRange} ${range[2].hourFrom}`;
                          return newDateFrom;
                        });

                        setDateTo((prevDateTo) => {
                          const newDateTo = `${dayRange} ${range[2].hourTo}`;
                          return newDateTo;
                        });
                        setactiveButton({
                          range1: false,
                          range2: false,
                          range3: true,
                        });
                      }
                }
                className={
                  activeButton.range3
                    ? "focus:ring-[3px] ring-black focus:border-none border border-black px-1 rounded-md dark:text-darkText dark:border dark:border-beige dark:bg-darkPrimary"
                    : "border border-black px-1 rounded-md dark:text-darkText dark:border dark:border-beige dark:bg-darkPrimary"
                }
              >
                2:00 PM - 8:00 PM
              </button>
            </div>
            <div>
            {user.role === "especialista" ? (
              <></>
            ) : (
              <div>
                <select
                  name="specialists"
                  id=""
                  className="w-60 border border-black rounded-md text-md dark:text-darkText dark:bg-darkPrimary md:w-fit"
                  onChange={(e) => {setUserId(e.target.value)}}
                >
                  <option value=""> -- Mostrar agendas especialistas --  </option>
                  {specialists.map((specialis, index) => (
                    <option key={index} value={specialis.id}>
                      {`${specialis.name} ${specialis.lastName}`}
                    </option>
                  ))}
                </select>
              </div>
            )}
              </div>
            {calendar.length === 0 && (
              <h4 className="font-medium mt-2 text-xl dark:text-darkText">
                Sin turnos hasta el momento
              </h4>
            )}
            {calendar.map((cita, index) => {
              return (
                cita.Client === null ? null :
                <div
                  key={index}
                  className={
                    cita.current === true
                      ? "border p-1 shadow shadow-black rounded-lg mt-2 hover:scale-[1.01] dark:bg-darkPrimary dark:border-none"
                      : "bg-secondaryColor  shadow shadow-black p-1 border-black mt-2 rounded-lg dark:bg-red-950 cursor-not-allowed"
                  }
                >
                  <div className="flex flex-col">
                    <div className="flex flex-row justify-between">
                      <h5 className="text-md font-medium tracking-wide dark:text-darkText underline underline-offset-2">
                        {" "}
                        {converter12Hrs(cita.date_from.split(" ")[1].slice(0, 5))} -{" "}
                        {converter12Hrs(cita.date_to.split(" ")[1].slice(0, 5))}
                        <span>
                          {" "}
                          - {cita.Client.name} {cita.Client.lastName}
                        </span>
                      </h5>
                      {cita.current === false ? null : (
                        <div className="flex pt-[6px] gap-2">
                          <Link to={`${DATEDETAILBASE}/${cita.id}`}>
                            <FaEye
                              className={
                                user.role === "especialista"
                                  ? "hover:scale-125 hover:text-blue-500 cursor-pointer delay-200 dark:text-darkText dark:hover:text-blue-500 mr-2"
                                  : "hover:scale-125 hover:text-blue-500 cursor-pointer delay-200 dark:text-darkText dark:hover:text-blue-500"
                              }
                            />
                          </Link>
                          {user.role === "especialista" ? null : (
                            <>
                              <MdEdit
                                onClick={() =>
                                  handleShowEditAppointment(
                                    JSON.stringify(cita)
                                  )
                                }
                                className="hover:scale-125 hover:text-primaryPink cursor-pointer delay-200 dark:text-darkText dark:hover:text-primaryPink"
                              />
                              <MdDelete
                                onClick={() => handleModal(cita.id)}
                                className="hover:scale-125 hover:text-red-500 cursor-pointer delay-200 dark:text-darkText dark:hover:text-red-500"
                              />
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    <p className="text-md tracking-wide font-medium dark:text-darkText">
                      {" "}
                      <span className="font-bold">Especialista:</span>{" "}
                      {cita.User === null
                        ? "Error en la carga de especialista"
                        : `${cita.User.name} ${cita.User.lastName}`}
                    </p>
                    <p className="text-md tracking-wide font-medium dark:text-darkText">
                      <span className="font-bold">Procedimiento:</span>{" "}
                      {cita.Service === null
                        ? "Error en la carga de procedimiento. Llamar cliente"
                        : cita.Service.serviceName}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {showDeleteConfirmation && citaId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className={`bg-white p-6 rounded-lg shadow-lg text-center sm:flex sm:flex-col ${
              window.innerWidth < 340 ? "max-w-sm" : "max-w-md"
            }`}
          >
            <p className="mb-4 text-sm sm:text-base">
              ¿Estás seguro de que deseas eliminar esta cita?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => deleteConfirmed(true)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm sm:text-base"
              >
                Aceptar
              </button>
              <button
                onClick={() => deleteConfirmed(false)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm sm:text-base"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      {showEditAppointment && date && (
        <EditAppointment
          token={token}
          setShowEditAppointment={setShowEditAppointment}
          citaId={citaId}
          date={date}
          branches={branches}
          services={services}
          users={users}
          setRefrescarCita={setRefrescarCita}
          refrescarCita={refrescarCita}
          setSpecialty={setSpecialty}
        />
      )}
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{
          zIndex: 1000,
          marginTop: "20px",
          height: "150px",
        }}
        toastOptions={{
          className: "",
          duration: 3000,
          style: {
            background: "#ffc8c8",
            color: "#363636",
          },

          success: {
            duration: 3000,
            theme: {
              primary: "green",
              secondary: "black",
            },
            style: {
              background: "#00A868",
              color: "#FFFF",
            },
          },

          error: {
            duration: 3000,
            theme: {
              primary: "pink",
              secondary: "black",
            },
            style: {
              background: "#C43433",
              color: "#fff",
            },
          },
        }}
      />
    </div>
  );
};

export default Calendar;
