import React from "react";
import Button from "../../components/Button";


const StudentDetailsModal = ({ student, onClose, onGenerateReport }) => {
  if (!student) return null;

  const imageSrc =
    student.logo && student.logo !== "SIN LOGO"
      ? `data:image/png;base64,${student.logo}`
      : null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-x" onClick={onClose}>
          ✕
        </button>

        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={student.firstName}
              width="80"
              height="80"
              style={{
                borderRadius: "50%",
                objectFit: "cover",
                marginBottom: "10px"
              }}
            />
          ) : (
            <svg viewBox="0 0 24 24" width="55" height="55" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08s5.97 1.09 6 3.08c-1.29 1.94-3.5 3.22-6 3.22z" />
            </svg>
          )}

          <h2>
            {student.firstName} {student.lastName}
          </h2>
          <p>{student.email}</p>
        </div>

        <div className="form-footer" style={{ justifyContent: "center", gap: "10px" }}>
          <Button
            variant="primary"
            onClick={() => onGenerateReport(student.id, student)}
          >
          Generar Reporte PDF
          </Button>

          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailsModal;