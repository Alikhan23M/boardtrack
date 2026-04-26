import { useState, useEffect } from "react";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = checking

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  return { isAuthenticated };
};

export default useAuth;