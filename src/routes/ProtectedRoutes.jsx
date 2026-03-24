import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../services/authContext";

function ProtectedRoutes({ allowedRoles }) {

  const { session, isLoggedIn, loading } = useAuth();

    if (loading) return <div>Cargando...</div>;

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const userRole = session?.user?.rol?.toLowerCase();

  if (
    allowedRoles &&
    !allowedRoles.map(r => r.toLowerCase()).includes(userRole)
  ) {
    if (userRole === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/advisor/dashboard" replace />;
    }
  }

  return <Outlet />;
}

export default ProtectedRoutes;