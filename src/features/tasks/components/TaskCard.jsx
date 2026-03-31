import React, { useRef, useState } from "react";
import ConfirmAlert from "../../modals/ConfirmAlert";
import SuccessAlert from "../../modals/SuccessAlert";

const TaskCard = ({ task, onOpenDetails, onDelete }) => {

  const isDragging = useRef(false);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const taskId = task.id;

  const handleDelete = (e) => {
    e.stopPropagation();
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    onDelete(taskId);

    setConfirmOpen(false);
    setAlertMessage("Tarea eliminada correctamente");
    setAlertOpen(true);
  };

  return (
    <>
      <div
        className="task-card"
        draggable
        onDragStart={(e) => {
          console.log("DRAG START:", taskId);

          isDragging.current = true;

          // ✅ usar tipo estándar
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
        <button
          className="delete-btn"
          onClick={handleDelete}
          onMouseDown={(e) => e.stopPropagation()}
        >
          X
        </button>

        <h4>{task.name}</h4>
        <p>{task.notes || "Sin descripción"}</p>
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