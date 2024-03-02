import {
  GET_USER,
  GET_USERS,
  USER_DATA_ID,
  GET_BRANCHES,
  GET_SPECIALTIES,
  ERROR,
  DELETE_USER,
  USER_LOGOUT,
  CLEAR_USERID,
  GET_SERVICES,
  TOKEN,
  GET_CLIENTS,
  GET_CLIENT_ID,
  CLEAR_CLIENT_ID,
  SET_WORKING_BRANCH,
  SET_APPOINTMENT_NOTIFICATION,
  GET_CALENDAR,
  GET_PRODUCTS_FAILURE,
  GET_PRODUCTS_REQUEST,
  GET_PRODUCTS_SUCCESS,
  CREATE_PRODUCT_FAILURE,
  CREATE_PRODUCT_REQUEST,
  CREATE_PRODUCT_SUCCESS,
  EDIT_PRODUCT_FAILURE,
  EDIT_PRODUCT_REQUEST,
  EDIT_PRODUCT_SUCCESS,
  GET_PRODUCT_PRICES_HISTORY_REQUEST,
  GET_PRODUCT_PRICES_HISTORY_SUCCESS,
  GET_PRODUCT_PRICES_HISTORY_FAILURE,
  UPDATE_PRODUCT_PRICE_REQUEST,
  UPDATE_PRODUCT_PRICE_SUCCESS,
  UPDATE_PRODUCT_PRICE_FAILURE,
  CLEAR_PRODUCT_PRICE,
  GET_PAY_METHODS,
  GET_SPECIALISTS,
  SET_TOKEN_ERROR,
  GET_BALANCE,
  ERASE_APPOINTMENT_NOTIFICATION,
} from "./actionsTypes";

const initialState = {
  token: "",
  workingBranch: {},
  appointments: {},
  user: {},
  userDataId: {},
  users: [],
  calendar: [],
  count: 0,
  branches: [],
  specialties: [],
  services: [],
  clients: [],
  countClient: 0,
  clientID: {},
  error: null,
  editingProduct: null,
  pricesHistory: [],
  payMethods: [],
  specialists: [],
  tokenError: 0,
  balance: {},
};

