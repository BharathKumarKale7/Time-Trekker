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
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Sign Up</h2>
      <form onSubmit={handleSignup} className="space-y-5">
        <input
          type="email"
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <input
          type="password"
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-md transition"
        >
          Sign Up
        </button>
      </form>
      <p className="mt-6 text-center text-gray-600 text-sm">
        Already have an account?{" "}
        <Link to="/login" className="text-indigo-600 hover:underline font-medium">
          Login
        </Link>
      </p>
    </div>
  );
}

export default Signup;
