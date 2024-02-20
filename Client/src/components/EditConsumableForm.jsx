import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { toast } from "react-hot-toast";
import ToasterConfig from "./../components/Toaster";
import editConsumableValidation from "../functions/editConsumableValidation";
import getParamsEnv from "../functions/getParamsEnv";
import axios from "axios";
import { useSelector } from "react-redux";
import Loader from "./Loader";

const {API_URL_BASE} = getParamsEnv()

function EditConsumableForm({
  setEditConsumableModal,
  productData,
  user,
  aux,
  setAux
}) {

  const workingBranch = useSelector((state) => state?.workingBranch);
  const token = useSelector((state) => state?.token);
  const [submitLoader, setSubmitLoader] = useState(false);
  const [product, setProduct] = useState({
    productName: productData.productName || "",
    description: productData.description || "",
    productCode: productData.productCode || "",
    supplier: productData.supplier || "",
    amount: productData.amount || "",
    newPrice: Math.floor(productData.price) || "",
    priceHistory: [],
    adjustmentValue: 0,
    updatedAmount: 0
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const close = (e) => {
      if (e.keyCode === 27) {
        setEditConsumableModal(false);
      }
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [setEditConsumableModal]);

  const handleAdjustAmount = (operation) => {
    let updatedAmount = parseInt(product.amount, 10);
    let amountToAddOrSubtract = parseInt(product.adjustmentValue, 10);

    if (isNaN(amountToAddOrSubtract) || amountToAddOrSubtract <= 0) {
      return;
    }

    if (operation === "add") {
      updatedAmount += amountToAddOrSubtract;
    } else if (operation === "subtract") {
      const result = updatedAmount - amountToAddOrSubtract;
      if (result < 0) {
        setErrors({
          amountError: `La cantidad resultante no puede ser ${result}.`,
        });
        return;
      }
      updatedAmount = result;
      setErrors({});
    }

    setProduct({ ...product, amount: updatedAmount });
  };

  const handleUpdate = async (e) => {

    e.preventDefault()
    const resetFields = () => {
      setProduct({
        ...product,
        productName: "",
        description: "",
        supplier: "",
        amount: "",
        newPrice: "",
      });
      setErrors({});
    };
  
    const fieldErrors = editConsumableValidation(
      product.productName,
      product.supplier,
      product.amount,
      product.newPrice
    );
  
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
  
      toast.error("Hubo un error al actualizar el insumo");
  
      setTimeout(() => {
        setEditConsumableModal(false);
        resetFields();
        toast.dismiss();
      }, 3000);
  
      return;
    } else {
      setErrors({});
    }
  
    if (
      product.productName === productData.productName &&
      product.description === productData.description &&
      product.supplier === productData.supplier &&
      product.amount === productData.amount &&
      parseFloat(product.newPrice) === parseFloat(productData.priceHistory)
    ) {
      toast.error("No se realizaron modificaciones.");
      return;
    }

    setSubmitLoader(true)
    
    const data = {
      price: product.newPrice,
      branchId: workingBranch.id,
      productName: product.productName,
      description: product.description,
      supplier: product.supplier,
      amount: product.amount,
      token
    }
  
  
    try {
      const response = await axios.put(`${API_URL_BASE}/v1/products/${product.productCode}`, data)

      if (response.data.updated === "ok") {
        setSubmitLoader(false)
        toast.success("Producto modificado correctamente")
        setTimeout(() => {
          setEditConsumableModal(false)
          resetFields();
          setAux(!aux)
        },3000)
      }

    } catch (error) {
      setSubmitLoader(false)
      console.error("Error al editar el producto:", error.message);
      toast.error("Hubo un problema al editar el producto.");
    }
  };
  

  return (
    <>
      <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black" style={{ background: "rgba(0, 0, 0, 0.70)" }}>
        <div className="container">
          <div className="w-full bg-white shadow rounded-lg p-6 md:mx-auto md:w-1/2 2xl:w-1/3 dark:bg-darkBackground">
            <div className="flex justify-between">
              <h1 className="text-2xl font-semibold mb-4 text-black dark:text-darkText">
                Editar insumo
              </h1>
              <IoClose
                onClick={() => setEditConsumableModal(false)}
                className="cursor-pointer mt-2 w-5 h-5 dark:text-darkText"
              />
            </div>
            <form onSubmit={handleUpdate}>
              {user.role === "superAdmin" && (
                <>
                  <div className="mb-2">
                    <label className="pl-1  font-bold dark:text-darkText">Nombre:</label>
                    <input
                      className="border border-black p-2 rounded w-full dark:text-darkText dark:bg-darkPrimary"
                      type="text"
                      value={product.productName}
                      onChange={(e) => setProduct({ ...product, productName: e.target.value })}
                    />
                  </div>
                  <div className="mb-2">
                    <label className="pl-1  font-bold dark:text-darkText">
                      Descripción:
                    </label>
                    <input
                      className="border border-black p-2 rounded w-full dark:text-darkText dark:bg-darkPrimary"
                      type="text"
                      value={product.description}
                      onChange={(e) => setProduct({ ...product, description: e.target.value })}
                    />
                  </div>
                  <div className="mb-2">
                    <label className="pl-1  font-bold dark:text-darkText">Proveedor:</label>
                    <input
                      className="border border-black p-2 rounded w-full dark:text-darkText dark:bg-darkPrimary"
                      type="text"
                      value={product.supplier}
                      onChange={(e) => setProduct({ ...product, supplier: e.target.value })}
                    />
                  </div>
                </>
              )}
              <div className="mb-2">
                <label className="pl-1  font-bold dark:text-darkText">
                  Cantidad Actual:
                </label>
                <input
                  className="border border-black p-2 rounded w-full dark:text-darkText dark:bg-darkPrimary"
                  type="number"
                  value={product.amount}
                  onChange={(e) => setProduct({ ...product, amount: e.target.value })}
                  readOnly
                />
              </div>

              {user.role === "admin" ? (
                <div className="mb-2">
                  <label className="pl-1  font-bold dark:text-darkText">
                    Cantidad a Quitar:
                  </label>
                  <div className="flex items-center">
                    <input
                      className="border border-black p-2 rounded mr-2 dark:text-darkText dark:bg-darkPrimary"
                      type="number"
                      value={product.adjustmentValue}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value) && value >= 0) {
                          setProduct({ ...product, adjustmentValue: value });
                        }
                      }}
                      min="0"
                    />
                    <button
                      type="button"
                      className="border border-black p-1.5 rounded dark:text-darkText dark:border-darkText"
                      onClick={() => handleAdjustAmount("subtract")}
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              ) : null}

              {user.role === "superAdmin" ? (
                <>
                  <div className="mb-2">
                    <label className="pl-1  font-bold dark:text-darkText">
                      Cantidad a Quitar/Agregar:
                    </label>
                    <div className="flex items-center">
                      <input
                        className="border border-black p-2 rounded mr-2 dark:text-darkText dark:bg-darkPrimary"
                        type="number"
                        value={product.adjustmentValue}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (!isNaN(value) && value >= 0) {
                            setProduct({ ...product, adjustmentValue: value });
                          }
                        }}
                        min="0"
                      />
                      <button
                        type="button"
                        className="focus:ring-2 ring-blue-600 border border-black p-1 rounded font-bold dark:text-darkText dark:border-darkText"
                        onClick={() => handleAdjustAmount("subtract")}
                      >
                        Quitar
                      </button>
                      <button
                        type="button"
                        className="focus:ring-2 ring-blue-600 border border-black p-1 rounded font-bold dark:text-darkText dark:border-darkText ml-2"
                        onClick={() => handleAdjustAmount("add")}
                      >
                        Agregar
                      </button>
                    </div>
                  </div>
                  <div className="mb-2">
                    <label className="pl-1  font-bold dark:text-darkText">Precio:</label>
                    <input
                      className="border border-black p-2 rounded w-full dark:text-darkText dark:bg-darkPrimary"
                      type="number"
                      value={product.newPrice}
                      onChange={(e) => setProduct({ ...product, newPrice: e.target.value })}
                    />
                  </div>
                </>
              ) : null}
              {/* Mostrar errores */}
              {Object.keys(errors).length > 0 && (
                <div className="text-red-500">
                  {Object.values(errors).map((error) => (
                    <p key={error}>{error}</p>
                  ))}
                </div>
              )}
              <div className="flex justify-center items-center">
                {!submitLoader ? (
                  <button
                    type="submit"
                    className="mt-2 px-4 py-2 w-fit rounded bg-primaryPink shadow shadow-black text-black hover:bg-secondaryColor transition-colors duration-700 dark:text-darkText dark:bg-darkPrimary dark:hover:bg-blue-600"
                  >
                    Modificar insumo
                  </button>
                ) : (
                  <Loader />
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToasterConfig />
    </>
  );
}

export default EditConsumableForm;
