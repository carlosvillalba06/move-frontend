import React from "react";
import TaskCard from "./TaskCard";

const KanbanColumn = ({ title, status, tasks, addTask }) => {

  const columnTasks = tasks.filter(task => task.status === status);

  return (
    <div className="kanban-column">

      <h3>{title}</h3>

      <button
        className="add-task"
        onClick={() => addTask(status)}
      >
        + Agregar tarea
      </button>

      <div className="task-list">
        {columnTasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

    </div>
  );
};

export default KanbanColumn;