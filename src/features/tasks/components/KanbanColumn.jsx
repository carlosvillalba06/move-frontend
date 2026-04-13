import React, { useState } from "react";
import TaskCard from "./TaskCard";
import AddTask from "../../modals/AddTask";
import TaskDetailsModal from "../../modals/TaskDetailsModal";
import SubmissionsModal from "../../modals/SubmissionsModal";

const KanbanColumn = ({
  title,
  status,
  tasks,
  advisors = [],
  onCreateTask,
  onMoveTask,
  onUpdateTask,
  onDeleteTask,
  isReadOnly = false
}) => {

  const [openModal, setOpenModal] = useState(false);
  const [isOver, setIsOver] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedTaskSubmissions, setSelectedTaskSubmissions] = useState(null);

  const columnTasks = tasks.filter(task => task.statusKanban === status);

  const handleSaveTask = async (formData) => {
    if (isReadOnly) return; 

    try {
      formData.append("statusKanban", status);
      await onCreateTask(formData);
      setOpenModal(false);
    } catch (error) {
      console.error("Error creando tarea:", error);
    }
  };

  const handleDragOver = (e) => {
    if (isReadOnly) return;

    e.preventDefault();
    setIsOver(true);
  };

  const handleDrop = (e) => {
    if (isReadOnly) return;
    e.preventDefault();

    const taskId = parseInt(e.dataTransfer.getData("text/plain"), 10);

    if (!isNaN(taskId)) { 
      onMoveTask(taskId, status);
    }

    setIsOver(false);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  return (
    <div className="kanban-column">
      <h3>{title}</h3>

      {!isReadOnly && (
        <button
          className="add-task"
          onClick={() => setOpenModal(true)}
        >
          + Agregar tarea
        </button>
      )}

      <div
        className={`task-list ${isOver && !isReadOnly ? "drag-over" : ""}`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragLeave={handleDragLeave}
        style={{ minHeight: "100px" }}
      >
        {columnTasks.length === 0 && (
          <p style={{ textAlign: "center", opacity: 0.6 }}>
            Sin tareas
          </p>
        )}

        {columnTasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onOpenDetails={(task) => setSelectedTask(task)}
            onDelete={isReadOnly ? null : onDeleteTask}
            onOpenSubmissions={setSelectedTaskSubmissions}
            isReadOnly={isReadOnly}
          />
        ))}
      </div>

      {!isReadOnly && openModal && (
        <AddTask
          onClose={() => setOpenModal(false)}
          advisors={advisors}
          onSave={handleSaveTask}
        />
      )}

      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          advisors={advisors}
          isReadOnly={isReadOnly} 
          onClose={() => setSelectedTask(null)}
          onSave={isReadOnly ? null : onUpdateTask} 
        />
      )}

      {selectedTaskSubmissions && (
        <SubmissionsModal
          task={selectedTaskSubmissions}
          onClose={() => setSelectedTaskSubmissions(null)}
        />
      )}
    </div>
  );
};

export default KanbanColumn;