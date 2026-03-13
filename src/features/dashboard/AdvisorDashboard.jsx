import DashboardLayout from "../../components/layouts/DashboardLayout";
import DashboardSidebar from "../../components/DashboardSidebar";

const AdvisorDashboard = () => {

  return (

    <DashboardLayout sidebar={<DashboardSidebar role="ADVISOR" />}>

      <div className="kanban-container">
        {/* tablero kanban */}
      </div>

    </DashboardLayout>

  );

};

export default AdvisorDashboard;