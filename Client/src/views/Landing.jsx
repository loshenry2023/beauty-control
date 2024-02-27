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
const { LOGIN, HOME, AGENDA, ROOT, DEVELOPEDBY, SSADMIN } = getParamsEnv();

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
      if (user.role === "superAdmin") {
        navigate(HOME);
      } if (user.role === "superSuperAdmin"){
        navigate(SSADMIN)
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
    setShowInfo((prevShowInfo) => (prevShowInfo === 1 ? 0 : 1));
  };

  const onClickMision = () => {
    setShowInfo((prevShowInfo) => (prevShowInfo === 2 ? 0 : 2));
  };

  return (
    <section>
      <div
        id="home"
        className="bg-[url('https://images.unsplash.com/photo-1600948836101-f9ffda59d250?q=80&w=2036&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover flex flex-col h-screen lg:py-0"
      >
        <div>
          <nav className="relative overflow-hidden flex flex-row justify-between items-center">
            <img
              src="https://res.cloudinary.com/doyafxwje/image/upload/v1707517244/Logos/beuatycontrol-logo_hlmilv.png"
              alt=""
              className="h-40"
            />
            <ul className="z-2 pt-5 flex flex-row gap-5">
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
            {/* <svg
              className="absolute bottom-0"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 320"
            >
              <path
                fill="transparent"
                d="M0,320L4200,128L1440,330L0,320Z"
              ></path>
            </svg> */}
          </nav>
        </div>
        <section className="text-white  h-full place-items-center grid grid-cols-1 gap-2 xl:grid-cols-2 xl:w-full xl:px-20">
          <div className="px-2 ">
            <h1 className="text-text-[#D62598] text-center text-[50px] font-bold font-fontTitle xl:text-left ">
              Te damos la bienvenida a{" "}
              <span className="text-[#D62598]">Beauty Control</span>, tu nueva
              herramienta de gestión de negocios
            </h1>
            <div className="flex flex-col gap-5 mt-5 p-5 rounded-2xl">
              <p className="text-center font-fontBody text-2xl tracking-widest xl:text-left">
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
            <div
                className="transition-all h-full duration-3000 ease-out"
                style={{ opacity: showInfo === 1 ? 1 : 0 }}
              >
                {showInfo === 0 && (
                  <div className="text-white pt-14 w-4/5 font-fontBody text-2xl tracking-widest leading-8">
                  <p className="p-5 rounded-2xl">
                    Somos una empresa dedicada a ofrecer{" "}
                    <strong className="text-[#D62598]">
                      {" "}
                      soluciones tecnológicas
                    </strong>{" "}
                    diseñadas para potenciar el rendimiento y la eficiencia de
                    los negocios dentro del sector del cuidado personal.
                    Buscamos optimizar procesos para aumentar la rentabilidad
                    y mejorar la <strong>atención al público</strong>. Nuestro
                    enfoque se centra en la aplicación de nuevas tecnologías
                    para impulsar el{" "}
                    <strong className="text-[#D62598]">
                      crecimiento y la competitividad{" "}
                    </strong>
                    en un mercado en constante evolución, brindando soluciones
                    a medida que satisfacen las necesidades específicas de
                    cada empresa.
                  </p>
                </div>
                )}
              </div>
              <div
                className="transition-all duration-3000 ease-out"
                style={{ opacity: showInfo === 1 ? 1 : 0 }}
              >
                {showInfo === 1 && (
                  <div className="text-white pt-14 w-4/5 font-fontBody text-2xl tracking-widest leading-8">
                    <p className="p-5 rounded-2xl">
                      Somos una empresa dedicada a ofrecer{" "}
                      <strong className="text-[#D62598]">
                        {" "}
                        soluciones tecnológicas
                      </strong>{" "}
                      diseñadas para potenciar el rendimiento y la eficiencia de
                      los negocios dentro del sector del cuidado personal.
                      Buscamos optimizar procesos para aumentar la rentabilidad
                      y mejorar la <strong>atención al público</strong>. Nuestro
                      enfoque se centra en la aplicación de nuevas tecnologías
                      para impulsar el{" "}
                      <strong className="text-[#D62598]">
                        crecimiento y la competitividad{" "}
                      </strong>
                      en un mercado en constante evolución, brindando soluciones
                      a medida que satisfacen las necesidades específicas de
                      cada empresa.
                    </p>
                  </div>
                )}
              </div>
              <div
                className="transition-all duration-3000 ease-out"
                style={{ opacity: showInfo === 2 ? 1 : 0 }}
              >
                {showInfo === 2 && (
                  <div className="text-white pt-14 w-4/5 font-fontBody text-2xl tracking-widest leading-8">
                    <p className="p-5 rounded-2xl">
                      Beauty Control cuenta con varias herramientas de gestión
                      administrativa mediante las cuales vamos a poder:{" "}
                      <strong className="text-[#D62598]">
                        {" "}
                        controlar inventarios, gestionar citas, dar de alta
                        clientes o empleados, ver ingresos diarios o mensuales,
                        etc.
                      </strong>
                      Buscamos agilizar procesos para que los empresarios y sus
                      equipos puedan dedicar{" "}
                      <strong className="text-[#D62598]">
                        {" "}
                        más atención a sus clientes y empleados, fortaleciendo
                        así las relaciones humanas
                      </strong>{" "}
                      que son el corazón de cualquier negocio exitoso .
                      <br />
                      El servicio busca generar oportunidades y transformar la
                      manera en que se conducen los negocios.
                    </p>
                  </div>
                )}
              </div>
              <ul className="absolute left-0 top-0 flex flex-row gap-4">
                <li
                  className={
                    showInfo == 1
                      ? "w-fit bg-[#F3E500] px-4 py-2 rounded-xl shadow-sm shadow-black text-black font-bold cursor-pointer hover:scale-[1.02]"
                      : "w-fit bg-[#111d1f] text-white px-4 py-2 rounded-xl shadow-sm shadow-white font-bold cursor-pointer hover:scale-[1.02]"
                  }
                  onClick={onClickNosotros}
                >
                  {" "}
                  Nosotros{" "}
                </li>
                <li
                  className={
                    showInfo == 2
                      ? "w-fit bg-[#F3E500] px-4 py-2 rounded-xl shadow-sm shadow-black text-black font-bold cursor-pointer hover:scale-[1.02]"
                      : "w-fit bg-[#111d1f] text-white px-4 py-2 rounded-xl shadow-sm shadow-white font-bold cursor-pointer hover:scale-[1.02]"
                  }
                  onClick={onClickMision}
                >
                  {" "}
                  Nuestro servicio{" "}
                </li>
              </ul>
            </div>
          </div>
        </section>
        <Link
            to={DEVELOPEDBY}
            className="z-10 text-black text-right font-bold hover:text-[#D62598] p-6 tracking-widest"
          >
            @Developed by
          </Link>
      </div>
    </section>
  );
};

export default Landing;
