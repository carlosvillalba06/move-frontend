import AdminNavbar from "../components/AdminNavbar";

const AdminLayout = ({ children, advisorName }) => {

  return (

    <div className="admin-layout">

      <AdminNavbar advisorName={advisorName} />

      <main className="admin-content">
        {children}
      </main>

    </div>

  );

};

export default AdminLayout;