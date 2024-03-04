import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import ServicesTable from "../components/ServicesTable";
import PayMethodsTable from "../components/PayMethodsTable";
import BranchTable from "../components/BranchTable";
import SpecialtiesTable from "../components/SpecialtiesTable";
import ErrorToken from "../views/ErrorToken";

import { useSelector } from "react-redux";

const ControlTables = () => {
  const [activeTab, setActiveTab] = useState("services");

  const tokenError = useSelector((state) => state?.tokenError);
  const methods = useSelector((state) => state?.payMethods);
  const branches = useSelector((state) => state?.branches);

  const renderTabContent = () => {
    switch (activeTab) {
      case "services":
        return (
          <div className="flex flex-col mt-5 gap-5 w-2/3 mx-auto">
            <ServicesTable />
          </div>
        );
      case "PayMethods":
        return (
          <div className="flex flex-col mt-5 gap-5 w-2/3 mx-auto">
            <PayMethodsTable methods={methods} />
          </div>
        );
      case "branches":
        return (
          <div className="flex flex-col mt-5 gap-5 w-2/3 mx-auto">
            <BranchTable branches={branches} />
          </div>
        );
      case "specialties":
        return (
          <div className="flex flex-col mt-5 gap-5 w-2/3 mx-auto">
            <SpecialtiesTable />
          </div>
        );
      default:
        return null;
    }
  };

  if (tokenError === 401 || tokenError === 402 || tokenError === 403) {
    return <ErrorToken error={tokenError} />;
  } else {
    return (
      <div className="flex flex-col h-screen">
        <NavBar />
        <div className="flex flex-row flex-grow dark:bg-darkBackground">
          <SideBar />
          <div className="flex flex-col w-full p-4 items-center mx-auto">
            <div className="flex items-center justify-center mt-10 mb-5">
              <h1 className="text-3xl underline underline-offset-4 tracking-wide text-center font-fontTitle dark:text-beige sm:text-left">
                Control de tablas
              </h1>
            </div>
            <div className="flex flex-col md:flex-row gap-2 sm:gap-4 md:gap-8 justify-center sm:justify-start">
              <button
                className={
                  activeTab === "services"
                    ? "mb-2 w-full sm:w-auto px-2 md:px-4 py-1 md:py-2 bg-primaryColor text-white font-medium rounded transition-colors duration-500"
                    : "mb-2 w-full sm:w-auto px-2 md:px-4 py-1 md:py-2 bg-secondaryColor text-black rounded"
                }
                onClick={() => setActiveTab("services")}
              >
                Procedimientos
              </button>
              <button
                className={
                  activeTab === "PayMethods"
                    ? "mb-2 w-full sm:w-auto px-2 md:px-4 py-1 md:py-2 bg-primaryColor text-white font-medium rounded transition-colors duration-500"
                    : "mb-2 w-full sm:w-auto px-2 md:px-4 py-1 md:py-2 bg-secondaryColor text-black rounded"
                }
                onClick={() => setActiveTab("PayMethods")}
              >
                Medios de Pago
              </button>
              <button
                className={
                  activeTab === "branches"
                    ? "mb-2 w-full sm:w-auto px-2 md:px-4 py-1 md:py-2 bg-primaryColor text-white font-medium rounded transition-colors duration-500"
                    : "mb-2 w-full sm:w-auto px-2 md:px-4 py-1 md:py-2 bg-secondaryColor text-black rounded"
                }
                onClick={() => setActiveTab("branches")}
              >
                Sedes
              </button>
              <button
                className={
                  activeTab === "specialties"
                    ? "mb-2 w-full sm:w-auto px-2 md:px-4 py-1 md:py-2 bg-primaryColor text-white font-medium rounded transition-colors duration-500"
                    : "mb-2 w-full sm:w-auto px-2 md:px-4 py-1 md:py-2 bg-secondaryColor text-black rounded"
                }
                onClick={() => setActiveTab("specialties")}
              >
                Especialidades
              </button>
            </div>
            {renderTabContent()}
          </div>
        </div>
      </div>
    );
  }
};

export default ControlTables;
