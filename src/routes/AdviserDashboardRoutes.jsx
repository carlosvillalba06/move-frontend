import DashboardSidebar from "../components/DashboardSidebar";
import DashboardLayout from "../components/layouts/DashboardLayout";
import StudentToggleCardsContainer from "../features/dashboard/StudentToggleCardsContainer"
import TasksPage from '../features/tasks/TasksPage';
import { useAuth } from "../services/authContext";
import { Routes, Route, Navigate } from "react-router-dom";


const AdviserDashboardRoutes = ({}) =>{

    const {user} = useAuth();
     const role = user?.rol?.toUpperCase();

    return (

        <DashboardLayout sidebar={<DashboardSidebar role={role}/>}>
            <Routes>
                <Route path="/" element={<Navigate to="tablero" replace/>} />
                <Route path="tablero" element={<TasksPage/>} />
                <Route path="estudiantes" element={<StudentToggleCardsContainer/>} />
            </Routes>
        </DashboardLayout>
    );
};

export default AdviserDashboardRoutes;