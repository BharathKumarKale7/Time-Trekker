import React, { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../utils/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.token);
      navigate("/Explore");
    } catch (err) {
      alert("Login failed");
      console.error(err);
    }
  };

  return (
    <div className="fluid-container login-bg-container d-flex align-items-center justify-content-center vh-100">
      <div className="card bg-transparent border-3 border-light shadow-lg p-5 rounded-3" style={{ maxWidth: "400px", width: "100%" }}>
        <h3 className="text-center text-light fw-bold mb-4">LOGIN</h3>
        <form onSubmit={handleLogin}>
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
              autoComplete="current-password"
            />
            <label htmlFor="floatingPassword">Password</label>
          </div>
          <button type="submit" className="btn btn-dark w-100">Login</button>
        </form>
        <div className="text-center mt-3">
          <span>Don't have an account? <Link to="/signup" className="text-decoration-none text-light">Sign up</Link></span>
        </div>
      </div>
    </div>
  );
}

export default Login;
