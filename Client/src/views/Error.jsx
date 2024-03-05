import React from "react";
import { Link, useNavigate } from "react-router-dom";

//variables de entorno
import getParamsEnv from "../functions/getParamsEnv";
const { ROOT } = getParamsEnv();

//icons
import { AiFillInstagram } from "react-icons/ai";
import { AiFillFacebook } from "react-icons/ai";

const Error = () => {
    const navigate = useNavigate();

    function handleOriginData() {
        navigate(ROOT);
    }

    return (
        <div className="min-h-screen flex flex-grow items-center justify-center bg-gray-50">
            <div className="rounded-lg bg-white p-8 text-center shadow-xl">
                <h1 className=" text-3xl font-bold">404</h1>
                <div className="mt-4">
                    <p className="text-gray-600">
                        Oops! No hemos encontrado la página que estás buscando
                    </p>
                    <p className="text-gray-600">
                        Si las dificultades persisten, no dudes en contactarnos
                    </p>
                </div>
                <div className="flex flex-row justify-center gap-10 mt-2">
                    <Link to="https://www.facebook.com/" target="_blank">
                        {" "}
                        <img className="h-10 w-10 hover:scale-105 cursor-pointer" src="https://res.cloudinary.com/doyafxwje/image/upload/v1703428750/Logos/jwqnssm7alfmzsabbcjp.png" alt="facebook" />
                    </Link>
                    <Link to="https://www.instagram.com/" target="_blank">
                        {" "}
                        <img className="h-10 w-10 hover:scale-105 cursor-pointer" src="https://res.cloudinary.com/doyafxwje/image/upload/v1703428750/Logos/y1rwzvoumgvq9ciaony4.png" alt="instagram" />
                    </Link>
                </div>
                <a
                    href="/"
                    className="mt-4 inline-block rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
                    onClick={handleOriginData}
                >
                    {" "}
                    Volver a la página principal{" "}
                </a>
            </div>
        </div>
    );
};


export default Error;
