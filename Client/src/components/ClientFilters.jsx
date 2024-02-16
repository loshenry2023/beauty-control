import React, { useState } from "react";
import { useLocation } from "react-router-dom";

//Toast
import { toast } from "react-hot-toast";
import ToasterConfig from "../components/Toaster";


const ClientFilters = ({setOrder, nameOrLastName, setAttribute, setNameOrLastName, setPage, setBirthdaysMonth, setCreateDateStart, setCreateDateEnd, createDateStart, createDateEnd}) => {

  const location = useLocation()

  const handlerDateFrom = (e) => {
    if(createDateEnd !== "" && `${e.target.value} 00:00:00`> createDateEnd){
      toast.error("La fecha inicial no puede ser mayor a la fecha final");
    }
    setCreateDateStart(`${e.target.value} 00:00:00`)
  };

  const handlerDateTo = (e) => {
    if(createDateStart !== "" && `${e.target.value} 23:59:59` < createDateStart){
      toast.error("La fecha final no puede ser menor a la fecha inicial");
    }
    setCreateDateEnd(`${e.target.value} 23:59:59`)
  };

  return (
    <section className="flex flex-col gap-4">
      {location.pathname !== "/agenda" ? <h4 className="text-md underline mb-[-10px] dark:text-darkText">Filtro por fecha de creación</h4> : null}
      <div className="flex flex-col gap-2 sm:flex sm:flex-row sm:gap-5 sm:w-full">
        <div className="flex flex-col gap-6 sm:flex-row">
            {location.pathname !== "/agenda" ? (
            <>
            <div className="flex gap-2">
              <label className="hidden md:inline dark:text-darkText">
                Fecha inicial
              </label>
              <input
                id="dateFrom"
                onChange={handlerDateFrom}
                type="date"
                defaultValue=""
                className="w-full text-center border rounded-md border-black px-2  sm:w-fit dark:invert"
                onKeyDown={(e) => e.preventDefault()}
              />
            </div>
            <div className="flex gap-2">
              <label className="hidden md:inline dark:text-darkText">
                Fecha final
              </label>
              <input
                id="dateTo"
                onChange={handlerDateTo}
                type="date"
                defaultValue=""
                className="w-full text-center border rounded-md border-black px-2  sm:w-fit dark:invert"
                onKeyDown={(e) => e.preventDefault()}
              />
            </div> </>): null }
        </div>
      </div>
      <div className="flex flex-col items-start sm:w-full">
        <div className="flex flex-col items-center w-full gap-3 lg:flex-row lg:items-center lg:gap-3">
          <input
            value={nameOrLastName}
            onChange={(e) => {
              setNameOrLastName(e.target.value);
              setPage(0);
            }}
            type="text"
            placeholder="Buscar por nombre..."
            className="font-medium w-full border border-black focus:outline-none focus:ring-1 focus:ring-secondaryColor px-1  dark:bg-darkPrimary dark:placeholder-darkText dark:text-darkText"
          />
          <select
            onChange={(e) => {
              setOrder(e.target.value);
              setPage(0);
            }}
            className="font-medium py-0.5 w-full border border-black rounded-md  dark:text-darkText dark:bg-darkPrimary"
          >
            <option value="asc"> -- Ordenar por -- </option>
            <option value="asc">A-Z</option>
            <option value="desc">Z-A</option>
          </select>
          {location.pathname !== "/agenda" ? 
          <>
           <select
            onChange={(e) => {
              setAttribute(e.target.value);
              setPage(0);
            }}
            className="font-medium py-0.5 w-full border border-black rounded-md  dark:text-darkText dark:bg-darkPrimary"
          >
            <option value="lastName"> -- Ordenar por -- </option>
            <option value="name">Nombre</option>
            <option value="lastName">Apellido</option>
            <option value="createdAt">Fecha de creación</option>
            <option value="monthBirthday">Cumpleaños</option>
          </select>
          <select
            onChange={(e) => {
              setBirthdaysMonth(e.target.value);
              setPage(0);
            }}
            className="font-medium py-0.5 w-full border border-black rounded-md  dark:text-darkText dark:bg-darkPrimary"
          >
            <option value=""> -- Mes de cumpleaños -- </option>
            <option value="01" >Enero</option>
            <option value="02">Febrero</option>
            <option value="03">Marzo</option>
            <option value="04">Abril</option>
            <option value="05">Mayo</option>
            <option value="06">Junio</option>
            <option value="07">Julio</option>
            <option value="08">Agosto</option>
            <option value="09">Septiembre</option>
            <option value="10">Octubre</option>
            <option value="11">Noviembre</option>
            <option value="12">Diciembre</option>
          </select>
          </> : null}
          
        </div>
      </div>
      <ToasterConfig />
    </section>
  );
};

export default ClientFilters;
