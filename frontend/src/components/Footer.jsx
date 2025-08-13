// Footer component
export default function Footer(){
  return (
    <footer className="bg-white text-dark text-center fixed-bottom p-3 mt-5 shadow">
      {/* Container to center content and apply padding */}
      <div className="container">
        {/* Main footer message */}
        <p className="mb-0">Explore More, Even When Time is Short.</p>
        
        {/* Copyright with dynamic year */}
        <small>&copy; {new Date().getFullYear()} Time Trekker. All rights reserved.</small>
      </div>
    </footer>
  );
}
