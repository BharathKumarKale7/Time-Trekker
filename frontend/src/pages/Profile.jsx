import React, { useEffect, useState } from "react";
import api from "../services/api";

const Profile = () => {
  const [form, setForm] = useState({ name: "", email: "" });

  useEffect(() => {
    api.get("/auth/me").then((res) => {
      setForm({ name: res.data.name, email: res.data.email });
    });
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.put("/auth/me", form);
    alert("Profile updated!");
  };

  return (
    <div className="container mt-5 mb-5 pt-5">
        <div className="row justify-content-center">
            <div className="col-md-6">
            <div className="card shadow">
                <div className="card-body">
                <h3 className="card-title mb-4 text-center">User Profile</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                    <label htmlFor="name" className="form-label">Full Name</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={form.name}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Enter your full name"
                    />
                    </div>
                    <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={form.email}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Enter your email"
                    />
                    </div>
                    <div className="d-grid">
                    <button type="submit" className="btn btn-dark">Save Profile</button>
                    </div>
                </form>
                </div>
            </div>
            </div>
        </div>
    </div>
  );
};

export default Profile;
