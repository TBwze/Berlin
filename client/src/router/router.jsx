import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import CreateCampaign from "../pages/CreateCampaign";
import Campaign from "../pages/Campaign";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import RequireAuth from "@auth-kit/react-router/RequireAuth";

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
        element: (
          <RequireAuth fallbackPath="/login">
            <CreateCampaign />
          </RequireAuth>
        ),
      },
      {
        path: "/campaign",
        element: (
          <RequireAuth fallbackPath="/login">
            <Campaign />
          </RequireAuth>
        ),
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
        path: "/profile",
        element: (
          <RequireAuth fallbackPath="/login">
            <Profile />
          </RequireAuth>
        ),
      },
    ],
  },
]);

export default router;
