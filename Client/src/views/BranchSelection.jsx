//hooks, reducer, components
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getUser, setBranch } from "../redux/actions";
import Loader from "../components/Loader";
import ToasterConfig from "../components/Toaster";

//icons
import { IoClose } from 'react-icons/io5';

// Variables de entorno:
import getParamsEnv from "../functions/getParamsEnv";

const { HOME, AGENDA, API_URL_BASE } = getParamsEnv();

const BranchSelection = () => {
  const [workingBranch, setWorkingBranch] = useState({})
  const [isButtonDisabled, setButtonDisabledState] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const fetchData = async () => {
        const userData = {
          nameUser: user.userName,
          idUser: user.token,
        };

        const retrieveUser = await axios.post(
          API_URL_BASE + "/v1/userdata",
          userData
        );

        const userInfo = retrieveUser.data
        //! PENDIENTE - No usar dispach que en actions llamen a Axios porque no se puede controlar el asincronismo
        dispatch(getUser(userInfo))
      }
      fetchData()
      setLoading(false)
    } catch (error) {
      toast.error(error.message)
    }
  }, [])

  const user = useSelector((state) => state?.user);
  const dispatch = useDispatch()
  const navigate = useNavigate();

  const handleChange = (e) => {
    const branchObject = JSON.parse(e.target.value);
    setWorkingBranch(branchObject)
    setButtonDisabledState(false);
  }

  const handleBranch = () => {
    dispatch(setBranch(workingBranch))
    if (user.role === "superAdmin") {
      navigate(HOME)
    } else {
      navigate(AGENDA)
    }
  }

  const orderedBranches = user.branches.sort((a, b) => {
    const nameA = a.branchName.toUpperCase();
    const nameB = b.branchName.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
  })

  return (
    <section className="bg-[url('https://res.cloudinary.com/doyafxwje/image/upload/v1703630993/LogIn/osoq2vut2vy2fivyauxm.jpg')] bg-cover bg-center flex flex-col items-center justify-center h-screen lg:py-0">
      {loading ? <Loader /> :
        <div className="relative flex flex-col items-center justify-center gap-5 rounded-xl w-fit p-10 mx-auto h-fit bg-white border shadow-xl shadow-black border-black">
          <IoClose onClick={() => navigate(-1)} className="absolute top-3 right-3 h-5 w-5 cursor-pointer hover:scale-110" />
          <div className="text-center mb-2">
            <h1 className="text-3xl font-bold mb-2">¡Hola {user.name}! ¿Cómo estás?</h1>
            <h2 className="text-xl">Haz clic en la sede en la que trabajarás hoy 👇</h2>
          </div>
          <div className="w-fit flex flex-row gap-5 flex-wrap justify-center">
            {orderedBranches.map((branch, index) => {
              return (
                <div key={index} className="flex flex-row gap-1">
                  <input
                    type="radio"
                    id={branch.branchName}
                    name="branch"
                    value={JSON.stringify(branch)}
                    onChange={handleChange}
                  />
                  <label>{branch.branchName}</label>
                </div>
              )
            })}
          </div>
          <div>
            <button className={isButtonDisabled ? "font-medium cursor-not-allowed rounded shadow-sm py-2 px-4 my-2 shadow-black" : "cursor-pointer font-medium  rounded shadow-sm py-2 px-4 my-2 shadow-black hover:bg-secondaryColor transition-color duration-700 ease-in-out"} onClick={handleBranch} disabled={isButtonDisabled}> Ingresar </button>
          </div>
        </div>}
      <ToasterConfig />
    </section>
  );
};

export default BranchSelection;
