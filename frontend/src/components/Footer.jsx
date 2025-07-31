import React from "react";

function Footer() {
  return (
    <footer className="bg-dark text-white text-center py-3 fixed-bottom">
      <div className="container">
        <small>&copy; {new Date().getFullYear()} Time Trekker. All rights reserved.</small>
      </div>
    </footer>
  );
}

export default Footer;
