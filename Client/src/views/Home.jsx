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
import axios from "axios";

//toast
import { toast } from "react-hot-toast";
import ToasterConfig from "../components/Toaster";

//variables de entorno
import getParamsEnv from "../functions/getParamsEnv.js";
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
    if (!requestMade) { 
      setLoading(true);
      requestMade = true;
      axios.post(API_URL_BASE + "/v1/payments", { token })
        .then(respuesta => {
          dispatch(getPayMethods(respuesta.data)); 
          return axios.post(API_URL_BASE + "/v1/specialists?branchWorking=" + branchWorking.branchName, { token });
        })
        .then(respuesta2 => {
          dispatch(getspecialists(respuesta2.data)); 
          return axios.post(API_URL_BASE + "/v1/getservices", { token });
        })
        .then(respuesta3 => {
          dispatch(getServices(respuesta3.data));
          setLoading(false);
          requestMade = false;
        })
        .catch(error => {  
          let errorMessage= ""   
          console.log(error)     
          if (!error.response) {
            errorMessage = error.message;
          } else {
            errorMessage = `${error.response.status} ${error.response.statusText} - ${error.response.data.split(":")[1]}`
          }
          toast.error(errorMessage);
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
            user.role === "superAdmin" ? 
            <Balance specialists={specialists} services={services} payMethods={payMethods}/> :  <Restricted />
          )}
        </div>
        <ToasterConfig />
      </>
    );
  }
}


export default Home;
