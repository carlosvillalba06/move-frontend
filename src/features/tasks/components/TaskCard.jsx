import React, { useRef, useState } from "react";
import ConfirmAlert from "../../modals/ConfirmAlert";

const TaskCard = ({ task, onOpenDetails, onDelete, onOpenSubmissions }) => {

  const isDragging = useRef(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const taskId = task.id;

  const handleDelete = (e) => {
    e.stopPropagation();
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
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
        draggable
        onDragStart={(e) => {
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
          cursor: "grab",
          position: "relative"
        }}
      >
        {/* ❌ Eliminar */}
        <button
          className="delete-btn"
          onClick={handleDelete}
          onMouseDown={(e) => e.stopPropagation()}
        >
          X
        </button>

        <h4>{task.name}</h4>
        <p>{task.notes || "Sin descripción"}</p>

        {/* 📦 Entregables */}
        <button
          className="submissions-btn"
          onClick={handleOpenSubmissions}
          onMouseDown={(e) => e.stopPropagation()}
          style={{
            marginTop: "8px",
            fontSize: "12px",
            padding: "4px 8px",
            borderRadius: "6px",
            border: "none",
            background: "#eee",
            cursor: "pointer"
          }}
        >
          Entregables
          
        </button>


      </div>

      <ConfirmAlert
        isOpen={confirmOpen}
        message="¿Seguro que quieres eliminar esta tarea?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
};

export default TaskCard;