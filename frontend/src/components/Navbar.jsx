import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { isLoggedIn, logout } from "../utils/auth";
import authEvent from "../utils/authEvent";

function Navbar() {
  const [auth, setAuth] = useState(isLoggedIn());
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const updateAuth = () => setAuth(isLoggedIn());
    authEvent.subscribe(updateAuth);
    return () => authEvent.unsubscribe(updateAuth);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold fs-4" to="/">Time Trekker</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav gap-2">
            {auth ? (
              <>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}
                    to="/dashboard"
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive("/explore") ? "active" : ""}`}
                    to="/explore"
                  >
                    Explore
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-outline-light btn-sm ms-2"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive("/login") ? "active" : ""}`}
                    to="/login"
                  >
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`btn btn-primary btn-sm ms-2`}
                    to="/signup"
                  >
                    Signup
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
