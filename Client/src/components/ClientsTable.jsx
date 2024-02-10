//Hooks, reducer
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

//variables de entorno
import getParamsEnv from "../functions/getParamsEnv";
import converterGMT from '../functions/converteGMT';
const { CLIENTDETAILBASE } = getParamsEnv();

const ClientsTable = ({clients, count, setChosenClient, setShowClientListModal}) => {
    const navigate = useNavigate();
    const location = useLocation()

      return (
        <>
          {count > 0 ? (
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="border border-secondaryColor w-full text-sm text-left rtl:text-right text-black dark:text-beige dark:border-beige">
                <thead className="bg-secondaryColor text-black text-left dark:bg-darkPrimary dark:text-darkText dark:border-secondaryColor">
                {location.pathname !== "/agenda" ?
                  <tr>
                    <th scope="col" className="px-4 py-3">
                      Fecha de creación
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Nombre
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Apellido
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Correo
                    </th>
                    <th scope="col" className="px-4 py-3">
                      ID Personal
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Teléfono 1
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Teléfono 2
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Fecha de nacimiento
                    </th>
                  </tr> : 
                   <tr>
                   <th scope="col" className="px-4 py-3">
                     Nombre
                   </th>
                   <th scope="col" className="px-4 py-3">
                     Apellido
                   </th>
                   <th scope="col" className="px-4 py-3">
                     Correo
                   </th>
                   <th scope="col" className="px-4 py-3">
                     ID Personal
                   </th>
                   <th scope="col" className="px-4 py-3">
                     Teléfono 1
                   </th>
                   <th scope="col" className="px-4 py-3">
                     Fecha de nacimiento
                   </th>
                 </tr>}
                </thead>
                <tbody>
                  {clients.map((fila, index) => (
                    <tr
                      key={index}
                      onClick={() => {
                        if (location.pathname === "/agenda") {
                          const clienteDos = { ...fila }; // Copia de fila para evitar mutar el estado directamente
                          setChosenClient(clienteDos);
                          setShowClientListModal(false);
                        } else {
                          navigate(`${CLIENTDETAILBASE}/${fila.id}`);
                        }
                      }}
                      className="text-xs border border-secondaryColor hover:bg-gray-200 cursor-pointer transition-colors duration-700 dark:hover:bg-gray-200 dark:hover:text-black"
                    >
                       {location.pathname !== "/agenda" ? (
                        <>
                          <td className="px-4 py-4">{fila.createdAt.split(" ")[0]}</td>
                        </>
                      ) : null}
                      <td className="px-4 py-4">{fila.name}</td>
                      <td className="px-4 py-4">{fila.lastName}</td>
                      <td className="px-4 py-4">{fila.email}</td>
                      <td className="px-4 py-4">{fila.id_pers}</td>
                      <td className="px-4 py-4">{fila.phoneNumber1}</td>
                      {location.pathname !== "/agenda" ? (
                        <>
                          <td className="px-4 py-4">{fila.phoneNumber2 ? fila.phoneNumber2 : "-"}</td>
                        </>
                      ) : null}
                      <td className="px-4 py-4">{fila.birthday ? converterGMT(fila.birthday).split(" ")[0]: "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <h2 className="font-medium text-center  dark:text-darkText">
              {" "}
              No hay coincidencias
            </h2>
          )}{" "}
        </>
      );
}


export default ClientsTable