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
  onDeleteTask
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [isOver, setIsOver] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedTaskSubmissions, setSelectedTaskSubmissions] = useState(null);

  const columnTasks = tasks.filter(
    task => task.statusKanban === status
  );

  const handleSaveTask = async (formData) => {
    formData.append("statusKanban", status);
    await onCreateTask(formData);
    setOpenModal(false);
  };

  return (
    <div className="kanban-column">
      <h3>{title}</h3>

      <button className="add-task" onClick={() => setOpenModal(true)}>
        + Agregar tarea
      </button>

      <div
        className={`task-list ${isOver ? "drag-over" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          e.dataTransfer.dropEffect = "move";
          setIsOver(true);
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          setIsOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsOver(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();

          const rawId = e.dataTransfer.getData("text/plain");

          if (!rawId) {
            setIsOver(false);
            return;
          }

          const taskId = parseInt(rawId, 10);

          if (isNaN(taskId)) {
            setIsOver(false);
            return;
          }

          onMoveTask(taskId, status);
          setIsOver(false);
        }}
        style={{ minHeight: "100px" }}
      >
        {columnTasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onOpenDetails={setSelectedTask}
            onDelete={onDeleteTask}
            onOpenSubmissions={setSelectedTaskSubmissions}
          />
        ))}
      </div>

      {openModal && (
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