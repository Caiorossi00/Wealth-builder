import React from "react";
import { useLocation } from "react-router-dom";
import WBLogo from "../assets/images/WealthBuilderLogo.png";
import "../assets/css/Navbar.css";

function Navbar() {
  const location = useLocation();

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
        {location.pathname !== "/" && (
          <li>
            <a href="/">Sair</a>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
