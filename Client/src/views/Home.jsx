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


const Home = () => {
  const dispatch = useDispatch()
  const token = useSelector((state) => state?.token)
  const branchWorking = useSelector((state) => state?.workingBranch)
  const tokenError = useSelector((state) => state?.tokenError);
  const specialists = useSelector((state) => state?.specialists)
  const services = useSelector((state) => state?.services)
  const payMethods = useSelector((state) => state?.payMethods)
  const user = useSelector((state) => state?.user);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const respuesta = dispatch(getPayMethods({ token }))
    dispatch(getspecialists(branchWorking.branchName, { token: token }))
    // dispatch(getServices({token}))
    // .then(setLoading(false))
  }, [tokenError]);

  if (tokenError === 401 || tokenError === 403) {
    return (
      <ErrorToken error={tokenError} />
    );
  } else {
    return (
      <>
        <NavBar user={user}/>
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
