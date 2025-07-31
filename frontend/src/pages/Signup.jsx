import React, { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/signup", { email, password });
      alert("Signup successful! You can now log in.");
      navigate("/login");
    } catch (err) {
      alert("Signup failed");
      console.error(err);
    }
  };

  return (
    <div className="fluid-container signup-bg-container d-flex align-items-center justify-content-center vh-100">
      <div className="card bg-transparent border-3 border-light shadow-lg p-5 rounded-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h3 className="text-center text-light fw-bold mb-4">SIGN UP</h3>
        <form onSubmit={handleSignup}>
          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              id="floatingEmail"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <label htmlFor="floatingEmail">Email</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="password"
              className="form-control"
              id="floatingPassword"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            <label htmlFor="floatingPassword">Password</label>
          </div>
          <button type="submit" className="btn btn-dark w-100">
            Sign Up
          </button>
        </form>
        <div className="text-center mt-3">
          <span className="fw-semibold">
            Already have an account?{" "}
            <Link to="/login" className="text-decoration-none text-light">Login</Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Signup;
