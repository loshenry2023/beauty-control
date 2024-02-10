// Vistas:
import Landing from "./views/Landing.jsx";
import LogIn from "./views/LogIn.jsx";
import Profiles from "./views/UserProfiles.jsx";
import Home from "./views/Home.jsx";
import Error from "./views/Error.jsx";
import TermsAndPrivacy from "./views/TermsAndPrivacy.jsx";
import UserDetail from "./views/UserDetail.jsx";
import Agenda from "./views/Agenda.jsx";
import SpecialistDate from "./views/SpecialistDate.jsx";
import DevelopedBy from "./views/DevelopedBy/DevelopedBy.jsx";

import Consumables from "./views/Consumables.jsx";
import ConsHistoryPrice from "./components/ConsHistoryPrice.jsx";
import NewConsumableForm from "./components/NewConsumableForm.jsx";
import EditConsumableForm from "./components/EditConsumableForm.jsx";
import ControlTables from "./views/ControlTables.jsx";

// hooks, routers, reducers:
import { Route, Routes } from "react-router-dom";

// Variables de entorno:
import getParamsEnv from "./functions/getParamsEnv.js";
import ClientDetail from "./views/ClientDetail.jsx";
import ClientsProfiles from "./views/ClientsProfiles.jsx";
import BranchSelection from "./views/BranchSelection.jsx";
import SpecialistMonitoring from "./views/SpecialistMonitoring.jsx";
const {
  ROOT,
  LOGIN,
  USERPROFILES,
  BRANCH,
  HOME,
  USERDETAIL,
  TERMSANDPRIVACY,
  AGENDA,
  CLIENTDETAIL,
  CLIENTSPROFILES,
  DATEDETAIL,
  SPECIALISTMONITORING,
  DEVELOPEDBY
} = getParamsEnv();

const App = () => {
  return (
    <div className="font-fontBody text-md">
      <Routes>
        <Route path={ROOT} element={<Landing />} />
        <Route path={LOGIN} element={<LogIn />} />
        <Route path={BRANCH} element={<BranchSelection />} />
        <Route path={HOME} element={<Home />} />
        <Route path={USERPROFILES} element={<Profiles />} />
        <Route path={USERDETAIL} element={<UserDetail />} />
        <Route path={AGENDA} element={<Agenda />} />
        <Route path={CLIENTSPROFILES} element={<ClientsProfiles />} />
        <Route path={CLIENTDETAIL} element={<ClientDetail />} />
        <Route path={TERMSANDPRIVACY} element={<TermsAndPrivacy />} />
        <Route path={DATEDETAIL} element={<SpecialistDate />} />
        <Route path={SPECIALISTMONITORING} element={<SpecialistMonitoring />} />
        <Route path={DEVELOPEDBY} element={<DevelopedBy />} />
        <Route path="consumables" element={<Consumables />} />
        <Route path="historyprice/:productId" element={<ConsHistoryPrice />} />
        <Route path="*" element={<Error />} />
        <Route path="controlTables" element={<ControlTables />} />
      </Routes>
    </div>
  );
};

export default App;
