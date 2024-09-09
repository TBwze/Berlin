import React from "react";
import ReactDOM from "react-dom/client";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { RouterProvider } from "react-router-dom";
import createStore from "react-auth-kit/createStore";
import AuthProvider from "react-auth-kit";
import router from "./router/router";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
const store = createStore({
  authName: "_auth",
  authType: "cookie",
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === "https:",
});

root.render(
  <React.StrictMode>
    <AuthProvider store={store}>
      <ThirdwebProvider
        activeChain="sepolia"
        clientId="your-thirdweb-client-id"
      >
        <RouterProvider router={router} />
      </ThirdwebProvider>
    </AuthProvider>
  </React.StrictMode>
);
