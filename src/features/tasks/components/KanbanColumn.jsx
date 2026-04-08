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
    formData.append("statusKanban", status);
    await onCreateTask(formData);
    setOpenModal(false);
  };

  return (
    <div className="kanban-column">
      <h3>{title}</h3>

      {!isReadOnly && (
        <button className="add-task" onClick={() => setOpenModal(true)}>
          + Agregar tarea
        </button>
      )}

      <div
        className={`task-list ${isOver ? "drag-over" : ""}`}
        onDragOver={(e) => {
          if (isReadOnly) return;
          e.preventDefault();
          setIsOver(true);
        }}
        onDrop={(e) => {
          if (isReadOnly) return;

          e.preventDefault();
          const taskId = parseInt(e.dataTransfer.getData("text/plain"), 10);
          if (!isNaN(taskId)) {
            onMoveTask(taskId, status);
          }
          setIsOver(false);
        }}
        style={{ minHeight: "100px" }}
      >
        {columnTasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            isReadOnly={isReadOnly}
            onOpenDetails={setSelectedTask}
            onDelete={onDeleteTask}
            onOpenSubmissions={setSelectedTaskSubmissions}
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
          onSave={onUpdateTask}
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