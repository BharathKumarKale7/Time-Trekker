import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Explore from "./pages/Explore";
import Itinerary from "./pages/Itinerary";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="main-container">
        <Routes>
          <Route path="/Explore" element={<Explore />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/itinerary" element={<Itinerary />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
