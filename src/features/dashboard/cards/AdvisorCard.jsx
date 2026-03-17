import React from "react";
import { useNavigate } from "react-router-dom";

const AdvisorCard = ({ advisor }) => {

  const navigate = useNavigate();

  const goToBoard = () => {
    navigate(`/admin/dashboard/tablero/${advisor.boardId}`);
  };

  return (
    <div className="card">
      <div>
        <span>Asesor:</span>

        <div className="profile">
          {advisor.image ? (
            <img
              src={advisor.image}
              alt={advisor.firstName}
              width="50"
              height="50"
              style={{ borderRadius: "50%" }}
            />
          ) : (
            <svg viewBox="0 0 24 24" width="50" height="50" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08s5.97 1.09 6 3.08c-1.29 1.94-3.5 3.22-6 3.22z" />
            </svg>
          )}

          <h2>{advisor.firstName} {advisor.lastName}</h2>
        </div>
      </div>

      <button onClick={goToBoard}>
        Ingresar
      </button>
    </div>
  );
};

export default AdvisorCard;