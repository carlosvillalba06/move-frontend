import React from "react";
import Button from "../../components/Button";

const SuccessAlert = ({ isOpen, mensage, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="alert-content">
        <h2>{mensage}</h2>

        <p>Presione para continuar</p>

        <Button variant="primary" size="sm" onClick={onClose}>
              Continuar
            </Button>

      </div>
    </div>
  );
};

export default SuccessAlert;