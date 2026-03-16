import React from "react";
import { useParams,useLocation } from "react-router-dom";
import KanbanBoard from "../tasks/components/KanbanBoard";
import "./kanban.css";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import DashboardSidebar from "../../components/DashboardSidebar";

import { useAuth } from "../../services/authContext";


const TasksPage = () => {

  const { advisorId } = useParams();
  const { user } = useAuth();
  const role = user?.rol;

  return (
    <div>
      <DashboardLayout sidebar={<DashboardSidebar role={role} />}>
        <KanbanBoard advisorId={advisorId} />
      </DashboardLayout>

    </div>
  );
};

export default TasksPage;