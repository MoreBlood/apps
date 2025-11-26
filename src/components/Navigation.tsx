import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navigation() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="navigation">
      <button
        className="menu-toggle"
        onClick={toggleMenu}
        aria-label="Toggle menu"
        aria-expanded={isMenuOpen}
      >
        <span className="menu-icon">
          <span className={isMenuOpen ? "open" : ""}></span>
          <span className={isMenuOpen ? "open" : ""}></span>
          <span className={isMenuOpen ? "open" : ""}></span>
        </span>
      </button>
      <nav className={`nav-menu ${isMenuOpen ? "open" : ""}`}>
        <Link
          to="/"
          className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
          onClick={closeMenu}
        >
          Home
        </Link>
        <Link
          to="/privacy"
          className={`nav-link ${
            location.pathname === "/privacy" ? "active" : ""
          }`}
          onClick={closeMenu}
        >
          Privacy Policy
        </Link>
        <Link
          to="/terms"
          className={`nav-link ${
            location.pathname === "/terms" ? "active" : ""
          }`}
          onClick={closeMenu}
        >
          Terms of Service
        </Link>
      </nav>
    </div>
  );
}
