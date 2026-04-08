import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../components/layouts/DashboardLayout.jsx";
import DashboardSidebar from "../components/DashboardSidebar.jsx";
import AdvisorToggleCardsContainer from "./../features/dashboard/AdvisorToggleCardsContainer.jsx";
import { useAuth } from "../services/authContext.js";
import AdvisorCardsContainer from "../features/dashboard/AdvisorCardContainer.jsx";
import TasksPage from "../features/tasks/TasksPage.jsx";

import AdminAdviserBoardPage from "../features/tasks/AdminAdviserBoardPage.jsx";

const AdminDashboardRoutes = () => {
    const { user } = useAuth();
    const role = user?.rol?.toUpperCase();

    return (
        <DashboardLayout sidebar={<DashboardSidebar role={role} />}>
            <Routes>
                <Route path="/" element={<Navigate to="tablero" replace />} />

                <Route path="tablero" element={<AdvisorCardsContainer />} />

                <Route path="tablero/adviser/:adviserId" element={<AdminAdviserBoardPage />} />

                <Route path="mis-tareas" element={<TasksPage />} />

                <Route path="asesores" element={<AdvisorToggleCardsContainer />} />
            </Routes>
        </DashboardLayout>
    );
};

export default AdminDashboardRoutes;