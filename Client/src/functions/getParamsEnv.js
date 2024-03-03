//! Unico lugar donde obtengo las variables de entorno.
export default function getParamsEnv() {
  const ROOT = import.meta.env.VITE_ROOT || "/";
  const LOGIN = import.meta.env.VITE_LOGIN || "/login";
  const BRANCH = import.meta.env.VITE_BRANCH || "/branch";
  const HOME = import.meta.env.VITE_HOME || "/home";
  const SSADMIN = import.meta.env.VITE_SSADMIN || "/organizationControl"
  const USERPROFILES = import.meta.env.VITE_PROFILES || "/userProfiles";
  const AGENDA = import.meta.env.AGENDA || "/agenda";
  const USERDETAILBASE = import.meta.env.VITE_DETAIL_BASE || "/detail";
  const USERDETAIL = import.meta.env.VITE_DETAIL || "/detail/:id";
  const CLIENTDETAILBASE = import.meta.env.VITE_CLIENT_DETAIL_BASE || "/client-detail";
  const CLIENTDETAIL = import.meta.env.VITE_CLIENT_DETAIL || "/client-detail/:id";
  const CLIENTSPROFILES = import.meta.env.VITE_CLIENTS_PROFILES || "/clientsProfiles";
  const TERMSANDPRIVACY = import.meta.env.VITE_TERMS_AND_PRIVACY || "/terms-and-privacy";
  const API_URL_BASE = import.meta.env.VITE_API_URL_BASE || "http://localhost:3001/beautycontrol";
  const DATEDETAIL = import.meta.env.VITE_DATE_DETAIL || "/dateDetail/:id";
  const DATEDETAILBASE = import.meta.env.VITE_DATE_DETAIL_BASE || "/dateDetail";
  const SPECIALISTMONITORING = import.meta.env.VITE_SPECIALIST_MONITORING || "/specialistMonitoring";
  const DEVELOPEDBY = import.meta.env.VITE_DEVELOPEDBY || "/developedby";

  const CONSUMABLES = import.meta.env.VITE_CONSUMABLES || "/consumables";
  const HISTORYPRICE = import.meta.env.VITE_HISTORY_PRICE || "/historyprice/:productId";
  const HISTORYPRICEBASE = import.meta.env.VITE_HISTORY_PRICE_BASE || "/historyprice";

  const NEWCONSUMABLE = import.meta.env.VITE_NEW_CONSUMABLE || "/newconsumable";
  const EDITPRODUCT = import.meta.env.VITE_EDIT_PRODUCT || "/editproduct/:code";
  const EDITPRODUCTBASE = import.meta.env.VITE_EDIT_PRODUCT || "/editproduct";
  const CONTROLTABLES = import.meta.env.VITE_CONTROL_TABLES|| "/controlTables"

  const CLOUD_NAME = import.meta.env.VITE_APP_CLOUD_NAME || "doyafxwje"; //estaba antes: doqyrz0sg
  const UPLOAD_PRESET = import.meta.env.VITE_APP_UPLOAD_PRESET || "ml_default"; // estaba antes: "gcx7ffyb";

  const FIREBASE_API_KEY = import.meta.env.VITE_APP_FIREBASE_API_KEY || "AIzaSyC6Ge76jJulwWTbLRGmTXwBSy6CCYvYa5w"; 
  const FIREBASE_AUTH_DOMAIN = import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN || "beauty-control-595c5.firebaseapp.com";
  const FIREBASE_PROJECT_ID = import.meta.env.VITE_APP_FIREBASE_PROJECT_ID || "beauty-control-595c5";
  const FIREBASE_STORAGE_BUCKET = import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET || "beauty-control-595c5.appspot.com";
  const FIREBASE_MESSAGING_SENDER_ID = import.meta.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID || "699869510206";
  const FIREBASE_APP_ID = import.meta.env.VITE_APP_FIREBASE_APP_ID || "1:699869510206:web:8e3a864f961409ebb2ef6f";
  
  return {
    ROOT,
    BRANCH,
    HOME,
    LOGIN,
    USERDETAIL,
    AGENDA,
    TERMSANDPRIVACY,
    USERDETAILBASE,
    USERPROFILES,
    CLIENTDETAIL,
    CLIENTDETAILBASE,
    SPECIALISTMONITORING,
    API_URL_BASE,
    CLOUD_NAME,
    UPLOAD_PRESET,
    FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID,
    CLIENTSPROFILES,
    DATEDETAIL,
    DATEDETAILBASE,
    CONSUMABLES,
    HISTORYPRICE,
    NEWCONSUMABLE,
    EDITPRODUCT,
    HISTORYPRICEBASE,
    EDITPRODUCTBASE,
    DEVELOPEDBY,
    SSADMIN,
    CONTROLTABLES
  };
}
