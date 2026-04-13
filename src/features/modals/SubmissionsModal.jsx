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
      let base64Data = file.file;

      if (base64Data.includes(",")) {
        base64Data = base64Data.split(",")[1];
      }

      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const blob = new Blob(
        [new Uint8Array(byteNumbers)],
        { type: file.fileType || "application/octet-stream" }
      );

      const url = URL.createObjectURL(blob);

      if (file.fileType?.startsWith("image/")) {
        const imgWindow = window.open("");
        imgWindow.document.write(`<img src="${url}" style="width:100%" />`);
      } else {
        window.open(url, "_blank");
      }

      setTimeout(() => URL.revokeObjectURL(url), 5000);

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
            <div key={studentId} className="student-card">

              <div className="student-header">
                <h4>{student.name}</h4>
              </div>

              {/* 📁 Archivos */}
              <div className="files-container">
                {student.evidences.map(ev => (
                  <div key={ev.id} className="file-item">
                    <span>{ev.fileName || "Archivo"}</span>

                    <button onClick={() => previewFile(ev)}>
                      Ver
                    </button>
                  </div>
                ))}
              </div>

              {/* 📝 Evaluación */}
              <div className="grade-section">

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
                />

                <button
                  onClick={() => handleGrade(studentId)}
                  disabled={saving[studentId] || !grades[studentId]}
                >
                  {saving[studentId] ? "Guardando..." : "Guardar"}
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