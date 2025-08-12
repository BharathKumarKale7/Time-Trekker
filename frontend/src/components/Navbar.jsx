/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getUsername, isLoggedIn, logout } from "../utils/auth";
import authEvent from "../utils/authEvent";
import { motion } from "framer-motion";

export default function Navbar() {
  const [auth, setAuth] = useState(isLoggedIn());
  const [username, setUsername] = useState(getUsername());
  const navigate = useNavigate();
  const location = useLocation();
  const navbarRef = useRef(null);

  useEffect(() => {
    const update = () => { setAuth(isLoggedIn()); setUsername(getUsername()); };
    authEvent.subscribe(update);
    return () => authEvent.unsubscribe(update);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      const navbarCollapse = document.getElementById("navbarNav");
      const toggler = document.querySelector(".navbar-toggler");
      const isExpanded = toggler?.getAttribute("aria-expanded") === "true";
      if (isExpanded && navbarCollapse && !navbarCollapse.contains(e.target) && !toggler?.contains(e.target)) toggler?.click();
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };
  const isActive = (path) => location.pathname === path;

  const collapseNavbar = () => {
    const navbarCollapse = document.getElementById("navbarNav");
    if (navbarCollapse) {
      const toggler = document.querySelector(".navbar-toggler");
      if (toggler && toggler.getAttribute("aria-expanded") === "true") toggler.click();
    }
  }
  
  return (
    <motion.nav
      className="navbar navbar-expand-lg bg-white shadow-sm fixed-top px-4"
      initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.45 }}
      style={{ backdropFilter: "blur(6px)", backgroundColor: "rgba(255,255,255,0.95)", borderBottom: "1px solid #eee", zIndex: 1040 }}
      ref={navbarRef}
    >
      <div className="container-fluid">
        <Link to={auth ? "/dashboard" : "/"} className="navbar-brand fw-bold text-dark">
          <i className="bi bi-globe-central-south-asia-fill me-2" style={{ color: "var(--brand-yellow)" }} />
          Time<span style={{ color: "var(--brand-yellow)" }}>Trekker</span>
        </Link>

        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav align-items-center">
            {auth ? (
              <>
                <li className="nav-item mx-2"><Link className={`nav-link ${isActive('/profile') ? 'fw-semibold text-warning' : 'text-dark'}`} to="/profile" onClick={collapseNavbar}> <i className="bi bi-person-circle me-2"/> {username}</Link></li>
                <li className="nav-item mx-2"><Link className={`nav-link ${isActive('/dashboard') ? 'fw-semibold text-warning' : 'text-dark'}`} to="/dashboard" onClick={collapseNavbar}>Dashboard</Link></li>
                <li className="nav-item mx-2"><Link className={`nav-link ${isActive('/explore') ? 'fw-semibold text-warning' : 'text-dark'}`} to="/explore" onClick={collapseNavbar}>Explore</Link></li>
                <li className="nav-item mx-2"><Link className={`nav-link ${isActive('/events') ? 'fw-semibold text-warning' : 'text-dark'}`} to="/events" onClick={collapseNavbar}>Events</Link></li>
                <li className="nav-item mx-2"><button onClick={handleLogout} className="nav-link btn btn-link text-dark">Logout</button></li>
              </>
            ) : (
              <>
                <li className="nav-item mx-2"><Link className={`nav-link ${isActive('/login') ? 'fw-semibold text-warning' : 'text-dark'}`} to="/login" onClick={collapseNavbar}>Login</Link></li>
                <li className="nav-item mx-2"><Link className={`nav-link ${isActive('/signup') ? 'fw-semibold text-warning' : 'text-dark'}`} to="/signup" onClick={collapseNavbar}>Signup</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </motion.nav>
  );
}
