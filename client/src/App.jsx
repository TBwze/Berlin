import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Navigate, Outlet } from "react-router-dom";

const App = () => {
  // const isTokenExpired = () => {
  //   const token = localStorage.getItem("token");
  //   const expiresInString = localStorage.getItem("expiresIn");

  //   if (!token || !expiresInString) {
  //     return true;
  //   }

  //   const expiresIn = parseInt(expiresInString);
  //   const now = Date.now();
  //   return now > expiresIn;
  // };

  // if (isTokenExpired()) {
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("expiresIn");
  //   Navigate("/login");
  // }

  return (
    <div className="w-full p-6">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default App;
