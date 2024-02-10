import React from "react";
import converterGMT from "../functions/converteGMT";
import { useLocation } from "react-router-dom";

const HistoryServices = ({ history }) => {
  const location = useLocation();

  // const transform = (fecha) => {
  //   const inputDate = new Date(fecha);

  //   const options = {
  //     year: 'numeric',
  //     month: 'long',
  //     day: 'numeric',
  //     hour: 'numeric',
  //     minute: 'numeric',
  //     second: 'numeric',
  //     timeZoneName: 'short'
  //   };
  //   const formattedDate = inputDate; //new Intl.DateTimeFormat('en-US', options).format(inputDate);
  //   return formattedDate
  // }  


  const historySorted = history.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <section
      className={
        (location.pathname = "/dateDetail"
          ? "w-full flex flex-col flex-wrap justify-evenly gap-10 md:flex-row"
          : "w-full mx-auto my-10 flex flex-col flex-wrap justify-evenly gap-10 md:flex-row")
      }
    >
      <div className="mx-auto mt-2 border-primaryPink flex flex-col gap-1 flex-wrap p-4 h-fit rounded overflow-hidden dark:border-zinc-800 dark:bg-darkBackground">
        {historySorted.length >= 1 ? (
          <h2 className="font-medium text-center text-xl dark:text-darkText ">
            {" "}
            Procedimientos anteriores{" "}
          </h2>
        ) : (
          <h2 className="font-medium text-center dark:text-darkText ">
            {" "}
            Sin procedimientos registrados{" "}
          </h2>
        )}
        {historySorted.map((service, index) => {
          return (
            <div
              key={index}
              className="flex flex-row flex-wrap justify-between shadow-sm shadow-black p-2 dark:bg-darkPrimary dark:hover:bg-zinc-800"
            >
              <div className="flex flex-col justify-between">
                <p className="text-md tracking-wide font-light dark:text-darkText">
                  {" "}
                  <span className="font-medium dark:text-darkText">
                    {" "}
                    Fecha de procedimiento:{" "}
                  </span>{" "}
                  {converterGMT(service.date).split(" ")[0]}{" "}
                </p>
                <p className="text-md tracking-wide font-light dark:text-darkText">
                  {" "}
                  <span className="font-medium dark:text-darkText">
                    {" "}
                    Sede:{" "}
                  </span>{" "}
                  {service.branchName}
                </p>
                <p className="text-md tracking-wide font-light dark:text-darkText">
                  {" "}
                  <span className="font-medium dark:text-darkText">
                    {" "}
                    Especialista:{" "}
                  </span>{" "}
                  {service.attendedBy}
                </p>
                <p className="text-md tracking-wide font-light dark:text-darkText">
                  {" "}
                  <span className="font-medium dark:text-darkText">
                    {" "}
                    Servicio:{" "}
                  </span>{" "}
                  {service.serviceName}
                </p>
              </div>
              <div className="flex flex-col justify-end items-end gap-2">
                <a
                  href={service.imageServiceDone}
                  target="_blank"
                  className="cursor-pointer shadow-md rounded-2xl w-fit px-2 bg-beige hover:bg-primaryColor transition-colors duration-700 hover:text-white dark:bg-darkBackground dark:text-darkText dark:hover:bg-blue-600"
                >
                  <p className="text-center"> Ver foto </p>
                </a>
                <a
                  href={service.conformity}
                  target="_blank"
                  className={`${service.conformity === "" ? "hidden" : ""} cursor-pointer shadow-md rounded-2xl w-fit px-2 bg-beige hover:bg-blue-600 hover:text-white dark:bg-darkBackground dark:text-darkText dark:hover:bg-blue-600`}
                >
                  <p className="text-center"> Ver conformidad </p>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HistoryServices;
