import {
  GET_USER,
  GET_USERS,
  GET_USER_ID,
  GET_BRANCHES,
  GET_SPECIALTIES,
  DELETE_USER,
  SET_ICON,
  USER_LOGOUT,
  CLEAR_USERID,
  GET_SERVICES,
  TOKEN,
  GET_CLIENTS,
  GET_CLIENT_ID,
  CLEAR_CLIENT_ID,
  GET_CALENDAR,
  SET_WORKING_BRANCH,
  GET_PRODUCTS_REQUEST,
  GET_PRODUCTS_FAILURE,
  GET_PRODUCTS_SUCCESS,
  CREATE_PRODUCT_FAILURE,
  CREATE_PRODUCT_REQUEST,
  CREATE_PRODUCT_SUCCESS,
  EDIT_PRODUCT_FAILURE,
  EDIT_PRODUCT_REQUEST,
  EDIT_PRODUCT_SUCCESS,
  GET_PRODUCT_PRICES_HISTORY_FAILURE,
  GET_PRODUCT_PRICES_HISTORY_REQUEST,
  GET_PRODUCT_PRICES_HISTORY_SUCCESS,
  UPDATE_PRODUCT_PRICE_REQUEST,
  UPDATE_PRODUCT_PRICE_SUCCESS,
  UPDATE_PRODUCT_PRICE_FAILURE,
  GET_PAY_METHODS
} from "./actionsTypes";

import axios from "axios";
import getParamsEnv from "../functions/getParamsEnv";
import converterGMT from "../functions/converteGMT";
const { API_URL_BASE } = getParamsEnv();

export const getUser = (userData) => {
  return {
    type: GET_USER,
    payload: userData,
  };
};

export const setBranch = (branch) => {
  return {
    type: SET_WORKING_BRANCH,
    payload: branch,
  };
};

export const getBranches = (token) => {
  return async function (dispatch) {
    try {
      const response = await axios.post(API_URL_BASE + "/branches", token);
      return dispatch({
        type: GET_BRANCHES,
        payload: response.data,
      });
    } catch (error) {
      throw Error(error.message);
    }
  };
};

export const getSpecialties = (token) => {
  return async function (dispatch) {
    try {
      const response = await axios.post(API_URL_BASE + "/specialties", token);
      return dispatch({
        type: GET_SPECIALTIES,
        payload: response.data,
      });
    } catch (error) {
      throw Error(error.message);
    }
  };
};

export const getServices = (token) => {
  return async function (dispatch) {
    try {
      const response = await axios.post(API_URL_BASE + "/getservices", token);
      return dispatch({
        type: GET_SERVICES,
        payload: response.data,
      });
    } catch (error) {
      throw Error(error.message);
    }
  };
};

export const getClients = (
  nameOrLastName,
  attribute,
  order,
  page,
  size,
  createDateEnd,
  createDateStart,
  token
) => {
  const endPoint = API_URL_BASE + "/getclients?";
  return async function (dispatch) {
    try {
      const { data } = await axios.post(
        `${endPoint}nameOrLastName=${nameOrLastName}&attribute=${attribute}&order=${order}&page=${page}&size=${size}&createDateEnd=${createDateEnd}&createDateStart=${createDateStart}`,
        token
      );
      const modifiedData = data.rows.map((user) => {
        const { createdAt, ...rest } = user;
        const createdAtInBogotaTimezone = converterGMT(createdAt);
        return { ...rest, createdAt: createdAtInBogotaTimezone };
      });
      return dispatch({
        type: GET_CLIENTS,
        payload: modifiedData,
        countClient: data.count,
      });
    } catch (error) {
      throw Error(error.message);
    }
  };
};

export const getClientId = (id, token) => {
  return async function (dispatch) {
    try {
      const response = await axios.post(
        `${API_URL_BASE}/getclient/${id}`,
        token
      );
      return dispatch({
        type: GET_CLIENT_ID,
        payload: response.data,
      });
    } catch (error) {
      throw Error(error.message);
    }
  };
};

