import React from "react";
import { useParams } from "react-router-dom";
import KanbanBoard from "../tasks/components/KanbanBoard";
import { useAuth } from "../../services/authContext";
import "./kanban.css";

const TasksPage = () => {

  const { boardId } = useParams();
  const { user } = useAuth();
  console.log("DEBUG TasksPage: user =", user);

  const finalBoardId = boardId || user?.boardId;

  console.log("DEBUG TasksPage: finalBoardId =", finalBoardId);
  return <KanbanBoard boardId={finalBoardId}  />;
};

export default TasksPage;