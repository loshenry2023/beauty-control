// hooks, routers, reducers:
import React from "react";

//Components
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import UserInfo from "../components/UserInfo";
import { useSelector } from "react-redux";
import Restricted from "./Restricted";

const UserDetail = () => {

  const user = useSelector(state => state?.user)


  return (
    //! falta componente para renderizar details
    <div className="relative">
      <NavBar />
      <div className="flex flex-row dark:bg-darkBackground">
        <SideBar />
        {user?.role === "superAdmin" || user?.role === "admin" ?
          <UserInfo /> : (
          <Restricted />)}
      </div>
    </div>
  );
};

export default UserDetail;
