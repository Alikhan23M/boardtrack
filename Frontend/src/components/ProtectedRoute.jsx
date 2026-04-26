import { Navigate } from "react-router-dom";
import Loading from "./Loading"
import useAuth from "../hooks/useAuth";
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === null) {
    return <Loading message="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;