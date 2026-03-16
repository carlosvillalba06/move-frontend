import React from "react";
import logoMove from "../assets/logoImg.png";
import userMove from "../assets/userMOVE.png"



const AdminNavbar = ({ advisorName }) => {

  const user = JSON.parse(localStorage.getItem("user"));
  

  return (

    <header className="admin-navbar">

      <div className="navbar-left">

        <img
          src={logoMove}
          alt="Logo"
          className="navbar-logo"
        />

        {advisorName && (
          <span className="advisor-name">
            Tablero de {advisorName}
          </span>
        )}

      </div>

      <div className="navbar-right">

        <div className="user-circle">
            <img
            src={userMove}
            alt="User"            
            />
          
        </div>

      </div>

    </header>

  );

};

export default AdminNavbar;