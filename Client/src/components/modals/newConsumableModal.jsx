import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import newConsumableValidation from "../../functions/newConsumableValidation";
import getParamsEnv from "../../functions/getParamsEnv";
import { toast } from "react-hot-toast";

const { API_URL_BASE, CONSUMABLES } = getParamsEnv();

function NewConsumableModal({ onClose }) {
  const dispatch = useDispatch();
  const [newConsumable, setNewConsumable] = useState({
    productName: "",
    description: "",
    supplier: "",
    amount: 0,
    price: 0.0,
    branchId: "",
    productCode: "",
  });
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const user = useSelector((state) => state?.user);
  const branches = user.branches;
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [codeCounter, setCodeCounter] = useState(1);
  const [errors, setErrors] = useState({});
  const [isCodeInUse, setIsCodeInUse] = useState(false);

  const workingBranch = useSelector((state) => state?.workingBranch);

  const updateNewConsumable = (field, value) => {
    setNewConsumable((prevConsumable) => ({
      ...prevConsumable,
      [field]: value,
    }));
  };

  useEffect(() => {
    if (user && user.branches && user.branches.length > 0) {
      const defaultBranchId = workingBranch.id;
      setSelectedBranch(defaultBranchId);

      selectedBranch;

      updateNewConsumable("branchId", defaultBranchId);
    }

    const close = (e) => {
      if (e.keyCode === 27) {
        onClose();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newCode = codeCounter + 1;
    setCodeCounter(newCode);

    const validationErrors = newConsumableValidation(newConsumable);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      //console.error("Hubo errores de validación", validationErrors);
    } else {
      if (!selectedBranch) {
        //console.error("error con la sucursal");
        return;
      }

      try {
        const response = await axios.post(
          API_URL_BASE + "/v1/products",
          newConsumable
        );

        if (response.statusText === "Created") {
          setIsCodeInUse(false);
          toast.success("Producto creado con éxito");
          setSubmissionStatus("success");
          onClose();
        } else {
          setSubmissionStatus("error");
        }
      } catch (error) {
        toast.error(
          `Código N°: ${newConsumable.productCode} en uso, por favor elija otro.`
        );
        setIsCodeInUse(true);
        setSubmissionStatus("error");
      }
    }
  };

  const handleGoBack = () => {
    onClose();
  };
  return (
    <div className="modal" style={{ zIndex: 1000 }}>
      <div
        className="fixed top-0 left-0 flex items-center justify-center w-full h-full"
        style={{ background: "rgba(0, 0, 0, 0.70)" }}
      >
        <div>
          <div className="w-4/5 mx-auto bg-white shadow rounded-lg p-6 md:w-full dark:bg-darkBackground">
            <div className="flex justify-between">
              <h1 className="text-2xl font-semibold mb-4 text-black dark:text-darkText">
                Agregar nuevo insumo
              </h1>
              <IoClose
                onClick={handleGoBack}
                className="cursor-pointer mt-2 w-5 h-5 dark:text-darkText hover:scale-125"
              />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="first-letter:grid grid-cols-1 mb-2">
                <label className="pl-1  font-bold dark:text-darkText">
                  Nombre:
                </label>
                <input
                  className={`border p-2 rounded w-full ${
                    errors.productName ? "border-red-500" : "border-black"
                  } dark:text-darkText dark:bg-darkPrimary`}
                  type="text"
                  value={newConsumable.productName}
                  placeholder="Nombre de insumo..."
                  onChange={(e) =>
                    updateNewConsumable("productName", e.target.value)
                  }
                />
                {errors.productName && (
                  <p className=" text-red-500">{errors.productName}</p>
                )}
              </div>
              <div className="first-letter:grid grid-cols-1 mb-2">
                <label className="pl-1  font-bold dark:text-darkText">
                  Código del producto:
                </label>
                <input
                  className={`border-2 p-2 rounded w-full ${
                    errors.productCode || isCodeInUse
                      ? "border-red-500"
                      : "border-black"
                  } dark:text-darkText dark:bg-darkPrimary`}
                  type="text"
                  placeholder="Código..."
                  value={newConsumable.productCode}
                  onChange={(e) =>
                    updateNewConsumable("productCode", e.target.value)
                  }
                />
                {errors.productCode && (
                  <p className=" text-red-500">{errors.productCode}</p>
                )}
              </div>
              <div className="first-letter:grid grid-cols-1 mb-2">
                <label className="pl-1  font-bold dark:text-darkText">
                  {" "}
                  Descripción:
                </label>
                <input
                  className={`border p-2 rounded w-full ${
                    errors.description ? "border-red-500" : "border-black"
                  } dark:text-darkText dark:bg-darkPrimary`}
                  type="text"
                  placeholder="descripción..."
                  value={newConsumable.description}
                  onChange={(e) =>
                    updateNewConsumable("description", e.target.value)
                  }
                />
                {errors.description && (
                  <p className=" text-red-500">{errors.description}</p>
                )}
              </div>
              <div className="first-letter:grid grid-cols-1 mb-2">
                <label className="pl-1  font-bold dark:text-darkText">
                  Proveedor:
                </label>
                <input
                  className={`border p-2 rounded w-full ${
                    errors.supplier ? "border-red-500" : "border-black"
                  } dark:text-darkText dark:bg-darkPrimary`}
                  type="text"
                  placeholder="Proveedor..."
                  value={newConsumable.supplier}
                  onChange={(e) =>
                    updateNewConsumable("supplier", e.target.value)
                  }
                />
                {errors.supplier && (
                  <p className=" text-red-500">{errors.supplier}</p>
                )}
              </div>
              <div className="first-letter:grid grid-cols-1 mb-2">
                <label className="pl-1  font-bold dark:text-darkText">
                  Cantidad:
                </label>
                <input
                  className={`border p-2 rounded w-full ${
                    errors.amount ? "border-red-500" : "border-black"
                  } dark:text-darkText dark:bg-darkPrimary`}
                  type="number"
                  placeholder="Cantidad..."
                  value={newConsumable.amount}
                  onChange={(e) =>
                    updateNewConsumable("amount", parseInt(e.target.value, 10))
                  }
                />
                {errors.amount && (
                  <p className=" text-red-500">{errors.amount}</p>
                )}
              </div>
              <div className="first-letter:grid grid-cols-1 mb-2">
                <label className="pl-1  font-bold dark:text-darkText">
                  Precio:
                </label>
                <input
                  className={`border p-2 rounded w-full ${
                    errors.price ? "border-red-500" : "border-black"
                  } dark:text-darkText dark:bg-darkPrimary`}
                  type="number"
                  placeholder="Precio..."
                  value={newConsumable.price}
                  onChange={(e) =>
                    updateNewConsumable("price", parseFloat(e.target.value))
                  }
                />
                {errors.price && (
                  <p className=" text-red-500">{errors.price}</p>
                )}
              </div>
              <div className="first-letter:grid grid-cols-1 mb-2">
                <input
                  type="hidden"
                  value={selectedBranch || " "}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                />
              </div>
              <div className=" flex justify-center mb-4 space-x-20 mt-6">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="h-10 w-[130px] cursor-pointer shadow shadow-black bg-primaryPink text-black px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 dark:text-darkText dark:bg-darkPrimary dark:hover:bg-blue-600"
                >
                  Agregar
                </button>

                <button
                  type="button"
                  onClick={handleGoBack}
                  className="h-10 w-[130px] cursor-pointer shadow shadow-black bg-primaryPink text-black px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 dark:text-darkText dark:bg-darkPrimary dark:hover:bg-blue-600"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewConsumableModal;
