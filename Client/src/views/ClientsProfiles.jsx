import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import Loader from "../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { getClients } from "../redux/actions";
import ClientsTable from "../components/ClientsTable";
import ErrorToken from "./ErrorToken";

import axios from "axios";
import getParamsEnv from "../functions/getParamsEnv";
const { API_URL_BASE } = getParamsEnv();

//icons
import { IoPersonAddOutline } from "react-icons/io5";
import CreateClient from '../components/modals/CreateClient';
import ClientFilters from "../components/ClientFilters";
import Pagination from "../components/Pagination";



const ClientsProfiles = () => {

  const [loading, setLoading] = useState(true);
  const token = useSelector((state) => state?.token);
  const user = useSelector((state) => state?.user);
  const clients = useSelector((state) => state?.clients);
  const count = useSelector((state) => state?.countClient);
  const tokenError = useSelector((state) => state?.tokenError);
  const dispatch = useDispatch();

  const [nameOrLastName, setNameOrLastName] = useState("");
  const [birthdaysMonth, setBirthdaysMonth] = useState("");
  const [attribute, setAttribute] = useState("lastName");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [createDateStart, setCreateDateStart] = useState("");
  const [createDateEnd, setCreateDateEnd] = useState("");

  const [showClientFormModal, setShowClientCreateModal] = useState(false);
  const [activarNuevoCliente, setActivarNuevoCliente] = useState(false);


  const handleClientFormModal = () => {
    setShowClientCreateModal(true);
  };

  let requestMade = false;
  useEffect(() => {
    //! PENDIENTE - No usar dispach que en actions llamen a Axios porque no se puede controlar el asincronismo
    // dispatch(
    //   getClients(
    //     nameOrLastName,
    //     attribute,
    //     order,
    //     page,
    //     size,
    //     createDateEnd,
    //     createDateStart,
    //     birthdaysMonth,
    //     { token }
    //   )
    // ).then(() => setLoading(false));
    if (!requestMade) { // evito llamados en paralelo al pedir los datos iniciales
      requestMade = true
      axios.post(API_URL_BASE + `/v1/getclients?nameOrLastName=${nameOrLastName}&attribute=${attribute}&order=${order}&page=${page}&size=${size}&createDateEnd=${createDateEnd}&createDateStart=${createDateStart}&birthdaysMonth=${birthdaysMonth}`, {token})
      .then(respuesta => {
        dispatch(getClients(respuesta.data))
        setLoading(false)
      })
    }
  }, [
    nameOrLastName,
    attribute,
    order,
    page,
    size,
    createDateEnd,
    createDateStart,
    token,
    activarNuevoCliente,
    birthdaysMonth,
    tokenError
  ]);

  if (tokenError === 401 || tokenError === 403) {
    return (
      <ErrorToken error={tokenError} />
    );
  } else {
    return (
      <div>
        <NavBar />
        <div className="flex flex-row dark:bg-darkBackground">
          <SideBar />
          {loading ? (
            <Loader />
          ) : (
            <div className="flex flex-col mt-10 gap-5 w-2/3 mx-auto">
              <div className="flex flex-row gap-2">
                <h1 className="text-3xl underline underline-offset-4 tracking-wide text-center font-fontTitle dark:text-beige sm:text-left">
                  {" "}
                  Clientes{" "}
                </h1>
                {user.role !== "especialista" ?
                  <IoPersonAddOutline className='h-6 w-6 mt-2.5 cursor-pointer dark:text-darkText' onClick={handleClientFormModal} /> : null
                }
              </div>
              <ClientFilters setNameOrLastName={setNameOrLastName} nameOrLastName={nameOrLastName} setAttribute={setAttribute} setOrder={setOrder} setPage={setPage} setSize={setSize} setBirthdaysMonth={setBirthdaysMonth} setCreateDateStart={setCreateDateStart} setCreateDateEnd={setCreateDateEnd} createDateStart={createDateStart} createDateEnd={createDateEnd} />
              <ClientsTable count={count} clients={clients} />
              <Pagination page={page} setPage={setPage} size={size} setSize={setSize} count={count} />
            </div>
          )}
        </div>
        {showClientFormModal ? (
          <CreateClient
            activarNuevoCliente={activarNuevoCliente}
            setShowClientCreateModal={setShowClientCreateModal}
            setActivarNuevoCliente={setActivarNuevoCliente}
          />
        ) : null}
      </div>

    );
  }
};

export default ClientsProfiles;
