import { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../utils/auth";
import authEvent from "../utils/authEvent";
import { toast } from "react-toastify";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [animate, setAnimate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setAnimate(true);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      authEvent.emit();
      navigate("/Explore");
    } catch (err) {
      toast.error("Login failed");
      console.error(err);
    }
  };

  return (
    <div className="fluid-container login-bg-container d-flex align-items-center justify-content-center vh-100">
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
        <h3 className="text-center fw-bold mb-4">LOGIN</h3>

        <form onSubmit={handleLogin}>
          <div className="form-floating mb-3 position-relative">
            <input
              type="email"
              className="form-control bg-light bg-opacity-75 border-0 ps-5"
              id="floatingEmail"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <label htmlFor="floatingEmail">Email</label>
            <i
              className="bi bi-envelope-fill position-absolute"
              style={{
                left: "18rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#f0ad4e",
              }}
            />
          </div>

          <div className="form-floating mb-4 position-relative">
            <input
              type="password"
              className="form-control bg-light bg-opacity-75 border-0 ps-5"
              id="floatingPassword"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <label htmlFor="floatingPassword">Password</label>
            <i
              className="bi bi-lock-fill position-absolute"
              style={{
                left: "18rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#f0ad4e",
              }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-light fw-semibold w-100"
            style={{ transition: "transform 0.3s ease" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-2px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            LOGIN
          </button>
        </form>

        <div className="text-center mt-3">
          <span className="fw-semibold text-white-50">
            Don't have an account?{" "}
            <Link to="/signup" className="text-white text-decoration-none">
              Sign up
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;
