import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import CreateCampaign from "../pages/CreateCampaign";
import Campaign from "../pages/Campaign";
import CampaignDetail from "../pages/CampaignDetail";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import ProtectedRoute from "../components/ProtectedRoute.component";
import NotAuthorize from "../pages/NotAuthorize";
import Admin from "../pages/admin/AdminPage";
import MyCampaign from "../pages/MyCampaign";
import ContactUs from "../pages/ContactUs";
import AboutUs from "../pages/AboutUs";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />
      },
      {
        path: "create-campaign",
        element: <ProtectedRoute element={<CreateCampaign />} />
      },
      {
        path: "campaign",
        element: <Campaign />
      },
      {
        path: "my-campaign",
        element: <ProtectedRoute element={<MyCampaign />} />
      },
      {
        path: "campaign/:id",
        element: <ProtectedRoute element={<CampaignDetail />} />
      },
      {
        path: "login",
        element: <Login />
      },
      {
        path: "register",
        element: <Register />
      },
      {
        path: "profile",
        element: <ProtectedRoute element={<Profile />} />
      },
      {
        path: "admin",
        element: <ProtectedRoute element={<Admin />} requiredRole="Admin" />
      },
      {
        path: "not-authorized",
        element: <ProtectedRoute element={<NotAuthorize />} />
      },
      {
        path: "contact-us",
        element: <ContactUs />
      },
      {
        path: "about-us",
        element: <AboutUs />
      }
    ]
  }
]);

export default router;
