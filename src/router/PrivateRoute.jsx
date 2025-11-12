import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Navigate, useLocation } from "react-router";
import LoadingSpinner from "../components/LoadingSpinner";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <LoadingSpinner />;

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  return children;
};

export default PrivateRoute;
