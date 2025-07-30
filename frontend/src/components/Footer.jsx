import React from "react";

function Footer() {
  return (
    <footer className="footer mt-auto fixed-bottom">
      <div className="container">
        <span>&copy; {new Date().getFullYear()} TimeTrekker. All rights reserved.</span>
      </div>
    </footer>
  );
}

export default Footer;
