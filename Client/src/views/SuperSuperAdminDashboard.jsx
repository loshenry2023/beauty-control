import React, { useEffect } from "react";


import SSadminNavBar from "../components/SSadminNavBar";
import ControlCompany from "../components/ControleCompany";

const SuperSuperAdminDashboard = () => {
    return (
      <>
        <div className="h-full dark:bg-darkBackground">
          <SSadminNavBar />
          <div className="w-full pt-5">
            <ControlCompany />
          </div>
        </div>
      </>
    );
  }


export default SuperSuperAdminDashboard;
