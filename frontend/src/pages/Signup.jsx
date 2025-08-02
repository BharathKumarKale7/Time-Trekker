import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState([]);
  const [animate, setAnimate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setAnimate(true);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = [];

    const { password } = form;
    if (password.length < 8) {
      newErrors.push("Password must be at least 8 characters.");
    }
    if (!/[A-Z]/.test(password)) {
      newErrors.push("Password must contain at least one uppercase letter.");
    }
    if (!/[0-9]/.test(password)) {
      newErrors.push("Password must contain at least one number.");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      newErrors.push("Password must contain at least one special character.");
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await api.post("/auth/signup", form);
      alert("Signup successful! Please log in.");
      navigate("/login");
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors.map((e) => e.msg));
      } else if (err.response?.data?.msg) {
        setErrors([err.response.data.msg]);
      } else {
        setErrors(["Signup failed. Please try again."]);
      }
    }
  };

  return (
    <div className="fluid-container signup-bg-container d-flex align-items-center justify-content-center vh-100">
      <div
        className={`card text-white border-0 shadow-lg p-5 rounded-4 ${
          animate ? "fade-in" : ""
        }`}
        style={{
          maxWidth: "420px",
          width: "100%",
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.2)",
          transition: "all 0.6s ease",
          transform: animate ? "translateY(0)" : "translateY(20px)",
          opacity: animate ? 1 : 0,
        }}
      >
        <h3 className="text-center fw-bold mb-4">SIGN UP</h3>

        {errors.length > 0 && !errors.some((e) => e.toLowerCase().includes("password")) && (
          <div className="alert alert-danger" role="alert">
            <ul className="mb-0">
              {errors.map(
                (msg, i) =>
                  !msg.toLowerCase().includes("password") && <li key={i}>{msg}</li>
              )}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3 position-relative">
            <input
              type="text"
              className="form-control bg-light bg-opacity-75 border-0 ps-5"
              id="floatingName"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <label htmlFor="floatingName">Name</label>
            <i
              className="bi bi-person-fill position-absolute"
              style={{
                left: "18rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#6c757d",
              }}
            />
          </div>

          <div className="form-floating mb-3 position-relative">
            <input
              type="email"
              className="form-control bg-light bg-opacity-75 border-0 ps-5"
              id="floatingEmail"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <label htmlFor="floatingEmail">Email</label>
            <i
              className="bi bi-envelope-fill position-absolute"
              style={{
                left: "18rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#6c757d",
              }}
            />
          </div>

          <div className="form-floating mb-1 position-relative">
            <input
              type="password"
              className="form-control bg-light bg-opacity-75 border-0 ps-5"
              id="floatingPassword"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <label htmlFor="floatingPassword">Password</label>
            <i
              className="bi bi-lock-fill position-absolute"
              style={{
                left: "18rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#6c757d",
              }}
            />
          </div>

          {/* Password-specific errors */}
          {errors.length > 0 &&
            errors.some((e) => e.toLowerCase().includes("password")) && (
              <ul className="text-muted small mt-2">
                {errors.map(
                  (msg, i) =>
                    msg.toLowerCase().includes("password") && <li key={i}>{msg}</li>
                )}
              </ul>
            )}

          <button
            type="submit"
            className="btn btn-light fw-semibold mt-4 w-100"
            style={{
              transition: "transform 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-2px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            SIGN UP
          </button>
        </form>

        <div className="text-center mt-3">
          <span className="fw-semibold text-white-50">
            Already have an account?{" "}
            <Link to="/login" className="text-white text-decoration-none">
              Login
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Signup;
