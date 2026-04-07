import React from "react";
import Button from "../../../components/Button";

const AdvisorToggleCard = ({ advisor, onToggle }) => {

    const imageSrc =
    advisor.logo && advisor.logo !== "SIN LOGO"
      ? `data:image/png;base64,${advisor.logo}`
      : null;

  return (
    <div className="toggle-card">

        <div className="user-info">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={advisor.firstName}
              width="55"
              height="55"
              style={{
                borderRadius: "50%",
                objectFit: "cover"
              }}
            />
          ) : (
            <svg viewBox="0 0 24 24" width="55" height="55" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08s5.97 1.09 6 3.08c-1.29 1.94-3.5 3.22-6 3.22z" />
            </svg>
          )}
          <div>
            <h2>
            {advisor.firstName} {advisor.lastName}
          </h2>
             <p>{advisor.email}</p>
          </div>
          

          
        </div>

      <Button
        variant={advisor.status ? "danger" : "success"}
        size="sm"
        onClick={() => onToggle(advisor)}
      >
        {advisor.status ? "Deshabilitar" : "Habilitar"}
      </Button>

    </div>
  );
};

export default AdvisorToggleCard;