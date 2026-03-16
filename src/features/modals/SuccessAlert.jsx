import React from "react";

const SuccessAlert = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="alert-content">

        <h2>Asesor registrado con éxito</h2>

        <p>Presione para continuar</p>

        <button className="continue-button" onClick={onClose}>
          Continuar
        </button>

      </div>
    </div>
  );
};

export default SuccessAlert;