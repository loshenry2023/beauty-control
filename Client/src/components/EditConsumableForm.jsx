import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { editProduct, updateProductPrice } from "../redux/actions";
import { IoClose } from "react-icons/io5";
import { toast } from "react-hot-toast";
import ToasterConfig from "./../components/Toaster";
import editConsumableValidation from "../functions/editConsumableValidation";

import getParamsEnv from "../functions/getParamsEnv";
const { CONSUMABLES } = getParamsEnv();

function EditConsumableForm({
  setEditConsumableModal,
  code,
  onClose,
  setProductsData,
  user,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const productsState = useSelector((state) => state.products);
  const products = Array.isArray(productsState.rows) ? productsState.rows : [];

  const product = products.find((p) => p.code === parseInt(code, 10));

  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [supplier, setSupplier] = useState("");
  const [amount, setAmount] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [errors, setErrors] = useState({});
  const [priceHistory, setPriceHistory] = useState([]);
  const [adjustmentValue, setAdjustmentValue] = useState(0);
  const [updatedAmount, setUpdatedAmount] = useState(0);

  useEffect(() => {
    if (product) {
      setProductName(product.productName);
      setDescription(product.description);
      setSupplier(product.supplier);
      setAmount(product.amount);

      const currentPrice =
        product.PriceHistories.length > 0
          ? product.PriceHistories[0].price
          : "Precio no disponible";
      setPriceHistory(currentPrice);
      setNewPrice(currentPrice);
    }

    const close = (e) => {
      if(e.keyCode === 27){
        setEditConsumableModal(false)
      }
    }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [product, products]);

  const handleAdjustAmount = (operation) => {
    let updatedAmount = parseInt(amount, 10);
    let amountToAddOrSubtract = parseInt(adjustmentValue, 10);

    if (isNaN(amountToAddOrSubtract) || amountToAddOrSubtract <= 0) {
      // console.error("Ingresa un número válido para la cantidad.");
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

    setAmount(updatedAmount);
  };

  const handleUpdate = async () => {
    const resetFields = () => {
      setProductName("");
      setDescription("");
      setSupplier("");
      setAmount("");
      setNewPrice("");
      setErrors({});
    };
    const fieldErrors = editConsumableValidation(
      productName,
      supplier,
      amount,
      newPrice
    );

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);

      toast.error("Hubo un error al actualizar el insumo");

      setTimeout(() => {
        onClose();
        resetFields();
        toast.dismiss();
      }, 3000);

      return;
    } else {
      setErrors({});
    }

    if (
      productName === product.productName &&
      description === product.description &&
      supplier === product.supplier &&
      amount === product.amount &&
      parseFloat(newPrice) === parseFloat(priceHistory)
    ) {
      toast.error("No se realizaron modificaciones.");
      // setTimeout(() => {
      //   setEditConsumableModal(false);
      // }, 2000);
      return;
    }

    let updatedProduct = { ...(product || {}) };

    updatedProduct = {
      ...(product || {}),
      productName,
      description,
      supplier,
      amount,
    };

    setProductsData(updatedProduct);
    if (parseFloat(newPrice) !== parseFloat(priceHistory)) {
      try {
        await dispatch(updateProductPrice(product.code, newPrice));
      } catch (error) {
        console.error(
          "Error al actualizar el precio del producto:",
          error.message
        );
        toast.error("Hubo un problema al actualizar el precio.");
      }
    }

    try {
      await dispatch(editProduct(product.code, updatedProduct));
      setProductsData(updatedProduct);
    } catch (error) {
      console.error("Error al editar el producto:", error.message);
      toast.error("Hubo un problema al editar el producto.");
    }
    toast.success("Insumo modificado correctamente.");

    onClose();
    resetFields();
    setTimeout(() => {
      setEditConsumableModal(false);
    }, 3000);
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
            <form>
              {user.role === "superAdmin" && (
                <>
                  <div className="mb-2">
                    <label className="pl-1  font-bold dark:text-darkText">Nombre:</label>
                    <input
                      className="border border-black p-2 rounded w-full dark:text-darkText dark:bg-darkPrimary"
                      type="text"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                    />
                  </div>
                  <div className="mb-2">
                    <label className="pl-1  font-bold dark:text-darkText">
                      Descripción:
                    </label>
                    <input
                      className="border border-black p-2 rounded w-full dark:text-darkText dark:bg-darkPrimary"
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div className="mb-2">
                    <label className="pl-1  font-bold dark:text-darkText">Proveedor:</label>
                    <input
                      className="border border-black p-2 rounded w-full dark:text-darkText dark:bg-darkPrimary"
                      type="text"
                      value={supplier}
                      onChange={(e) => setSupplier(e.target.value)}
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
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
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
                      value={adjustmentValue}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value) && value >= 0) {
                          setAdjustmentValue(value);
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
                        value={adjustmentValue}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (!isNaN(value) && value >= 0) {
                            setAdjustmentValue(value);
                          }
                        }}
                        min="0"
                      />
                      <button
                        type="button"
                        className="border border-black p-1 rounded font-bold dark:text-darkText dark:border-darkText"
                        onClick={() => handleAdjustAmount("subtract")}
                      >
                        Quitar
                      </button>
                      <button
                        type="button"
                        className="border border-black p-1 rounded font-bold dark:text-darkText dark:border-darkText ml-2"
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
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
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
              <div className="flex justify-center mb-4 space-x-20 mt-6">
                <button
                  type="button"
                  onClick={handleUpdate}
                  className="h-10 cursor-pointer flex items-center justify-center shadow shadow-black bg-primaryPink text-black text-md p-5 rounded-md hover:bg-blue-600 transition duration-300 dark:text-darkText dark:bg-darkPrimary dark:hover:bg-blue-600"
                >
                  Actualizar insumo
                </button>
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
