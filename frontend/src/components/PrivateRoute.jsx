import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";

// Component to protect routes from unauthenticated access
export default function PrivateRoute({ children }) {
  // If user is logged in, render the child components
  // Otherwise, redirect to login page
  return isLoggedIn() ? children : <Navigate to="/login" replace />;
}
