import React from "react";
import logoMove from "../assets/logoImg.png";
const Navbar = () => {
  return (
    <header className="navbar">

      <div className="navbar-container">

        <img 
          src={logoMove} 
          alt="Logo MOVE"
          className="navbar-logo"
        />

      </div>

    </header>
  );
};

export default Navbar;