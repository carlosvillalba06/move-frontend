import React, { useRef, useState } from "react";
import ConfirmAlert from "../../modals/ConfirmAlert";

const TaskCard = ({ task, onOpenDetails, onDelete, onOpenSubmissions, isReadOnly }) => {

  const isDragging = useRef(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [blockedAlert, setBlockedAlert] = useState(false);

  const taskId = task.id;

  const handleDelete = (e) => {
    e.stopPropagation();
    if (isReadOnly) {
      setBlockedAlert(true);
      return;
    }
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (isReadOnly) {
      setConfirmOpen(false);
      return;
    }
    onDelete(taskId);
    setConfirmOpen(false);
  };

  const handleOpenSubmissions = (e) => {
    e.stopPropagation();
    onOpenSubmissions(task);
  };

  return (
    <>
      <div
        className="task-card"
        draggable={!isReadOnly}
        onDragStart={(e) => {
          if (isReadOnly) return;
          isDragging.current = true;
          e.dataTransfer.setData("text/plain", String(taskId));
          e.dataTransfer.effectAllowed = "move";
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
          cursor: isReadOnly ? "default" : "grab",
          opacity: isReadOnly ? 0.8 : 1
        }}
      >
        <button className="delete-btn" onClick={handleDelete}>
          <svg className="delete-icon" viewBox="0 0 24 24">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="task-content">
          <h4>{task.name}</h4>
          <p>{task.notes || "Sin descripción adicional"}</p>
        </div>

        <button className="submissions-btn" onClick={handleOpenSubmissions}>
          Ver Entregables
        </button>
      </div>

      <ConfirmAlert
        isOpen={confirmOpen}
        message="¿Seguro que quieres eliminar esta tarea?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />

      <ConfirmAlert
        isOpen={blockedAlert}
        message="No puedes eliminar tareas siendo administrador"
        onConfirm={() => setBlockedAlert(false)}
        onCancel={() => setBlockedAlert(false)}
      />
    </>
  );
};

export default TaskCard;