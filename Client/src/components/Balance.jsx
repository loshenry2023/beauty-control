import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBalance, getCalendar } from "../redux/actions";
import Loader from "./Loader";
import DonutChart from "./DonutChart";
import DonutChartPayMethods from "./DonutChartPayMethods";
import ErrorToken from "../views/ErrorToken";

//Toast
import { toast } from "react-hot-toast";
import ToasterConfig from "../components/Toaster";

const Balance = ({ specialists, services, payMethods }) => {
  const testData = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
  const dispatch = useDispatch();
  const token = useSelector((state) => state?.token);
  const tokenError = useSelector((state) => state?.tokenError);
  const workingBranch = useSelector((state) => state?.workingBranch);
  const balanceData = useSelector((state) => state?.balance);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1; // Months are zero-indexed, so add 1
  const day = today.getDate();
  const formattedDate = `${year}-${month < 10 ? "0" + month : month}-${
    day < 10 ? "0" + day : day
  }`;
  const [showAdditionalCharts, setShowAdditionalCharts] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const [fetchDataBalance, setFetchDataBalance] = useState({
    branchName: workingBranch.branchName,
    dateFrom: formattedDate,
    dateTo: formattedDate,
    token,
  });

  const colors = [
    "#FA98C0",
    "#AB5AFA",
    "#76D1FA",
    "#5AA3FA",
    "#EFB8FA",
    "#A908F9",
  ];

  const formatNumber = (number) => {
    return number.toLocaleString("es-CO");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch(getBalance(fetchDataBalance));
        setLoading(false);

        // Procesar datos
        let totalIncomes = 0;
        let specialistCounts = [];
        let serviceCounts = [];
        let paymentMethodIncomes = [];

        if (response.payload && response.payload.rows) {
          response.payload.rows.forEach((user, index) => {
            // calcular total ingresos
            user.payments.forEach((payment) => {
              totalIncomes += payment.Amount;
            });

            // datos gráfico de especialistas
            specialistCounts.push({
              id: `specialist-${index}`,
              name: `${user.name} ${user.lastName}`,
              value: user.services.length,
            });

            // datos gráfico de cantidad de servicios
            services.forEach((service, serviceIndex) => {
              const serviceCount = user.services.filter(
                (userService) => userService.serviceName === service.serviceName
              ).length;
              const existingService = serviceCounts.find(
                (item) => item.id === `service-${serviceIndex}`
              );

              if (existingService) {
                existingService.value += serviceCount;
              } else {
                serviceCounts.push({
                  id: `service-${serviceIndex}`,
                  name: service.serviceName,
                  value: serviceCount,
                });
              }
            });

            // ingresos reales por método de pago
            paymentMethodIncomes = payMethods.map((payMethod) => {
              const methodName = payMethod.paymentMethodName;
              const methodData = paymentMethodIncomes.find(
                (item) => item.name === methodName
              ) || { name: methodName, value: 0 };
              methodData.value += user.payments
                .filter((payment) => payment.Method === methodName)
                .reduce((acc, payment) => acc + payment.Amount, 0);

              return methodData;
            });
          });
        }

        // actualizar gráficos y estado
        setChartDataSpecialists([...specialistCounts]);

        setChartDataServicesCount([...serviceCounts]);

        setChartDataPaymentMethods([...paymentMethodIncomes]);
      } catch (error) {
        console.error("Error fetching balance data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [
    dispatch,
    fetchDataBalance,
    specialists,
    services,
    payMethods,
    tokenError,
  ]);

  const handleDate = (e) => {
    if (e.target.name === "dateFrom" && testData.test(e.target.value)) {
      if (e.target.value > fetchDataBalance.dateTo) {
        const newDate = fetchDataBalance.dateTo;
        setFetchDataBalance({
          ...fetchDataBalance,
          dateFrom: newDate,
        });
        toast.error("La fecha inicial no puede ser mayor a la fecha final");
        document.getElementById("dateFrom").value = newDate;
      } else {
        setFetchDataBalance({
          ...fetchDataBalance,
          [e.target.name]: e.target.value,
        });
      }
    }

    if (e.target.name === "dateTo" && testData.test(e.target.value)) {
      if (e.target.value < fetchDataBalance.dateFrom) {
        const newDate = fetchDataBalance.dateFrom;
        setFetchDataBalance({
          ...fetchDataBalance,
          dateTo: newDate,
        });
        toast.error("La fecha final no puede ser menor a la fecha inicial");
        document.getElementById("dateTo").value = newDate;
      } else {
        setFetchDataBalance({
          ...fetchDataBalance,
          [e.target.name]: e.target.value,
        });
      }
    }
  };

  const handleDataToFetch = (e) => {
    setFetchDataBalance((prevData) => {
      const updatedValue =
        e.target.name === "idPayment" ||
        e.target.name === "idUser" ||
        e.target.name === "idService"
          ? e.target.value === ""
            ? []
            : [e.target.value]
          : e.target.value;

      const { [e.target.name]: removedProperty, ...updatedData } = {
        ...prevData,
        [e.target.name]: updatedValue,
      };

      return updatedValue.length === 0
        ? updatedData
        : { ...prevData, [e.target.name]: updatedValue };
    });
  };

  //Total Incomes
  let totalIncomes = 0;
  if (balanceData && balanceData.rows) {
    balanceData.rows.forEach((user) => {
      user.payments.forEach((payment) => {
        totalIncomes += payment.Amount;
      });
    });
  }

  //PaymentMethos and incomes
  let paymentMethods = [];
  if (balanceData && balanceData.rows) {
    balanceData.rows.forEach((user) => {
      user.payments.forEach((payment) => {
        const existingPayment = paymentMethods.find(
          (item) => item[payment.Method]
        );
        if (existingPayment) {
          existingPayment[payment.Method] += payment.Amount;
        } else {
          const newPayment = { [payment.Method]: payment.Amount };
          paymentMethods.push(newPayment);
        }
      });
    });
  }

  let comision = 0;
  if (fetchDataBalance.idUser) {
    const copy = specialists;
    const specialistData = copy.filter(
      (specialist) => specialist.id === fetchDataBalance.idUser[0]
    );
    comision = Number(specialistData[0].comission);
  }

  const [chartDataSpecialists, setChartDataSpecialists] = useState([
    { name: "Total" },
    ...specialists,
  ]);

  const [chartDataServicesCount, setChartDataServicesCount] = useState([
    { name: "Total" },
    ...services,
  ]);

  const [chartDataPaymentMethods, setChartDataPaymentMethods] = useState([
    { name: "Total" },
    ...paymentMethods,
  ]);

  const handleToggleCharts = () => {
    setShowAdditionalCharts(!showAdditionalCharts);
  };

  if (tokenError === 401 || tokenError === 403) {
    return <ErrorToken error={tokenError} />;
  } else {
    return (
      <div className="flex flex-col w-2/3 mx-auto">
        {loading ? (
          <Loader />
        ) : (
          <div className="flex flex-col mt-10 gap-5">
            <h1 className="text-3xl underline underline-offset-4 tracking-wide text-center font-fontTitle dark:text-beige sm:text-left">
              Balance
            </h1>
            <section className="flex flex-wrap md:flex-row gap-5">
              <div className="flex gap-2 w-full xl:w-fit">
                <label className="hidden xl:inline dark:text-darkText">
                  Fecha inicial
                </label>
                <input
                  id="dateFrom"
                  type="date"
                  name="dateFrom"
                  defaultValue={formattedDate}
                  onChange={handleDate}
                  className="w-full border rounded-md border-black px-2  dark:invert xl:w-fit"
                />
              </div>
              <div className="flex gap-2 w-full xl:w-fit">
                <label className="hidden xl:inline dark:text-darkText">
                  Fecha final
                </label>
                <input
                  id="dateTo"
                  type="date"
                  name="dateTo"
                  defaultValue={formattedDate}
                  onChange={handleDate}
                  className="w-full border rounded-md border-black px-2  dark:invert xl:w-fit"
                />
              </div>
            </section>
            <section className="flex flex-col gap-6 md:flex-wrap xl:flex-row">
              <div className="flex gap-2 w-full xl:w-fit">
                <label className="hidden xl:inline dark:text-darkText">
                  Especialista
                </label>
                <select
                  type="text"
                  className="border w-full rounded-md border-black px-2  dark:invert xl:w-fit"
                  onChange={(e) => handleDataToFetch(e)}
                  name="idUser"
                >
                  <option value=""> -- Especialista -- </option>
                  {specialists.map((especialist, index) => (
                    <option name="idUser" key={index} value={especialist.id}>
                      {especialist.name} {especialist.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 w-full xl:w-fit">
                <label className="hidden xl:inline dark:text-darkText">
                  Procedimientos
                </label>
                <select
                  type="text"
                  className="border rounded-md w-full border-black px-2   dark:invert xl:w-fit"
                  onChange={(e) => handleDataToFetch(e)}
                  name="idService"
                >
                  <option value=""> -- Procedimientos -- </option>
                  {services.map((service, index) => (
                    <option key={index} value={service.id}>
                      {service.serviceName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 w-full xl:w-fit">
                <label className="hidden xl:inline dark:text-darkText">
                  Métodos de pago
                </label>
                <select
                  type="text"
                  className="border rounded-md w-full border-black px-2   dark:invert xl:w-fit"
                  onChange={(e) => handleDataToFetch(e)}
                  name="idPayment"
                >
                  <option value={[]}> -- Métodos de pago -- </option>
                  {payMethods.map((payMethod, index) => (
                    <option key={index} value={payMethod.id}>
                      {payMethod.paymentMethodName}
                    </option>
                  ))}
                </select>
              </div>
            </section>
            <div className="w-full mt-10 flex flex-col items-center justify-between xl:flex-row sm:justify-start">
              <section className="flex flex-col gap-4 sm:flex-row xl:flex-col">
                <div className="h-40 w-60 p-5 flex flex-row justify-center items-center rounded-2xl shadow-md shadow-black transition duration-700 dark:bg-darkPrimary hover:bg-secondaryColor dark:hover:bg-zinc-800">
                  <h2 className="text-2xl dark:text-darkText flex flex-col items-center">
                    Total ingresos:{" "}
                    <span className=" mt-2">
                      {" "}
                      ${formatNumber(totalIncomes)}
                    </span>
                  </h2>
                </div>
                <div className="h-40 w-60 p-5 flex flex-row justify-center items-center rounded-2xl shadow-md shadow-black transition duration-700 dark:bg-darkPrimary hover:bg-secondaryColor dark:hover:bg-zinc-800">
                  <h2 className="text-center text-2xl dark:text-darkText">
                    {comision
                      ? `Comision: ${comision}%`
                      : "Selecciona un especialista para visualizar comisión"}
                  </h2>
                </div>
              </section>
              {totalIncomes !== 0 ? (
                <section className="mt-10 flex flex-col sm:flex-row items-center sm:items-start xl:mt-0 sm:w-full">
                  <DonutChartPayMethods
                    data={chartDataPaymentMethods}
                    title="Métodos de pago"
                    className="col-span-2"
                  />
                  <div className="mx-2">
                    <button
                      className="w-40 p-2 mt-10 rounded-2xl shadow-md font-bold shadow-black hover:bg-secondaryColor transition-colors duration-700 dark:bg-darkPrimary  dark:hover:bg-zinc-800 dark:text-darkText xl:mt-0"
                      onClick={() => setShowDetails(!showDetails)}
                    >
                      {showDetails ? "Ocultar detalles" : "Mostrar detalles"}
                    </button>
                    {showDetails && (
                      <ul className="mt-4 dark:text-darkText">
                        {chartDataPaymentMethods.map((entry) => (
                          <div
                            className=""
                            key={`legend-${entry.name}`} // Cambiado a entry.name como clave
                            style={{ marginBottom: "12px" }}
                          >
                            <li className="text-[13px] p-1">
                              <span
                                style={{
                                  display:
                                    entry &&
                                    entry.name &&
                                    entry.name.includes("Total")
                                      ? "none"
                                      : "inline-block",
                                  width: "12px",
                                  height: "12px",
                                  backgroundColor:
                                    colors[
                                      chartDataPaymentMethods.indexOf(entry) %
                                        colors.length
                                    ],
                                  borderRadius: "50%",
                                  marginRight: "8px",
                                }}
                              ></span>
                              {entry
                                ? `${entry.name}: $${formatNumber(entry.value)}`
                                : ""}
                            </li>
                          </div>
                        ))}
                      </ul>
                    )}
                  </div>
                </section>
              ) : (
                <h2 className=" text-center w-full text-3xl mt-10 xl:mt-0  dark:text-darkText">
                  No hay informacion para los filtros seleccionados
                </h2>
              )}
            </div>
            {totalIncomes !== 0 ? (
              <section className="mb-10 w-full flex flex-col items-center justify-center">
                <button
                  className="mt-5 xl:ml-[70px] w-fit p-2 px-4 rounded-2xl shadow-md font-bold shadow-black hover:bg-secondaryColor transition-colors duration-700 dark:bg-darkPrimary  dark:hover:bg-zinc-800 dark:text-darkText"
                  onClick={handleToggleCharts}
                >
                  {showAdditionalCharts
                    ? "Menos informacion"
                    : "Más información"}
                </button>
                {showAdditionalCharts && (
                  <div className="flex flex-col justify-center sm:flex-row sm:gap-10">
                    <DonutChart
                      data={chartDataSpecialists}
                      title="Turnos por especialista"
                    />
                    <DonutChart
                      data={chartDataServicesCount}
                      title="Cantidad de servicios realizados"
                    />
                  </div>
                )}
              </section>
            ) : (
              ""
            )}
          </div>
        )}
        <ToasterConfig />
      </div>
    );
  }
};

export default Balance;
