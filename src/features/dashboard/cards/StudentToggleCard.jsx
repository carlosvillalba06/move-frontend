import React from "react";
import Button from "../../../components/Button";

const StudentToggleCard = ({ student, onToggle }) => {

  return (
    <div className="toggle-card">
      
      <div className="user-info">
        <svg viewBox="0 0 24 24" width="45" height="45" fill="black">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08s5.97 1.09 6 3.08c-1.29 1.94-3.5 3.22-6 3.22z" />
        </svg>

        <div>
          <h2>{student.firstName} {student.lastName}</h2>
          <p>{student.email}</p>
        </div>
      </div>

      <Button
        variant={student.status ? "danger" : "success"}
        size="sm"
        onClick={() => onToggle(student)}
      >
        {student.status ? "Deshabilitar" : "Habilitar"}
      </Button>

    </div>
  );
};

export default StudentToggleCard;