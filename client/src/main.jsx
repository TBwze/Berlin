import React from "react";
import ReactDOM from "react-dom/client";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { RouterProvider } from "react-router-dom";
import router from "./router/router";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ThirdwebProvider activeChain="sepolia" clientId="your-thirdweb-client-id">
      <RouterProvider router={router} />
    </ThirdwebProvider>
  </React.StrictMode>
);
