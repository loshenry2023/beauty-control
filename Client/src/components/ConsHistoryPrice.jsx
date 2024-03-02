import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import BarChartComponent from "./BarChartComponent";
import { IoMdArrowRoundBack } from "react-icons/io";

import Loader from "./Loader";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import Restricted from "../views/Restricted";
import ErrorToken from "../views/ErrorToken";
import axios from "axios";
import getParamsEnv from "../functions/getParamsEnv";
import { useRef } from "react";

const { API_URL_BASE } = getParamsEnv()

const ConsHistoryPrice = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  let { productId } = useParams()
  const navigate = useNavigate();
  const user = useSelector((state) => state?.user);
  const tokenError = useSelector((state) => state?.tokenError);
  const token = useSelector((state) => state?.token);
  const workingBranch = useSelector((state) => state?.workingBranch);
  const [historic, setHistoric] = useState(null)
  const [prices, setPrices] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const isRequestMade = useRef(false); // Utilizando useRef para mantener una referencia mutable

  useEffect(() => {
    if (!isRequestMade.current) {
      const fetchData = () => {
        isRequestMade.current = true;

        const data = {
          branchId: workingBranch.id,
          productCode: productId,
          token
        };

       

        return axios.post(`${API_URL_BASE}/v1/productsHist`, data)
          .then(response => {
            setHistoric(response.data);

            let historicPrices = [];
            response.data?.rows?.forEach((history) => {
              historicPrices.push(Math.floor(history.price));
            });
            setPrices(historicPrices);
            setIsLoading(false);
          })
          .catch(error => {
            console.error("Error fetching data:", error);
          });
      };

      fetchData();
    }
  }, []);

  const handleGoBack = () => {
    navigate("/consumables");
  };

  if (isLoading) {
    return (
      <div>
        <NavBar />
        <div className="flex flex-row">
          <SideBar />
          <div className="flex flex-col w-full dark:bg-darkBackground">
            <Loader />
          </div>
        </div>
      </div>
    );
  } else if (tokenError === 401 || tokenError === 403) {
    return <ErrorToken error={tokenError} />;
  } else {
    return (
      <div>
        <NavBar />
        <div className="flex flex-row">
          <SideBar />
          <div className="flex flex-col w-full dark:bg-darkBackground">
            <div className="flex flex-row justify-center w-full p-4 mt-10">
              <span>
                {" "}
                <IoMdArrowRoundBack
                  onClick={handleGoBack}
                  className="cursor-pointer mt-2 w-5 h-5 text-black dark:text-darkText mr-2"
                />
              </span>
              <h1 className="text-3xl text-black font-semibold mb-4 dark:text-darkText ">
                Historial de Precios
              </h1>
            </div>
            <div className="w-full flex flex-row mx-auto">
              <div className="w-1/3 bg-white rounded-lg p-6 dark:bg-darkBackground">
                <table className="'border border-black w-full  text-left rtl:text-right text-black dark:text-beige dark:border-beige'">
                  <thead className="bg-secondaryColor text-black text-left dark:bg-darkPrimary dark:text-darkText dark:border-secondaryColor">
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
                    {historic?.rows.map((history, index) => (
                      <tr
                        key={index}
                        className="text-md hover:bg-gray-200 cursor-pointer dark:hover:bg-gray-200 dark:hover:text-black"
                      >
                        <td className="px-6 py-4 w-1/2">{Math.floor(history.price)}</td>
                        <td className="px-6 py-4 w-1/2">
                          {new Date(history.date).toLocaleString().split(",")[0]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className=" px-6 py-4 w-2/3">
                {historic && (
                  <BarChartComponent
                    data={historic.rows}
                    colors={["#FFC8C8"]}
                    name="Precio"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default ConsHistoryPrice;
