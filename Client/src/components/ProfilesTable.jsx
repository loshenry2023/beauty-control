import React from "react";

//componentes, hooks, reducer
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";

//variables de entorno
import getParamsEnv from "../functions/getParamsEnv";
const { USERDETAILBASE } = getParamsEnv();

const TablaDatos = ({ users, count }) => {
  const navigate = useNavigate();

  if (users) {
    return (
      <>
        {count ? (
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="border border-secondaryColor w-full  text-left rtl:text-right text-black dark:text-beige dark:border-beige">
              <thead className="bg-secondaryColor text-black text-left dark:bg-darkPrimary dark:text-darkText dark:border-gre">
                <tr>
                  <th scope="col" className="px-2 py-3">
                    Fecha de creación
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Nombre
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Apellido
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Correo
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Especialidad
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Rol
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Sede
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Comisión
                  </th>
                </tr>
              </thead>
              <tbody>
              {users.map((fila, index) => (
                 <tr 
                 props={fila}
                 key={index}
                 onClick={() => navigate(`${USERDETAILBASE}/${fila.id}`)}
                 className="border border-secondaryColor hover:bg-gray-200 transition-colors duration-700 cursor-pointer dark:hover:bg-gray-200 dark:hover:text-black"
               >
      
                  <td className="px-2 py-4">{fila.createdAt.split(" ")[0]}</td>
                  <td className="px-6 py-4">{fila.name}</td>
                  <td className="px-6 py-4">{fila.lastName}</td>
                  <td className="px-6 py-4">{fila.userName}</td>
                  <td className="px-6 py-4"> {fila.Specialties.map(
                        (specialty) => specialty.specialtyName
                      ).join(", ")}</td>
                  <td className="px-6 py-4">{fila.role === "superAdmin" ? "Admin General" : `${fila.role.charAt(0).toUpperCase()}${fila.role.slice(1)}`}</td>
                  <td className="px-6 py-4"> {fila.Branches.map((branch) => branch.branchName).join(
                        ", "
                      )}</td>
                  <td className="px-6 py-4">{fila.comission}</td>
                </tr>))}
              </tbody>
            </table>
          </div>
        ) : (
          <h2 className="text-center font-medium dark:text-darkText">
            {" "}
            No hay coincidencias
          </h2>
        )}{" "}
      </>
    );
  } else {
    return <Loader />;
  }
};
export default TablaDatos;
