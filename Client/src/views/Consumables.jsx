import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../redux/actions";
import axios from "axios";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import ConsumablesTable from "../components/ConsumablesTable";
import NewConsumableModal from "../components/modals/newConsumableModal";
import ErrorToken from "./ErrorToken";

import getParamsEnv from "../functions/getParamsEnv";
const { API_URL_BASE } = getParamsEnv();

import { FaPlus } from "react-icons/fa";

import Loader from "../components/Loader";
import "./loading.css";

import ToasterConfig from "../components/Toaster";
import { toast } from "react-hot-toast";
import Restricted from "./Restricted";

function Consumables() {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [showNewConsumableModal, setShowNewConsumableModal] = useState(false);
    const [newProductAdded, setNewProductAdded] = useState(false);
    const [editedProduct, setEditedProduct] = useState(false);

    const [productName, setProductName] = useState("");
    const [description, setDescription] = useState("");

    const [loadingProducts, setLoadingProducts] = useState(true);

    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);

    const user = useSelector((state) => state?.user);
    const branches = user.branches;
    const [selectedBranch, setSelectedBranch] = useState("");
    const token = useSelector((state) => state?.token);
    const tokenError = useSelector((state) => state?.tokenError);
    const [products, setProducts] = useState(null)
    const workingBranch = useSelector((state) => state?.workingBranch);

    const count = useSelector((state) => state?.count);
    const [aux, setAux] = useState(false)


    useEffect(() => {
        /*  //! PENDIENTE - No usar dispach que en actions llamen a Axios porque no se puede controlar el asincronismo
         if (selectedBranch) {
           dispatch(
             getProducts(token, productName, selectedBranch, page, size, description)
           ).then(() => {
             setLoading(false);
           });
         } */

        const getProducts = async () => {
            try {
                const data = {
                    token, productName, branchId: workingBranch.id, page, size, description
                }
                const response = await axios.post(`${API_URL_BASE}/v1/products`, data)
                setProducts(response.data)
                console.log(response.data)
            } catch (error) {
                console.log(error)
                toast.error("Hubo un error en la creación.")
            }
        }

        getProducts()
        setLoading(false)
    }, [
        productName,
        selectedBranch,
        page,
        size,
        description,
        newProductAdded,
        editedProduct,
        token,
        aux
    ]);

    const handleShowNewConsumableModal = () => {
        setShowNewConsumableModal(true);
    };

    const handleNewProductAdded = () => {
        setNewProductAdded(!newProductAdded);
    };

    const handleProductEdited = () => {
        setEditedProduct(!editedProduct);
    };



    const totalPages = products && products.count ? Math.ceil(products.count / size) : 0;

    console.log(totalPages)

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
        }
    };

    if (tokenError === 401 || tokenError === 403) {
        return (
            <ErrorToken error={tokenError} />
        );
    } else {
        return (
            <>
                <div>
                    <NavBar />
                    <div className="flex flex-row dark:bg-darkBackground">
                        <SideBar />
                        {user?.role === "superAdmin" || user?.role === "admin" ? (
                            loading ? (
                                <Loader />
                            ) : (
                                <div className="flex flex-col mt-10 gap-5 w-2/3 mx-auto">
                                    <h1 className="text-3xl underline underline-offset-4 tracking-wide text-center font-fontTitle dark:text-beige sm:text-left">
                                        Control de insumos
                                    </h1>

                                    {user?.role !== "admin" && ( // Renderiza el botón solo si el rol no es admin
                                        <div className="flex justify-center md:ml-auto">
                                            <button
                                                onClick={handleShowNewConsumableModal}
                                                className="bg-secondaryColor hover:bg-primaryColor hover:text-white text-black py-2 px-4 rounded border dark:bg-darkPrimary dark:border-darkText dark:text-darkText dark:hover:bg-gray-200 dark:hover:text-black"
                                            >
                                                <div className="flex items-center">
                                                    Nuevo Insumo <FaPlus className="ml-2" />
                                                </div>
                                            </button>
                                        </div>
                                    )}
                                    {user?.role === "superAdmin" && showNewConsumableModal && (
                                        <NewConsumableModal
                                            token={token}
                                            onClose={() => {
                                                setShowNewConsumableModal(false);
                                                handleNewProductAdded();
                                            }}
                                            onProductAdd={handleNewProductAdded}
                                        />
                                    )}

                                    <section className="flex flex-col items-start sm:w-full">
                                        <div className="flex flex-col items-center w-full gap-3">
                                            <input
                                                value={productName}
                                                onChange={(e) => {
                                                    setProductName(e.target.value);
                                                    setPage(0);
                                                }}
                                                type="text"
                                                placeholder="Buscar por nombre..."
                                                className="w-full text-center border border-black focus:outline-none focus:ring-1 focus:ring-secondaryColor px-1  md:text-left dark:bg-darkPrimary dark:placeholder-darkText dark:text-darkText"
                                            />
                                            <input
                                                value={description}
                                                onChange={(e) => {
                                                    setDescription(e.target.value);
                                                    setPage(0);
                                                }}
                                                type="text"
                                                placeholder="Buscar por descripción..."
                                                className="w-full text-center border border-black focus:outline-none focus:ring-1 focus:ring-secondaryColor px-1  md:text-left dark:bg-darkPrimary dark:placeholder-darkText dark:text-darkText"
                                            />
                                        </div>
                                    </section>
                                    <section>
                                        <ConsumablesTable
                                            aux={aux}
                                            setAux={setAux}
                                            workingBranch={workingBranch}
                                            products={products}
                                            user={user}
                                            onClose={() => {
                                                handleProductEdited();
                                            }}
                                        />
                                    </section>

                                    <div className="flex items-center justify-center mt-4">
                                        <button
                                            onClick={() => handlePageChange(page - 1)}
                                            disabled={page === 0}
                                            className="dark:text-darkText cursor-pointer"
                                        >
                                            {"<"}
                                        </button>
                                        <p className="dark:text-darkText px-2">
                                            Página{" "}
                                            {totalPages === 0
                                                ? `${page} de ${totalPages}`
                                                : `${page + 1} de ${totalPages}`}
                                        </p>
                                        <span
                                            onClick={() => handlePageChange(page + 1)}
                                            disabled={page === totalPages - 1}
                                            className="dark:text-darkText cursor-pointer"
                                        >
                                            {">"}
                                        </span>
                                    </div>
                                </div>
                            )
                        ) : (
                            <Restricted />
                        )}
                    </div>
                </div>
                <ToasterConfig />
            </>
        );
    }
}
export default Consumables;
