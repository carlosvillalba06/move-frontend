import React, { useEffect, useState } from "react";
import {
  getStudentEvidencesRequest,
  gradeStudentTaskRequest
} from "../../services/adviserService";
import SuccessAlert from "../modals/SuccessAlert";
import Button from "../../components/Button";

const SubmissionsModal = ({ task, onClose }) => {
  const [studentsWithEvidence, setStudentsWithEvidence] = useState([]);
  const [loading, setLoading] = useState(false);
  const [grades, setGrades] = useState({});
  const [feedbacks, setFeedbacks] = useState({});
  const [saving, setSaving] = useState({});
  const [openStudent, setOpenStudent] = useState(null);
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, message: "" });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const getStudentId = (student) =>
    typeof student === "number"
      ? student
      : (student.studentID || student.id || student.userId || student.idStudent);

  const getStudentName = (student, id) => {
    if (!student) return `ID: ${id}`;
    const name = student.firstName
      ? `${student.firstName} ${student.lastName}`
      : (student.fullName || student.name || student.nombre || student.username);
    const nestedName = student.User?.fullName || student.Student?.name;
    return name || nestedName || `Estudiante #${id}`;
  };

  const fetchStudentsWithEvidence = async () => {
    if (!task?.students?.length) return;
    setLoading(true);
    try {
      const results = await Promise.all(
        task.students.map(async (student) => {
          const studentId = getStudentId(student);
          if (!studentId) return null;
          try {
            const res = await getStudentEvidencesRequest(task.id, studentId);
            const data = res?.data || res || [];
            if (data.length > 0) {
              return {
                studentId,
                name: getStudentName(student, studentId),
                evidences: data
              };
            }
          } catch { return null; }
          return null;
        })
      );
      const filtered = results.filter(Boolean);
      setStudentsWithEvidence(filtered);
      if (filtered.length > 0) setOpenStudent(filtered[0].studentId);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (task) {
      fetchStudentsWithEvidence();
      setGrades({});
      setFeedbacks({});
      setCurrentPage(1);
    }
  }, [task]);

  const totalPages = Math.ceil(studentsWithEvidence.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = studentsWithEvidence.slice(startIndex, startIndex + itemsPerPage);

  const previewFile = (file) => {
    try {
      let base64Data = file.fileData || file.file || "";
      if (base64Data.includes(",")) base64Data = base64Data.split(",")[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Uint8Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const blob = new Blob([byteNumbers], { type: file.fileType || "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch (error) { console.error(error); }
  };

  const handleGrade = async (studentId) => {
    const grade = Number(grades[studentId]);
    if (isNaN(grade) || grade < 0 || grade > 10) {
      setAlertConfig({ isOpen: true, message: "La calificación debe ser entre 0 y 10" });
      return;
    }
    try {
      setSaving(prev => ({ ...prev, [studentId]: true }));
      await gradeStudentTaskRequest(task.id, studentId, grade, feedbacks[studentId] || "");
      setAlertConfig({ isOpen: true, message: "Calificación guardada correctamente" });
    } catch {
      setAlertConfig({ isOpen: true, message: "Error al guardar calificación" });
    } finally {
      setSaving(prev => ({ ...prev, [studentId]: false }));
    }
  };

  if (!task) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content submissions-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-x" onClick={onClose}>&times;</button>
        <header className="modal-header">
          <h3>Entregables: {task.name}</h3>
        </header>

        <div className="modal-body scrollable">
          {loading && <div className="loader">Cargando...</div>}
          {!loading && studentsWithEvidence.length === 0 && (
            <div className="empty-state">No hay entregas registradas.</div>
          )}

          {!loading && paginatedStudents.map(student => {
            const isOpen = openStudent === student.studentId;
            return (
              <div key={student.studentId} className={`student-card ${isOpen ? 'active' : ''}`}>
                <div className="student-header" onClick={() => setOpenStudent(isOpen ? null : student.studentId)}>
                  <h4>{student.name}</h4>
                  <span>{isOpen ? "▲" : "▼"}</span>
                </div>
                {isOpen && (
                  <div className="student-body">
                    <div className="student-comment-box">
                      <label className="section-label">Nota del Alumno</label>
                      <p>{student.evidences[0]?.comment || "Sin comentario."}</p>
                    </div>
                    <div className="evidence-list">
                      <label className="section-label">Archivos</label>
                      {student.evidences.map((ev, idx) => (
                        <div key={idx} className="file-row">
                          <span>{ev.fileName || "Archivo"}</span>
                          <button className="view-btn" onClick={() => previewFile(ev)}>Ver</button>
                        </div>
                      ))}
                    </div>
                    <div className="grading-area">
                      <label className="section-label">Evaluación</label>
                      <div className="grading-fields">
                        <input
                          type="number"
                          min="0" max="10" step="0.1"
                          placeholder="0.0"
                          value={grades[student.studentId] || ""}
                          onChange={(e) => setGrades(prev => ({ ...prev, [student.studentId]: e.target.value }))}
                        />
                        <textarea
                          placeholder="Retroalimentación..."
                          value={feedbacks[student.studentId] || ""}
                          onChange={(e) => setFeedbacks(prev => ({ ...prev, [student.studentId]: e.target.value }))}
                        />
                        <Button
                          onClick={() => handleGrade(student.studentId)}
                          disabled={saving[student.studentId] || !grades[student.studentId]}
                        >
                          {saving[student.studentId] ? "Enviando..." : "Calificar"}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {!loading && studentsWithEvidence.length > itemsPerPage && (
          <div className="pagination">
            <button 
              className="pag-btn"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              &laquo; Anterior
            </button>
            <span className="pag-info">Página <b>{currentPage}</b> de {totalPages}</span>
            <button 
              className="pag-btn"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Siguiente &raquo;
            </button>
          </div>
        )}
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