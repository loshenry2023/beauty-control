// hooks, routers, reducers:
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getToken, getUser, setBranch } from "../redux/actions";
import axios from "axios";
import { Toaster, toast } from 'react-hot-toast'
import { clearDataInicio } from "../redux/actions.js";

//icons
import { GiExitDoor } from "react-icons/gi";
import { FcGoogle } from "react-icons/fc";
import { AiFillYahoo } from "react-icons/ai";

// Variables de entorno:
import getParamsEnv from "../functions/getParamsEnv";
const { ROOT, HOME, API_URL_BASE, BRANCH } = getParamsEnv();

//Firebase
import {
  GoogleAuthProvider,
  signInWithPopup,
  getAuth,
  OAuthProvider
} from "firebase/auth";
import app from "../firebase/firebaseConfig";

//const auth = getAuth(app);
//const googleProvider = new GoogleAuthProvider();
//const yahooProvider = new OAuthProvider('yahoo.com');

const LogIn = () => {
  const [role, setRole] = useState("");
  const [branches, setBranches] = useState([]);
  const [errorCredentials, setErrorCredentials] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (role === "superAdmin" || role === "admin" || role === "especialista") {
      if (branches.length == 1) {
        dispatch(setBranch({ ...branches[0] }));
        navigate(HOME)
      } else {
        navigate(BRANCH)
      }
    }
  }, [role]);

  const handleYahoo = async () => {
    dispatch(clearDataInicio());
    try {
      const auth = getAuth(app);
      const yahooProvider = new OAuthProvider('yahoo.com');

      yahooProvider.setCustomParameters({
        prompt: "select_account",
        language: 'es',
      });
      const result = await signInWithPopup(auth, yahooProvider);
      const userEmail = result.user.email;
      const credential = OAuthProvider.credentialFromResult(result);
      const accessToken = credential.accessToken;
      const idToken = credential.idToken;

      // Obtengo el token de acceso:
      const dataToValidate = {
        nameUser: userEmail,
        idUser: idToken, // mando el gigantesco token real
      };
      const retrieveUser = await axios.post(
        API_URL_BASE + "/userdata",
        dataToValidate
      );

      const userData = retrieveUser.data;
      dispatch(getUser(userData));
      const { role, branches } = userData;
      setBranches(branches);
      setRole(role);
      dispatch(getToken(accessToken));
    } catch (error) {
      if (error.code === "auth/popup-closed-by-user") {
        // La primera vez que se carga un usuario, la ventana se cierra sin devolver el resultado,
        // así que atrapo el error y le aviso que vuelva a intentar:
        toast.error("Vuelve a intentar, por favor")
        setTimeout(() => {
        }, 4000);
      } else {
        if (error.message.includes("404")) {
          { toast.error(`${error.response.data}`.charAt(0).toUpperCase() + `${error.response.data}`.slice(1)) }
        } else {
          toast.error(error.message);
        }
      };
    };
  };

  const handleGoogle = async () => {
    dispatch(clearDataInicio())
    try {
      const auth = getAuth(app);
      const googleProvider = new GoogleAuthProvider();

      // Configuro el parámetro "prompt" para permitir seleccionar una nueva cuenta:
      googleProvider.setCustomParameters({
        prompt: "select_account",
      });

      const googleUser = await signInWithPopup(auth, googleProvider);

      // Obtengo el token de acceso:
      const accessToken = await googleUser.user.getIdToken();

      const dataToValidate = {
        nameUser: googleUser.user.email,
        idUser: accessToken, // mando el gigantesco token real
      };

      const retrieveUser = await axios.post(
        API_URL_BASE + "/userdata",
        dataToValidate
      );

      const userData = retrieveUser.data;
      dispatch(getUser(userData));
      const { role, branches } = userData;
      setBranches(branches);
      setRole(role);
      dispatch(getToken(accessToken));
    } catch (error) {
      if (error.message.includes("404")) { { toast.error(`${error.response.data}`.charAt(0).toUpperCase() + `${error.response.data}`.slice(1)) } }
      else { toast.error(error.message) }
    }
  };

  return (
    <section className="mx-auto">
      <div className="bg-[url('https://res.cloudinary.com/doyafxwje/image/upload/v1703630993/LogIn/osoq2vut2vy2fivyauxm.jpg')] bg-cover bg-center flex flex-col items-center justify-center h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow-xl shadow-black max-w-sm">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <div className="flex justify-between">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
                Iniciar sesión
              </h1>
              <Link to={ROOT}>
                {" "}
                <GiExitDoor className="h-8 w-8" />{" "}
              </Link>
            </div>
            <button
              onClick={handleYahoo}
              className="w-full px-4 py-2 border flex justify-center  gap-2 rounded-lg border-slate-700 hover:bg-grey hover:text-white transition-color duration-700 ease-in-out"
            >
              <AiFillYahoo className="h-6 w-6 text-blue-900" />
              <span>Iniciar sesión con Yahoo</span>
            </button>
            <button
              onClick={handleGoogle}
              className="w-full px-4 py-2 border flex justify-center gap-2 rounded-lg border-slate-700 hover:bg-grey hover:text-white transition-color duration-700 ease-in-out "
            >
              <FcGoogle className="h-6 w-6" />
              <span>Iniciar sesión con Google</span>
            </button>
            {errorCredentials ? (
              <p className="text-red-500 text-sm font-semibold ">
                {errorCredentials}
              </p>
            ) : null}
          </div>
        </div>
      </div>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{
          zIndex: 1000, // Puedes ajustar este valor según tus necesidades
          // Otros estilos aquí
        }}
        toastOptions={{
          // Define default options
          error: {
            duration: 5000,
            theme: {
              primary: 'pink',
              secondary: 'black',
            },
            style: {
              background: '#C43433',
              color: '#fff',
            }
          },
        }}
      />
    </section>
  );
};

export default LogIn;
