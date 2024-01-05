import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductPricesHistory,
  clearProductPricesHistory,
} from "../redux/actions";
import { useNavigate } from "react-router-dom";
import BarChartComponent from "./BarChartComponent";
import { IoMdArrowRoundBack } from "react-icons/io";

import Loader from "./Loader";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import Error from "../views/Error";
import Restricted from "../views/Restricted";

const ConsHistoryPrice = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [productName, setProductName] = useState(""); //para traer nombre
  const navigate = useNavigate();

  const pricesHistory = useSelector((state) => state?.pricesHistory);
  const user = useSelector((state) => state?.user);

  useEffect(() => {
    // Llamar a la acción para obtener el historial de precios y el nombre del producto
    setLoading(true);
    dispatch(getProductPricesHistory(productId));
    setLoading(false);

    // Deshabilito código que no llega a obtener los datos a tiempo (no funciona el then con un dispatch):
    // .then((history) => {
    //   // Obtener el nombre del producto desde la primera entrada del historial
    //   if (history.length > 0) {
    //     setProductName(history[0].productName);
    //     console.log("FIN ", pricesHistory);
    //     console.log("name ", history[0].productName);
    //     setLoading(false);
    //   }
    // })
    // .catch((error) => {
    //   console.log("ERR ", error);
    //   setLoading(false);
    // });
    return () => {
      dispatch(clearProductPricesHistory());
    };
  }, [dispatch, productId]);

  const handleGoBack = () => {
    navigate("/consumables");
  };

  return (
    <div>
      <NavBar />
      <div className="flex flex-row">
        <SideBar />
        {loading ? (
          <Loader />
        ) : (
          user !== "superAdmin" ? <Restricted /> : 
          <div className="flex flex-col w-full dark:bg-darkBackground">
            <div className="flex flex-row justify-center w-full p-4 mt-10">
              <span>
                {" "}
                <IoMdArrowRoundBack
                  onClick={handleGoBack}
                  className="cursor-pointer mt-2 w-5 h-5 text-black dark:text-darkText mr-2"
                />
              </span>
              <h1 className="text-xl text-black font-semibold mb-4 dark:text-darkText ">
                {/* Historial de Precios - {pricesHistory[0]?.productName} */}
                Historial de Precios
              </h1>
            </div>
            <div className="w-full flex flex-row mx-auto">
              <div className="w-1/3 bg-white rounded-lg p-6 dark:bg-darkBackground">
                <table className="'border border-black w-full text-sm text-left rtl:text-right text-black dark:text-beige dark:border-beige'">
                  <thead className="bg-secondaryPink text-black text-left dark:bg-darkPrimary dark:text-darkText dark:border-grey">
                    <tr>
                      <th scope="col" className="px-6 py-3 w-1/2">
                        Precio
                      </th>
                      <th scope="col" className="px-6 py-3 w-1/2">
                        Fecha de Modificación
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pricesHistory?.map((history, index) => (
                      <tr
                        key={index}
                        className="text-md hover:bg-gray-200 cursor-pointer dark:hover:bg-gray-200 dark:hover:text-black"
                      >
                        <td className="px-6 py-4 w-1/2">{history.price}</td>
                        <td className="px-6 py-4 w-1/2">
                          {new Date(history.dateModification).toLocaleString().split(",")[0]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-sm px-6 py-4 w-2/3">
                <BarChartComponent
                  data={pricesHistory}
                  colors={["#FFC8C8"]}
                  name="Precio"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsHistoryPrice;
