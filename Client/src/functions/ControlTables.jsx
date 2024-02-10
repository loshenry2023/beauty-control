import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import ServicesTable from "../components/ServicesTable";
import PayMethodsTable from "../components/PayMethodsTable";
import BranchTable from "../components/BranchTable";
import SpecialtiesTable from "../components/SpecialtiesTable";
import ErrorToken from "../views/ErrorToken";
import { getBranches, getServices, getSpecialties } from "../redux/actions";
import ToasterConfig from "../components/Toaster";

import { useDispatch, useSelector } from "react-redux";

const ControlTables = () => {
  const [activeTab, setActiveTab] = useState("clients");

  const clients = useSelector((state) => state?.clients);
  const count = useSelector((state) => state?.countClient);
  const token = useSelector((state) => state?.token);
  const tokenError = useSelector((state) => state?.tokenError);
  const methods = useSelector((state) => state?.payMethods);
  const branches = useSelector((state) => state?.branches);
  const dispatch = useDispatch();

  const renderTabContent = () => {
    switch (activeTab) {
      case "clients":
        return (
          <div className="flex flex-col mt-10 gap-5 w-2/3 mx-auto">
            <ServicesTable />;
          </div>
        );
      case "PayMethods":
        return (
          <div className="flex flex-col mt-10 gap-5 w-2/3 mx-auto">
            <PayMethodsTable methods={methods} />;
          </div>
        );
      case "branches":
        return (
          <div className="flex flex-col mt-10 gap-5 w-2/3 mx-auto">
            <BranchTable branches={branches} />;
          </div>
        );
      case "specialties":
        return (
          <div className="flex flex-col mt-10 gap-5 w-2/3 mx-auto">
            <SpecialtiesTable />;
          </div>
        );
      default:
        return null;
    }
  };

  if (tokenError === 401 || tokenError === 403) {
    return <ErrorToken error={tokenError} />;
  } else {
    return (
      <>
      <div className="flex flex-col h-screen">
        <NavBar />
        <div className="flex flex-row flex-grow dark:bg-darkBackground">
          <SideBar />
          <div className="flex flex-col w-full p-4 items-center mx-auto">
            <div className="flex items-center justify-center mb-4">
              <h1 className="text-2xl underline underline-offset-4 tracking-wide text-center font-fontTitle dark:text-beige sm:text-left">
                Control de tablas
              </h1>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 md:gap-8 justify-center sm:justify-start">
              <button
                className={`mb-2 w-full sm:w-auto px-2 md:px-4 py-1 md:py-2 bg-gray-300 text-black rounded ${
                  activeTab === "clients" && "bg-secondaryColor"
                }`}
                onClick={() => setActiveTab("clients")}
              >
                Procedimientos
              </button>
              <button
                className={`mb-2 w-full sm:w-auto px-2 md:px-4 py-1 md:py-2 bg-gray-300 text-black rounded ${
                  activeTab === "PayMethods" && "bg-secondaryColor"
                }`}
                onClick={() => setActiveTab("PayMethods")}
              >
                Medios de Pago
              </button>
              <button
                className={`mb-2 w-full sm:w-auto px-2 md:px-4 py-1 md:py-2 bg-gray-300 text-black rounded ${
                  activeTab === "branches" && "bg-secondaryColor"
                }`}
                onClick={() => setActiveTab("branches")}
              >
                Sedes
              </button>
              <button
                className={`mb-2 w-full sm:w-auto px-2 md:px-4 py-1 md:py-2 bg-gray-300 text-black rounded ${
                  activeTab === "specialties" && "bg-secondaryColor"
                }`}
                onClick={() => setActiveTab("specialties")}
              >
                Especialidades
              </button>
            </div>
            {renderTabContent()}
          </div>
        </div>
      </div>
      <ToasterConfig />
      </>
    );
  }
};

export default ControlTables;
