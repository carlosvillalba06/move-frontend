import React, { useEffect, useState } from "react";
import KanbanColumn from "./KanbanColumn";
import { getAllStudentsRequest } from "../../../services/adviserService";
import {
  getTasksRequest,
  addTaskRequest,
  updateTaskStatusRequest,
  deleteTaskRequest,
  updateTaskRequest
} from "../../../services/adviserService";

const KanbanBoard = ({ boardId }) => {
    console.log("DEBUG KanbanBoard: received boardId =", boardId);
  const [tasks, setTasks] = useState([]);
  const [students, setStudents] = useState([]);

  const loadData = async () => {
    try {
      const [tasksRes, studentsRes] = await Promise.all([
        getTasksRequest(),
        getAllStudentsRequest()
      ]);

      const tasksData = tasksRes?.data || tasksRes;
      const studentsData = studentsRes?.data || studentsRes;

      // Filtrar tareas por el tablero del adviser
      const filteredTasks = tasksData.filter(task => task.boardId === boardId);
      console.log("DEBUG KanbanBoard: tasks for this board", filteredTasks);

      setTasks(Array.isArray(filteredTasks) ? filteredTasks : []);

      const studentsParsed =
        studentsRes?.data || studentsRes?.students || studentsRes || [];
      setStudents(Array.isArray(studentsParsed) ? studentsParsed : []);

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
    } catch (error) {
      console.error("Error creando tarea", error);
    }
  };

  const handleMoveTask = async (taskId, newStatus) => {
    try {
      await updateTaskStatusRequest(taskId, newStatus);

      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, statusKanban: newStatus } : task
        )
      );
    } catch (error) {
      console.error("Error moviendo tarea", error);
    }
  };

  const handleUpdateTask = async (id, data) => {
    try {
      await updateTaskRequest(id, data);
      await loadData();
    } catch (error) {
      console.error("Error actualizando tarea", error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTaskRequest(id);
      await loadData();
    } catch (error) {
      console.error("Error eliminando tarea", error);
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
    </div>
  );
};

export default KanbanBoard;