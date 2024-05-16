import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import AppLayout from "../common-components/Layout";
import ROUTES from "./RoutesConstants";
import RestaurantsList from '../components/restaurants-list/RestaurantsList'
import App from "../App";

const Routing = () => {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
};
const RouterApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>

        </Route>
        <Route path={ROUTES.RESTAURANTS} element={<Routing />}>
          <Route index element={< RestaurantsList />} />
          {/* <Route path={ROUTES.NEW_RESTAURANTS} element={<NewQuestionaire />} /> */}
          {/* <Route
            path={`${ROUTES.NEW_RESTAURANTS}`}
            element={<NewQuestionaire />}
          />
          <Route
            path={ROUTES.EDIT_RESTAURANTS/:id}
            element={<RespondToQuestionnaires />}
          />
          <Route
            path={`${ROUTES.DELETE_RESTAURANTS}/:id`}
            element={<ReplyToQuestionnairesForm />}
          />
        </Route> */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
export default RouterApp;
