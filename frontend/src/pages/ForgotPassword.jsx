/* eslint-disable no-unused-vars */
import { useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function ForgotPassword() {
  // State for storing email input and loading status
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Request OTP for password reset
      await api.post("/auth/request-password-otp", { email });
      toast.success("If an account exists, an OTP has been sent to your email");
      // Redirect to reset page, passing email via state
      navigate("/reset-with-otp", { state: { email } });
    } catch (err) {
      // Show error message from backend or generic message
      toast.error(err.response?.data?.msg || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 pt-5 d-flex justify-content-center">
      {/* Animated card container */}
      <motion.div
        className="card shadow-lg p-4"
        style={{ maxWidth: "450px", width: "100%" }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Animated heading */}
        <motion.h3
          className="text-center mb-4 fw-bold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Forgot Password
        </motion.h3>

        {/* Animated form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Email input field with animation on focus */}
          <motion.input
            type="email"
            className="form-control mb-3 shadow-sm"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            whileFocus={{ scale: 1.02, borderColor: "#0d6efd" }}
            transition={{ type: "spring", stiffness: 200 }}
          />

          {/* Submit button with loading state and animations */}
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
            {loading ? "Sending..." : "Send OTP"}
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
}
