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
import { FaArrowRight } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import { PiUserSwitchFill } from "react-icons/pi";

const Landing = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state?.token);
  const user = useSelector((state) => state?.user);
  const branches = useSelector((state) => state?.branches);
  const navigate = useNavigate();
  const [hayUser, setHayuser] = useState(false);
  const [showInfo, setShowInfo] = useState(0);
  const [auxNosotros, setAuxNosotros] = useState(true);
  const [auxMision, setAuxMision] = useState(true);
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
        navigate(HOME);
      } else {
        navigate(AGENDA);
      }
    } else {
      // Primer ingreso, lo hago validar usuario:
      navigate(LOGIN);
    }
  };

  const handleLogout = () => {
    dispatch(setLogout(user.token));
    navigate(ROOT);
  };


  const onClickNosotros = () => {
    setShowInfo(prevShowInfo => prevShowInfo === 1 ? 0 : 1);
  }

  const onClickMision = () => {
    setShowInfo(prevShowInfo => prevShowInfo === 2 ? 0 : 2);
  }

  return (
    <section>
      <div
        id="home"
        className="bg-white bg-cover bg-center flex flex-col h-screen lg:py-0"
      >
        <div>
          <nav className="relative bg-slate-800 overflow-hidden flex flex-row justify-between items-start">
            <img
              src="https://res.cloudinary.com/doyafxwje/image/upload/v1707517244/Logos/beuatycontrol-logo_hlmilv.png"
              alt=""
              className="h-40"
            />
            <ul className="z-10 pt-5 flex flex-row gap-5">
              <li className="text-white hover:text-[#D62598] ">
                <Link to="" target="_blank">
                  <AiFillFacebook className="h-10 w-10 cursor-pointer" />
                </Link>
              </li>
              <li className="text-white hover:text-[#D62598] ">
                <Link to="" target="_blank">
                  <AiFillInstagram className="h-10 w-10 cursor-pointer" />
                </Link>
              </li>
              <li
                className="flex items-center shadow-md shadow-black rounded-2xl border-1 border-black border-double bg-beige font-medium px-5 cursor-pointer hover:scale-105 hover:bg-[#D62598]"
                onClick={handleLogin}
              >
                {hayUser ? `${user.name} ${user.lastName}` : "Iniciar sesión"}
              </li>
              <li>
                {hayUser && (
                  <PiUserSwitchFill
                    className="h-10 w-10 cursor-pointer "
                    onClick={handleLogout}
                  />
                )}
              </li>
            </ul>
            <svg
              className="absolute bottom-0"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 320"
            >
              <path
                fill="#FFF"
                fill-opacity="1"
                d="M0,320L4200,128L1440,330L0,320Z"
              ></path>
            </svg>
          </nav>
        </div>
        <section className="my-20 h-full grid grid-cols-1 gap-2 xl:grid-cols-2 xl:w-full xl:px-20">
          <div className="px-2">
            <h1 className="text-center text-[50px] font-bold font-fontTitle xl:text-left ">
              Te damos la bienvenida a{" "}
              <span className="text-[#D62598]">Beauty Control</span>, tu nueva
              herramienta de gestión de negocios
            </h1>
            <div className="flex flex-col gap-5 mt-5">
              <p className="text-center font-fontBody text-xl tracking-widest xl:text-left">
                Te ofrecemos una solución integral para{" "}
                <span className="underline decoration-[#D62598] decoration-4 underline-offset-2">
                  optimizar
                </span>{" "}
                y{" "}
                <span className="underline decoration-[#D62598] decoration-4 underline-offset-2 ">
                  simplificar
                </span>{" "}
                la administración de tu negocio. Podrás gestionar todo lo
                relativo a tus clientes, calendarizar las citas y hasta ver un
                análisis de los ingresos de tu empresa.
              </p>
              <p className="text-center font-fontBody text-xl tracking-widest xl:text-left">
                Estamos aquí para ayudarte a alcanzar tus objetivos de manera{" "}
                <span className="underline decoration-[#D62598] decoration-4 underline-offset-2 ">
                  eficiente
                </span>{" "}
                y{" "}
                <span className="underline decoration-[#D62598] decoration-4 underline-offset-2 ">
                  organizada
                </span>{" "}
                .
              </p>
            </div>
          </div>
          <div className="p-4">
            <div className="relative p-0">
              {showInfo === 0 && (
                <img
                  src="https://res.cloudinary.com/doyafxwje/image/upload/v1708119187/1_Myyqz-dqw56aEvNPIEhn2A_kfxwp4.png"
                  alt=""
                />
              )}
              <div className="transition-all duration-3000 ease-out"  style={{ opacity: showInfo === 1 ? 1 : 0 }}>
              {showInfo === 1 && (
                <div className="pt-14 w-4/5 font-fontBody text-xl tracking-widest leading-8">
                    <img className="h-40 pr-10 float-right" src="https://res.cloudinary.com/doyafxwje/image/upload/v1708187276/Landing/vector-simple-purple-contrast-color-fresh-wind-business-man-working-with-computer-at-desk_2718496_gqqarq.jpg" alt="computer" />  
                    <p>
                    Somos una empresa dedicada a ofrecer <strong> soluciones tecnológicas</strong> diseñadas para potenciar el rendimiento y la eficiencia de los negocios dentro del sector del cuidado personal. Buscamos optimizar procesos para aumentar la rentabilidad y mejorar la <strong>atención al público</strong>.
                    Nuestro enfoque se centra en la aplicación de nuevas tecnologías para impulsar el <strong>crecimiento y la competitividad </strong>en un mercado en constante evolución, brindando soluciones a medida que satisfacen las necesidades específicas de cada empresa.
                    </p>
              </div>
              )}
              </div>
              <div className="transition-all duration-3000 ease-out"  style={{ opacity: showInfo === 2 ? 1 : 0 }}>
              {showInfo === 2 && (
                <div className="pt-14 w-4/5 font-fontBody text-xl tracking-widest leading-8">
                   <img className="h-40 p-1 float-right" src="https://res.cloudinary.com/doyafxwje/image/upload/v1708187561/Landing/Screenshot_1_qtc2l2.png" alt="computer" />  
                <p className="mb-5">
                Beauty Control cuenta con varias herramientas de gestión administrativa mediante las cuales vamos a poder: <strong> controlar inventarios, gestionar citas, dar de alta clientes o empleados, ver ingresos diarios o mensuales, etc.</strong>
                Buscamos agilizar procesos para que los empresarios y sus equipos puedan dedicar <strong> más atención a sus clientes y empleados, fortaleciendo así las relaciones humanas</strong> que son el corazón de cualquier negocio exitoso .
                <br /></p>
                <p>
                El servicio busca generar oportunidades y transformar la manera en que se conducen los negocios.
                </p>
              </div>
              )}
              </div>
              <ul className="absolute left-0 top-0 flex flex-row gap-4">
                <li
                  className={showInfo == 1 ? "w-fit bg-[#F3E500] px-4 py-2 rounded-xl shadow-sm shadow-black text-black font-bold cursor-pointer hover:scale-[1.02]" : "w-fit bg-slate-800 text-white px-4 py-2 rounded-xl shadow-sm shadow-black font-bold cursor-pointer hover:scale-[1.02]"}
                  onClick={onClickNosotros}
                >
                  {" "}
                  Nosotros{" "}
                </li>
                <li
                  className={showInfo == 2 ? "w-fit bg-[#F3E500] px-4 py-2 rounded-xl shadow-sm shadow-black text-black font-bold cursor-pointer hover:scale-[1.02]" : "w-fit bg-slate-800 text-white  px-4 py-2 rounded-xl shadow-sm shadow-black font-bold cursor-pointer hover:scale-[1.02]"}
                  onClick={onClickMision}
                >
                  {" "}
                  Nuestro servicio{" "}
                </li>
              </ul>
            </div>
          </div>
        </section>
        <footer className="relative h-full bg-slate-800 overflow-hidden flex flex-row justify-end items-end">
          <Link
            to={DEVELOPEDBY}
            className="z-10 text-white font-medium hover:text-[#D62598] p-6 tracking-widest"
          >
            @Developed by
          </Link>
          <svg className="absolute bottom-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#FFFF" fill-opacity="1" d="M0,320L1440,256L1440,0L0,0Z"></path></svg>
        </footer>
      </div>
    </section>
  );
};

export default Landing;
