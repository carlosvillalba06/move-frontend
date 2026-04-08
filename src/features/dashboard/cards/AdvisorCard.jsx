import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button";

const AdvisorCard = ({ advisor }) => {
  const navigate = useNavigate();

  const goToBoard = () => {
    if (!advisor?.id) {
      console.error("No se puede navegar: advisor.id es nulo");
      return;
    }

    console.log("Navegando al tablero del asesor con ID:", advisor.id);
    navigate(`/admin/dashboard/tablero/adviser/${advisor.id}`);
  };

  const imageSrc =
    advisor.logo && advisor.logo !== "SIN LOGO"
      ? `data:image/png;base64,${advisor.logo}`
      : null;

  return (
    <div className="card">
      <div>
        <span>Asesor</span>

        <div className="profile">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={advisor.firstName}
              width="55"
              height="55"
              style={{ borderRadius: "50%", objectFit: "cover" }}
            />
          ) : (
            <svg viewBox="0 0 24 24" width="55" height="55">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
            </svg>
          )}

          <h2>
            {advisor.firstName} {advisor.lastName}
          </h2>
        </div>
      </div>

      <Button variant="primary" size="sm" onClick={goToBoard}>
        Ingresar
      </Button>
    </div>
  );
};

export default AdvisorCard;