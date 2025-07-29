import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn, logout } from "../utils/auth";
import authEvent from "../utils/authEvent";

function Navbar() {
  const [auth, setAuth] = useState(isLoggedIn());
  const navigate = useNavigate();

  useEffect(() => {
    const updateAuth = () => setAuth(isLoggedIn());
    authEvent.subscribe(updateAuth);
    return () => authEvent.unsubscribe(updateAuth);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <div className="font-bold text-lg">
        <Link to="/">Time Trekker</Link>
      </div>
      <div className="space-x-4">
        {auth ? (
          <>
            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
            <Link to="/explore" className="hover:underline">Explore</Link>
            <button onClick={handleLogout} className="hover:underline">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/signup" className="hover:underline">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
