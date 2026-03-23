import React, { useRef } from "react";

const TaskCard = ({ task, onOpenDetails }) => {

  const isDragging = useRef(false); 

  return (
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
      onClick={() => {
        if (!isDragging.current) {
          onOpenDetails(task); 
        }
      }}
      style={{
        borderLeft: `6px solid ${task.color || "#ccc"}`,
        cursor: "pointer"
      }}
    >
      <h4>{task.name}</h4>
      <p>{task.description}</p>
    </div>
  );
};

export default TaskCard;