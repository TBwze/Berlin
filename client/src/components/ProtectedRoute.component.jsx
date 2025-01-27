import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../utils/useAuth";
import PageLoad from "./Loading.component";

const ProtectedRoute = ({ element, requiredRole }) => {
  const { isAuthenticated, isLoading, role } = useAuth();

  if (isLoading) {
    return <PageLoad loading={isLoading} />;
  }

  if (isAuthenticated === false) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/not-authorized" replace />;
  }

  return element;
};

export default ProtectedRoute;
