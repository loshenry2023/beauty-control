import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getClients } from "../../redux/actions";
import CreateClient from "./CreateClient";

//icons
import { IoPersonAddOutline } from "react-icons/io5";
import { IoClose } from 'react-icons/io5';
import ClientFilters from "../ClientFilters";
import ClientsTable from "../ClientsTable";
import Pagination from "../Pagination";


const ListClients = ({ setShowClientListModal, setChosenClient }) => {

  const token = useSelector((state) => state?.token);
  const clients = useSelector((state) => state?.clients);
  const count = useSelector((state) => state?.countClient);
  const dispatch = useDispatch();

  const [nameOrLastName, setNameOrLastName] = useState("");
  const [birthdaysMonth, setBirthdaysMonth] = useState("");
  const [attribute, setAttribute] = useState("lastName");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [createDateStart, setCreateDateStart] = useState("");
  const [createDateEnd, setCreateDateEnd] = useState("");

  const [showClientFormModal, setShowClientFormModal] = useState(false);
  const [activarNuevoCliente, setActivarNuevoCliente] = useState(false);

  const showCreateModal = () => {
    setShowClientFormModal(true)
  }

  useEffect(() => {
    dispatch(
      getClients(
        nameOrLastName,
        attribute,
        order,
        page,
        size,
        createDateEnd,
        createDateStart,
        birthdaysMonth,
        { token }
      )
    )
    const close = (e) => {
      if(e.keyCode === 27){
        if(showClientFormModal === false) {setShowClientListModal(false)}
        if(showClientFormModal === true ) {setShowClientListModal(true)}
      }
    }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)}
  , [
    nameOrLastName,
    attribute,
    order,
    page,
    size,
    createDateEnd,
    createDateStart,
    token,
    activarNuevoCliente,
    birthdaysMonth
  ]);

  return (
    <section className="fixed top-0 left-0 flex justify-center w-full h-full" style={{ background: "rgba(0, 0, 0, 0.70)" }}>
    <div className="flex flex-col rounded m-5 p-3 gap-3 w-full sm:w-4/5 md:w-3/4 lg:w-2/3 xl:w-1/2 mx-auto border border-white bg-white dark:bg-darkBackground">
      <div className="flex flex-row justify-between">
        <>
          <IoPersonAddOutline onClick={showCreateModal} className='h-7 w-7 mt-0.5 cursor-pointer dark:text-darkText' />
        </>
        <h1 className="text-2xl dark:text-darkText">Elige un cliente</h1>
        <>
          <IoClose className='h-6 w-6 mt-0.5 cursor-pointer hover:scale-125 dark:text-darkText' onClick={() => setShowClientListModal(false)} />
        </>
      </div>
      <ClientFilters setNameOrLastName={setNameOrLastName} nameOrLastName={nameOrLastName} setAttribute={setAttribute} setOrder={setOrder} setPage={setPage} setSize={setSize} />
      <div>
        <ClientsTable count={count} setChosenClient={setChosenClient} setShowClientListModal={setShowClientListModal} clients={clients} />
      </div>
      <Pagination page={page} setPage={setPage} size={size} setSize={setSize} count={count} />
    </div>
    {showClientFormModal ?
      <CreateClient
        setChosenClient={setChosenClient}
        setShowClientListModal={setShowClientListModal}
        setShowClientFormModal={setShowClientFormModal}
        setActivarNuevoCliente={setActivarNuevoCliente}
      /> : null}
  </section>
  );
};

export default ListClients;
