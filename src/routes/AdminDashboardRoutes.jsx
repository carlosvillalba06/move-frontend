import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../components/layouts/DashboardLayout.jsx";
import DashboardSidebar from "../components/DashboardSidebar.jsx";
import AdvisorToggleCardsContainer from "./../features//dashboard/AdvisorToggleCardsContainer.jsx";
import { useAuth } from "../services/authContext.js";
import AdvisorCardsContainer from "../features/dashboard/AdvisorCardContainer.jsx";
import TasksPage from "../features/tasks/TasksPage.jsx";


const AdminDashboardRoutes = () => {
    const { user } = useAuth();
    const role = user?.rol?.toUpperCase();

    return (
        <DashboardLayout sidebar={<DashboardSidebar role={role} />}>
            <Routes>
                <Route path="/" element={<Navigate to="tablero" replace />} />

            {/* Lista de asesores */}
            <Route path="tablero" element={<AdvisorCardsContainer />} />

            {/* Kanban del asesor */}
            <Route path="tablero/:boardId" element={<TasksPage />} />

            <Route path="asesores" element={<AdvisorToggleCardsContainer />} />
            </Routes>
            
        </DashboardLayout>
    );
};

export default AdminDashboardRoutes;