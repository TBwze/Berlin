import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThirdwebProvider } from '@thirdweb-dev/react';
import { RouterProvider } from 'react-router-dom';
import { StateContextProvider } from './context';
import router from './router/router';
import './index.css';
// import CONFIG from './config';
import dotenv from 'dotenv';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ThirdwebProvider activeChain={process.env.ACTIVE_CHAIN} clientId={process.env.THIRDWEB_CLIENT_ID}>
      <StateContextProvider>
        <RouterProvider router={router} />
      </StateContextProvider>
    </ThirdwebProvider>
  </React.StrictMode>
);
