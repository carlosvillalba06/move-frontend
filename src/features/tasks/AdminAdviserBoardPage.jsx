import React from "react";
import { useParams } from "react-router-dom";
import KanbanBoard from "../tasks/components/KanbanBoard";

const AdminAdviserBoardPage = () => {
  const { adviserId } = useParams();

  return <KanbanBoard adviserId={adviserId} isAdminView />;
};

export default AdminAdviserBoardPage;