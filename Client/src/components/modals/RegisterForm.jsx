import React, { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import validateRegisterInput from '../../functions/registerFormValidations'
import axios from 'axios';
import { UploadWidget } from '../Uploadwidget';

function RegisterForm({ setShowResgisterFormModal, branches, specialties, tokenID }) {

  const roles = ["superAdmin", "admin", "especialista"];

  const [userData, setUserData] = useState({
    name: "",
    lastName: "",
    userName: "",
    phoneNumber1: "",
    phoneNumber2: "",
    image: "https://res.cloudinary.com/doqyrz0sg/image/upload/v1702302836/varpjl2p5dwvpwbmdiui.png",
    specialtyName: [],
    commission: "",
    branch: [],
    rol: "",
    notificationEmail: "",
  });
  console.log(userData)
  const [errors, setErrors] = useState({
  });

  const closeModal = () => {
    setShowResgisterFormModal(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox' && name === 'specialtyName') {
      setUserData((prevInfo) => {
        const updatedSpecialities = checked
          ? [...prevInfo.specialtyName, value]
          : prevInfo.specialtyName.filter((specialty) => specialty !== value);

        return {
          ...prevInfo,
          [name]: updatedSpecialities,
        }
      })
    }
    else if (type === 'checkbox' && name === 'branch') {
      setUserData((prevInfo) => {
        const updatedBranches = checked
          ? [...prevInfo.branch, value]
          : prevInfo.branch.filter((branchName) => branchName !== value);

        return {
          ...prevInfo,
          [name]: updatedBranches,
        };
      })
    }
    else {
      setUserData((prevInfo) => ({
        ...prevInfo,
        [name]: value,
      }));
    }

    setUserData((prevInfo) => {
      const validationErrors = validateRegisterInput({ ...prevInfo, [name]: value });
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: validationErrors[name],
      }));
      return prevInfo;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateRegisterInput(userData);
    setErrors(validationErrors);

    const hasErrors = Object.values(validationErrors).some((error) => error !== undefined);

    if (hasErrors) {
    } else {
      try {
        const data = {
          name: userData.name,
          lastName: userData.lastName,
          userName: userData.userName,
          specialty: userData.specialtyName,
          branch: userData.branch,
          phone1: userData.phoneNumber1,
          phone2: userData.phoneNumber2,
          role: userData.rol,
          notificationEmail: userData.notificationEmail,
          image: userData.image,
          comission: userData.commission,
          token: tokenID
        }
        const response = await axios.post("http://localhost:3001/laura-vargas/newuser", data)

        if (response.data.created === "ok") {
          closeModal()
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
          )
          window.alert("usuario creado exitosamente")
          
        } else {
          window.alert("Hubo un problema con la creacion")
        }
      } catch (error) {
        window.alert(`Hubo un problema con la creacion. ${error.response.data}`)
      }

    }
  };

  return (
    <>
      <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full bg-black opacity-95">
        <div className="container">
          <div className="w-full bg-white shadow rounded-lg p-6 md:mx-auto md:w-1/2 2xl:w-1/3 dark:bg-darkBackground">
          <div className='flex justify-between'>
            <h1 className="text-xl font-semibold mb-4 text-black dark:text-darkText">Agregar usuario</h1>
            <IoClose onClick={closeModal} className='cursor-pointer mt-2 w-5 h-5 dark:text-darkText' />
          </div>
            <form onSubmit={handleSubmit}>
              <div className="first-letter:grid grid-cols-1 mb-2">
                <input
                  placeholder="Mail de usuario"
                  className="border border-black p-2 rounded w-full dark:bg-darkPrimary dark:text-darkText dark:border-none dark:shadow dark:shadow-white"
                  onChange={handleChange}
                  type="email"
                  name="userName"
                  value={userData.userName}
                />
                {errors.userName !== "" && <p className="text-xs text-red-500 ">{errors.userName}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                <div>
                  <input
                    onChange={handleChange}
                    type="text"
                    name="name"
                    value={userData.name}
                    placeholder="Nombre"
                    className="border border-black p-2 rounded w-full dark:bg-darkPrimary dark:text-darkText dark:border-none dark:shadow dark:shadow-white"
                  />
                  {errors.name !== "" && <p className="text-xs text-red-500">{errors.name}</p>}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Apellido"
                    className="border border-black p-2 rounded w-full dark:bg-darkPrimary dark:text-darkText dark:border-none dark:shadow dark:shadow-white"
                    onChange={handleChange}
                    name="lastName"
                    value={userData.lastName}

                  />
                  {errors.lastName !== "" && <p className="text-xs text-red-500">{errors.lastName}</p>}
                </div>
              </div>
              <div className="first-letter:grid grid-cols-1 gap-4 mb-2">
                <input
                  placeholder="Email para notifiaciones"
                  className="border border-black p-2 rounded w-full dark:bg-darkPrimary dark:text-darkText dark:border-none dark:shadow dark:shadow-white"
                  onChange={handleChange}
                  type="email"
                  name="notificationEmail"
                  value={userData.notificationEmail}
                />
                {errors.notificationEmail !== "" && <p className="text-xs text-red-500">{errors.notificationEmail}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                <div>
                  <input
                    placeholder="Telefono 1"
                    className="border border-black p-2 rounded w-full dark:bg-darkPrimary dark:text-darkText dark:border-none dark:shadow dark:shadow-white"
                    onChange={handleChange}
                    type="text"
                    name="phoneNumber1"
                    value={userData.phoneNumber1}
                  />
                  {errors.phoneNumber1 !== "" && <p className="text-xs text-red-500">{errors.phoneNumber1}</p>}
                </div>
                <div>
                  <input
                    onChange={handleChange}
                    type="text"
                    name="phoneNumber2"
                    value={userData.phoneNumber2}
                    placeholder="Telefono 2"
                    className="border border-black p-2 rounded w-full dark:bg-darkPrimary dark:text-darkText dark:border-none dark:shadow dark:shadow-white "
                  />
                  {errors.phoneNumber2 !== "" && <p className="text-xs text-red-500">{errors.phoneNumber2}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-2">
                <div>
                  <input
                    onChange={handleChange}
                    type="text"
                    name="commission"
                    value={userData.commission}
                    placeholder="Comision"
                    className="border border-black p-2 rounded w-full dark:bg-darkPrimary dark:text-darkText dark:border-none dark:shadow dark:shadow-white"
                  />
                  {errors.commission !== "" && <p className="text-xs text-red-500 ">{errors.commission}</p>}
                </div>
                <div>
                  <select
                    onChange={handleChange}
                    name="rol"
                    value={userData.rol}
                    className="bg-gray-50 border border-black text-black sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-darkPrimary dark:text-darkText dark:border-none dark:shadow dark:shadow-white"

                  >
                    <option value="" disabled hidden>Selecciona un rol</option>
                    {roles.map((rol, index) => (
                      <option key={index} value={rol}>
                        {rol}
                      </option>
                    ))}
                  </select>
                  {errors.rol !== "" && <p className="text-xs text-red-500">{errors.rol}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                <div className="mb-2">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-darkText">Especialidades</label>
                  {specialties.map((specialty, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="checkbox"
                        id={specialty}
                        name="specialtyName"
                        value={specialty.id}
                        checked={userData.specialtyName.includes(specialty.id)}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <label htmlFor={specialty} className="text-sm text-gray-900 dark:text-darkText">
                        {specialty.specialtyName}
                      </label>
                    </div>
                  ))}
                  {errors.specialtyName !== "" && <p className="text-xs text-red-500">{errors.specialtyName}</p>}
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-darkText">Sedes</label>
                    {branches.map((branch, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="checkbox"
                          id={branch}
                          name="branch"
                          value={branch.id}
                          checked={userData.branch.includes(branch.id)}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        <label htmlFor={branch} className="text-xs text-gray-900 dark:text-darkText">
                          {branch.branchName}
                        </label>
                      </div>
                    ))}
                    {errors.branch !== "" && <span className="text-xs text-red-500">{errors.branch}</span>}
                </div>
              </div>
                <div>
                  <div className="flex flex-col w-full items-center">
                    <UploadWidget setUserData={setUserData} />
                    <div className='mt-2 mb-2'>
                      <img className='w-20 h-20 rounded' src={userData.image} alt="user-avatar" />
                    </div>
                    </div>  
                </div>
              <button
                type="submit"
                id="theme-toggle"
                className="px-4 py-2 w-full rounded bg-primaryPink shadow shadow-black text-black hover:bg-blue-600 focus:outline-none transition-colors dark:text-darkText dark:bg-darkPrimary dark:hover:bg-blue-600"
              >
                Crear Usuario
              </button>
            </form>
          </div>
        </div>
      </div>


    </>
  );
}

export default RegisterForm;