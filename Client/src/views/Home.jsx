// components
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getPayMethods, getServices, getspecialists } from '../redux/actions.js'
import Restricted from "./Restricted.jsx";
import ErrorToken from "./ErrorToken";
import Balance from "../components/Balance.jsx";
import Loader from "../components/Loader.jsx";
import getParamsEnv from "../functions/getParamsEnv.js";
import axios from "axios";
const { API_URL_BASE } = getParamsEnv();

const Home = () => {
  const dispatch = useDispatch()
  const token = useSelector((state) => state?.token)
  const branchWorking = useSelector((state) => state?.workingBranch)
  const tokenError = useSelector((state) => state?.tokenError);
  const specialists = useSelector((state) => state?.specialists)
  const services = useSelector((state) => state?.services)
  const payMethods = useSelector((state) => state?.payMethods)
  const user = useSelector((state) => state?.user);
  const [loading, setLoading] = useState(true);

  let requestMade = false;
  useEffect(() => {
    //! No usar dispach que en actions llamen a Axios porque no se puede controlar el asincronismo
    //const respuesta = dispatch(getPayMethods({ token }))
    //dispatch(getspecialists(branchWorking.branchName, { token: token }))
    //dispatch(getServices({ token }))
    //  .then(setLoading(false))
    if (!requestMade) { // evito llamados en paralelo al pedir los datos iniciales
      setLoading(true);
      requestMade = true;
      axios.post(API_URL_BASE + "/v1/payments", { token })
        .then(respuesta => {
          dispatch(getPayMethods(respuesta.data)); // actualizo el store
          return axios.post(API_URL_BASE + "/v1/specialists?branchWorking=" + branchWorking.branchName, { token });
        })
        .then(respuesta2 => {
          dispatch(getspecialists(respuesta2.data)); // actualizo el store
          return axios.post(API_URL_BASE + "/v1/getservices", { token });
        })
        .then(respuesta3 => {
          dispatch(getServices(respuesta3.data)); // actualizo el store
          setLoading(false);
          requestMade = false;
        })
        .catch(error => {
          // PENDIENTE - HACER UN MEJOR MANEJO DE ERRORES:
          let msg = '';
          if (!error.response) {
            msg = error.message;
          } else {
            msg = "Error fetching data: " + error.response.status + " - " + error.response.data;
          }
          console.log("ERROR!!! " + msg);
        });
    }
  }, [tokenError]);

  if (tokenError === 401 || tokenError === 403) {
    return (
      <ErrorToken error={tokenError} />
    );
  } else {
    return (
      <>
        <NavBar user={user} />
        <div className="flex flex-row dark:bg-darkBackground">
          <SideBar />
          {loading ? (
            <Loader />
          ) : (
            user.role === "superAdmin" ? <p>hola</p> : <p>tres</p>
            // <Balance specialists={specialists} services={services} payMethods={payMethods}/> :  <Restricted />
          )}
        </div>
      </>
    );
  }
}


export default Home;
