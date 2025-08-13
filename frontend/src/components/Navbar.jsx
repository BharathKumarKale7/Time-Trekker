/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getUsername, isLoggedIn, logout } from "../utils/auth";
import authEvent from "../utils/authEvent";
import { motion } from "framer-motion";

export default function Navbar() {
  // State for authentication status and username
  const [auth, setAuth] = useState(isLoggedIn());
  const [username, setUsername] = useState(getUsername());

  const navigate = useNavigate();
  const location = useLocation();
  const navbarRef = useRef(null);

  // Subscribe to auth state changes (login/logout) and update UI accordingly
  useEffect(() => {
    const update = () => { 
      setAuth(isLoggedIn()); 
      setUsername(getUsername()); 
    };
    authEvent.subscribe(update);
    return () => authEvent.unsubscribe(update);
  }, []);

  // Collapse navbar when clicking outside (on small screens)
  useEffect(() => {
    const handler = (e) => {
      const navbarCollapse = document.getElementById("navbarNav");
      const toggler = document.querySelector(".navbar-toggler");
      const isExpanded = toggler?.getAttribute("aria-expanded") === "true";
      if (
        isExpanded &&
        navbarCollapse &&
        !navbarCollapse.contains(e.target) &&
        !toggler?.contains(e.target)
      ) {
        toggler?.click();
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  // Handle user logout and redirect to login page
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Check if a navigation link is currently active
  const isActive = (path) => location.pathname === path;

  // Collapse navbar manually (for toggler button)
  const collapseNavbar = () => {
    const navbarCollapse = document.getElementById("navbarNav");
    if (navbarCollapse) {
      const toggler = document.querySelector(".navbar-toggler");
      if (toggler && toggler.getAttribute("aria-expanded") === "true") {
        toggler.click();
      }
    }
  }

  return (
    <motion.nav
      className="navbar navbar-expand-lg bg-white shadow-sm fixed-top px-4"
      initial={{ y: -60, opacity: 0 }} // Navbar animation on mount
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45 }}
      style={{
        backdropFilter: "blur(6px)",
        backgroundColor: "rgba(255,255,255,0.95)",
        borderBottom: "1px solid #eee",
        zIndex: 1040
      }}
      ref={navbarRef}
    >
      <div className="container-fluid">
        {/* Logo and brand name */}
        <Link to={auth ? "/dashboard" : "/"} className="navbar-brand fw-bold text-dark">
          <i className="bi bi-globe-central-south-asia-fill me-2" style={{ color: "var(--brand-yellow)" }} />
          Time<span style={{ color: "var(--brand-yellow)" }}>Trekker</span>
        </Link>

        {/* Toggler button for small screens */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* Navigation links */}
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav align-items-center">
            {auth ? (
              <>
                {/* Links for authenticated users */}
                <li className="nav-item mx-2">
                  <Link className={`nav-link ${isActive('/profile') ? 'fw-semibold text-warning' : 'text-dark'}`} to="/profile" onClick={collapseNavbar}>
                    <i className="bi bi-person-circle me-2" /> {username}
                  </Link>
                </li>
                <li className="nav-item mx-2">
                  <Link className={`nav-link ${isActive('/dashboard') ? 'fw-semibold text-warning' : 'text-dark'}`} to="/dashboard" onClick={collapseNavbar}>
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item mx-2">
                  <Link className={`nav-link ${isActive('/explore') ? 'fw-semibold text-warning' : 'text-dark'}`} to="/explore" onClick={collapseNavbar}>
                    Explore
                  </Link>
                </li>
                <li className="nav-item mx-2">
                  <Link className={`nav-link ${isActive('/events') ? 'fw-semibold text-warning' : 'text-dark'}`} to="/events" onClick={collapseNavbar}>
                    Events
                  </Link>
                </li>
                <li className="nav-item mx-2">
                  <button onClick={handleLogout} className="nav-link btn btn-link text-dark">Logout</button>
                </li>
              </>
            ) : (
              <>
                {/* Links for unauthenticated users */}
                <li className="nav-item mx-2">
                  <Link className={`nav-link ${isActive('/login') ? 'fw-semibold text-warning' : 'text-dark'}`} to="/login" onClick={collapseNavbar}>
                    Login
                  </Link>
                </li>
                <li className="nav-item mx-2">
                  <Link className={`nav-link ${isActive('/signup') ? 'fw-semibold text-warning' : 'text-dark'}`} to="/signup" onClick={collapseNavbar}>
                    Signup
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </motion.nav>
  );
}
