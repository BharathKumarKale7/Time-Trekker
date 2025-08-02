/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { isLoggedIn, logout } from "../utils/auth";
import authEvent from "../utils/authEvent";
import { motion } from "framer-motion";

function Navbar() {
  const [auth, setAuth] = useState(isLoggedIn());
  const navigate = useNavigate();
  const location = useLocation();
  const navbarRef = useRef(null);

  useEffect(() => {
    const updateAuth = () => setAuth(isLoggedIn());
    authEvent.subscribe(updateAuth);
    return () => authEvent.unsubscribe(updateAuth);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const navbarCollapse = document.getElementById("navbarNav");
      const toggler = document.querySelector(".navbar-toggler");
      const isExpanded = toggler?.getAttribute("aria-expanded") === "true";

      if (
        isExpanded &&
        navbarCollapse &&
        !navbarCollapse.contains(event.target) &&
        !toggler.contains(event.target)
      ) {
        toggler.click(); // simulate a click to collapse
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    collapseNavbar();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const collapseNavbar = () => {
    const navbarCollapse = document.getElementById("navbarNav");
    const toggler = document.querySelector(".navbar-toggler");
    if (navbarCollapse?.classList.contains("show")) {
      toggler?.click();
    }
  };

  return (
    <motion.nav
      className="navbar navbar-expand-lg bg-white shadow-sm fixed-top px-4"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        backdropFilter: "blur(6px)",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderBottom: "1px solid #ddd",
        zIndex: 1040,
      }}
      ref={navbarRef}
    >
      <div className="container-fluid">
        <Link to="/" className="navbar-brand fw-bold text-dark" onClick={collapseNavbar}>
          <i
              className="bi bi-globe-central-south-asia-fill me-2"
              style={{
                left: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#f0ad4e",
              }}
          />
          Time<span style={{ color: "#f0ad4e" }}>Trekker</span>
        </Link>

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

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav align-items-center">
            {auth ? (
              <>
                <li className="nav-item mx-2">
                  <Link
                    className={`nav-link ${isActive("/dashboard") ? "fw-semibold text-warning" : "text-dark"}`}
                    to="/dashboard"
                    onClick={collapseNavbar}
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item mx-2">
                  <Link
                    className={`nav-link ${isActive("/explore") ? "fw-semibold text-warning" : "text-dark"}`}
                    to="/explore"
                    onClick={collapseNavbar}
                  >
                    Explore
                  </Link>
                </li>
                <li className="nav-item mx-2">
                  <motion.button
                    onClick={handleLogout}
                    className="nav-link fw-semibold text-dark"
                    whileTap={{ scale: 0.95 }}
                  >
                    Logout
                  </motion.button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item mx-2">
                  <Link
                    className={`nav-link ${isActive("/login") ? "fw-semibold text-warning" : "text-dark"}`}
                    to="/login"
                    onClick={collapseNavbar}
                  >
                    Login
                  </Link>
                </li>
                <li className="nav-item mx-2">
                  <Link 
                    className={`nav-link ${isActive("/signup") ? "fw-semibold text-warning" : "text-dark"}`}
                    to="/signup"
                    onClick={collapseNavbar}
                  >  
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

export default Navbar;
