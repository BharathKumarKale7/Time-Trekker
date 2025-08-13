import { useState, useEffect } from "react";
import api from "../services/api"; // API helper for HTTP requests
import { useNavigate, Link } from "react-router-dom"; // Navigation and routing
import { login as loginStore } from "../utils/auth"; // Store login token and user info
import authEvent from "../utils/authEvent"; // Event emitter for auth state changes
import { toast } from "react-toastify"; // Toast notifications

export default function Login(){
  // State variables for email, password, and animation
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [animate,setAnimate] = useState(false);

  // React Router hook for navigation after login
  const navigate = useNavigate();

  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Trigger fade-in animation when component mounts
  useEffect(()=> setAnimate(true),[]);

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    try{
      // Call login API with email and password
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;
      loginStore(token, user);
      // Notify app about login event
      authEvent.emit();
      toast.success('Logged in');
      // Redirect to explore page
      navigate('/explore');
    }catch(err){ 
      console.error(err); 
      toast.error('Login failed'); 
    }
  };

  return (
    <div className="fluid-container login-bg-container d-flex align-items-center justify-content-center vh-100">
      {/* Login card with conditional fade-in */}
      <div className={`card text-white border-0 shadow-lg p-5 rounded-4 ${animate? 'fade-in':''}`} style={{maxWidth:420, width:'100%', background:'rgba(255,255,255,0.05)', backdropFilter:'blur(10px)', border:'1px solid rgba(255,255,255,0.2)'}}>
        <h3 className="text-center fw-bold mb-4">LOGIN</h3>
        <form onSubmit={handleLogin}>
          {/* Email input with icon */}
          <div className="form-floating mb-3 position-relative">
            <input type="email" className="form-control bg-light bg-opacity-75 border-0 ps-5" id="floatingEmail" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="email"/>
            <label htmlFor="floatingEmail">Email</label>
            <i className="bi bi-envelope-fill position-absolute" style={{right:16,top:'50%',transform:'translateY(-50%)',color:'var(--brand-yellow)'}}/>
          </div>
          {/* Password input with show/hide toggle */}
          <div className="form-floating mb-4 position-relative">
            <input type={showPassword ? "text" : "password"} className="form-control bg-light bg-opacity-75 border-0 ps-5" id="floatingPassword" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required autoComplete="current-password"/>
            <label htmlFor="floatingPassword">Password</label>
            <i className={`bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'} position-absolute`} onClick={() => setShowPassword(!showPassword)} style={{ right: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--brand-yellow)', cursor: 'pointer'}} title={showPassword ? 'Hide password' : 'Show password'}/>
          </div>
          {/* Submit button */}
          <button type="submit" className="btn btn-light fw-semibold w-100">LOGIN</button>
          {/* Forgot password link */}
          <div className="text-end mt-2"><Link to="/forgot-password" className="text-white-50 text-decoration-none fw-semibold">Forgot password?</Link></div>
        </form>
        {/* Signup prompt */}
        <div className="text-center mt-3"><span className="fw-semibold text-white-50">Don't have an account? <Link to="/signup" className="text-white text-decoration-none">Sign up</Link></span></div>
      </div>
    </div>
  );
}