export const clearClientId = () => ({
  type: CLEAR_CLIENT_ID,
  payload: {},
});

export const getUsers = (
  nameOrLastName,
  attribute,
  order,
  page,
  size,
  branch,
  specialty,
  role,
  createDateEnd,
  createDateStart,
  token
) => {
  const endPoint = API_URL_BASE + "/users?";
  return async function (dispatch) {
    try {
      const { data } = await axios.post(
        `${endPoint}nameOrLastName=${nameOrLastName}&attribute=${attribute}&order=${order}&page=${page}&size=${size}&branch=${branch}&specialty=${specialty}&role=${role}&createDateEnd=${createDateEnd}&createDateStart=${createDateStart}`,
        token
      );

      const modifiedData = data.rows.map((user) => {
        const { createdAt, ...rest } = user;
        const createdAtInBogotaTimezone = converterGMT(createdAt);
        return { ...rest, createdAt: createdAtInBogotaTimezone };
      });

      return dispatch({
        type: GET_USERS,
        payload: modifiedData,
        count: data.count,
      });
    } catch (error) {
      throw Error(error.message);
    }
  };
};

export const getCalendar = (branch, dateFrom, dateTo, userId, token) => {
  const endPoint = API_URL_BASE + "/getcalendar?";
  return async function (dispatch) {
    try {
      const { data } = await axios.post(
        `${endPoint}branch=${branch}&dateFrom=${dateFrom}&dateTo=${dateTo}&userId=${userId}`,
        token
      );
      const modifiedData = data.map((calendar) => {
        const { date_from, date_to, ...rest } = calendar;
        const date_fromInBogotaTimezone = converterGMT(date_from);
        const date_toInBogotaTimezone = converterGMT(date_to);
        return {
          ...rest,
          date_from: date_fromInBogotaTimezone,
          date_to: date_toInBogotaTimezone,
        };
      });
      return dispatch({
        type: GET_CALENDAR,
        payload: modifiedData,
      });
    } catch (error) {
      throw Error(error.message);
    }
  };
};

export const getUserId = (id, token) => {
  return async function (dispatch) {
    try {
      const response = await axios.post(
        `${API_URL_BASE}/userdetails/${id}`,
        token
      );
      return dispatch({
        type: GET_USER_ID,
        payload: response.data,
      });
    } catch (error) {
      throw Error(error.message);
    }
  };
};

export const deleteUser = (id, token) => {
  return async function (dispatch) {
    try {
      const response = await axios.post(
        `${API_URL_BASE}/deleteuserdata/${id}`,
        { token }
      );
      return dispatch({
        type: DELETE_USER,
        payload: response.data,
        idDelete: id,
      });
    } catch (error) {
      throw Error(error.message);
    }
  };
};

export const setIcon = (iconName) => ({
  type: SET_ICON,
  payload: iconName,
});

export const setLogout = (token) => {
  return async function (dispatch) {
    try {
      const response = await axios.post(API_URL_BASE + "/logoutuser", {
        token,
      });
      return dispatch({
        type: USER_LOGOUT,
      });
    } catch (error) {
      throw Error(error.message);
    }
  };
};

export const clearUserId = () => ({
  type: CLEAR_USERID,
  payload: {},
});

export const getToken = (token) => ({
  type: TOKEN,
  payload: token,
});

export const clearDataInicio = () =>
  // Sólo limpia el storage al inicio del programa, donde aún no existe el token:
  ({
    type: USER_LOGOUT,
    payload: {},
  });
// ACTIONS PARA EL INVENTARIO
export const getProductsRequest = () => ({
  type: GET_PRODUCTS_REQUEST,
});

export const getProductsSuccess = (products) => ({
  type: GET_PRODUCTS_SUCCESS,
  payload: products,
});

export const getProductsFailure = (error) => ({
  type: GET_PRODUCTS_FAILURE,
  payload: error,
});

