import React from "react";

const SuccessAlert = ({ isOpen, mensage, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="alert-content">



        <h2>{mensage}</h2>

        <p>Presione para continuar</p>
        <button className="continue-button" onClick={onClose}>
          Continuar
        </button>

      </div>
    </div>
  );
};

export default SuccessAlert;