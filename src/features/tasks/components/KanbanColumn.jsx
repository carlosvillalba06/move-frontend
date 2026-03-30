import React, { useState } from "react";
import TaskCard from "./TaskCard";
import AddTask from "../../modals/AddTask";
import TaskDetailsModal from "../../modals/TaskDetailsModal";

const KanbanColumn = ({ title, status, tasks, advisors = [], onCreateTask, onMoveTask, onUpdateTask, onDeleteTask }) => {

  const [openModal, setOpenModal] = useState(false);
  const [isOver, setIsOver] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const columnTasks = Array.isArray(tasks)
    ? tasks.filter(task => task.statusKanban === status)
    : [];

  const handleSaveTask = async (formData) => {
    formData.append("statusKanban", status);

    await onCreateTask(formData);
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

      <div
        className={`task-list ${isOver ? "drag-over" : ""}`}
        style={{ minHeight: "150px" }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsOver(true);
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          setIsOver(true);
        }}
        onDragLeave={(e) => {
          setIsOver(false);
        }}
        onDrop={(e) => {
          e.preventDefault();

          const taskId = e.dataTransfer.getData("taskId");

          console.log("DROP en", status, "task:", taskId);

          if (!taskId) return;

          onMoveTask(taskId, status);
          setIsOver(false);
        }}
      >
        {columnTasks.length === 0 && (
          <p style={{ textAlign: "center", color: "#999" }}>
            Suelta aquí
          </p>
        )}

        {columnTasks.map(task => (
          <TaskCard key={task.id} task={task} onOpenDetails={(task) => { setSelectedTask(task) }} onDelete={onDeleteTask}/>
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

    </div>
  );
};

export default KanbanColumn;