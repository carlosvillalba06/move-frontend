import { Routes, Route } from "react-router-dom";
import ProtectedRoutes from "./ProtectedRoutes";
import RegisterEmail from "../features/auth/RegisterEmail";
import VerifyCode from "../features/auth/VerifyCode";
import SetPassword from "../features/auth/SetPassword";
import ResetPassword from "../features/auth/ResetPassword";
import AdminDashboard from "../features/dashboard/AdminDashboard";
import AdvisorDashboard from "../features/dashboard/AdvisorDashboard";
import SettingsPage from "../features/users/SettingsPage";

import Login from "../features/auth/Login";
import ForgotPasswordEmail from "../features/auth/ForgotPasswordEmail";

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterEmail />} />
            <Route path="/verify-code" element={<VerifyCode />} />
            <Route path="/set-password" element={<SetPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<ForgotPasswordEmail/>}/>
            {/* ADMIN + ADVISOR */}

            <Route element={<ProtectedRoutes allowedRoles={["admin", "advisor"]} />}>

                <Route path="/advisor/dashboard/*" element={<AdvisorDashboard />} />
                <Route path="/settings" element={<SettingsPage />} />

            </Route>

            {/* SOLO ADMIN */}

            <Route element={<ProtectedRoutes allowedRoles={["admin"]} />}>

                <Route path="/admin/dashboard/*" element={<AdminDashboard />} />
            </Route>

        </Routes>
    )
};

export default AppRouter;