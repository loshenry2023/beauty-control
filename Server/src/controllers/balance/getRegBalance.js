// ! Obtiene el balance y la comisión, según los datos de ingreso. Este proceso corre por partes.
const { connectDB } = require("../../DB_connection_General"); // conexión a la base de datos de trabajo
const showLog = require("../../functions/showLog");
const { Op } = require("sequelize");

const getRegBalance = async (dataQuery, dbName) => {
  const { branchName, dateFrom, dateTo, idUser, idPayment, idService } =
    dataQuery;
  showLog(`getRegBalance`);

  const { conn, User, HistoryService, Incoming, Service, Payment } = await connectDB(dbName);
  await conn.sync({ alter: true });

  let dFrom = "";
  let dTo = "";
  if (dateFrom) {
    dFrom = dateFrom + " 00:00:00";
  }
  if (dateTo) {
    dTo = dateTo + " 23:59:59";
  }
  try {
    // El único dato obligatorio es la sede. El resto es opcional, para adaptarse a las diferentes consultas:
    if (!branchName) {
      throw Error("Faltan datos");
    }
    // Paso 1: ubico cada registro de especialista que venga por body (o tomo todos, si no especifica):
    let users;
    if (idUser) {
      // Obtengo sólo los especialistas que se indican en iduser:
      users = await User.findAll({
        where: {
          id: {
            [Op.in]: idUser,
          },
          role: "especialista",
        },
        order: [["userName", "ASC"]],
        attributes: ["id", "userName", "name", "lastName", "comission"],
      });
    } else {
      // Obtengo todos los especialistas:
      users = await User.findAll({
        where: {
          role: "especialista",
        },
        order: [["userName", "ASC"]],
        attributes: ["id", "userName", "name", "lastName", "comission"],
      });
    }
    if (!users) {
      showLog(`getRegBalance: reg not found.`);
      throw Error("registros de especialista no encontrados.");
    }
    const userInfo = users.map((user) => ({
      // armo el array con los datos definitivos a buscar
      id: user.id,
      userName: user.userName,
      name: user.name,
      lastName: user.lastName,
      comission: user.comission,
    }));
    const userCount = userInfo.length;
    // Paso 2: ubico cada registro de procedimiento que venga por body (o tomo todos, si no especifica):
    let services;
    if (idService) {
      // Obtengo sólo los procedimientos que se indican en iduser:
      services = await Service.findAll({
        where: {
          id: {
            [Op.in]: idService,
          },
        },
        order: [["serviceName", "ASC"]],
        attributes: ["id", "serviceName"],
      });
    } else {
      // Obtengo todos los procedimientos:
      services = await Service.findAll({
        order: [["serviceName", "ASC"]],
        attributes: ["id", "serviceName"],
      });
    }
    if (!services) {
      showLog(`getRegBalance: reg not found.`);
      throw Error("registros de procedimientos no encontrados.");
    }
    const serviceInfo = services.map((svs) => ({
      // armo el array con los datos definitivos a buscar
      id: svs.id,
      serviceName: svs.serviceName,
    }));
    // Paso 3: ubico cada medio de pago que venga por body (o tomo todos, si no especifica):
    let payments;
    if (idPayment) {
      // Obtengo sólo los medios de pago que se indican en idPayment:
      payments = await Payment.findAll({
        where: {
          id: {
            [Op.in]: idPayment,
          },
        },
        order: [["paymentMethodName", "ASC"]],
        attributes: ["id", "paymentMethodName"],
      });
    } else {
      // Obtengo todos los medios de pago:
      payments = await Payment.findAll({
        order: [["paymentMethodName", "ASC"]],
        attributes: ["id", "paymentMethodName"],
      });
    }
    if (!payments) {
      showLog(`getRegBalance: reg not found.`);
      throw Error("registros de medios de pago no encontrados.");
    }
    const paymentInfo = payments.map((pay) => ({
      // armo el array con los datos definitivos a buscar
      id: pay.id,
      paymentMethodName: pay.paymentMethodName,
    }));
    // Paso 4: Ya tengo todos los datos necesarios. Recorro cada usuario y le asigno los procedimientos que coincidan en su historial:
    let serviceOut = []; // para formar el objeto de cada procedimiento
    let servicesOut = []; // para ir acumulando los procedimientos
    let paymentOut = []; // para formar el objeto de cada medio de pago
    let paymentsOut = []; // para ir acumulando los medios de pago
    let historyOut = {
      // para formar el objeto de cada usuario
      userID: "",
      userName: "",
      name: "",
      lastName: "",
      comission: 0,
      services: [],
      payments: [],
    };
    let usersWithHistory = []; // para ir acumulando los datos finales. Será el dato de retorno

    for (const user of userInfo) {
      // Busco todos los registros en el historial para ese usuario, que coincidan con los procedimientos, medios de pago, sede y rango de fechas solicitados:
      const regService = await HistoryService.findAll({
        attributes: ["date", "branchName", "idUser", "serviceName"],
        where: {
          date: {
            [Op.gte]: dFrom ? dFrom : new Date(0),
            [Op.lte]: dTo ? dTo : new Date(),
          },
          serviceName: {
            [Op.in]: serviceInfo.map((service) => service.serviceName),
          },
          branchName: branchName,
          idUser: user.id,
        },
        order: [["date", "ASC"]],
        include: [
          {
            model: Incoming,
            attributes: ["id", "amount", "DateIncoming", "paymentMethodName"],
            where: {
              paymentMethodName: {
                [Op.in]: paymentInfo.map(
                  (payment) => payment.paymentMethodName
                ),
              },
            },
            order: [["DateIncoming", "ASC"]],
          },
        ],
      });
      servicesOut = [];

      for (const service of regService) {
        // Voy armando el array de procedimientos:
        const match = serviceInfo.find(
          (svice) => svice.serviceName === service.serviceName
        );
        const idSvc = match ? match.id : null;
        serviceOut = {
          date: service.date,
          // serviceID: idSvc,
          serviceName: service.serviceName,
        };
        servicesOut.push(serviceOut);
      }
      paymentsOut = [];
      for (const service of regService) {
        // Voy armando el array de pagos:
        if (service.Incomings && service.Incomings.length > 0) {
          service.Incomings.forEach((incoming) => {
            const matchInc = paymentInfo.find(
              (pment) => pment.paymentMethodName === incoming.paymentMethodName
            );
            const idMthd = matchInc ? matchInc.id : null;
            paymentOut = {
              date: incoming.DateIncoming,
              // MethodID: idMthd,
              Method: incoming.paymentMethodName,
              Amount: incoming.amount,
            };
            paymentsOut.push(paymentOut);
          });
        }
      }
      // Voy armando el array final de salida:
      historyOut = {
        userID: user.id,
        userName: user.userName,
        name: user.name,
        lastName: user.lastName,
        comission: parseFloat(user.comission),
        services: servicesOut,
        payments: paymentsOut,
      };
      usersWithHistory.push(historyOut);
    }
    await conn.close(); // cierro la conexión
    showLog(`getRegBalance OK`);
    return { count: userCount, rows: usersWithHistory };
  } catch (err) {
    // Cierro la conexión:
    if (conn) {
      await conn.close();
    }
    showLog(`getRegBalance -> error: ${err.message}`);
    return err.message;
  }
};
module.exports = getRegBalance;
