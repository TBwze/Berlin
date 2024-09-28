import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { getUserDetails } from "../api/User/getUserDetails.api";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isloading, setIsLoading] = useState(true);
  const [role, setRole] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = Cookies.get("token");

      if (token) {
        try {
          const response = await getUserDetails();
          setRole(response.role);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Failed to fetch user details:", error);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
        setRole("");
      }
      setIsLoading(false);
    };

    fetchUserDetails();
  }, []);

  return { isAuthenticated, isloading, role };
};

export default useAuth;
