import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
import CreateCampaign from '../pages/CreateCampaign';
import Campaign from '../pages/Campaign';
import CampaignDetail from '../pages/CampaignDetail';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import ProtectedRoute from '../components/ProtectedRoute.component';
import NotAuthorize from '../pages/NotAuthorize';
import Admin from '../pages/admin/AdminPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <Home />
      },
      {
        path: 'create-campaign',
        element: <ProtectedRoute element={<CreateCampaign />} />
      },
      {
        path: 'campaign',
        element: <ProtectedRoute element={<Campaign />} />
      },
      {
        path: 'campaign/:id',
        element: <ProtectedRoute element={<CampaignDetail />} />
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'register',
        element: <Register />
      },
      {
        path: 'profile',
        element: <ProtectedRoute element={<Profile />} />
      },
      {
        path: 'admin',
        element: <ProtectedRoute element={<Admin />} requiredRole="Admin" />
      },
      {
        path: 'NotAuthorize',
        element: <ProtectedRoute element={<NotAuthorize />} />
      }
    ]
  }
]);

export default router;
