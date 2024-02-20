// assets and icons
import { CiBellOn } from "react-icons/ci";
import { IoExitOutline } from "react-icons/io5";
import { TbStatusChange } from "react-icons/tb";
import { MdDarkMode } from "react-icons/md";
import { MdLightMode } from "react-icons/md";

// hooks, routers, reducers:
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { eraseNotification, getcalendarcount, setLogout } from "../redux/actions.js";

//functions
import capitalizeFirstLetter from "../functions/capitalizeFirstLetter.js"

//variables de entorno
import getParamsEnv from "../functions/getParamsEnv.js";
const { ROOT, HOME, AGENDA, BRANCH } = getParamsEnv();

const SSadminNavBar = () => {
  const [theme, setTheme] = useState(JSON.parse(localStorage.getItem("darkMode")) ? JSON.parse(localStorage.getItem("darkMode")) : "light");
  

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const handleDarkMode = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("darkMode", JSON.stringify(newTheme));
  };

/*   const getCalendarCount = {
    branchID: workingBranch.id,
    userID: user.id,
    token
  } */

  useEffect(() => {
    const storedTheme = JSON.parse(localStorage.getItem("darkMode"));
    if (storedTheme === "light" || !storedTheme) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }

  }, [theme]);

  const handleLogout = () => {
    dispatch(setLogout(user.token));
    navigate(ROOT);
  };


  const showRed = localStorage.getItem('showRed');

  return (
    <>
      <nav
       className={`h-20 flex pr-10 justify-between items-center shadow-md bg-gradient-to-r from-blue-200 to-blue-500`}
        
      >
        <div className="flex flex-row items-center gap-5">
          

            <Link to={HOME}>
              <img
                className="hidden sm:flex w-24"
                src={
                  "https://res.cloudinary.com/doyafxwje/image/upload/v1707517244/Logos/beuatycontrol-logo_hlmilv.png"
                }
                alt="logo"
              />
            </Link>
        </div>
        <div className="flex gap-4 ml:10 sm:ml-28 items-center pointer-events:auto ">
          <span className=" text-center font-extrabold sm:text-lg">
            {" "}
            Control de Empresas
          </span>
        </div>
        <div className="flex gap-4 items-center pointer-events:auto">
          {theme==="light" ?
          <MdDarkMode
            onClick={handleDarkMode}
            className="h-6 w-6 cursor-pointer"
          />
          :
          <MdLightMode
            onClick={handleDarkMode}
            className="h-6 w-6 cursor-pointer"
          />}
          <Link to={ROOT}>
            <IoExitOutline className="h-6 w-6 " onClick={handleLogout} />
          </Link>
        </div>
      </nav>
    </>
  );
};


export default SSadminNavBar;
