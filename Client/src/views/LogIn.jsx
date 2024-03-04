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
const { ROOT, HOME, AGENDA, API_URL_BASE, BRANCH, SSADMIN } = getParamsEnv();

//Firebase
import {
    GoogleAuthProvider,
    signInWithPopup,
    getAuth,
    OAuthProvider,
} from "firebase/auth";
import app from "../firebase/firebaseConfig";

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
                if (role === "superAdmin") {
                    navigate(HOME)
                } else {
                    navigate(AGENDA)
                }
            } else {

                navigate(BRANCH)
            }
        } else if (role === "superSuperAdmin") {
            navigate(SSADMIN)

        }
    }, [role]);

    const handleYahoo = async (directIn = false, ultIntento = false) => {
        dispatch(clearDataInicio());
        try {
            const auth = getAuth(app);
            const yahooProvider = new OAuthProvider('yahoo.com');
            // ISSUE: Al primer intento de login con Yahoo, es posible que ocurra un error capturable. En ese caso hago un segundo intento, donde ya logra ingresar sin problemas. Manejo recursividad y un flag que me permita darme cuenta si estoy entrando por primera vez, así customizo el popup de manera diferente:
            if (directIn === true) { // segundo intento
                yahooProvider.setCustomParameters({
                    language: 'es',
                })

            } else { // primera vez
                yahooProvider.setCustomParameters({
                    prompt: "select_account",
                    language: 'es',
                })
            };
            // Guarda la referencia a la nueva ventana emergente
            const result = await signInWithPopup(auth, yahooProvider);
            const userEmail = result.user.email;
            const credential = OAuthProvider.credentialFromResult(result);
            const idToken = credential.idToken;
            // Obtengo el token de acceso:
            const dataToValidate = {
                nameUser: userEmail,
                idUser: idToken, // mando el gigantesco token real
            };
            const retrieveUser = await axios.post(
                API_URL_BASE + "/v1/userdata",
                dataToValidate
            );
            const userData = retrieveUser.data;
            dispatch(getUser(userData));
            const { role, branches } = userData;
            setBranches(branches);
            setRole(role);
            dispatch(getToken(idToken));
        } catch (error) {
            if (!ultIntento) {
                if (error.code === "auth/popup-closed-by-user") {
                    // atrapo el error y reintento:
                    setTimeout(() => {
                    }, 1000);
                    ultIntento = true;
                    handleYahoo(true, ultIntento);
                } else {
                    if (error.message.includes("404")) {
                        toast.error(`No estás autorizado. Verifica tus datos y si el error persiste, comunícate con el administrador.`)
                    }
                    else if (error.message.includes("402")) {
                        toast.error(`La suscripción ha expirado. Para renovarla, contacta al administrador.`)
                    }
                    else {
                        toast.error(`${error.message}. Por favor comunícate con el administrador.`)
                    }
                };
            }
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


            //console.log(API_URL_BASE)


            const retrieveUser = await axios.post(
                API_URL_BASE + "/v1/userdata",
                dataToValidate
            );

            const userData = retrieveUser.data;
            dispatch(getUser(userData));
            const { role, branches } = userData;
            setBranches(branches);
            setRole(role);
            dispatch(getToken(accessToken));
        } catch (error) {
            if (error.message.includes("404")) {
                toast.error(`No estás autorizado. Verifica tus datos y si el error persiste, comunícate con el administrador.`)
            }
            else if (error.message.includes("402")) {
                toast.error(`La suscripción ha expirado. Para renovarla, contacta al administrador.`)
            }
            else {
                toast.error(`${error.message}. Por favor comunícate con el administrador.`)
            }
        }
    };

    return (
        <section className="mx-auto">
            <div className="bg-[url(https://images.unsplash.com/photo-1612538498456-e861df91d4d0?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] bg-cover bg-center flex flex-col items-center justify-center h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow-sm shadow-black max-w-sm">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <div className="flex justify-between">
                            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 ">
                                Iniciar sesión
                            </h1>
                            <Link to={ROOT}>
                                {" "}
                                <GiExitDoor className="h-8 w-8 mt-0.5" />{" "}
                            </Link>
                        </div>
                        <button
                            onClick={() => handleYahoo(false)}
                            className="w-full px-4 py-2 border flex justify-center  gap-2 rounded-lg border-slate-700 hover:bg-secondaryColor transition-color duration-700"
                        >
                            <AiFillYahoo className="h-6 w-6 text-blue-900" />
                            <span>Iniciar sesión con Yahoo</span>
                        </button>
                        <button
                            onClick={handleGoogle}
                            className="w-full px-4 py-2 border flex justify-center gap-2 rounded-lg border-slate-700 hover:bg-secondaryColor transition-color duration-700 "
                        >
                            <FcGoogle className="h-6 w-6" />
                            <span>Iniciar sesión con Google</span>
                        </button>
                        {errorCredentials ? (
                            <p className="text-red-500  font-semibold ">
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
