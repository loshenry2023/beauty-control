import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { generateDate, months } from "../functions/calendar";
import cn from "../functions/cn";
import converterGMT from "../functions/converteGMT";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import Loader from "../components/Loader";
import EditAppointment from "./modals/EditAppoinment";
import { Link } from "react-router-dom";
import getParamsEnv from '../functions/getParamsEnv';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios'

//icons
import { FaEye } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { getCalendar } from "../redux/actions";


const { API_URL_BASE, DATEDETAILBASE } = getParamsEnv();

const Calendar = ({setDateInfo, services, users, setSpecialty, branches, refrescarCita, setRefrescarCita, chosenClient, user, setSelectServices}) => {
  const dispatch = useDispatch();

  const [date, setDate] = useState({})
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [citaId, setCitaId] = useState(null)
  const [showEditAppointment, setShowEditAppointment] = useState(false)
  const days = ["D", "L", "M", "M", "J", "V", "S"];
  const currentDate = dayjs();
  const workingBranch = useSelector((state) => state?.workingBranch);
  const workingBranchID = workingBranch.id;
  const token = useSelector((state) => state?.token);
  const calendar = useSelector((state) => state?.calendar);
  const [today, setToday] = useState(currentDate);
  const [selectDate, setSelectDate] = useState(currentDate);
  const [userId, setUserId] = useState(user.role === "especialista" ? user.id : "")
  const [branch, setBranch] = useState(workingBranchID);
  const [loading, setLoading] = useState(true);
  const dateNow = new Date();
  const day = dateNow.getDate() < 10 ? `0${dateNow.getDate()}` : dateNow.getDate();
  const month =
    dateNow.getMonth() + 1 < 10
      ? `0${dateNow.getMonth() + 1}`
      : dateNow.getMonth() + 1;
  const firstDateFrom = `${dateNow.getFullYear()}-${month}-${day} 00:00:00`;
  const firstDateTo = `${dateNow.getFullYear()}-${month}-${day} 23:59:59`;
  const [dateFrom, setDateFrom] = useState(firstDateFrom);
  const [dateTo, setDateTo] = useState(firstDateTo);
  const [dayRange, setDayRange] = useState(`${dateNow.getFullYear()}-${month}-${day}`);
  const [activeButton, setactiveButton] = useState({
    range1: false,
    range2: false,
    range3: false,
  });
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formatedDate = selectDate.toDate().toLocaleDateString('es-ES', options);
  const capitalizedDate = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  const [effectControl, setEffectControl] = useState(false)

  const range = [
    { hourFrom: "06:00:00", hourTo: "09:59:59" },
    { hourFrom: "10:00:00", hourTo: "13:59:59" },
    { hourFrom: "14:00:00", hourTo: "18:59:59" },
  ];

  const handleDelete = async () => {
    try {
      const response = await axios.post(`${API_URL_BASE}/deletecalendar/${citaId}`, { token });
      if (response.data.deleted === "ok") {
      toast.success("Cita eliminada exitosamente");
  
      
      setCitaId(null);
      } else {
      toast.error("Hubo un problema con la creación");
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error.response ? error.response.data : 'An error occurred';
      toast.error(`Hubo un problema con la creacion. ${errorMessage}`);
    }
    };
  
    
  useEffect(() => {

    if(!effectControl){
     
      setEffectControl(true)
      dispatch(getCalendar(branch, dateFrom, dateTo, userId, { token: token })).then(
        setLoading(false)
      );
      setEffectControl(false)
      
    }
    if (showEditAppointment){
      setSpecialty(date.User.Specialties[0].specialtyName)
      setSelectServices(false)
    } else {
      setSpecialty("noneSpecialty")
      setSelectServices(true)
    }

    
  }, [workingBranch.id, dateFrom, dateTo, citaId, refrescarCita, showEditAppointment]);

  const handleShowEditAppointment = (date) => {
    
    const parsedDate = JSON.parse(date)
    
    setDate(parsedDate)
    setShowEditAppointment(true)
    
    }

    const hideDeleteModal = () => {
      setShowDeleteConfirmation(false);
    };

    const handleModal = (id) => {
      setCitaId(id)
        setShowDeleteConfirmation(true);
      };

      const deleteConfirmed = (confirmed) => {
        if (confirmed) {
          hideDeleteModal();
          handleDelete()
        } else {
          hideDeleteModal();
        }
      };


  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="flex flex-col gap-10 justify-center items-center w-full sm:w-1/2 xl:flex-row">
          <div className="w-72 sm:w-96 sm:h-96 md:w-[500px]">
            <div className="flex justify-between items-center">
              <h1 className="select-none font-semibold dark:text-darkText">
                {months[today.month()]}, {today.year()}
              </h1>
              <div className="flex gap-10 items-center ">
                <GrFormPrevious
                  className="w-5 h-5 cursor-pointer hover:scale-105 transition-all dark:text-darkText"
                  onClick={() => {
                    setToday(today.month(today.month() - 1));
                  }}
                />
                <h1
                  className=" cursor-pointer hover:scale-105 transition-all dark:text-darkText"
                  onClick={() => {
                    setToday(currentDate);
                  }}
                >
                  Hoy
                </h1>
                <GrFormNext
                  className="w-5 h-5 cursor-pointer hover:scale-105 transition-all dark:text-darkText"
                  onClick={() => {
                    setToday(today.month(today.month() + 1));
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-7 ">
              {days.map((day, index) => {
                return (
                  <h1
                    key={index}
                    className="text-sm text-center h-14 w-14 grid place-content-center text-gray-500 select-none"
                  >
                    {day}
                  </h1>
                );
              })}
            </div>

            <div className=" grid grid-cols-7 ">
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
                          let day = `${date.$y}-${date.$M + 1 < 10 ? `0${date.$M + 1}` : date.$M + 1
                            }-${date.$D < 10 ? `0${date.$D}` : date.$D}`;
                          setDateFrom(`${day} 00:00:00`);
                          setDateTo(`${day} 23:59:59`);
                          setDayRange(day);
                          setactiveButton({ range1: false, range2: false, range3: false });
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
          <div className="w-72 h-72 sm:px-5 overflow-auto sm:w-96 sm:h-96 md:w-[500px]">
            {/* // se pued eponer mas con h-full // */}
            <h1 className="font-semibold mb-2 dark:text-darkText">
              {capitalizedDate(formatedDate)}
            </h1>
            <div className="flex flex-row gap-2">
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
                    ? "focus:ring-4 ring-primaryPink focus:border-none border border-black px-1 rounded-md dark:text-darkText dark:border dark:border-beige dark:bg-darkPrimary"
                    : "border border-black px-1 rounded-md dark:text-darkText dark:border dark:border-beige dark:bg-darkPrimary"
                }
              >
                06:00 a 10:00
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
                    ? "focus:ring-4 ring-primaryPink focus:border-none border border-black px-1 rounded-md dark:text-darkText dark:border dark:border-beige dark:bg-darkPrimary"
                    : "border border-black px-1 rounded-md dark:text-darkText dark:border dark:border-beige dark:bg-darkPrimary"
                }
              >
                10:00 a 14:00
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
                    ? "focus:ring-4 ring-primaryPink focus:border-none border border-black px-1 rounded-md dark:text-darkText dark:border dark:border-beige dark:bg-darkPrimary"
                    : "border border-black px-1 rounded-md dark:text-darkText dark:border dark:border-beige dark:bg-darkPrimary"
                }
              >
                14:00 a 19:00
              </button>
            </div>
            {calendar.length === 0 && (
              <h4 className="mt-2 font-medium text-xl dark:text-darkText">Sin turnos hasta el momento</h4>
            )}
            {calendar.map((cita, index) => {
              return (
                <div
                  key={index}
                  className={
                    cita.current === true
                      ? "border p-1 shadow shadow-black rounded-lg mt-2 hover:scale-105 dark:bg-darkPrimary dark:border-none"
                      : "bg-red-100 p-1 border-black mt-2 rounded-lg hover:scale-105 dark:bg-red-950" 
                  }
                >
                  <div className="flex flex-col">
                    <div className="flex flex-row justify-between">
                      <h5 className="text-md font-medium tracking-wide dark:text-darkText underline underline-offset-2">
                        {" "}
                        {cita.date_from.split(" ")[1].slice(0,5)} -  {cita.date_to.split(" ")[1].slice(0,5)}
                        
                        <span>
                          {" "}
                          - {cita.Client.name} {cita.Client.lastName}
                        </span>
                      </h5>
                      {cita.current === false ? null :
                      <div className="flex pt-[6px] gap-2">
                      <Link to={`${DATEDETAILBASE}/${cita.id}`} ><FaEye className={user.role === "especialista" ? "hover:scale-125 hover:text-blue-500 cursor-pointer delay-200 dark:text-darkText dark:hover:text-blue-500 mr-2" :  "hover:scale-125 hover:text-blue-500 cursor-pointer delay-200 dark:text-darkText dark:hover:text-blue-500"}/></Link>
                      {user.role === "especialista" ? null : 
                      <>
                        <MdEdit onClick={() => handleShowEditAppointment(JSON.stringify(cita))} className="hover:scale-125 hover:text-primaryPink cursor-pointer delay-200 dark:text-darkText dark:hover:text-primaryPink" />
                        <MdDelete onClick={() => handleModal(cita.id)} className="hover:scale-125 hover:text-red-500 cursor-pointer delay-200 dark:text-darkText dark:hover:text-red-500" />
                      </>
                      }
                      </div>
                      }
                    </div>
                    <p className="text-md tracking-wide font-light dark:text-darkText">
                      {" "}
                      <span className="font-medium">Sede:</span>{" "}
                      {cita.Branch.branchName}
                    </p>
                    <p className="text-md tracking-wide font-light dark:text-darkText">
                      {" "}
                      <span className="font-medium">Especialista:</span>{" "}
                      {cita.User === null ? "Error en la carga de especialista" : `${cita.User.name} ${cita.User.lastName}`}
                      
                    </p>
                    <p className="text-md tracking-wide font-light dark:text-darkText">
                      <span className="font-medium">Procedimiento:</span>{" "}
                      {cita.Service === null ? "Error en la carga de procedimiento. Llamar cliente" : cita.Service.serviceName}
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
      {showEditAppointment && date &&
	  (
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
    chosenClient={chosenClient}
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
          }} />
    </>
  );
};

export default Calendar;
