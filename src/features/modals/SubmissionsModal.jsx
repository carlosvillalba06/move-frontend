import React, { useEffect, useState } from "react";

import {
  getStudentEvidencesRequest,
  gradeStudentTaskRequest
} from "../../services/adviserService";

import SuccessAlert from "../modals/SuccessAlert";

const SubmissionsModal = ({ task, onClose }) => {

  const [studentsWithEvidence, setStudentsWithEvidence] = useState([]);
  const [loading, setLoading] = useState(false);

  const [grades, setGrades] = useState({});
  const [feedbacks, setFeedbacks] = useState({});
  const [saving, setSaving] = useState({});

  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    message: ""
  });

  const getStudentId = (student) => {
    if (typeof student === "number") return student;

    return (
      student.studentID ||
      student.id ||
      student.userId ||
      student.idStudent
    );
  };

  const getStudentName = (student, id) => {
    if (typeof student === "object") {
      return student.fullName || student.name || `Estudiante ${id}`;
    }
    return `Estudiante ${id}`;
  };

  const fetchStudentsWithEvidence = async () => {
    if (!task?.students?.length) return;

    setLoading(true);

    try {
      const results = [];

      for (const student of task.students) {
        const studentId = getStudentId(student);
        if (!studentId) continue;

        try {
          const res = await getStudentEvidencesRequest(task.id, studentId);
          const data = res?.data || res || [];

          if (data.length > 0) {
            results.push({
              studentId,
              name: getStudentName(student, studentId),
              evidences: data
            });
          }

        } catch (error) {
          console.error("Error en estudiante:", studentId);
        }
      }

      setStudentsWithEvidence(results);

    } catch (error) {
      console.error("Error cargando evidencias:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (task) {
      fetchStudentsWithEvidence();
      setGrades({});
      setFeedbacks({});
    }
  }, [task]);

  const previewFile = (file) => {
    try {
      const byteCharacters = atob(file.file);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const blob = new Blob(
        [new Uint8Array(byteNumbers)],
        { type: file.fileType }
      );

      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");

      setTimeout(() => URL.revokeObjectURL(url), 1000);

    } catch (error) {
      console.error("Error al abrir archivo:", error);
    }
  };

  const handleGrade = async (studentId) => {
    const grade = Number(grades[studentId]);

    if (isNaN(grade) || grade < 0 || grade > 10) {
      setAlertConfig({
        isOpen: true,
        message: "La calificación debe ser entre 0 y 10"
      });
      return;
    }

    try {
      setSaving(prev => ({ ...prev, [studentId]: true }));

      await gradeStudentTaskRequest(
        task.id,
        studentId,
        grade,
        feedbacks[studentId] || ""
      );

      setAlertConfig({
        isOpen: true,
        message: "Calificación guardada correctamente"
      });

    } catch (error) {
      console.error(error);
      setAlertConfig({
        isOpen: true,
        message: "Error al guardar la calificación"
      });
    } finally {
      setSaving(prev => ({ ...prev, [studentId]: false }));
    }
  };

  if (!task) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>

        <button className="close-x" onClick={onClose}>X</button>

        <h3 style={{ marginBottom: "15px" }}>
          Entregables - {task.name}
        </h3>

        {loading && <p style={{ textAlign: "center" }}>Cargando...</p>}

        {!loading && studentsWithEvidence.length === 0 && (
          <p style={{ textAlign: "center" }}>No hay entregas aún</p>
        )}

        {!loading && studentsWithEvidence.map(student => {
          const studentId = student.studentId;

          return (
            <div key={studentId} style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "10px",
              background: "#f9f9f9"
            }}>

              <h4 style={{ marginBottom: "10px" }}>{student.name}</h4>

              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                {student.evidences.map(ev => (
                  <button
                    key={ev.id}
                    onClick={() => previewFile(ev)}
                    style={{
                      background: "#000",
                      color: "#fff",
                      border: "none",
                      padding: "6px",
                      borderRadius: "5px",
                      cursor: "pointer"
                    }}
                  >
                    {ev.fileName || "Ver archivo"}
                  </button>
                ))}
              </div>

              <div style={{ marginTop: "15px" }}>

                
                <input
                  type="number"
                  min="0"
                  max="10"
                  placeholder="Calificación (0-10)"
                  value={grades[studentId] || ""}
                  onChange={(e) =>
                    setGrades(prev => ({
                      ...prev,
                      [studentId]: e.target.value
                    }))
                  }
                  style={{
                    width: "100%",
                    padding: "6px",
                    marginBottom: "5px",
                    borderRadius: "5px",
                    border: "1px solid #ccc"
                  }}
                />

                <textarea
                  placeholder="Comentario"
                  value={feedbacks[studentId] || ""}
                  onChange={(e) =>
                    setFeedbacks(prev => ({
                      ...prev,
                      [studentId]: e.target.value
                    }))
                  }
                  style={{
                    width: "100%",
                    padding: "6px",
                    borderRadius: "5px",
                    border: "1px solid #ccc"
                  }}
                />

                <button
                  onClick={() => handleGrade(studentId)}
                  disabled={saving[studentId] || !grades[studentId]}
                  style={{
                    marginTop: "8px",
                    width: "100%",
                    padding: "8px",
                    background: saving[studentId] ? "#888" : "#000",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer"
                  }}
                >
                  {saving[studentId] ? "Guardando..." : "Guardar calificación"}
                </button>

              </div>
            </div>
          );
        })}

      </div>

      <SuccessAlert
        isOpen={alertConfig.isOpen}
        message={alertConfig.message}
        onClose={() => setAlertConfig({ isOpen: false, message: "" })}
      />
    </div>
  );
};

export default SubmissionsModal;