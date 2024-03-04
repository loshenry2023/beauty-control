import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoClose } from 'react-icons/io5';
import validateRegisterInput from '../../functions/registerFormValidations';
import axios from 'axios';
import { UploadWidget } from '../Uploadwidget';
import { toast } from 'react-hot-toast'
import getParamsEnv from '../../functions/getParamsEnv';
import Loader from '../Loader'

const { USERPROFILES, API_URL_BASE } = getParamsEnv();

function EditModal({ setShowEditModal, branches, specialties, userId, tokenID }) {
    useEffect(() => {
        const close = (e) => {
            if (e.keyCode === 27) {
                closeModal()
            }
        }
        window.addEventListener('keydown', close)
        return () => window.removeEventListener('keydown', close)
    }, [])

    const navigate = useNavigate();
    const roles = ["superAdmin", "admin", "especialista"];
    const [controlData, setControlData] = useState({
        name: userId.name,
        lastName: userId.lastName,
        userName: userId.userName,
        phoneNumber1: userId.phone1,
        phoneNumber2: userId.phone2 || "",
        image: userId.image,
        specialtyName: userId.specialties,
        commission: userId.comission,
        branch: userId.branches,
        rol: userId.role,
        notificationEmail: userId.notificationEmail,
        // notificationEmail: "notificationEmail@gmail.com"
    })

    const [userData, setUserData] = useState({
        name: userId.name,
        lastName: userId.lastName,
        userName: userId.userName,
        phoneNumber1: userId.phone1,
        phoneNumber2: userId.phone2 || "",
        image: userId.image,
        specialtyName: userId.specialties,
        commission: userId.comission,
        branch: userId.branches,
        rol: userId.role,
        notificationEmail: userId.notificationEmail,
        // notificationEmail: "notificationEmail@gmail.com"
    });

    const [submitLoader, setSubmitLoader] = useState(false)
    const [disableSubmit, setDisableSubmit] = useState(false)

    const [errors, setErrors] = useState({});

    const closeModal = () => {
        setShowEditModal(false);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox' && name === 'branch') {
            setUserData((prevInfo) => {
                const updatedBranch = checked
                    ? [...prevInfo.branch, { id: value, branch: value }]
                    : prevInfo.branch.filter((b) => b.id !== value);

                return {
                    ...prevInfo,
                    [name]: updatedBranch,
                };
            });
        } else if (type === 'checkbox' && name === 'specialtyName') {

            setUserData((prevInfo) => {
                const updatedSpecialities = checked
                    ? [...prevInfo.specialtyName, { id: value, specialtyName: value }]
                    : prevInfo.specialtyName.filter((specialty) => specialty.id !== value);

                return {
                    ...prevInfo,
                    [name]: updatedSpecialities,
                };
            });
        } else if (name === 'rol') {
            if (userId.userName === 'loshenry2023@gmail.com') {
                toast.error('Usted es el primer superAdmin. No puede cambiar su rol.', {
                    id: 'editModal',
                })
            } else {
                setUserData((prevInfo) => ({
                    ...prevInfo,
                    [name]: value,
                }));
            }
        }
        else {
            setUserData((prevInfo) => ({
                ...prevInfo,
                [name]: value,
            }));
        }

        const validationErrors = validateRegisterInput({ ...userData, [name]: value });
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: validationErrors[name],
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateRegisterInput(userData);
        setErrors(validationErrors);

        const hasErrors = Object.values(validationErrors).some((error) => error !== undefined);
        const isDataUnchanged = JSON.stringify(userData) === JSON.stringify(controlData);

        if (isDataUnchanged) {
            toast.error("Debes modificar al menos un campo");
        } else if (hasErrors) {
            
        } else {
            try {

                setDisableSubmit(true)
                setSubmitLoader(true)

                const specialtiesId = userData.specialtyName.map((specialty) => specialty.id);
                const branchesId = userData.branch.map((b) => b.id);

                const data = {
                    name: userData.name,
                    lastName: userData.lastName,
                    specialty: specialtiesId,
                    branch: branchesId,
                    phone1: userData.phoneNumber1,
                    phone2: userData.phoneNumber2 || "",
                    role: userData.rol,
                    notificationEmail: userData.notificationEmail,
                    image: userData.image,
                    comission: userData.commission,
                    token: tokenID
                };

                const response = await axios.put(`${API_URL_BASE}/v1/edituserdata/${userId.id}`, data);

                if (response.data.updated === "ok") {
                    setTimeout(() => {
                        setUserData(
                            {
                                name: "",
                                lastName: "",
                                userName: "",
                                phoneNumber1: "",
                                phoneNumber2: "",
                                image: "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-vector-260nw-2271804793.jpg",
                                specialtyName: [],
                                commission: "",
                                branch: [],
                                rol: "",
                                notificationEmail: "notificationEmail@gmail.com"
                            }
                        );
                        closeModal();
                        setDisableSubmit(false)
                        setSubmitLoader(false)
                        navigate(USERPROFILES);
                    }, 4000);
                    toast.success("Usuario modificado exitosamente")
                } else {
                setDisableSubmit(false)
                setSubmitLoader(false)
                }
            } catch (error) {
                setDisableSubmit(false)
                setSubmitLoader(false)
                toast.error(`Hubo un problema con la modificacion. ${error.response.data}`)
            }
        }
    };
    return (
        <>
            <div className="absolute top-0 left-0 p-0 m-0 flex items-center justify-center w-full h-full" style={{ background: "rgba(0, 0, 0, 0.70)" }}>
                
                    <div className="w-full bg-white shadow rounded-lg p-4 pt-2 pb-2 mx-auto md:w-1/2 2xl:w-1/3 scale-90 dark:bg-darkBackground">
                        <div className='flex justify-between '>
                            <h1 className="text-2xl font-semibold mb-4 text-black dark:text-darkText">Editar usuario</h1>
                            {!submitLoader &&
                            <IoClose onClick={closeModal} className='cursor-pointer mt-1 w-5 h-5 hover:scale-125 dark:text-darkText' /> }
                             {submitLoader &&
                            <IoClose className="cursor-not-allowed mt-1 w-5 h-5 dark:text-darkText"/> }
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="first-letter:grid grid-cols-1 mb-1">
                                <label className="mb-2  font-medium text-gray-900 dark:text-darkText">Cuenta de usuario (Email)</label>
                                <input
                                    placeholder="Gmail Usuario"
                                    className={`cursor-not-allowed border bg-gray-200 text-gray-500 border-black p-2 rounded w-full ${errors.userName !== undefined && "border-red-500"} dark:text-darkText dark:bg-darkPrimary`}
                                    onChange={handleChange}
                                    type="email"
                                    name="userName"
                                    value={userData.userName}
                                    disabled
                                />
                                {errors.userName !== "" && <p className=" text-red-500">{errors.userName}</p>}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-1">
                                <div>
                                    <label className='block mb-2  font-medium text-gray-900 dark:text-darkText'>Nombre</label>
                                    <input
                                        onChange={handleChange}
                                        type="text"
                                        name="name"
                                        value={userData.name}
                                        placeholder="Nombre"
                                        className={`border border-black p-2 rounded w-full ${errors.name !== undefined && "border-red-500"} dark:text-darkText dark:bg-darkPrimary`}
                                    />
                                    {errors.name !== "" && <p className=" text-red-500">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className='block mb-1  font-medium text-gray-900 dark:text-darkText'>Apellido</label>
                                    <input
                                        type="text"
                                        placeholder="Apellido"
                                        className={`border border-black p-2 mb-1 rounded w-full ${errors.lastName !== undefined && "border-red-500"} dark:text-darkText dark:bg-darkPrimary`}
                                        onChange={handleChange}
                                        name="lastName"
                                        value={userData.lastName}
                                    />
                                    {errors.lastName !== "" && <p className=" text-red-500">{errors.lastName}</p>}
                                </div>
                            </div>
                            <div className="first-letter:grid grid-cols-1 gap-2 mb-1">
                                <label className='block mb-1  font-medium text-gray-900 dark:text-darkText'>Email para notificaciones</label>
                                <input
                                    placeholder="Email para notifiaciones"
                                    className="border border-black p-2 rounded w-full dark:text-darkText dark:bg-darkPrimary"
                                    onChange={handleChange}
                                    type="email"
                                    name="notificationEmail"
                                    value={userData.notificationEmail}
                                />
                                {errors.notificationEmail !== "" && <p className=" text-red-500">{errors.notificationEmail}</p>}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-1">
                                <div>
                                    <label className='block mb-1  font-medium text-gray-900 dark:text-darkText'>Telefono</label>
                                    <input
                                        placeholder="Telefono 1"
                                        className={`border border-black p-2 rounded w-full ${errors.phoneNumber1 !== undefined && "border-red-500"} dark:text-darkText dark:bg-darkPrimary`}
                                        onChange={handleChange}
                                        type="text"
                                        name="phoneNumber1"
                                        value={userData.phoneNumber1}
                                    />
                                    {errors.phoneNumber1 !== "" && <p className=" text-red-500">{errors.phoneNumber1}</p>}
                                </div>
                                <div>
                                    <label className='block mb-1  font-medium text-gray-900 dark:text-darkText'>Telefono alternativo</label>
                                    <input
                                        onChange={handleChange}
                                        type="text"
                                        name="phoneNumber2"
                                        value={userData.phoneNumber2}
                                        placeholder="Telefono 2"
                                        className={`border border-black p-2 rounded w-full ${errors.phoneNumber2 !== undefined && "border-red-500"} dark:text-darkText dark:bg-darkPrimary`}
                                    />
                                    {errors.phoneNumber2 !== "" && <p className=" text-red-500">{errors.phoneNumber2}</p>}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mb-1">
                                <div>
                                    <label className='block mb-1  font-medium text-gray-900 dark:text-darkText'>% de comisión</label>
                                    <input
                                        onChange={handleChange}
                                        type="text"
                                        name="commission"
                                        value={userData.commission}
                                        placeholder="Comision"
                                        className={`border border-black p-2 rounded w-full ${errors.commission !== undefined && "border-red-500"} dark:text-darkText dark:bg-darkPrimary`}
                                    />
                                    {errors.commission !== "" && <p className=" text-red-500 ">{errors.commission}</p>}
                                </div>
                                <div>
                                    <label className='block mb-1  font-medium text-gray-900 dark:text-darkText'>Rol</label>
                                    <select
                                        onChange={handleChange}
                                        name="rol"
                                        value={userData.rol}
                                        placeholder='Selecciona un rol'
                                        className={`bg-gray-50 border border-black text-black sm: rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 ${errors.rol !== undefined && "border-red-500"} dark:text-darkText dark:bg-darkPrimary`}
                                    >
                                        {roles.map((rol, index) => (
                                            <option key={index} value={rol}>
                                                {rol}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.rol !== "" && <p className=" text-red-500">{errors.rol}</p>}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-2">
                                <div className="mb-2">
                                    <label className="block mb-2  font-medium text-gray-900 dark:text-darkText">Especialidades</label>
                                    {specialties.map((specialty, index) => (
                                        <div key={index} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id={specialty.id}
                                                name="specialtyName"
                                                value={specialty.id}
                                                checked={userData.specialtyName.map(s => s.id).includes(specialty.id)}
                                                onChange={handleChange}
                                                className="mr-2 dark:bg-darkPrimary dark:text-darkText dark:border-none "
                                            />
                                            <label htmlFor={specialty} className=" text-gray-900 dark:text-darkText">
                                                {specialty.specialtyName}
                                            </label>
                                        </div>
                                    ))}
                                    {errors.specialtyName !== "" && <p className=" text-red-500">{errors.specialtyName}</p>}
                                </div>
                                <div>
                                    <label className="block mb-2  font-medium text-gray-900 dark:text-darkText">Sedes</label>
                                    {branches.map((b, index) => (
                                        <div key={index} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id={b.id}
                                                name="branch"
                                                value={b.id}
                                                checked={userData.branch.map(s => s.id).includes(b.id)}
                                                onChange={handleChange}
                                                className="mr-2"
                                            />
                                            <label htmlFor={b} className=" text-gray-900 dark:text-darkText">
                                                {b.branchName}
                                            </label>
                                        </div>
                                    ))}
                                    {errors.branch !== "" && <span className=" text-red-500">{errors.branch}</span>}
                                </div>
                            </div>
                            <div>
                                <div className="flex flex-col w-full items-center">
                                    <UploadWidget className="w-full" setUserData={setUserData} />
                                    <div className='mt-2 mb-1'>
                                        <img className='w-20 h-20 rounded' src={userData.image} alt="user-avatar" />
                                    </div>
                                </div>
                            </div>
                            {!submitLoader ?
                            <div className='flex justify-center my-2'>
                                <button
                                    type="submit"
                                    className="px-6 py-2 w-fit rounded-md bg-primaryPink shadow shadow-black text-black hover:bg-secondaryColor transition-colors duration-700 dark:text-darkText dark:bg-darkPrimary dark:hover:bg-blue-600"
                                    disabled={disableSubmit}
                                >
                                    Actualizar usuario
                                </button> 
                            </div> :
                                <Loader />
                            }
                        </form>
                    </div>
                
            </div>
        </>
    );
}

export default EditModal;
