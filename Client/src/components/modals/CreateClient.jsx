//hooks,reducer, componentes
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios"
import { toast } from 'react-hot-toast'
import { useLocation } from 'react-router-dom';
import ToasterConfig from '../Toaster';
import Loader from '../Loader';

//icons
import { IoClose } from 'react-icons/io5';
import { UploadWidget } from '../Uploadwidget';

//funciones
import validateClientInput from '../../functions/registerClient';

//Variables de entorno
import getParamsEnv from '../../functions/getParamsEnv'


const { API_URL_BASE } = getParamsEnv()

const CreateClient = ({setShowClientCreateModal, setActivarNuevoCliente,activarNuevoCliente, setChosenClient, setShowClientFormModal, setShowClientListModal}) => {

    useEffect(() => {
        const close = (e) => {
            if(e.keyCode === 27){
                closeWithX()
                closeModal()
            }
          }
          window.addEventListener('keydown', close)
          return () => window.removeEventListener('keydown', close)
    })

    const location = useLocation()
    const token = useSelector((state) => state?.token);
    const [client, setClient] = useState({
        email: "",
        name: "",
        lastName: "",
        id_pers: "",
        phoneNumber1: "",
        phoneNumber2: "",
        birthday: "",
        image: "https://res.cloudinary.com/doqyrz0sg/image/upload/v1702302836/varpjl2p5dwvpwbmdiui.png",
        token: token,
      });
      
      const [errors, setErrors] = useState({
      });

      const [submitLoader, setSubmitLoader] = useState(false)
    const [disableSubmit, setDisableSubmit] = useState(false)

    const closeWithX = () => {
        if (location.pathname === "/clientsProfiles") {
            setShowClientCreateModal(false);
        } else {
            setShowClientFormModal(false);
        }
    }

    const closeModal = () => {
        if (location.pathname === "/clientsProfiles") {
            setShowClientCreateModal(false);
        } else {
            setShowClientListModal(false)
        }
    }

    const handleChange = (e) => {
    const { name, value } = e.target;

    setClient((prevInfo) => ({
        ...prevInfo,
        [name]: value,
        }));

    setClient((prevInfo) => {
    const validationErrors = validateClientInput({ ...prevInfo, [name]: value });
    setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: validationErrors[name],
    }));
    return prevInfo;
    })
    }

    const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateClientInput(client);
    setErrors(validationErrors);
    const hasErrors = Object.values(validationErrors).some((error) => error !== undefined);

    if (hasErrors) {
    } else {
      try {

        setDisableSubmit(true)
        setSubmitLoader(true)

        const data = {
          email: client.email,
          name: client.name,
          id_pers: client.id_pers,
          lastName: client.lastName,
          phone1: client.phoneNumber1,
          phone2: client.phoneNumber2,
          birthday: client.birthday,
          image: client.image,
          token: client.token,
        }
        
        const response = await axios.post(`${API_URL_BASE}/newclient`, data)
        
        if (response.data.created === "ok") {
            setSubmitLoader(false)
        toast.success("Cliente creado exitosamente")
        setActivarNuevoCliente(!activarNuevoCliente)     
        if (location.pathname !== "/clientsProfiles") {
            setChosenClient({name: data.name, lastName: data.lastName, email: data.email, id: response.data.id})
        }
        setTimeout(() => {
        closeModal();
        setDisableSubmit(false)
        setClient(
            {
                email: "",
                name: "",
                lastName: "",
                phone1: "",
                phone2: "",
                birthday: "",
                image: "",
                id_pers: "",
                token: "",
            }
        )}, 3000);
        } else {
            setDisableSubmit(false)
            setSubmitLoader(false)
            toast.error("Hubo un problema con la creación")
          }
    } catch (error) {
        setDisableSubmit(false)
            setSubmitLoader(false)
        toast.error(`Hubo un problema con la creacion. ${error.response.data}`)
      }
    }
}

    return (
        <>
            <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full" style={{ background: "rgba(0, 0, 0, 0.70)"}}>
                <div>
                    <div className="w-4/5 mx-auto bg-white shadow rounded-lg p-6 md:w-full dark:bg-darkBackground">
                        <div className='flex justify-between'>
                            <h1 className="text-2xl font-semibold mb-4 text-black dark:text-darkText">Agregar nuevo cliente</h1>
                            <IoClose onClick={closeWithX} className='cursor-pointer mt-2 w-5 h-5 hover:scale-125 dark:text-darkText' />
                        </div>
                        <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                            <div>
                                <label className='pl-1  font-bold dark:text-darkText'>Nombre</label>
                                <input
                                    onChange={handleChange}
                                    type="text"
                                    name="name"
                                    value={client.name}
                                    placeholder="Nombre"
                                    className={`border border-black p-2 rounded w-full ${errors.name !== undefined && "border-2 border-red-500"} dark:text-darkText dark:bg-darkPrimary`}
                                />  
                                {errors.name !== "" && <p className=" text-red-500">{errors.name}</p>}
                            </div>  
                            <div>
                                <label className='pl-1  font-bold dark:text-darkText'>Apellido</label>
                                <input
                                    onChange={handleChange}
                                    type="text"
                                    name="lastName"
                                    value={client.lastName}
                                    placeholder="Apellido"
                                    className={`border border-black p-2 rounded w-full ${errors.lastName !== undefined && "border-2 border-red-500"} dark:text-darkText dark:bg-darkPrimary`}
                                />
                                {errors.lastName !== "" && <p className=" text-red-500">{errors.lastName}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                            <div>
                            <label className="mb-2  font-bold text-gray-900 dark:text-darkText">Email cliente</label>
                                <input
                                    onChange={handleChange}
                                    type="email"
                                    name="email"
                                    value={client.email}
                                    placeholder="Email cliente"
                                    className={`border text-gray-500 border-black p-2 rounded w-full ${errors.email !== undefined && "border-2 border-red-500"} dark:text-darkText dark:bg-darkPrimary`}
                                />
                                {errors.email !== "" && <p className=" text-red-500">{errors.email}</p>}
                            </div>
                            <div>
                                <label className='mb-2  font-bold text-gray-900 dark:text-darkText'>ID de persona</label>
                                <input
                                    placeholder="ID"
                                    className={`border border-black p-2 rounded w-full ${errors.id_pers !== undefined && "border-2 border-red-500"} dark:text-darkText dark:bg-darkPrimary`}
                                    onChange={handleChange}
                                    type="text"
                                    name="id_pers"
                                    value={client.id_pers}
                                />
                                {errors.id_pers !== "" && <p className=" text-red-500">{errors.id_pers}</p>}
                         </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                            <div>
                                <label className='pl-1  font-bold dark:text-darkText'>Telefono</label>
                                <input
                                    placeholder="Telefono 1"
                                    className={`border border-black p-2 rounded w-full ${errors.phoneNumber1 !== undefined && "border-2 border-red-500"} dark:text-darkText dark:bg-darkPrimary`}
                                    onChange={handleChange}
                                    type="text"
                                    name="phoneNumber1"
                                    value={client.phoneNumber1}
                                />
                                {errors.phoneNumber1 !== "" && <p className=" text-red-500">{errors.phoneNumber1}</p>}
                            </div>
                            <div>
                                <label className='pl-1  font-bold dark:text-darkText'>Telefono alternativo</label>
                                <input
                                    onChange={handleChange}
                                    type="text"
                                    name="phoneNumber2"
                                    value={client.phoneNumber2}
                                    placeholder="Telefono 2"
                                    className={`border border-black p-2 rounded w-full ${errors.phoneNumber2 !== undefined && "border-2 border-red-500"} dark:text-darkText dark:bg-darkPrimary`}
                                />
                                {errors.phoneNumber2 !== "" && <p className=" text-red-500">{errors.phoneNumber2}</p>}
                            </div>
                        </div>
                        <div className="first-letter:grid grid-cols-1 mb-2">
                            <label className='pl-1  font-bold dark:text-darkText'>Fecha de nacimiento</label>
                            <input
                                placeholder="Fecha de nacimiento"
                                className={`border border-black p-2 rounded w-full ${errors.birthday !== undefined && "border-2 border-red-500"} dark:text-darkText dark:bg-darkPrimary dark:[color-scheme:dark]`}
                                onChange={handleChange}
                                type="date"
                                name="birthday"
                                value={client.birthday}
                            />
                            {errors.birthday && <p className=" text-red-500">{errors.birthday}</p>}
                        </div>
                        <div>
                        <div className="mt-2 grid grid-cols-1 place-items-center">
                            <UploadWidget setUserData={setClient} />
                            <div className='mt-2 mb-2'>
                                <img className='w-20 h-20 rounded' src={client.image} alt="user-avatar" />
                            </div>
                            </div>
                        </div>
                        <div className="flex justify-center items-center">
                        {!submitLoader ?
                                    <button
                                    type="submit"
                                    disabled={disableSubmit}
                                    className="px-4 py-2 w-fit rounded-md bg-primaryPink shadow shadow-black text-black hover:bg-secondaryColor transition-colors duration-700 dark:text-darkText dark:bg-darkPrimary dark:hover:bg-blue-600"
                                >
                                    Crear nuevo cliente
                                </button> :
                                    <Loader />
                                }
                        </div>
                        </form>
                    </div>
                </div>
            </div>
            <ToasterConfig />
        </>
    );
}

export default CreateClient