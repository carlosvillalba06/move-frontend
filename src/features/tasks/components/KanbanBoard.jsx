import React, { useEffect, useState } from "react";
import KanbanColumn from "./KanbanColumn";
{/*import { getTasksRequest } from "../services/taskService"; */}

const KanbanBoard = ({advisorId}) => {

  const [tasks, setTasks] = useState([]);

  useEffect(() => {

    const loadTasks = async () => {
      try {

       /* const data = await getTasksByAdvisorRequest(advisorId);*/ 
        setTasks(data);

      } catch (error) {
        console.error("Error cargando tareas", error);
      }
    };

    loadTasks();

  }, [advisorId]);

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