import { useNavigate } from "react-router-dom";

const DashboardSidebar = ({ role }) => {
  const navigate = useNavigate();

  const menu = {
    ADMIN: [
      { label: "Tableros", path: "/admin/dashboard/tablero" },
      { label: "Asesores", path: "/admin/dashboard/asesores" }
    ],
    ADVISER: [
      { label: "Tablero", path: "/advisor/dashboard/tablero" },
      { label: "Estudiantes", path: "/advisor/dashboard/estudiantes" }
    ]
  };

  const roleKey = role?.toUpperCase();

  return (
    <>
      {menu[roleKey]?.map((item, index) => (
        <button key={index} onClick={() => navigate(item.path)}>
          {item.label}
        </button>
      ))}

      <button
        className="sidebar-footer"
        onClick={() => navigate("/settings")}
      >
        Configuraciones
      </button>
    </>
  );
};

export default DashboardSidebar;