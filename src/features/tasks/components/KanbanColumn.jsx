import React, { useState } from "react";
import TaskCard from "./TaskCard";
import AddTask from "../../modals/AddTask";

const KanbanColumn = ({ 
  title, 
  status, 
  tasks, 
  user, 
  advisors, 
  colors,
  createTask // función para guardar
}) => {

  const [openModal, setOpenModal] = useState(false);

  const columnTasks = tasks.filter(task => task.status === status);

  // Guardar tarea
  const handleSaveTask = (formData) => {
    // aquí le agregas el status automáticamente
    formData.append("status", status);

    createTask(formData);
    setOpenModal(false);
  };

  return (
    <div className="kanban-column">

      <h3>{title}</h3>

      <button
        className="add-task"
        onClick={() => setOpenModal(true)}
      >
        + Agregar tarea
      </button>

      <div className="task-list">
        {columnTasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      {/* Modal */}
      {openModal && (
        <AddTask 
          onClose={() => setOpenModal(false)}
          user={user}
          advisors={advisors}
          colorsFromBackend={colors}
          onSave={handleSaveTask}
        />
      )}

    </div>
  );
};

export default KanbanColumn;