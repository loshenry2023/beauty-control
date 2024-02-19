import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearDataInicio } from "../redux/actions";

//variables de entorno
import getParamsEnv from "../functions/getParamsEnv";
const { ROOT } = getParamsEnv();


const ErrorToken = (props) => {
  const { error } = props;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleOriginData() {
    dispatch(clearDataInicio())
    navigate(ROOT);
  }

  return (
    <div className="min-h-screen absolute top-0 w-full flex flex-grow items-center justify-center bg-gray-50">
      <div className="rounded-lg bg-white p-8 text-center shadow-xl">
        <h1 className=" text-3xl font-bold">{error}</h1>
        <div className="mt-4">
          <p className="text-gray-600">
            {error === 401 && "Sin permiso"}
            {error === 402 && `La suscripción expiró`}
            {error === 403 && "La sesión expiró"}
          </p>
          <p className="text-gray-600">
            Vuelve a ingresar con tus credenciales.
          </p>
        </div>
        <a
          href="/"
          className="mt-4 inline-block rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
          onClick={handleOriginData}
        >
          {" "}
          Volver al inicio{" "}
        </a>
      </div>
    </div>
  );
};

export default ErrorToken;
