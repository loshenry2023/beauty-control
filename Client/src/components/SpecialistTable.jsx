import React, { useState } from "react";
import divideArray from "../functions/divideArray"

const SpecialistTable = ({ specialistData, count, size, setSize }) => {
  let valorTotal = 0;
  let valorAPagar = 0;

  const formatNumber = (number) => {
    return number.toLocaleString("es-CO");
  };

  const [page, setPage] = useState(0)
  const totalPages = Math.floor(count / size);
  const arraysDvided = divideArray(specialistData, size)


  return (
    <>
      {count > 0 ? (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full  text-left rtl:text-right text-black dark:text-beige dark:border-beige dark:border">
            <thead className="bg-secondaryColor text-black text-left dark:bg-darkPrimary dark:text-darkText dark:border-gre">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Especialista
                </th>
                <th scope="col" className="px-6 py-3">
                  Procedimientos realizados
                </th>
                <th scope="col" className="px-6 py-3">
                  Valor Total
                </th>
                <th scope="col" className="px-6 py-3">
                  Comisión
                </th>
                <th scope="col" className="px-6 py-3">
                  Total a pagar
                </th>
              </tr>
            </thead>
            <tbody>
              {arraysDvided[page].map((specialist, index) => (
                <tr
                  key={index}
                  className=" border border-secondaryColor hover:bg-gray-200 transition-colors duration-700 dark:hover:bg-gray-200 dark:hover:text-black"
                >
                  <td className="px-6 py-4">
                    {" "}
                    {specialist.name} {specialist.lastName}
                  </td>
                  <td className="px-6 py-4">
                    {" "}
                    {specialist.services.length === 0
                      ? "Sin servicios registrados"
                      : specialist.services.length}
                  </td>
                  <td className="px-6 py-4">
                    {" "}
                    {specialist.payments.length === 0
                      ? "Sin pagos registrados"
                      : (valorTotal = formatNumber(
                          specialist.payments.reduce(
                            (total, payment) => total + payment.Amount,
                            0
                          )
                        ))}
                  </td>
                  <td className="px-6 py-4"> {specialist.comission}%</td>
                  <td className="px-6 py-4">
                    {" "}
                    {specialist.payments.length === 0
                      ? 0
                      : (valorAPagar = formatNumber(
                          (Number(valorTotal.replace(/\./g, "")) *
                            specialist.comission) /
                            100
                        ))}{" "}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <h2 className="font-medium text-left dark:text-darkText">
          No hay coincidencias
        </h2>
      )}
      <section className="flex flex-col items-center gap-2 mt-10">
        {specialistData.rows ? (
          <select
            name=""
            id=""
            value={size}
            onChange={(e) => {
              setSize(e.target.value);
            }}
            className="shadow shadow-black rounded-md dark:text-darkText dark:bg-darkPrimary"
          >
            {" "}
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
            <option value={6}>6</option>
            <option value={7}>7</option>
            <option value={8}>8</option>
            <option value={9}>9</option>
            <option value={10}>10</option>
          </select>
        ) : (
          <select
            name=""
            id=""
            value={size}
            onChange={(e) => {
              setSize(e.target.value);
            }}
            className="shadow shadow-black rounded-md dark:text-darkText dark:bg-darkPrimary"
          >
            {" "}
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
            <option value={6}>6</option>
            <option value={7}>7</option>
            <option value={8}>8</option>
            <option value={9}>9</option>
            <option value={10}>10</option>
          </select>
        )}
        <div>
        <button
          onClick={
            page
              ? () => {
                setPage(page - 1);
              }
              : null
          }
          className="dark:text-darkText"
        >
          {" "}
          {"<"}
        </button>
        <span className="dark:text-darkText"> Página {totalPages === 0 ? `${1} de ${1}` : `${page + 1} de ${totalPages}`} </span>
        <button
          onClick={
            page < totalPages - 1
              ? () => {
                setPage(page + 1);
              }
              : null
          }
          className="dark:text-darkText"
        >
          {">"}
        </button>
        </div>
      </section>
      
    </>
  );
};

export default SpecialistTable;
