import { Navigate } from "react-router-dom";

const isLoggedIn = () => {
  const token = localStorage.getItem("token");
  return !!token;
};

const PrivateRoute = ({ children }) => {
  return isLoggedIn() ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
