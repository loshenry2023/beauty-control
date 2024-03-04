//Hooks, components, reducer
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTokenError } from "../redux/actions";
import axios from "axios";

//components
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";
import SpecialistTable from "../components/SpecialistTable";
import Loader from "../components/Loader";
import Restricted from "./Restricted";
import ErrorToken from "./ErrorToken";

//toast
import { toast } from "react-hot-toast";
import ToasterConfig from "../components/Toaster";

//variables de entorno
import getParamsEnv from "../functions/getParamsEnv";
const { API_URL_BASE } = getParamsEnv();

//functions
import { isEqual } from "../functions/isEqual";

const SpecialistMonitoring = () => {

  const dispatch = useDispatch();
  const [specialistData, setSpecialist] = useState({});
  const [loading, setLoading] = useState(true);
  const [size, setSize] = useState(10);
  const count = specialistData.count;
  const user = useSelector((state) => state?.user);
  const token = useSelector((state) => state?.token);
  const tokenError = useSelector((state) => state?.tokenError);
  const workingBranch = useSelector((state) => state?.workingBranch);
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1; // Months are zero-indexed, so add 1
  const day = today.getDate();
  const formattedDate = `${year}-${month < 10 ? "0" + month : month}-${
    day < 10 ? "0" + day : day
  }`;

  const [dateFrom, setDateFrom] = useState(formattedDate);
  const [dateTo, setDateTo] = useState(formattedDate);

  const [filterDate, setFitlerDate] = useState({
    branchName: workingBranch.branchName,
    dateFrom: formattedDate,
    dateTo: formattedDate,
    token,
  });

  const handleDate = (e) => {
    if (e.target.name === "dateFrom") {
      const newDate = e.target.value;
      setDateFrom(newDate);
    }

    if (e.target.name === "dateTo") {
      const newDate = e.target.value;
      setDateTo(newDate);
    }
  };

  // const handleDate = (e) => {
  //   if (e.target.name === "dateFrom" && testData.test(e.target.value)) {
  //     if (e.target.value > filterDate.dateTo) {
  //       const newDate = filterDate.dateTo;
  //       setFitlerDate({
  //         ...filterDate,
  //         dateFrom: newDate,
  //       });
  //       toast.error("La fecha inicial no puede ser mayor a la fecha final");
  //       document.getElementById("dateFrom").value = newDate;
  //     } else {
  //       setFitlerDate({
  //         ...filterDate,
  //         [e.target.name]: e.target.value,
  //       });
  //     }
  //   }

  //   if (e.target.name === "dateTo" && testData.test(e.target.value)) {
  //     if (e.target.value < filterDate.dateFrom) {
  //       const newDate = filterDate.dateFrom;
  //       setFitlerDate({
  //         ...filterDate,
  //         dateTo: newDate,
  //       });
  //       toast.error("La fecha final no puede ser menor a la fecha inicial");
  //       document.getElementById("dateTo").value = newDate;
  //     } else {
  //       setFitlerDate({
  //         ...filterDate,
  //         [e.target.name]: e.target.value,
  //       });
  //     }
  //   }
  // };

  const buscarFecha = () => {
    if (dateFrom > dateTo) {
      toast.error("La fecha inicial no puede ser mayor a la fecha final");
      return;
    }

    setFitlerDate({
      branchName: workingBranch.branchName,
      dateFrom: dateFrom,
      dateTo: dateTo,
      token,
    });

    setLoading(true)
  };

  let requestMade = false;
  useEffect(() => {
    if (!requestMade) {
      requestMade = true;
      axios
        .post(`${API_URL_BASE}/v1/getbalance`, filterDate)
        .then((respuesta) => {
          if (!isEqual(respuesta.data, specialistData)) {
            setSpecialist(respuesta.data);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          if (
            error.request.status === 401 ||
            error.request.status === 402 ||
            error.request.status === 403
          ) {
            setLoading(false);
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
  }, [tokenError, filterDate])

  if (tokenError === 401 || tokenError === 402 || tokenError === 403) {
    return <ErrorToken error={tokenError} />;
  } else {
    return (
      <>
        <NavBar />
        <div className="flex flex-row dark:bg-darkBackground">
          <SideBar />
          {loading ? (
            <Loader />
          ) : user.role === "superAdmin" ? (
            <div className="flex flex-col mt-10 gap-5 w-2/3 mx-auto">
              <div className="flex gap-2">
                <h1 className="text-3xl underline underline-offset-4 tracking-wide text-center font-fontTitle text-black dark:text-darkText sm:text-left">
                  {" "}
                  Seguimiento Especialistas{" "}
                </h1>
              </div>
              <div className="flex flex-col gap-5 md:flex-row">
                <div className="flex gap-2">
                  <label className="hidden md:inline dark:text-darkText">
                    Fecha inicial
                  </label>
                  <input
                    id="dateFrom"
                    name="dateFrom"
                    type="date"
                    value={dateFrom}
                    onChange={handleDate}
                    className="w-full text-center border rounded-md border-black px-2  md:w-fit dark:invert"
                    onKeyDown={(e) => e.preventDefault()}
                  />
                </div>
                <div className="flex gap-2">
                  <label className="hidden md:inline dark:text-darkText">
                    Fecha final
                  </label>
                  <input
                    id="dateTo"
                    name="dateTo"
                    type="date"
                    value={dateTo}
                    onChange={handleDate}
                    className="w-full text-center border rounded-md border-black px-2  md:w-fit dark:invert"
                    onKeyDown={(e) => e.preventDefault()}
                  />
                </div>
                <button
                  onClick={buscarFecha}
                  className="border hover:bg-secondaryColor transition-colors duration-700 border-black px-2 rounded-md flex gap-2 dark:hover:bg-blue-500 dark:border-darkText dark:text-darkText"
                >
                  Buscar fecha
                </button>
              </div>
              <SpecialistTable
                count={count}
                specialistData={specialistData.rows}
                size={size}
                setSize={setSize}
              />
            </div>
          ) : (
            <Restricted />
          )}
        </div>
        <ToasterConfig />
      </>
    );
  }
};

export default SpecialistMonitoring;
