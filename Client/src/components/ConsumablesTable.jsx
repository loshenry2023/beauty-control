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

const ConsumablesTable = ({ products, user, onClose }) => {
  const navigate = useNavigate();
  const [productsData, setProductsData] = useState(products);

  const [showEditConsumableModal, setEditConsumableModal] = useState(false);
  const [code, setCode] = useState("");

  const handleShowEditModal = (fila) => {
    setEditConsumableModal(true);
    setCode(fila);
  };

  useEffect(() => {}, [productsData]);

  if (products && products.rows && Array.isArray(products.rows)) {
    return (
      <>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="border border-black w-full text-sm text-left rtl:text-right text-black dark:text-beige dark:border-beige">
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
              {products.rows.map((fila, index) => (
                <tr
                  props={fila}
                  key={index}
                  className="text-xs hover:bg-gray-200 cursor-pointer dark:hover:bg-gray-200 dark:hover:text-black"
                >
                  <td className="px-6 py-4">{fila.productCode}</td>
                  <td className="px-6 py-4">{fila.productName}</td>
                  <td className="px-6 py-4">{fila.description}</td>
                  <td className="px-6 py-4">{fila.supplier}</td>
                  <td className="px-6 py-4">{fila.amount}</td>
                  <td className="px-6 py-4">
                    {fila.Branch && Array.isArray(fila.Branch)
                      ? fila.Branch.map((branch) => branch.branchName).join(
                          ", "
                        )
                      : fila.Branch && fila.Branch.branchName}
                  </td>
                  {user?.role !== "admin" && (
                    <td className="px-6 py-4">
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {fila.PriceHistories.length > 0
                          ? fila.PriceHistories.map((priceHistory, index) => (
                              <span key={index}>
                                {priceHistory.price}
                                {index < fila.PriceHistories.length - 1 && ", "}
                              </span>
                            ))
                          : "No history"}
                        {user?.role === "superAdmin" && fila.code && (
                          <Link
                            to={`${HISTORYPRICEBASE}/${fila.code}`}
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
                    <FiEdit onClick={() => handleShowEditModal(fila.code)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showEditConsumableModal && (
          <EditConsumableForm
            onClose={onClose}
            setEditConsumableModal={setEditConsumableModal}
            code={code}
            setProductsData={setProductsData}
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
