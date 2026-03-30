import React, { useRef, useState } from "react";
import Button from "../../../components/Button";

import ConfirmAlert from "../../modals/ConfirmAlert";
import SuccessAlert from "../../modals/SuccessAlert";

const TaskCard = ({ task, onOpenDetails, onDelete }) => {

  const isDragging = useRef(false);

  // 🔥 mismo patrón que Configuracion
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);

  // 🔥 click botón
  const handleDelete = (e) => {
    e.stopPropagation();
    setConfirmOpen(true);
  };

  // 🔥 confirmar eliminación
  const handleConfirmDelete = () => {
    onDelete(task.id);

    setConfirmOpen(false);

    // 🔥 igual que Configuracion
    setAlertMessage("Tarea eliminada correctamente");
    setAlertOpen(true);
  };

  return (
    <>
      <div
        className="task-card"
        draggable
        onDragStart={(e) => {
          isDragging.current = true;
          e.dataTransfer.setData("taskId", task.id);
        }}
        onDragEnd={() => {
          setTimeout(() => {
            isDragging.current = false;
          }, 0);
        }}
        onClick={(e) => {
          if (e.target.closest("button")) return;

          if (!isDragging.current) {
            onOpenDetails(task);
          }
        }}
        style={{
          borderLeft: `6px solid ${task.color || "#ccc"}`,
          cursor: "pointer",
          position: "relative"
        }}
      >
        <button
          className="delete-btn"
          onClick={handleDelete}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <svg viewBox="0 0 24 24" className="delete-icon">
            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
          </svg>

        </button>
        <h4>{task.name}</h4>
        <p>{task.description}</p>

      </div>

      <ConfirmAlert
        isOpen={confirmOpen}
        message="¿Seguro que quieres eliminar esta tarea?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />

      <SuccessAlert
        isOpen={alertOpen}
        mensage={alertMessage}
        onClose={() => setAlertOpen(false)}
      />
    </>
  );
};

export default TaskCard;