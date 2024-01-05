import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const ClientFilters = ({setOrder, nameOrLastName, setAttribute, setNameOrLastName, setPage, setBirthdaysMonth, setCreateDateStart, setCreateDateEnd}) => {

  const location = useLocation()

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 mx-auto sm:flex sm:flex-row sm:gap-5 sm:w-full">
        <div className="flex flex-col gap-6 md:flex-row">
            {location.pathname !== "/agenda" ? (
            <>
            <div className="flex gap-2">
                <>
                </>
              <label className="hidden md:inline dark:text-darkText">
                Fecha inicial
              </label>
              <input
                onChange={(e) => {
                  setCreateDateStart(
                    e.target.value ? `${e.target.value} 00:00:00` : ""
                  );
                }}
                type="date"
                defaultValue=""
                className="border rounded-md border-black px-2 text-sm dark:invert"
              />
            </div>
            <div className="flex gap-2">
              <label className="hidden md:inline dark:text-darkText">
                Fecha final
              </label>
              <input
                onChange={(e) => {
                  setCreateDateEnd(
                    e.target.value ? `${e.target.value} 23:59:59` : ""
                  );
                }}
                type="date"
                defaultValue=""
                className="border rounded-md border-black px-2 text-sm dark:invert"
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
            className="font-medium w-full border border-black focus:outline-none focus:ring-1 focus:ring-grey px-1 text-sm dark:bg-darkPrimary dark:placeholder-darkText dark:text-darkText"
          />
          <select
            onChange={(e) => {
              setOrder(e.target.value);
              setPage(0);
            }}
            className="font-medium py-0.5 w-full border border-black rounded-md text-xs dark:text-darkText dark:bg-darkPrimary"
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
            className="font-medium py-0.5 w-full border border-black rounded-md text-xs dark:text-darkText dark:bg-darkPrimary"
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
            className="font-medium py-0.5 w-full border border-black rounded-md text-xs dark:text-darkText dark:bg-darkPrimary"
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
    </section>
  );
};

export default ClientFilters;
