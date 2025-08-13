/* eslint-disable no-useless-escape */
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";

export default function Signup() {
  // Form state to hold input values
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  // Errors array to display validation or server errors
  const [errors, setErrors] = useState([]);
  // Animation toggle for fade-in effect on mount
  const [animate, setAnimate] = useState(false);
  const navigate = useNavigate();

  // Trigger fade-in animation when component mounts
  useEffect(() => setAnimate(true), []);

  // Update form state on input change and clear errors
  const handleChange = (e) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
    setErrors([]);
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = [];
    const { password } = form;

    // Client-side password validations
    if (password.length < 8)
      newErrors.push("Password must be at least 8 characters.");
    if (!/[A-Z]/.test(password))
      newErrors.push("Password must contain at least one uppercase letter.");
    if (!/[0-9]/.test(password))
      newErrors.push("Password must contain at least one number.");
    if (!/[!@#$%^&*(),.?":\{}|<>]/.test(password))
      newErrors.push("Password must contain at least one special character.");

    // If there are validation errors, update state and stop submission
    if (newErrors.length) {
      setErrors(newErrors);
      return;
    }

    try {
      // Send signup data to backend API
      await api.post("/auth/signup", form);
      toast.success("Signup successful! Please log in.");
      navigate("/login"); // Redirect to login page on success
    } catch (err) {
      console.error(err);
      // Handle and display server validation errors or fallback message
      if (err.response?.data?.errors)
        setErrors(err.response.data.errors.map((e) => e.msg));
      else if (err.response?.data?.msg) setErrors([err.response.data.msg]);
      else setErrors(["Signup failed. Please try again."]);
    }
  };

  return (
    <div className="fluid-container signup-bg-container d-flex align-items-center justify-content-center vh-100">
      {/* Card container with fade-in animation */}
      <div
        className={`card text-white border-0 shadow-lg p-5 rounded-4 ${
          animate ? "fade-in" : ""
        }`}
        style={{
          maxWidth: 420,
          width: "100%",
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        <h3 className="text-center fw-bold mb-4">SIGN UP</h3>

        {/* Show non-password-related errors in an alert */}
        {errors.length > 0 &&
          !errors.some((e) => e.toLowerCase().includes("password")) && (
            <div className="alert alert-danger">
              <ul className="mb-0">
                {errors.map(
                  (m, i) =>
                    !m.toLowerCase().includes("password") && (
                      <li key={i}>{m}</li>
                    )
                )}
              </ul>
            </div>
          )}

        {/* Signup form */}
        <form onSubmit={handleSubmit}>
          {/* Name input */}
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
                right: 16,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--brand-yellow)",
              }}
            />
          </div>

          {/* Email input */}
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
                right: 16,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--brand-yellow)",
              }}
            />
          </div>

          {/* Password input */}
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
                right: 16,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--brand-yellow)",
              }}
            />
          </div>

          {/* Show password-related errors below password input */}
          {errors.length > 0 &&
            errors.some((e) => e.toLowerCase().includes("password")) && (
              <ul className="text-muted small mt-2">
                {errors.map(
                  (m, i) =>
                    m.toLowerCase().includes("password") && (
                      <li key={i}>{m}</li>
                    )
                )}
              </ul>
            )}

          {/* Submit button */}
          <button type="submit" className="btn btn-light fw-semibold mt-4 w-100">
            SIGN UP
          </button>
        </form>

        {/* Link to login page for existing users */}
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
