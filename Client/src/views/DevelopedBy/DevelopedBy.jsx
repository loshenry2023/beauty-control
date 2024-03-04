import React, { useEffect } from "react";
import ToasterConfig from "../../components/Toaster";
import { toast } from 'react-hot-toast'

//! Import styles module css
import styles from "./DevelopedBy.module.css";

//icons
import { IoLogoGithub, IoLogoLinkedin, IoMail } from "react-icons/io5";

// Variables de entorno
import getParamsEnv from "../../functions/getParamsEnv";
import { useNavigate } from "react-router-dom";
const { ROOT } = getParamsEnv();

const DevelopedBy = () => {
  const navigate = useNavigate()
  const storedTheme = JSON.parse(localStorage.getItem("darkMode"));
  const teamDev = [
    {
      name: "Tomas Bombau",
      role: "Full Stack Developer",
      foto: "https://res.cloudinary.com/desaac6ma/image/upload/v1704994106/samples/FOTOS/fotor-20240111122142-removebg-preview_wgjjd3.png",
      linkedin:
        "https://www.linkedin.com/in/tom%C3%A1s-ignacio-bombau-049a52139/",
      github: "https://github.com/Tomas-Bombau",
      email: "tomas.bombau@gmail.com",
    },
    {
      name: "Ramiro Alet",
      role: "Full Stack Developer",
      foto: "https://res.cloudinary.com/desaac6ma/image/upload/v1704990122/samples/FOTOS/photo1_yxjjoi-removebg-preview_hvlpsi.png",
      linkedin: "https://www.linkedin.com/in/ramiro-alet/",
      github: "https://github.com/ralet11",
      email: "ramiro.alet@gmail.com",
    },
    {
      name: "Paulo Vinci",
      role: "Full Stack Developer",
      foto: "https://res.cloudinary.com/desaac6ma/image/upload/v1704905834/samples/FOTOS/Vana_Studio_-_Portrait_of_at_the_office_detailed_face_imaginative_fantasy_concept_art_style_by_loish_3_1_vz1gdo-removebg-preview_c2ylfg.png",
      linkedin: "https://www.linkedin.com/in/paulo-damian-vinci/",
      github: "https://github.com/PauloDamianVinci",
      email: "paulodamianvinci@gmail.com",
    },
  ];

  useEffect(() => {
    if (storedTheme === "light" || !storedTheme) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  }, []);
  const style =
    "fixed w-screen h-screen bg-gradient-to-br from-purple-500 via-pink-300 to-fuchsia-500 dark:bg-gradient-to-br dark:from-gray-600 dark:via-slate-900 dark:to-black";
  return (
    <div>
      <div className={`${style} ${styles.BackgroundAnimate}`}></div>
      <div className="relative flex pt-5 h-screen md:w-auto  justify-center text-center ">
        <div className="pb-0 mb-0 bg-transparent">
          <h2 className="drop-shadow-2xl text-gray-700 mb-32 text-3xl font-bold dark:text-darkText">
            Development{" "}
            <i className="drop-shadow-2xl text-black dark:text-primaryPink">
              team
            </i>
          </h2>

          <div className="flex flex-row flex-wrap justify-center rounded gap-x-28 gap-y-32 mx-auto snap-y bg-transparent">
            {teamDev.map((member, index) => (
              <div
                key={index}
                className=" flex flex-col flex-wrap justify-center h-40 w-80 bg-transparent"
              >
                <div
                  className="block h-48 rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-darkBackground"
                  style={{ background: "rgba(255, 255, 255, 0.10)" }}
                >
                  <div className="flex justify-center">
                    <div className="flex rounded-full justify-center -mt-[75px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-100 via-gray-500 to-gray-800">
                      <img
                        src={member.foto}
                        className="mx-auto rounded-full shadow-lg dark:shadow-black/20 w-[150px]"
                        alt="Avatar"
                      />
                    </div>
                  </div>
                  <div className="p-0 m-0">
                    <h5 className="mb-1 text-lg font-bold dark:text-darkText">
                      {member.name}
                    </h5>
                    <p className="drop-shadow-2xl mb-3 dark:text-darkText">
                      {member.role}
                    </p>
                    <ul className="mx-auto flex list-inside justify-center">
                      <a
                        href={member.github}
                        className="drop-shadow-md text-gray-900 px-2 hover:text-white hover:scale-110 dark:hover:text-white dark:text-primaryPink"
                        target="_blank"
                      >
                        <IoLogoGithub className=" mb-1 text-3xl font-bold" />
                      </a>
                      <a
                        href={member.linkedin}
                        className="drop-shadow-md text-gray-900 px-2 hover:text-white hover:scale-110 dark:hover:text-white dark:text-primaryPink"
                        target="_blank"
                      >
                        <IoLogoLinkedin className="mb-1 text-3xl font-bold" />
                      </a>
                      <a
                        className="drop-shadow-md cursor-pointer text-gray-900 px-2 hover:text-white hover:scale-110 dark:hover:text-white dark:text-primaryPink"
                        target="_blank"
                      >
                        <IoMail onClick={() => { navigator.clipboard.writeText(member.email), toast(`Dirección ${member.email} copiada al portapapeles`) }} className="mb-1 text-3xl font-bold" />
                      </a>
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => navigate(ROOT)} className="mt-20 mb-20 drop-shadow-2xl border p-2 rounded-2xl text-2xl font-bold transition duration-700 hover:text-primaryPink dark:hover:bg-primaryPink dark:hover:text-black dark:text-darkText">Volver al inicio</button>
        </div>
      </div>
      <ToasterConfig />
    </div>
  );
};

export default DevelopedBy;