export const getProducts = (
  productName,
  selectedBranch,
  page,
  size,
  description,
  code,
  amount,
  orderBy,
  productCode // Asegúrate de colocar productCode aquí
) => {
  return async (dispatch) => {
    dispatch(getProductsRequest());

    try {
      const response = await axios.get(API_URL_BASE + "/products", {
        params: {
          productName,
          description,
          code,
          amount,
          order: orderBy,
          page,
          size,
          branch: selectedBranch,
          productCode,
        },
      });

      dispatch(getProductsSuccess(response.data));
    } catch (error) {
      dispatch(getProductsFailure(error.message));
    }
  };
};

export const createProductRequest = () => ({
  type: CREATE_PRODUCT_REQUEST,
});

export const createProductSuccess = (product) => ({
  type: CREATE_PRODUCT_SUCCESS,
  payload: product,
});

export const createProductFailure = (error) => ({
  type: CREATE_PRODUCT_FAILURE,
  payload: error,
});

export const createProduct = (newProductData) => {
  return async (dispatch, getState) => {
    dispatch(createProductRequest());

    try {
      const state = getState();

      const response = await axios.post(
        API_URL_BASE + "/products",
        newProductData
      );
      dispatch(createProductSuccess(response.data));
    } catch (error) {
      dispatch(createProductFailure(error.message));
    }
  };
};
export const editProduct = (productId, updatedProduct) => {
  return async (dispatch) => {
    dispatch({ type: EDIT_PRODUCT_REQUEST });

    try {
      const response = await axios.put(
        `${API_URL_BASE}/products/${productId}`,
        updatedProduct,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to edit product");
      }

      dispatch({
        type: EDIT_PRODUCT_SUCCESS,
        payload: { productId, updatedProduct },
      });
    } catch (error) {
      dispatch({ type: EDIT_PRODUCT_FAILURE, payload: error.message });
    }
  };
};
export const getProductPricesHistoryRequest = () => ({
  type: GET_PRODUCT_PRICES_HISTORY_REQUEST,
});

export const getProductPricesHistorySuccess = (pricesHistory) => ({
  type: GET_PRODUCT_PRICES_HISTORY_SUCCESS,
  payload: pricesHistory,
});

export const getProductPricesHistoryFailure = (error) => ({
  type: GET_PRODUCT_PRICES_HISTORY_FAILURE,
  payload: error,
});

export const getProductPricesHistory = (productId) => async (dispatch) => {
  try {
    dispatch(getProductPricesHistoryRequest());
    const response = await axios.get(
      API_URL_BASE + `/products/${productId}/prices-history`
    );
    dispatch(getProductPricesHistorySuccess(response.data));
  } catch (error) {
    dispatch(getProductPricesHistoryFailure(error.message));
  }
};
export const updateProductPriceRequest = () => ({
  type: UPDATE_PRODUCT_PRICE_REQUEST,
});

export const updateProductPriceSuccess = () => ({
  type: UPDATE_PRODUCT_PRICE_SUCCESS,
});

export const updateProductPriceFailure = (error) => ({
  type: UPDATE_PRODUCT_PRICE_FAILURE,
  payload: error,
});

export const updateProductPrice = (productId, newPrice) => {
  return async (dispatch) => {
    dispatch(updateProductPriceRequest());

    try {
      const response = await axios.put(
        API_URL_BASE + `/products/${productId}/price`,
        {
          newPrice,
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to update product price");
      }

      dispatch(updateProductPriceSuccess());
    } catch (error) {
      dispatch(updateProductPriceFailure(error.message));
    }
  };
};

export const getPayMethods = (token) => {

  return async function (dispatch) {
    try {
      const response = await axios.post(API_URL_BASE + "/payments", token);
      return dispatch({
        type: GET_PAY_METHODS,
        payload: response.data,
      });
    } catch (error) {
      throw Error(error.message);
    }
  };
};