import AdminNavbar from "../AdminNavbar";

const DashboardLayout = ({ sidebar, children }) => {

  return (

    <div className="dashboard-layout">

      <AdminNavbar />

      <div className="dashboard-body">

        <aside className="dashboard-sidebar">
          {sidebar}
        </aside>

        <main className="dashboard-content">
          {children}
        </main>

      </div>

    </div>

  );

};

export default DashboardLayout;