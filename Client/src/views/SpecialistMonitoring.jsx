//Hooks, components, reducer
import React, { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";
import SpecialistTable from "../components/SpecialistTable";
import { useSelector, useDispatch } from "react-redux";
import { setTokenError } from "../redux/actions";
import Loader from "../components/Loader";
import axios from "axios";
import Restricted from "./Restricted";
import ErrorToken from "./ErrorToken";

//Toast
import { toast } from "react-hot-toast";
import ToasterConfig from "../components/Toaster";

import getParamsEnv from "../functions/getParamsEnv";
const { API_URL_BASE } = getParamsEnv();

const SpecialistMonitoring = () => {
  const testData = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;

  const dispatch = useDispatch();
  const [specialistData, setSpecialsit] = useState({});
  const [loading, setLoading] = useState(true);
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

  const [filterDate, setFitlerDate] = useState({
    branchName: workingBranch.branchName,
    dateFrom: formattedDate,
    dateTo: formattedDate,
    token,
  });

  const handleDate = (e) => {
    if (e.target.name === "dateFrom" && testData.test(e.target.value)){
      if (
        e.target.value > filterDate.dateTo
      ) {
        const newDate = filterDate.dateTo
        setFitlerDate({
          ...filterDate,
          dateFrom: newDate,
        });
        toast.error("La fecha inicial no puede ser mayor a la fecha final");
        document.getElementById("dateFrom").value = newDate;
      } else {
        setFitlerDate({
          ...filterDate,
          [e.target.name]: e.target.value,
        });
      }
    }
    
    if (e.target.name === "dateTo" && testData.test(e.target.value) ){
      if (
        e.target.value < filterDate.dateFrom
      ) {
        const newDate = filterDate.dateFrom
        setFitlerDate({
          ...filterDate,
          dateTo: newDate,
        });
        toast.error("La fecha final no puede ser menor a la fecha inicial");
        document.getElementById("dateTo").value = newDate;
      } else {
        setFitlerDate({
          ...filterDate,
          [e.target.name]: e.target.value,
        });
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `${API_URL_BASE}/v1/getbalance`,
          filterDate
        );
        setSpecialsit(response.data);
        setLoading(false);
      } catch (error) {
        if (error.request.status === 403) {
          dispatch(setTokenError(error.request.status));
        }
        setLoading(false);
      }
    };
    fetchData();
  }, [filterDate, tokenError]);

  if (tokenError === 401 || tokenError === 403) {
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
                <div className="flex  gap-2">
                  <label className="hidden md:inline dark:text-darkText">
                    Fecha inicial
                  </label>
                  <input
                    id="dateFrom"
                    name="dateFrom"
                    type="date"
                    defaultValue={formattedDate}
                    onChange={handleDate}
                    className="w-full text-center border rounded-md border-black px-2  md:w-fit dark:invert"
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
                    defaultValue={formattedDate}
                    onChange={handleDate}
                    className="w-full text-center border rounded-md border-black px-2  md:w-fit dark:invert"
                  />
                </div>
              </div>
              <SpecialistTable
                count={count}
                specialistData={specialistData.rows}
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
