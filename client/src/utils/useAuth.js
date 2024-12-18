import { useState, useEffect } from "react";
import { getUserDetails } from "../api/User/getUserDetails.api";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState("");

  const fetchUserDetails = async () => {
    try {
      const response = await getUserDetails();
      if (response) {
        setRole(response.data.role);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error(error.message);
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  return { isAuthenticated, isLoading, role };
};

export default useAuth;
