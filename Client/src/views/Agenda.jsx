// Importaciones de componentes y librerías
import Calendar from "../components/Calendar";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import Loader from "../components/Loader";
import CreateAppointment from "../components/modals/CreateAppointment";
import ListClients from "../components/modals/ListClients";
import ErrorToken from "./ErrorToken";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getBranches,
  getClients,
  getServices,
  getToken,
  getUsers,
} from "../redux/actions";
import { FaPlusCircle } from "react-icons/fa";

const Agenda = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const tokenError = useSelector((state) => state?.tokenError);
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Agregar 1 ya que los meses se indexan desde 0
  const day = currentDate.getDate().toString().padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;



  const branches = useSelector((state) => state?.branches);
  const tokenID = useSelector((state) => state?.token);
  const workingBranch = useSelector((state) => state?.workingBranch);
  const services = useSelector((state) => state?.services);
  const users = useSelector((state) => state?.users);
  const user = useSelector((state) => state?.user);
  const [nameOrLastName, setNameOrLastName] = useState("");
  const [attribute, setAttribute] = useState("name");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(999999999999999);
  const [branch, setBranch] = useState(workingBranch.branchName);
  const [specialty, setSpecialty] = useState("noneSpecialty");
  const [role, setRole] = useState("");
  const [createDateStart, setCreateDateStart] = useState("");
  const [createDateEnd, setCreateDateEnd] = useState("");
  const [chosenClient, setChosenClient] = useState({
    name: "Elige",
    lastName: "cliente",
  });
  const [refrescarCita, setRefrescarCita] = useState(false);
  const [showClientListModal, setShowClientListModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showEditAppointment, setShowEditAppointment] = useState(false);


  const [dateInfo, setDateInfo] = useState({
    client: {
      id: "",
      name: "",
      lastName: "",
    },
    branch: {
      id: workingBranch.id,
      branchName: workingBranch.branchName,
    },
    service: {
      id: "",
      serviceName: "",
      specialtyName: ""
    },
    specialist: {
      id: "",
      name: "",
      lastName: "",
    },
    dateTime: formattedDate,
  });

  //console.log(dateInfo)

  const [isFormCompleted, setIsFormCompleted] = useState(false);

  useEffect(() => {
    const isDateSelected = dateInfo.dateTime !== "";

    const formCompleted =
      dateInfo.client.id &&
      dateInfo.service.id &&
      dateInfo.specialist.id &&
      isDateSelected;

    setIsFormCompleted(formCompleted);
  }, [dateInfo]);

  const handleAppointmentModal = () => {
    setShowAppointmentModal(true);
  };

  useEffect(() => {
    dispatch(getToken(tokenID));
    dispatch(getBranches({ token: tokenID }));
    dispatch(getServices({ token: tokenID }));
    dispatch(
      getUsers(
        nameOrLastName,
        attribute,
        order,
        page,
        size,
        branch,
        specialty,
        role,
        createDateEnd,
        createDateStart,
        { token: tokenID }
      )
    );
    setLoading(false);
  }, [specialty, tokenError]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "client") {
      // const parsedValue = JSON.parse(value);

      setDateInfo((prevInfo) => ({
        ...prevInfo,
        client: {
          id: chosenClient.id,
          name: chosenClient.name,
          lastName: chosenClient.lastName,
        },
      }));
    } else if (name === "service") {
      if (value === "noneSpecialty") {
        setDateInfo((prevInfo) => ({
          ...prevInfo,
          service: {
            id: "",
            name: "",
          },
        }));

      } else {
        const parsedValue = JSON.parse(value);
        setSpecialty(parsedValue.Specialties[0].specialtyName);

        setDateInfo((prevInfo) => ({
          ...prevInfo,
          service: {
            id: parsedValue.id,
            name: parsedValue.serviceName,
            specialtyName: parsedValue.Specialties[0].specialtyName
          },
        }));

        setDateInfo((prevInfo) => ({
          ...prevInfo,
          specialist: {
            id: "",
            name: "",
          },
        }));
      }
    } else if (name === "specialist") {
      if (value === "null") {
        setDateInfo((prevInfo) => ({
          ...prevInfo,
          specialist: {
            id: "",
            name: "",
            lastName: "",
          },
        }));
      } else {
        const parsedValue = JSON.parse(value);

        setDateInfo((prevInfo) => ({
          ...prevInfo,
          specialist: {
            id: parsedValue.id,
            name: parsedValue.name,
            lastName: parsedValue.lastName,
          },
        }));
      }
    } else if (name === "dateTime") {
      setDateInfo((prevInfo) => ({
        ...prevInfo,
        [name]: value || new Date().toISOString(),
      }));
    } else {
      setDateInfo((prevInfo) => ({
        ...prevInfo,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    setDateInfo((prevInfo) => ({
      ...prevInfo,
      client: {
        id: chosenClient.id,
        name: chosenClient.name,
        lastName: chosenClient.lastName,
      },
    }));
  }, [chosenClient]);

  if (tokenError === 401 || tokenError === 403) {
    return (
      <ErrorToken error={tokenError} />
    );
  } else {
    return (
      <div>
        <NavBar />
        <div className="flex flex-row mx-auto h-full dark:bg-darkBackground">
          <SideBar />
          {loading ? (
            <Loader />
          ) : (
            <div
              className={
                user.role !== "especialista"
                  ? "flex flex-col mx-auto m-10 gap-5"
                  : "flex flex-col mx-auto m-10 gap-5 items-center"
              }
            >
              <h1
                className={
                  user.role !== "especialista"
                    ? "text-center md:items-start text-3xl underline underline-offset-4 mx-5 tracking-wide font-fontTitle dark:text-beige sm:text-left"
                    : "text-center md:items-start text-3xl underline underline-offset-4 mb-10 tracking-wide font-fontTitle dark:text-beige sm:text-left"
                }
              >
                Gestión de citas
              </h1>
              {user.role === "especialista" ? null : (
                <section className="shadow shadow-black rounded-xl p-2 mx-5 bg-secondaryColor dark:bg-darkPrimary dark:shadow-darkText">
                  <h2 className="text-2xl  dark:text-darkText p-2 m-0 text-center xl:text-left">Agendar cita</h2>
                  <div className=" flex flex-col items-center flex-wrap gap-5 md:flex-row mr-5 mb-2 md:justify-center xl:justify-none">
                    <FaPlusCircle
                      className="text-center mt-1.5 cursor-pointer dark:text-darkText"
                      onClick={() => setShowClientListModal(true)}
                    />

                    <input
                      name=""
                      id=""
                      placeholder={`${chosenClient.name} ${chosenClient.lastName}`}
                      disabled
                      className="w-full sm:w-60 pl-2 py-1 bg-white resize-y border mt-3 sm:mt-0 sm:mr-2 border-black rounded-md text-md dark:text-darkText dark:bg-darkPrimary dark:border-darkText"
                    />


                    {!showEditAppointment && (
                      <select
                        name="service"
                        id=""
                        className="w-full mt-3 sm:mt-0 sm:w-60 pl-2 py-1 border border-black rounded-md text-md dark:text-darkText dark:bg-darkPrimary dark:border-darkText md:w-64"
                        onChange={handleChange}
                      >
                        <option defaultValue={dateInfo.service.id ? false : true} value={JSON.stringify({ Specialties: [{ specialtyName: "noneSpecialty" }] })}>
                          Procedimientos
                        </option>
                        {services.map((service, index) => (
                          <option
                            key={index}
                            value={JSON.stringify(service)}
                            selected={dateInfo.service.id === service.id ? true : false}
                          >
                            {service.serviceName}
                          </option>
                        ))}
                      </select>
                    )}

                    {!showEditAppointment && (
                      <select
                        onChange={handleChange}
                        name="specialist"
                        id=""
                        className="w-full mt-3 sm:mt-0 sm:w-60 pl-2 py-1  border border-black rounded-md text-md dark:text-darkText dark:bg-darkPrimary dark:border-darkText md:w-64"
                      >
                        <option defaultValue={dateInfo.specialist.id ? false : true} value="null" selected={dateInfo.specialist.id ? true : false}>
                          -- Especialista--
                        </option>
                        {users.map(
                          (user, index) =>
                            user.role === "especialista" && (
                              <option
                                key={index}
                                value={JSON.stringify(user)}
                                selected={user.id === dateInfo.specialist.id ? true : false}
                              >
                                {user.name} {user.lastName}
                              </option>
                            )
                        )}
                      </select>
                    )}
                    {user.role === "especialista" ? null : (
                  <button
                    onClick={handleAppointmentModal}
                    disabled={!isFormCompleted}
                    className={`border border-black rounded-md mt-auto px-6 py-1 ${isFormCompleted ? "bg-white cursor-pointer" : "bg-white cursor-not-allowed"
                      } shadow shadow-black text-black ${isFormCompleted ? "hover:scale-[1.02]" : "cursor-not-allowed"
                      } focus:outline-none transition-colors dark:text-darkText dark:bg-darkPrimary dark:border-white ${isFormCompleted
                        ? "dark:hover:bg-secondaryColor"
                        : "dark:cursor-not-allowed"
                      }`}
                  >
                    Agregar Cita
                  </button>
                )}
                  </div>
                </section>
              )}
              <Calendar
                setDateInfo={setDateInfo}
                branches={branches}
                services={services}
                users={users}
                user={user}
                refrescarCita={refrescarCita}
                setRefrescarCita={setRefrescarCita}
                chosenClient={chosenClient}
                setSpecialty={setSpecialty}
                setShowAppointmentModal={setShowAppointmentModal}
                setShowEditAppointment={setShowEditAppointment}
                showEditAppointment={showEditAppointment}
                dateInfo={dateInfo}
              />

            </div>
          )}
          {showClientListModal ? (
            <ListClients
              setChosenClient={setChosenClient}
              setShowClientListModal={setShowClientListModal}
            />
          ) : null}
          {showAppointmentModal && (
            <CreateAppointment
              branches={branches}
              setShowAppointmentModal={setShowAppointmentModal}
              dateInfo={dateInfo}
              setDateInfo={setDateInfo}
              token={tokenID}
              setRefrescarCita={setRefrescarCita}
              refrescarCita={refrescarCita}
              chosenClient={chosenClient}
              formattedDate={formattedDate}
              setChosenClient={setChosenClient}
            />
          )}
        </div>
      </div>
    );
  }
};

export default Agenda;
