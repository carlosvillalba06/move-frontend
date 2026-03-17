import React from "react";
import { useParams } from "react-router-dom";
import KanbanBoard from "../tasks/components/KanbanBoard";
import { useAuth } from "../../services/authContext";
import "./kanban.css";

const TasksPage = () => {

  const { boardId } = useParams();
  const { user } = useAuth();

  const finalBoardId = boardId || user?.boardId;

  return <KanbanBoard boardId={finalBoardId} />;
};

export default TasksPage;