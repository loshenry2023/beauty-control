import React from "react";

const SpecialistTable = ({ specialistData, count }) => {
  let valorTotal = 0;
  let valorAPagar = 0;

  const formatNumber = (number) => {
    return number.toLocaleString("es-CO");
  };

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
              {specialistData.map((specialist, index) => (
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
    </>
  );
};

export default SpecialistTable;
