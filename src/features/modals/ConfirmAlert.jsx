import React from "react";

const ConfirmAlert = ({ isOpen, message, onConfirm, onCancel }) => {

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="alert-content">

        <h2>{message}</h2>

        <div className="alert-buttons">
          <button className="cancel-btn" onClick={onCancel}>
            Cancelar
          </button>

          <button className="confirm-btn" onClick={onConfirm}>
            Confirmar
          </button>
        </div>

      </div>
    </div>
  );
};

export default ConfirmAlert;