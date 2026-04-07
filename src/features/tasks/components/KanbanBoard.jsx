import React, { useEffect, useState } from "react";
import KanbanColumn from "./KanbanColumn";
import { getAllStudentsRequest } from "../../../services/adviserService";
import SuccessAlert from "../../modals/SuccessAlert";
import {
  getTasksRequest,
  addTaskRequest,
  updateTaskStatusRequest,
  deleteTaskRequest,
  updateTaskRequest
} from "../../../services/adviserService";

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [students, setStudents] = useState([]);


  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const loadData = async () => {
    try {
      const [tasksRes, studentsRes] = await Promise.all([
        getTasksRequest(),
        getAllStudentsRequest()
      ]);

      const tasksData = tasksRes?.data || tasksRes;
      const studentsData = studentsRes?.data || studentsRes;

      setTasks(Array.isArray(tasksData) ? tasksData : []);
      setStudents(Array.isArray(studentsData) ? studentsData : []);
    } catch (error) {
      console.error("Error cargando datos", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateTask = async (form) => {
    try {
      await addTaskRequest(form);
      await loadData();
      setAlertMessage("Tarea creada correctamente");
      setAlertOpen(true);

    } catch (error) {
      console.error("Error creando tarea", error);
      setAlertMessage("Error al crear la tarea");
      setAlertOpen(true);
    }
  };

  const handleMoveTask = async (taskId, newStatus) => {
    console.log("MOVIENDO TAREA:", taskId, newStatus);

    try {
      await updateTaskStatusRequest(taskId, newStatus);

      setTasks(prev =>
        prev.map(task =>
          task.id === taskId
            ? { ...task, statusKanban: newStatus }
            : task
        )
      );
    } catch (error) {
      console.error("Error moviendo tarea", error);
    }
  };

  const handleUpdateTask = async (id, formData) => {
    try {
      await updateTaskRequest(id, formData);
      await loadData();
      setAlertMessage("Tarea actualizada correctamente");
      setAlertOpen(true);
    } catch (error) {
      console.error("Error actualizando tarea", error);
      setAlertMessage("Error al actualizar la tarea");
      setAlertOpen(true);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTaskRequest(id);
      await loadData();
      setAlertMessage("Tarea eliminada correctamente");
      setAlertOpen(true);
    } catch (error) {
      console.error("Error eliminando tarea", error);
      setAlertMessage("Error al eliminar la tarea");
      setAlertOpen(true);
    }
  };

  return (
    <div className="kanban-board">
      <KanbanColumn
        title="Por hacer"
        status="TODO"
        tasks={tasks}
        advisors={students}
        onCreateTask={handleCreateTask}
        onMoveTask={handleMoveTask}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
      />

      <KanbanColumn
        title="En proceso"
        status="IN_PROGRESS"
        tasks={tasks}
        advisors={students}
        onCreateTask={handleCreateTask}
        onMoveTask={handleMoveTask}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
      />

      <KanbanColumn
        title="Completado"
        status="DONE"
        tasks={tasks}
        advisors={students}
        onCreateTask={handleCreateTask}
        onMoveTask={handleMoveTask}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
      />

      <SuccessAlert
        isOpen={alertOpen}
        message={alertMessage}
        onClose={() => setAlertOpen(false)}
      />
    </div>
  );
};

export default KanbanBoard;