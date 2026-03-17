import React, { useEffect, useState } from "react";
import KanbanColumn from "./KanbanColumn";
import { getTasksByBoardRequest } from "../../../services/taskService";

const KanbanBoard = ({ boardId }) => {

  const [tasks, setTasks] = useState([]);

  useEffect(() => {

    const loadTasks = async () => {
      try {
        const data = await getTasksByBoardRequest(boardId);
        setTasks(data);
      } catch (error) {
        console.error("Error cargando tareas", error);
      }
    };

    if (boardId) {
      loadTasks();
    }

  }, [boardId]);

  return (

    <div className="kanban-board">

      <KanbanColumn
        title="Por hacer"
        status="TODO"
        tasks={tasks}
      />

      <KanbanColumn
        title="En proceso"
        status="IN_PROGRESS"
        tasks={tasks}
      />

      <KanbanColumn
        title="Completado"
        status="DONE"
        tasks={tasks}
      />

    </div>

  );
};

export default KanbanBoard;