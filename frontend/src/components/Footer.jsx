export default function Footer(){
  return (
    <footer className="bg-white text-dark text-center fixed-bottom p-3 mt-5 shadow">
      <div className="container">
        <p className="mb-0">Explore More, Even When Time is Short.</p>
        <small>&copy; {new Date().getFullYear()} Time Trekker. All rights reserved.</small>
      </div>
    </footer>
  );
}