import React, { useEffect, useState } from "react";
import KanbanColumn from "./KanbanColumn";
import { getTasksByBoardRequest } from "../../../services/taskService";
import { getAllStudentsRequest } from "../../../services/adviserService";

const KanbanBoard = ({ boardId, onCreateTask }) => {

  const [tasks, setTasks] = useState([]);
  const [students, setStudents] = useState([]);

  /*
useEffect(() => {

  const loadData = async () => {
    try {
      const [tasksData, studentsData] = await Promise.all([
        getTasksByBoardRequest(boardId),
        getAllStudentsRequest()
      ]);

      console.log("tasks:", tasksData);
      console.log("students:", studentsData);
      setTasks(Array.isArray(tasksData) ? tasksData : []);

      // cargar estudiantes
      setStudents(Array.isArray(studentsData) ? studentsData : []);

    } catch (error) {
      console.error("Error cargando datos", error);
    }
  };

  loadData();

}, [boardId]);
*/

// Tarea de prueba

  useEffect(() => {

    const fakeTask = {
      id: Date.now(),
      name: "Tarea de prueba",
      description: "Arrástrame a otra columna",
      statusKanban: "TODO",
      color: "#ff5733"
    };

    setTasks([fakeTask]);

  }, []);
  const handleMoveTask = (taskId, newStatus) => {
    console.log("Moviendo tarea:", taskId, "a", newStatus);

    setTasks(prevTasks => {
      const updated = prevTasks.map(task =>
        task.id === Number(taskId)
          ? { ...task, statusKanban: newStatus }
          : task
      );

      console.log("Estado actualizado:", updated);

      return updated;
    });

    try {
      // await updateTaskStatusRequest(taskId, newStatus);
    } catch (error) {
      console.error("Error al actualizar");
    }
  };
  return (
    <div className="kanban-board">

      <KanbanColumn
        title="Por hacer"
        status="TODO"
        tasks={tasks}
        advisors={students}
        onCreateTask={onCreateTask}
        onMoveTask={handleMoveTask}
      />

      <KanbanColumn
        title="En proceso"
        status="IN_PROGRESS"
        tasks={tasks}
        advisors={students}
        onCreateTask={onCreateTask}
        onMoveTask={handleMoveTask}
      />

      <KanbanColumn
        title="Completado"
        status="DONE"
        tasks={tasks}
        advisors={students}
        onCreateTask={onCreateTask}
        onMoveTask={handleMoveTask}
      />

    </div>
  );
};

export default KanbanBoard;