import { Outlet } from "react-router-dom";
import AdviserDashboardRoutes from "../../routes/AdviserDashboardRoutes";


const AdvisorDashboard = () => {

  return (
    <div>
      <AdviserDashboardRoutes>
        <Outlet/>
      </AdviserDashboardRoutes>
    </div>



  );

};

export default AdvisorDashboard;