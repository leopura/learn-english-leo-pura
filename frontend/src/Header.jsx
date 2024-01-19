import React from "react";
import { Link } from "react-router-dom";
import "./index.css";

function Header() {
  return (
    <div className="header">
      <h1>learn languages</h1>
      <Link to="/" className="header-link">
        Main View
      </Link>
      <Link to="/admin" className="header-link">
        Admin View
      </Link>
    </div>
  );
}

export default Header;
