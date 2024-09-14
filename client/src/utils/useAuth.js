// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isloading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const token = Cookies.get('token');

    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    setIsLoading(false);
  }, []);

  return { isAuthenticated, isloading };
};

export default useAuth;
