// src/hooks/useAuth.js
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { getUserDetails } from "../api/User/getUserDetails.api";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isloading, setIsLoading] = useState(true);
  const [role, setRole] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    const token = Cookies.get("token");

    if (token) {
      setIsAuthenticated(true);
      getUserDetails().then((response) => {
        setRole(response.role);
      });
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      setRole(null);
    }

    setIsLoading(false);
  }, []);

  return { isAuthenticated, isloading, role };
};

export default useAuth;
