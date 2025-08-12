/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function ResetWithOTP() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.email) setEmail(location.state.email);
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check password match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/reset-password-otp", { email, otp, password });
      toast.success("Password reset successful. Please log in.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 pt-5 d-flex justify-content-center">
      <motion.div
        className="card shadow-lg p-4"
        style={{ maxWidth: "450px", width: "100%" }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h3
          className="text-center mb-4 fw-bold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Reset Password with OTP
        </motion.h3>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.input
            type="email"
            className="form-control mb-3 shadow-sm"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            whileFocus={{ scale: 1.02, borderColor: "#0d6efd" }}
            transition={{ type: "spring", stiffness: 200 }}
          />

          <motion.input
            type="text"
            className="form-control mb-3 shadow-sm"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            whileFocus={{ scale: 1.02, borderColor: "#0d6efd" }}
            transition={{ type: "spring", stiffness: 200 }}
          />

          <motion.input
            type="password"
            className="form-control mb-3 shadow-sm"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            whileFocus={{ scale: 1.02, borderColor: "#0d6efd" }}
            transition={{ type: "spring", stiffness: 200 }}
          />

          <motion.input
            type="password"
            className="form-control mb-4 shadow-sm"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            whileFocus={{ scale: 1.02, borderColor: "#0d6efd" }}
            transition={{ type: "spring", stiffness: 200 }}
          />

          <motion.button
            type="submit"
            className="btn btn-dark w-100 py-2 fw-semibold"
            disabled={loading}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2"></span>
            ) : null}
            {loading ? "Resetting..." : "Reset Password"}
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
}
