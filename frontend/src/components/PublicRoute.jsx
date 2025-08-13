import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";

// Component to restrict access to public routes (e.g. login, signup)
// Redirects authenticated users to the dashboard
export default function PublicRoute({ children }) {
  return isLoggedIn() ? <Navigate to="/dashboard" replace /> : children;
}
