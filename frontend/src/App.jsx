import './App.css';
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Explore from "./pages/Explore";
import Homepage from "./pages/Home";
import Profile from "./pages/Profile";
import Events from './pages/Events';
import ForgotPassword from "./pages/ForgotPassword";
import ResetWithOTP from './pages/ResetWithOtp';
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";

function App() {
  return (
    <>
      {/* Main navigation bar */}
      <Navbar />

      {/* Define routes for the app */}
      <Routes>
        {/* Public routes: accessible without authentication */}
        <Route path="/" element={<PublicRoute><Homepage /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/reset-with-otp" element={<PublicRoute><ResetWithOTP /></PublicRoute>} />

        {/* Private routes: require user to be logged in */}
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/explore" element={<PrivateRoute><Explore /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/events" element={<PrivateRoute><Events /></PrivateRoute>} />
      </Routes>

      {/* Footer displayed on all pages */}
      <Footer />
    </>
  );
}

export default App;
