import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors([]); // Clear errors on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    try {
      await api.post("/auth/signup", form);
      alert("Signup successful! Please log in.");
      navigate("/login");
    } catch (err) {
      if (err.response?.data?.errors) {
        // Validation errors from express-validator
        setErrors(err.response.data.errors.map((e) => e.msg));
      } else if (err.response?.data?.msg) {
        setErrors([err.response.data.msg]);
      } else {
        setErrors(["Signup failed. Please try again."]);
      }
    }
  };

  return (
    <div className="fluid-container d-flex align-items-center justify-content-center vh-100 signup-bg-container">
      <div
        className="card bg-transparent text-light border-3 border-light shadow-lg p-5 rounded-4"
        style={{ maxWidth: "420px", width: "100%" }}
      >
        <h3 className="text-center fw-bold mb-4">SIGN UP</h3>

        {/* Error Alert */}
        {errors.length > 0 && (
          <div className="alert alert-danger" role="alert">
            <ul className="mb-0">
              {errors.map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="floatingName"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <label htmlFor="floatingName">Name</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              id="floatingEmail"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <label htmlFor="floatingEmail">Email</label>
          </div>

          <div className="form-floating mb-4">
            <input
              type="password"
              className="form-control"
              id="floatingPassword"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
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
            <Link to="/login" className="text-decoration-none text-light">
              Login
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Signup;
