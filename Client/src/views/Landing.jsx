import { Link } from "react-router-dom";
//import React from "react";
import { AiFillInstagram } from "react-icons/ai";
import { AiFillFacebook } from "react-icons/ai";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { setLogout } from "../redux/actions.js";

//Variables de entorno
import getParamsEnv from "../functions/getParamsEnv.js";
const { LOGIN, HOME, AGENDA, ROOT, DEVELOPEDBY } = getParamsEnv();

// assets and icons
import { IoExitOutline } from "react-icons/io5";
import { PiUserSwitchFill } from "react-icons/pi";

const Landing = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state?.token);
  const user = useSelector(state => state?.user)
  const branches = useSelector(state => state?.branches)
  const navigate = useNavigate();
  const [hayUser, setHayuser] = useState(false)
  const [showTeamDevModal, setShowTeamDevModal] = useState(false);

  useEffect(() => {
    // Preguntar si tengo almacenado un token de antes:
    if (token) {
      setHayuser(true);
    } else {
      setHayuser(false);
    }
  }, [token]);

  const handleLogin = () => {
    if (hayUser) {
      // Hay un usuario registrado desde antes, no lo hago loguear:
      if (user.role === "superAdmin") {
        navigate(HOME)
      } else {
        navigate(AGENDA)
      }
    } else {
      // Primer ingreso, lo hago validar usuario:
      navigate(LOGIN);
    }
  }

  const handleLogout = () => {
    dispatch(setLogout(user.token));
    navigate(ROOT);
  };

  return (
    <section>
      <div id="home" className="bg-[url('https://res.cloudinary.com/doyafxwje/image/upload/v1703631707/Landing/dccy66yweqbiqi8at8um.jpg')] bg-cover bg-center flex flex-col justify-between h-screen lg:py-0">
        <nav className="flex flex-row items-center justify-between px-10 h-20 bg-transparent">
          <ul className="flex flex-row gap-5">
            <li className="text-black hover:text-blue-500 ">
              <Link
                to=""
                target="_blank"
              >
                <AiFillFacebook className="h-10 w-10 cursor-pointer" />
              </Link>
            </li>
            <li className="text-black hover:text-primaryPink ">
              <Link
                to=""
                target="_blank"
              >
                <AiFillInstagram className="h-10 w-10 cursor-pointer" />
              </Link>
            </li>
            <li
              className="flex items-center shadow-md shadow-black rounded-2xl border-1 border-black border-double bg-beige font-medium px-5 cursor-pointer hover:scale-105"
              onClick={handleLogin}
            >
              {hayUser ? `${user.name} ${user.lastName}` : "Iniciar sesión"}
            </li>
            <li>
            {hayUser && (
              <PiUserSwitchFill className="h-10 w-10 cursor-pointer " onClick={handleLogout} />
            )}
            </li>
          </ul>
        </nav>
        <div>
          <h1 className="w-full text-center text-[100px] font-bold font-fontTitle tracking-widest ">
            Beauty Control
          </h1>
        </div>
        <footer
          className="text-md flex justify-end items-center h-20 pr-10">
          <Link to={DEVELOPEDBY} className="font-medium hover:underline hover:scale-110" >
            @Developed by
          </Link>
        </footer>
      </div>
      {/* <div className="grid grid-cols-1 place-items-center gap-10 mb-5 place-content-between sm:grid-cols-2 2xl:grid-cols-4 2xl:my-auto ">
          <div className="w-80 h-96 rounded-xl shadow-xl shadow-black bg-[url(https://res.cloudinary.com/doyafxwje/image/upload/v1702824197/Landing/a2ugvpzuvmjquvsyiwbk.jpg)] bg-cover bg-center flex flex-col items-center justify-end group">
            <span className="bg-black text-beige px-5 rounded-md mb-5 opacity-0 transition-opacity duration-1000 group-hover:opacity-100 ">
              Servicios personalizados
            </span>
          </div>
          <div className=" w-80 h-96 rounded-xl shadow-xl shadow-black bg-[url(https://res.cloudinary.com/doyafxwje/image/upload/v1702824197/Landing/cnqujn8oeh8x6jfac8ib.jpg)] bg-cover bg-center flex flex-col items-center justify-end group">
            <span className="bg-black text-beige px-5 rounded-md mb-5 opacity-0 transition-opacity duration-1000 group-hover:opacity-100 ">
              Eyelashes extensions
            </span>
          </div>
          <div className="w-80 h-96 rounded-xl shadow-xl shadow-black bg-[url(https://res.cloudinary.com/doyafxwje/image/upload/v1702824309/Landing/eetjnrejl6r30zhcy5md.jpg)] bg-cover bg-center flex flex-col items-center justify-end group">
            <span className="bg-black text-beige px-5 rounded-md mb-5 opacity-0 transition-opacity duration-1000 group-hover:opacity-100 ">
              Hydra Glow
            </span>
          </div>
          <div className="w-80 h-96 rounded-xl shadow-xl shadow-black bg-[url(https://res.cloudinary.com/doyafxwje/image/upload/v1702824196/Landing/izc72gdriptgh8cf4oft.jpg)] bg-cover bg-center flex flex-col items-center justify-end group">
            <span className="bg-black text-beige px-5 rounded-md mb-5 opacity-0 transition-opacity duration-1000 group-hover:opacity-100 ">
              Microblading
            </span>
          </div>
        </div> */}
    </section>
  );
};

export default Landing;
