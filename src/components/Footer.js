import React from "react";
import "../assets/css/Footer.css";
import logo from "../assets/images/caiorossi.dev.png";

function Footer() {
  return (
    <footer className="footer">
      <a
        href="https://instagram.com/caiorossi.dev"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src={logo}
          alt="Logo do Instagram @caiorossi.dev"
          className="footer-logo"
        />
      </a>
    </footer>
  );
}

export default Footer;
