import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../components/layouts/DashboardLayout.jsx";
import DashboardSidebar from "../components/DashboardSidebar.jsx";
import AdvisorToggleCardsContainer from "./../features//dashboard/AdvisorToggleCardsContainer.jsx";
import { useAuth } from "../services/authContext.js";
import AdvisorCardsContainer from "../features/dashboard/AdvisorCardContainer.jsx";


const AdminDashboardRoutes = () => {
    const { user } = useAuth();
    const role = user?.rol?.toUpperCase();

    return (
        <DashboardLayout sidebar={<DashboardSidebar role={role} />}>
            <Routes>
                <Route path="/" element={<Navigate to="tablero" replace />} />
                <Route path="tablero" element={<AdvisorCardsContainer />} />
                <Route path="asesores" element={<AdvisorToggleCardsContainer />} />
            </Routes>
        </DashboardLayout>
    );
};

export default AdminDashboardRoutes;