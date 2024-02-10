import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useParams } from "react-router-dom";
import { getClientId, getPayMethods } from "../redux/actions/";
import HistoryServices from "./HistoryServices";
import { toast } from "react-hot-toast";
import ToasterConfig from "../components/Toaster";

import { UploadWidgetDate } from "./UploadWidgetDate";
import { CiCirclePlus } from "react-icons/ci";
import { CiCircleMinus } from "react-icons/ci";
import Loader from "./Loader";
import { UploadWidgetConsent } from "./UploadWidgetConsent";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./dateDetail.css";
import getParamsEnv from "../functions/getParamsEnv";
import { IoMdArrowRoundBack } from "react-icons/io";

const { API_URL_BASE, AGENDA } = getParamsEnv();

const DateDetail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id: appointmentId } = useParams();
  const branch = useSelector((state) => state?.workingBranch);
  const token = useSelector((state) => state?.token);
  const calendar = useSelector((state) => state?.calendar);
  const clientInfo = useSelector((state) => state?.clientID);
  const payMethods = useSelector((state) => state?.payMethods);
  const [clientId, setClientId] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState({
    paymentMethod1: "",
    paymentMethod2: "",
  });
  const [paymentLoaded, setPaymentLoaded] = useState({
    price: false,
    method: false,
  });

  const [showFinishConfirmation, setShowFinishConfirmation] = useState(false);

  const [showPayment2, setShowPayment2] = useState(false);
  const [isConsentVisible, setIsConsentVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [photoLoaded, setPhotoLoaded] = useState(false);
  const [consentLoaded, setConsentLoaded] = useState(false);
  const [photo, setPhoto] = useState(
    "https://res.cloudinary.com/doyafxwje/image/upload/v1703977101/Icons/cosmetics_pt2tcb.png"
  );
  const [consent, setConsent] = useState(
    "https://res.cloudinary.com/doyafxwje/image/upload/v1703977059/Icons/pdf_bq1qdf.png"
  );
  const [consentURL, setConsentUrl] = useState("");
  const [price, setPrice] = useState({
    amount1: "",
    amount2: "",
  });
  const [aux, setAux] = useState(false);
  const [showPriceConfirmation, setShowPriceConfirmation] = useState();

  useEffect(() => {
    if (calendar) {
      const findAppointment = calendar.find(
        (date) => date.id === appointmentId
      );
      if (findAppointment) {
        setAppointment(findAppointment);
        setIsLoading(true);
        dispatch(getClientId(findAppointment.Client.id, { token }));
      }
    }
    dispatch(getPayMethods({ token }));
  }, [dispatch, token, appointmentId, clientId]);

  const handlePriceChange = (e, priceType) => {
    const updatedPrice = { ...price, [priceType]: e.target.value };
    setPrice(updatedPrice);
    setPaymentLoaded((prevInfo) => ({
      ...prevInfo,
      price: true,
    }));
  };

  const handlePaymentMethodChange = (e, methodNumber) => {
    setPaymentMethods({
      ...paymentMethods,
      [`paymentMethod${methodNumber}`]: e.target.value,
    });
    setPaymentLoaded((prevInfo) => ({
      ...prevInfo,
      method: true,
    }));
  };

  const handleToggleConsentVisibility = () => {
    if (isConsentVisible) {
      setIsConsentVisible(false);
      setConsentUrl("");
      setConsent(
        "https://res.cloudinary.com/doyafxwje/image/upload/v1703977059/Icons/pdf_bq1qdf.png"
      );
      setConsentLoaded(false);
    } else {
      setIsConsentVisible(true);
    }
  };
  const finishConfirmed = (confirmed) => {
    if (confirmed) {
      hideDeleteModal();
      handleSubmit();
    } else {
      hideDeleteModal();
    }
  };

  const priceConfirmed = (confirmed) => {
    if (confirmed) {
      setShowPriceConfirmation(false);
      setShowFinishConfirmation(true);
    } else {
      setShowPriceConfirmation(false);
    }
  };

  const handleCheckPrice = () => {
    if (

      (Number(price.amount1) + Number(price.amount2)) !==
      Number(appointment.Service.price)
    ) {
      setShowPriceConfirmation(true);
    } else {
      setShowFinishConfirmation(true);
    }
  };

  const hideDeleteModal = () => {
    setShowFinishConfirmation(false);
  };

  const updateDateState = async () => {
    const data = {
      date_from: appointment.date_from,
      date_to: appointment.date_to,
      obs: appointment.obs,
      idBranch: appointment.Branch.id,
      idUser: appointment.User.id,
      idService: appointment.Service.id,
      idClient: appointment.Client.id,
      current: false,
      token: token,
    };

    try {
      const response = await axios.put(
        `${API_URL_BASE}/calendar/${appointmentId}`,
        data
      );
    } catch (error) {}
  };

  useEffect(() => {}, [appointment]);

  const handleConsentLoad = () => {
    setConsentLoaded(true);
  };

  const observationSectionStyle = {
    backgroundColor: photoLoaded && "#A8D0B9",
    color: photoLoaded && "black",
  };

  const observationSectionStyleConsent = {
    backgroundColor: consentLoaded && "#A8D0B9",
    color: consentLoaded && "black",
  };

  const isButtonDisabled = !(
    photoLoaded &&
    (!isConsentVisible || consentLoaded) &&
    price &&
    paymentLoaded.price &&
    paymentLoaded.method
  );

  const handleSubmit = async () => {
    try {
      const dateData = {
        idUser: appointment.User.id,
        idclient: appointment.Client.id,
        imageServiceDone: photo,
        date: appointment.date_from,
        conformity: consentURL || "",
        branchName: appointment.Branch.branchName,
        paymentMethodName1: paymentMethods.paymentMethod1,
        amount1: price.amount1,
        paymentMethodName2: paymentMethods.paymentMethod2 || " ",
        amount2: price.amount2 || "0",
        serviceName: appointment.Service.serviceName,
        attendedBy: `${appointment.User.name} ${appointment.User.lastName}`,
        email: appointment.Client.email,
        name: appointment.Client.name,
        lastName: appointment.Client.lastName,
        id_pers: appointment.Client.id_pers,
        token: token,
      };

      const response = await axios.post(
        `${API_URL_BASE}/newhistoricproc`,
        dateData
      );
      if (response.data.created === "ok") {
        toast.success("Cita Finalizada exitosamente");
        updateDateState();
        setTimeout(() => {
          navigate(AGENDA);
        }, 3000);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const Checkbox = () => (
    <div className="flex items-center text-sm mt-[-20px]">
      <input
        type="checkbox"
        checked={isConsentVisible}
        onChange={handleToggleConsentVisibility}
        className="form-checkbox h-4 w-4 text-primaryPink"
      />
      <span className="ml-2">Requiere conformidad</span>
    </div>
  );

  const handleGoBack = () => {
    navigate(-1);
  };

  if (!isLoading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col mx-auto py-10 overflow-auto">
      <div className="flex flex-row">
        <IoMdArrowRoundBack
          onClick={handleGoBack}
          className="w-6 h-6 mt-1 mr-2 hover:scale-110 cursor-pointer dark:text-darkText"
        />
        <h1 className="mb-4 text-2xl underline underline-offset-4 tracking-wide text-center font-fontTitle dark:text-beige sm:text-left">
          {" "}
          Información de cita
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 m-auto ">
        {/* Client Details */}

        <div className="p-6 bg-primaryColor rounded-md dark:bg-darkPrimary">
          <div className="bg-secondaryColor max-w-screen-sm rounded-2xl overflow-hidden shadow-lg mx-auto dark:border-4 dark:border-zinc-800">
            <div className="grid grid-cols-1 place-items-center xl:place-items-start xl:grid-cols-3 sm:p-5 dark:bg-darkBackground">
              <img
                src={clientInfo.image}
                className="w-40 ml-8 shadow shadow-black rounded-full col-span-1 sm:w-40 sm:place-self-center dark:shadow-darkText"
                alt="client-photo"
              />
              <div className="m-4 col-span-2 ml-10 mt-0 space-y-2 dark:text-darkText">
                <p className="font-medium mt-5 text-center xl:text-left xl:mt-0">
                  Nombre: <span className="font-light">{clientInfo.name}</span>
                </p>
                <p className="font-medium text-center xl:text-left">
                  Apellido:{" "}
                  <span className="font-light">{clientInfo.lastName}</span>
                </p>
                <p className="font-medium text-center xl:text-left">
                  Email: <span className="font-light">{clientInfo.email}</span>
                </p>
                <p className="font-medium text-center xl:text-left">
                  ID:{" "}
                  {clientInfo.id_pers ? (
                    <span className="font-light">{clientInfo.id_pers} </span>
                  ) : (
                    <span className="font-light"> - </span>
                  )}
                </p>
                <p className="font-medium text-center xl:text-left">
                  Teléfono:{" "}
                  <span className="font-light">{clientInfo.phoneNumber1}</span>{" "}
                </p>
                <p className="font-medium text-center xl:text-left">
                  Teléfono secundario:{" "}
                  {clientInfo.phoneNumber2 ? (
                    <span className="font-light">
                      {clientInfo.phoneNumber2}{" "}
                    </span>
                  ) : (
                    <span className="font-light"> - </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Observations Section */}
        <div className="flex items-center p-6 bg-primaryColor rounded-md dark:bg-darkPrimary">
          <div className="bg-primaryColor max-w-screen-sm rounded-2xl overflow-hidden mx-auto dark:border-4 dark:border-zinc-800">
            <div className="grid grid-cols-1 bg-secondaryColor gap-20 p-5 mx-auto xl:h-60 xl:grid-cols-2 dark:bg-darkBackground">
              <div
                className={`flex flex-col flex-wrap gap-4 p-4 rounded-md shadow-sm md:justify-center shadow-black dark:text-darkText dark:bg-darkPrimary dark:shadow-darkText`}
                style={observationSectionStyle}
              >
                <p className="text-md underline">
                  Agrega foto de este procedimiento
                </p>
                <div className="flex flex-row flex-wrap gap-10">
                  <div className="flex flex-row flex-wrap gap-10">
                    <UploadWidgetDate
                      setPhoto={setPhoto}
                      setPhotoLoaded={setPhotoLoaded}
                    />
                    <img
                      className="w-12 h-12 dark:invert"
                      src={photo}
                      alt="foto de procedimiento"
                    />
                  </div>
                </div>
              </div>
              <div
                className={`flex flex-col flex-wrap gap-4 p-4 rounded-md shadow-sm md:justify-center shadow-black dark:text-darkText dark:bg-darkPrimary dark:shadow-darkText ${
                  isConsentVisible ? "visible" : "bg-secondaryColor"
                }`}
                style={observationSectionStyleConsent}
              >
                <Checkbox />
                <div>
                  <p className="underline mt-[-10px]">
                    Agrega formulario de conformidad
                  </p>
                  <div className="flex flex-row flex-wrap gap-10 mt-5">
                    <div className="flex flex-row flex-wrap gap-10">
                      <UploadWidgetConsent
                        isConsentVisible={isConsentVisible}
                        setConsentUrl={setConsentUrl}
                        setConsent={setConsent}
                        setConsentLoaded={setConsentLoaded}
                      />
                      <img
                        className="w-12 h-12 dark:invert"
                        src={consent}
                        alt="foto de procedimiento"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* History Services Section */}
        {isLoading && (
          <div className="p-6 flex justify-center bg-primaryColor rounded-md dark:bg-darkPrimary">
            {clientInfo.HistoryServices ? (
              <div className="bg-secondaryColor w-full h-fit rounded-2xl overflow-auto max-h-[450px] scrollbar-container dark:bg-darkPrimary ">
                <HistoryServices history={clientInfo.HistoryServices} />
              </div>
            ) : (
              <p>Loading history...</p>
            )}
          </div>
        )}

        {/* Payment Section */}
        <div className="p-6 bg-primaryColor rounded-md flex flex-col gap-4 dark:bg-darkPrimary">
          <div className="p-4 rounded-2xl bg-secondaryColor overflow-hidden shadow-lg mx-auto dark:bg-darkBackground dark:border-4  dark:dark:border-zinc-800">
            <div className="flex flex-col gap-6 mx-auto">
              <div className="flex flex-row rounded-lg dark:bg-darkBackground">
                <div className=" rounded overflow-hidden p-6 flex flex-row flex-wrap gap-2 justify-center">
                  <div className="rounded overflow-hidden flex-grow p-6 shadow-sm shadow-black dark:bg-darkPrimary dark:shadow-darkText">
                    <p className="text-xl font-medium text-black dark:text-darkText">
                      Procedimiento
                    </p>
                    <p className="text-sm text-left 2xl:text-center dark:text-darkText">
                      {appointment.Service.serviceName}
                    </p>
                  </div>
                  <div className="rounded overflow-auto shadow-sm flex-grow p-6 shadow-black dark:bg-darkPrimary dark:shadow-darkText">
                    <label className="text-xl font-medium text-black dark:text-darkText">
                      Observaciones
                    </label>
                    <p className="text-sm text-left 2xl:text-center dark:text-darkText">
                      {appointment.obs !== " " ? appointment.obs : " - "}{" "}
                    </p>
                  </div>
                  <div className="rounded overflow-hidden shadow-sm flex-grow p-6 shadow-black dark:bg-darkPrimary dark:shadow-darkText">
                    <p className="text-xl font-medium text-black dark:text-darkText">
                      {" "}
                      Precio final
                    </p>
                    <p className="text-sm m-auto text-left 2xl:text-center dark:text-darkText">
                      ${appointment.Service.price}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6 flex flex-col justify-center items-center flex-wrap md:flex-row sm:justify-start gap-10 rounded-lg dark:bg-darkPrimary">
                <div className="rounded overflow-hidden shadow-sm shadow-black dark:shadow-white  p-2 m-2 flex flex-col gap-4 dark:bg-darkPrimary">
                  <div className="mb-4 dark:bg-darkPrimary rounded-lg p-2 ">
                    <label className="ml-1 block text-md font-medium text-black dark:text-darkText">
                      Precio $
                    </label>
                    <input
                      type="number"
                      value={price.amount1}
                      onChange={(e) => handlePriceChange(e, "amount1")}
                      className="p-1 rounded-lg dark:bg-darkPrimary dark:border dark:text-darkText"
                      placeholder="Ingrese el precio"
                    />
                  </div>
                  <div className="mb-4 dark:bg-darkPrimary rounded-lg p-2">
                    <label className="ml-1 block text-md font-medium text-black dark:bg-darkPrimary dark:text-darkText">
                      Medio de Pago A
                    </label>
                    <select
                      value={paymentMethods.paymentMethod1}
                      onChange={(e) => handlePaymentMethodChange(e, 1)}
                      className="p-1 rounded-lg dark:bg-darkPrimary dark:border dark:text-darkText"
                    >
                      <option value="" disabled>
                        Elige medio de pago
                      </option>
                      {payMethods.map((method) => (
                        <option
                          key={method.id}
                          value={method.paymentMethodName}
                        >
                          {method.paymentMethodName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  onClick={() => setShowPayment2(!showPayment2)}
                  className="dark:text-darkText"
                >
                  {showPayment2 ? (
                    <CiCircleMinus size={30} />
                  ) : (
                    <CiCirclePlus size={30} />
                  )}
                </button>
                {showPayment2 && (
                  <div className="rounded overflow-hidden shadow-sm shadow-black dark:shadow-white p-2 m-2 flex flex-col gap-4">
                    <div className="mb-4 dark:bg-darkPrimary rounded-lg p-2 ">
                      <label className="ml-1 block text-md font-medium text-black dark:bg-darkPrimary dark:text-darkText">
                        Precio $
                      </label>
                      <input
                        type="number"
                        value={price.amount2}
                        onChange={(e) => handlePriceChange(e, "amount2")}
                        className="p-1 rounded-lg dark:bg-darkPrimary dark:border dark:text-darkText"
                        placeholder="Ingrese el precio"
                      />
                    </div>
                    <div className="mb-4 dark:bg-darkPrimary rounded-lg p-2">
                      <label className="ml-1 block text-md font-medium text-black dark:text-darkText">
                        Medio de Pago B
                      </label>
                      <select
                        value={paymentMethods.paymentMethod2}
                        onChange={(e) => handlePaymentMethodChange(e, 2)}
                        className="p-1 rounded-lg dark:bg-darkPrimary dark:border dark:text-darkText"
                      >
                        <option value="" disabled>
                          Elige medio de pago
                        </option>
                        {payMethods.map((method) => (
                          <option
                            key={method.id}
                            value={method.paymentMethodName}
                          >
                            {method.paymentMethodName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <button
                disabled={isButtonDisabled}
                onClick={handleCheckPrice}
                className={isButtonDisabled ? "btn px-4 py-2 rounded-full shadow shadow-black dark:bg-red-500 disabled-btn cursor-not-allowed" : " cursor-pointer btn px-4 py-2 rounded-full shadow shadow-black dark:bg-red-500 disabled-btn"}
                style={{
                  backgroundColor: isButtonDisabled ? "" : "#A8D0B9",
                }}
              >
                Finalizar Cita
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToasterConfig />
      {showFinishConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className={`bg-white p-6 rounded-lg shadow-lg text-center sm:flex sm:flex-col ${
              window.innerWidth < 340 ? "max-w-sm" : "max-w-md"
            }`}
          >
            <p className="mb-4 text-sm sm:text-base">
              ¿Estás seguro de que deseas finalizar esta cita?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => finishConfirmed(true)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm sm:text-base"
              >
                Aceptar
              </button>
              <button
                onClick={() => finishConfirmed(false)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm sm:text-base"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      {showPriceConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className={`bg-white p-6 rounded-lg shadow-lg text-center sm:flex sm:flex-col ${
              window.innerWidth < 340 ? "max-w-sm" : "max-w-md"
            }`}
          >
            <p className="mb-4 text-sm sm:text-base">
              El importe a pagar es diferente al precio final ¿Deseas continuar?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => priceConfirmed(true)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm sm:text-base"
              >
                Aceptar
              </button>
              <button
                onClick={() => priceConfirmed(false)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm sm:text-base"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateDetail;
