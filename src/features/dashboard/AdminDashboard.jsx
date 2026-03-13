import { Outlet } from "react-router-dom";
import AdminDashboardRoutes from "../../routes/AdminDashboardRoutes";

const AdminDashboard = () => {

  

  return (


    <div className="boards-container">
      <AdminDashboardRoutes>
        <Outlet/>
        </AdminDashboardRoutes>

    </div>

  );

};

export default AdminDashboard;