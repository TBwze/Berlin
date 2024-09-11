import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../utils/useAuth";
import PageLoad from "./Loading.component";

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated, isloading } = useAuth();

  if (isloading) {
    return <PageLoad loading={isloading} />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return element;
};

export default ProtectedRoute;
