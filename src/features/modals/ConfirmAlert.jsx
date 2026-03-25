import React from "react";
import Button from "../../components/Button";

const ConfirmAlert = ({ isOpen, message, onConfirm, onCancel }) => {

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="alert-content">

        <h2>{message}</h2>

        <div className="alert-buttons">
          <Button variant="secondary" size="md" onClick={onCancel}>
            Cancelar
          </Button>

          <Button variant="primary" size="md" onClick={onConfirm}>
            Confirmar
          </Button>
        </div>

      </div>
    </div>
  );
};

export default ConfirmAlert;