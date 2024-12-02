import React from "react";
import WBLogo from "../assets/images/WealthBuilderLogo.png";
import "../assets/css/Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <a
          href="https://www.instagram.com/caiorossi.dev"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={WBLogo} alt="Wealth Builder Logo" />
        </a>
      </div>
      <ul className="nav-links">
        <li>
          <a href="/">Sair</a>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
