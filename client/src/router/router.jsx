import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import CreateCampaign from "../pages/CreateCampaign";
import Campaign from "../pages/Campaign";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import ProtectedRoute from "../components/ProtectedRoute.component";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "create-campaign",
        element: <ProtectedRoute element={<CreateCampaign />} />,
      },
      {
        path: "campaign",
        element: <ProtectedRoute element={<Campaign />} />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "profile",
        element: <ProtectedRoute element={<Profile />} />,
      },
      {
        path: "admin",
        element: <ProtectedRoute element={<Admin />} requiredRole="admin" />,
      },
    ],
  },
]);

export default router;
