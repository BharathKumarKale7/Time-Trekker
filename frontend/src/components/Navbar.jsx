import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-indigo-600 text-white p-4 flex justify-between">
      <Link to="/" className="font-bold text-xl">Time Trekker</Link>
      <div className="space-x-4">
        <Link to="/explore">Explore</Link>
        <Link to="/itinerary">Itinerary</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/login">Login</Link>
      </div>
    </nav>
  );
}

export default Navbar;