const rootReducer = (
  state = initialState,
  { type, payload, count, error, idDelete, countClient }
) => {
  switch (type) {
    //! Trae token
    case TOKEN:
      const getToken = {
        ...state,
        token: payload,
      };
      localStorage.setItem("myAppReduxState", JSON.stringify(getToken));
      return getToken;

    case SET_WORKING_BRANCH:
      const setWorkingBranch = {
        ...state,
        workingBranch: { ...payload },
      };
      localStorage.setItem("myAppReduxState", JSON.stringify(setWorkingBranch));
      return setWorkingBranch;

    //! Setea cantidad de appointments
    case SET_APPOINTMENT_NOTIFICATION:
      const calendarCount = {
        ...state,
        appointments: payload,
      };
      localStorage.setItem("myAppReduxState", JSON.stringify(calendarCount));
      return calendarCount;

    //! Setea appointments a 0
    case ERASE_APPOINTMENT_NOTIFICATION:
      const eraseCalendarCount = {
        ...state,
        appointments: payload,
      };
      localStorage.setItem(
        "myAppReduxState",
        JSON.stringify(eraseCalendarCount)
      );
      return eraseCalendarCount;

    //! Trae usuario de logIn
    case GET_USER:
      const getUserState = {
        ...state,
        user: payload,
      };
      localStorage.setItem("myAppReduxState", JSON.stringify(getUserState));
      return getUserState;

    //! Trae todos los usuarios
    case GET_USERS:
      const getUsersState = {
        ...state,
        users: payload,
        count: count,
      };
      localStorage.setItem("myAppReduxState", JSON.stringify(getUsersState));
      return getUsersState;

    //! Trae todos los usuarios especialistas
    case GET_SPECIALISTS:
      const getspecialists = {
        ...state,
        specialists: payload,
      };
      localStorage.setItem("myAppReduxState", JSON.stringify(getspecialists));
      return getspecialists;

    //! Trae el calendar
    case GET_CALENDAR:
      const getCalendar = {
        ...state,
        calendar: payload,
      };
      localStorage.setItem("myAppReduxState", JSON.stringify(getCalendar));
      return getCalendar;

    //! Trae usuario por ID
    case USER_DATA_ID:
      const getUserIDState = {
        ...state,
        userDataId: payload,
      };      
      localStorage.setItem("myAppReduxState", JSON.stringify(getUserIDState));
      return getUserIDState;

    //! Borra detail de estado global
    case CLEAR_USERID:
      const clearUserId = {
        ...state,
        userID: {...payload},
      };
      localStorage.setItem("myAppReduxState", JSON.stringify(clearUserId));
      return clearUserId;

    //! Borra usuario
    case DELETE_USER:
      const copy = state.users.filter((user) => user.uid !== idDelete);
      const deleteUserState = {
        ...state,
        users: [...copy],
      };
      localStorage.setItem("myAppReduxState", JSON.stringify(deleteUserState));
      return deleteUserState;

    //! Trae las sedes
    case GET_BRANCHES:
      const getBranchesState = {
        ...state,
        branches: [...payload],
      };
      localStorage.setItem("myAppReduxState", JSON.stringify(getBranchesState));
      return getBranchesState;

    //! Trae las especialidades
    case GET_SPECIALTIES:
      const getSpecialtiesState = {
        ...state,
        specialties: [...payload],
      };
      localStorage.setItem(
        "myAppReduxState",
        JSON.stringify(getSpecialtiesState)
      );
      return getSpecialtiesState;

    //! Trae los clientes
    case GET_CLIENTS:
      const getClients = {
        ...state,
        clients: payload,
        countClient: countClient,
      };
      localStorage.setItem("myAppReduxState", JSON.stringify(getClients));
      return getClients;

    //! Trae cliente por ID
    case GET_CLIENT_ID:
      const getClientId = {
        ...state,
        clientID: payload,
      };
      localStorage.setItem("myAppReduxState", JSON.stringify(getClientId));
      return getClientId;

    //! Borra cliente detail de estado global
    case CLEAR_CLIENT_ID:
      const clearClientId = {
        ...state,
        clientID: payload,
      };
      localStorage.setItem("myAppReduxState", JSON.stringify(clearClientId));
      return clearClientId;

    //! Trae los procedimientos
    case GET_SERVICES:
      const getServices = {
        ...state,
        services: [...payload],
      };
      localStorage.setItem("myAppReduxState", JSON.stringify(getServices));
      return getServices;

    //! Trae el balance
    case GET_BALANCE:
      const getBalance = {
        ...state,
        balance: { ...payload },
      };
      localStorage.setItem("myAppReduxState", JSON.stringify(getBalance));
      return getBalance;

    case ERROR:
      const errorState = {
        ...state,
        users: payload,
        count: count,
        error: error,
      };
      localStorage.setItem("myAppReduxState", JSON.stringify(errorState));
      return errorState;

    case USER_LOGOUT:
      localStorage.removeItem("myAppReduxState");
      localStorage.removeItem("dispatchPerformed");
      localStorage.removeItem("showRed");
      return initialState;

    case GET_PRODUCTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        products: null,
      };

    case GET_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        products: payload,
        count: payload,
      };

    case GET_PRODUCTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    //REDUCER CREACION DE INVENTARIO
    case CREATE_PRODUCT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case CREATE_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        products: [...state.products, payload],
      };

    case CREATE_PRODUCT_FAILURE:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    case EDIT_PRODUCT_REQUEST:
      return state;

    case EDIT_PRODUCT_SUCCESS:
      return {
        ...state,
        editingProduct: payload.updatedProduct,
      };

    case EDIT_PRODUCT_FAILURE:
      return state;

    case GET_PRODUCT_PRICES_HISTORY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_PRODUCT_PRICES_HISTORY_SUCCESS:
      return {
        ...state,
        loading: false,
        pricesHistory: payload,
      };

    case CLEAR_PRODUCT_PRICE:
      return {
        ...state,
        loading: false,
        pricesHistory: null,
      };

    case GET_PRODUCT_PRICES_HISTORY_FAILURE:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    case UPDATE_PRODUCT_PRICE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        pricesHistory: null, // Paulo
      };

    case UPDATE_PRODUCT_PRICE_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };

    case UPDATE_PRODUCT_PRICE_FAILURE:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    case GET_PAY_METHODS:
      const setPayMethods = {
        ...state,
        payMethods: payload,
      };
      localStorage.setItem("myAppReduxState", JSON.stringify(setPayMethods));
      return setPayMethods;

    case SET_TOKEN_ERROR:
      return {
        ...state,
        tokenError: payload,
      };

    default:
      return state;
  }
};

export default rootReducer;
