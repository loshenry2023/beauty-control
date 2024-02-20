import React, { useEffect } from "react";
import { Link } from "react-router-dom";

//componentes, hooks, reducer
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";
//react icons
import { SlChart } from "react-icons/sl";
import { FiEdit } from "react-icons/fi";
import { useState } from "react";

//variables de entorno
import getParamsEnv from "../functions/getParamsEnv";
import EditConsumableForm from "./EditConsumableForm";
const { HISTORYPRICEBASE, EDITPRODUCTBASE } = getParamsEnv();

const ConsumablesTable = ({ products, user, onClose, workingBranch, aux, setAux }) => {
  const navigate = useNavigate();
  const [productData, setProductData] = useState(products);

  console.log(products, "productos")

  const [showEditConsumableModal, setEditConsumableModal] = useState(false);

  const handleShowEditModal = (fila) => {
    setEditConsumableModal(true);
    setProductData(fila);
  };


  if (products && products.products && Array.isArray(products.products)) { 
    return (
      <>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="border border-black w-full  text-left rtl:text-right text-black dark:text-beige dark:border-beige">
            <thead className="bg-secondaryColor text-black text-left dark:bg-darkPrimary dark:text-darkText dark:border-gre">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Codigo
                </th>
                <th scope="col" className="px-6 py-3">
                  Nombre
                </th>
                <th scope="col" className="px-6 py-3">
                  Descripcion
                </th>
                <th scope="col" className="px-6 py-3">
                  Proveedor
                </th>
                <th scope="col" className="px-6 py-3">
                  Cantidad
                </th>
                <th scope="col" className="px-6 py-3">
                  Sede
                </th>
                {user?.role !== "admin" && (
                  <th scope="col" className="px-6 py-3">
                    Precio
                  </th>
                )}
                <th scope="col" className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {products && products.products.map((fila, index) => (
                <tr
                  props={fila}
                  key={index}
                  className=" hover:bg-gray-200 cursor-pointer dark:hover:bg-gray-200 dark:hover:text-black"
                >
                  <td className="px-6 py-4">{fila.productCode}</td>
                  <td className="px-6 py-4">{fila.productName}</td>
                  <td className="px-6 py-4">{fila.description}</td>
                  <td className="px-6 py-4">{fila.supplier}</td>
                  <td className="px-6 py-4">{fila.amount}</td>
                  <td className="px-6 py-4">
                    {workingBranch.branchName}
                  </td>
                  {user?.role !== "admin" && (
                    <td className="px-6 py-4">
                      <div style={{ display: "flex", alignItems: "center" }}>
                       <span className="mr-3">{Math.floor(fila.price)}</span>
                        {user?.role === "superAdmin" &&  (
                          <Link
                            to={`${HISTORYPRICEBASE}/${fila.productCode}`}
                            className="text-blue-500 "
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <SlChart />
                          </Link>
                        )}
                      </div>
                    </td>
                  )}
                  <td className="px-6 py-4">
                    <FiEdit onClick={() => handleShowEditModal(fila)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showEditConsumableModal && (
          <EditConsumableForm
          aux={aux}
          setAux={setAux}
          setEditConsumableModal={setEditConsumableModal}
          productData={productData}
          user={user}
          />
        )}
      </>
    );
  } else {
    return <Loader />;
  }
};

export default ConsumablesTable;