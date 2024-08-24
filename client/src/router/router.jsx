import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import CreateCampaign from "../pages/CreateCampaign";
import Campaign from "../pages/Campaign";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AddFunds from "../pages/AddFunds";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/create-campaign",
        element: <CreateCampaign />,
      },
      {
        path: "/campaign",
        element: <Campaign />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/add-funds",
        element: <AddFunds />,
      },
    ],
  },
]);

export default router;
