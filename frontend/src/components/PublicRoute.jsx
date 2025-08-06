import { Navigate } from "react-router-dom";

const isLoggedIn = () => {
  const token = localStorage.getItem("token");
  return !!token;
};

const PublicRoute = ({ children }) => {
  return isLoggedIn() ? <Navigate to="/dashboard" replace /> : children;
};

export default PublicRoute;
