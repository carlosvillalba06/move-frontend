import React, { useEffect, useState } from "react";

import {
  getStudentEvidencesRequest,
  gradeStudentTaskRequest
} from "../../services/adviserService";

const SubmissionsModal = ({ task, onClose }) => {

  const [studentsWithEvidence, setStudentsWithEvidence] = useState([]);
  const [loading, setLoading] = useState(false);

  const [grades, setGrades] = useState({});
  const [feedbacks, setFeedbacks] = useState({});
  const [saving, setSaving] = useState({});

  const getStudentId = (student) => {
    if (typeof student === "number") return student;

    return (
      student.studentID ||
      student.id ||
      student.userId ||
      student.idStudent
    );
  };

  const fetchStudentsWithEvidence = async () => {
    if (!task?.students?.length) return;

    setLoading(true);

    try {
      const requests = task.students.map(async (student) => {

        const studentId = getStudentId(student);

        if (!studentId) {
          console.warn("⚠️ Estudiante sin ID:", student);
          return null;
        }

        try {
          const res = await getStudentEvidencesRequest(task.id, studentId);
          const data = res?.data || res || [];

          return {
            studentId,
            name:
              typeof student === "object"
                ? (student.name || student.fullName || `Estudiante ${studentId}`)
                : `Estudiante ${studentId}`,
            evidences: data
          };

        } catch (error) {
          console.error("Error en estudiante:", studentId);
          return null;
        }
      });

      const results = await Promise.all(requests);

      const filtered = results
        .filter(Boolean) 
        .filter(s => s.evidences && s.evidences.length > 0);

      setStudentsWithEvidence(filtered);

    } catch (error) {
      console.error("Error cargando evidencias:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (task) {
      fetchStudentsWithEvidence();
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

    } catch (error) {
      console.error("Error al abrir archivo:", error);
    }
  };

  const handleGrade = async (studentId) => {
    try {
      setSaving(prev => ({ ...prev, [studentId]: true }));

      await gradeStudentTaskRequest(
        task.id,
        studentId,
        Number(grades[studentId]),
        feedbacks[studentId] || ""
      );

      alert("Calificación guardada");

    } catch (error) {
      console.error("Error calificando:", error);
      alert("Error al guardar");
    } finally {
      setSaving(prev => ({ ...prev, [studentId]: false }));
    }
  };

  if (!task) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>

        <button className="close-x" onClick={onClose}>X</button>

        <h3>Entregables - {task.name}</h3>

        {loading && <p>Cargando...</p>}

        {!loading && studentsWithEvidence.length === 0 && (
          <p>No hay entregas aún</p>
        )}

        {!loading && studentsWithEvidence.map(student => {
          const studentId = student.studentId;

          return (
            <div key={studentId} style={{
              border: "1px solid #ddd",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "8px"
            }}>

              <h4>{student.name}</h4>

              {student.evidences.map(ev => (
                <div key={ev.id}>
                  <button onClick={() => previewFile(ev)}>
                    {ev.fileName || "Ver archivo"}
                  </button>
                </div>
              ))}

              <div style={{ marginTop: "10px" }}>

                <input
                  type="number"
                  placeholder="Calificación"
                  value={grades[studentId] || ""}
                  onChange={(e) =>
                    setGrades(prev => ({
                      ...prev,
                      [studentId]: e.target.value
                    }))
                  }
                  style={{ marginRight: "5px" }}
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
                  style={{ display: "block", marginTop: "5px", width: "100%" }}
                />

                <button
                  onClick={() => handleGrade(studentId)}
                  disabled={saving[studentId]}
                  style={{ marginTop: "5px" }}
                >
                  {saving[studentId] ? "Guardando..." : "Guardar"}
                </button>

              </div>

            </div>
          );
        })}

      </div>
    </div>
  );
};

export default SubmissionsModal;