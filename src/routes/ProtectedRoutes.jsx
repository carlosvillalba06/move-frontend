import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../services/authContext";

function ProtectedRoutes({ allowedRoles }) {

  const { session, isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const userRole = session?.user?.rol?.toLowerCase();

  if (
    allowedRoles &&
    !allowedRoles.map(r => r.toLowerCase()).includes(userRole)
  ) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoutes;