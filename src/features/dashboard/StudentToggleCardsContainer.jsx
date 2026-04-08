import React, { useEffect, useState } from "react";
import SearchBarAddStudent from "../../components/SearchBarAddStudent.jsx";
import StudentToggleCard from "./cards/StudentToggleCard.jsx";
import StudentDetailsModal from "../modals/StudentDetailsModal.jsx";

import {
  getAllStudentsRequest,
  disableBoardStudentRequest,
  enableBoardStudentRequest,
  addStudentToBoardRequest,
  getStudentExpedienteRequest
} from "../../services/adviserService";

import AddStudent from "../users/AddStudent.jsx";
import SearchStudentModal from "../modals/SearchStudentModal.jsx";
import SuccessAlert from "../modals/SuccessAlert.jsx";
import ConfirmAlert from "../modals/ConfirmAlert.jsx";

const StudentCardsToggleContainer = () => {
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [reportStartDate, setReportStartDate] = useState("");
  const [reportEndDate, setReportEndDate] = useState("");
  const [successConfig, setSuccessConfig] = useState({ isOpen: false, message: "" });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);

  const filteredStudents = Array.isArray(students)
    ? students.filter(s =>
      (s.firstName + " " + s.lastName + " " + s.email)
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    : [];

  const loadStudents = async () => {
    try {
      const res = await getAllStudentsRequest();
      const data = res?.data?.data || res?.data?.content || res?.data || res;

      const normalized = Array.isArray(data)
        ? data.map(s => ({
          id: s.studentID,
          firstName: s.firstName,
          lastName: s.lastName,
          email: s.email,
          status: s.statusAdviserStudent,
          logo: s.logo
        }))
        : [];

      setStudents(normalized);
    } catch (error) {
      console.error("Error cargando estudiantes", error);
      setStudents([]);
    }
  };

  useEffect(() => { loadStudents(); }, []);

  const handleStudentCreated = async (student) => {
    try {
      await addStudentToBoardRequest(student.email);
      await loadStudents();
      setSuccessConfig({ isOpen: true, message: "Estudiante registrado y agregado" });
    } catch (error) { console.error(error); }
  };

  const handleStudentAdded = async () => {
    await loadStudents();
    setSuccessConfig({ isOpen: true, message: "Estudiante agregado al tablero" });
  };

  const handleOpenRegister = () => setIsModalOpen(true);

  const handleToggleStatus = (student) => {
    const isActive = student.status;
    setConfirmMessage(`¿Seguro que deseas ${isActive ? "deshabilitar" : "habilitar"} este estudiante?`);
    setConfirmAction(() => async () => {
      try {
        if (isActive) await disableBoardStudentRequest(student.id);
        else await enableBoardStudentRequest(student.id);
        setStudents(prev => prev.map(s => s.id === student.id ? { ...s, status: !isActive } : s));
        setSuccessConfig({ isOpen: true, message: isActive ? "Estudiante deshabilitado" : "Estudiante habilitado" });
      } catch (error) { console.error(error); } finally { setConfirmOpen(false); }
    });
    setConfirmOpen(true);
  };

  const handleAddStudent = () => setIsSearchModalOpen(true);

  const translateStatus = (status) => {
  if (!status) return "-";

  const clean = status.split(",")[0];

  if (clean === "TODO" || clean === "ToDo") return "Por hacer";
  if (clean === "IN_PROGRESS") return "En proceso";
  if (clean === "DONE") return "Completado";

  return clean;
};

  const handleGenerateReport = async (studentId, student) => {
    try {
      const startDate = new Date(new Date().getFullYear(), 0, 1).toISOString().split("T")[0];
      const endDate = new Date().toISOString().split("T")[0];

      const res = await getStudentExpedienteRequest(studentId, startDate, endDate);
      const data = res?.data || res;
      console.log("Datos del expediente:", data);

      const reportHTML = `
<html>
  <head>
    <title>Reporte de ${data.fullName}</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 20px; color: #000; }
      h1 { text-align: center; color: #000; }
      h2 { color: #333; margin-top: 20px; }
      table { width: 100%; border-collapse: collapse; margin-top: 10px; }
      th, td { border: 1px solid #333; padding: 8px; text-align: left; }
      th { background-color: #000; color: #fff; }
      tr:nth-child(even) { background-color: #f2f2f2; }
      .logo { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; margin-bottom: 10px; }
      .center { text-align: center; }
    </style>
  </head>
  <body>

    <div class="center">
      ${student.logo && student.logo !== "SIN LOGO"
          ? `<img src="data:image/png;base64,${student.logo}" class="logo" />`
          : ""
        }

      <h1>Reporte de Estudiante</h1>
      <p><strong>Nombre:</strong> ${data.fullName}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Activo:</strong> ${data.active ? "Sí" : "No"}</p>
      <p><strong>Periodo:</strong> ${startDate} - ${endDate}</p>
    </div>

    <h2>Métricas</h2>
    <p><strong>Total de tareas:</strong> ${data.totalTasks}</p>
    <p><strong>Tareas por hacer:</strong> ${data.tasksToDo}</p>
    <p><strong>Tareas en proceso:</strong> ${data.tasksDoing}</p>
    <p><strong>Tareas completadas:</strong> ${data.tasksDone}</p>
    <p><strong>Promedio:</strong> ${data.averageGrade ?? "-"}</p>
    <p><strong>Entregas a tiempo:</strong> ${data.onTimePercentage != null ? data.onTimePercentage + "%" : "-"
        }</p>

    <h2>Historial de Tareas</h2>

    ${data.taskHistory && data.taskHistory.length
          ? `
        <table>
          <thead>
            <tr>
              <th>Tarea</th>
              <th>Estado</th>
              <th>Calificación</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            ${data.taskHistory.map(t => `
              <tr>
                <td>${t.taskName || "-"}</td>
                <td>${translateStatus(t.status)}</td>
                <td>${t.grade ?? "-"}</td>
                <td>${t.date || "-"}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
        `
          : "<p>No hay tareas registradas</p>"
        }

  </body>
</html>
`;

      const printWindow = window.open('', '_blank');
      printWindow.document.write(reportHTML);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();

    } catch (error) {
      console.error("Error generando reporte", error);
    }
  };

  return (
    <div>
      <SearchBarAddStudent setSearch={setSearch} onAddStudent={handleAddStudent} />
      <br />

      <div className="grid">
        {filteredStudents.map((student) => (
          <StudentToggleCard
            key={student.id}
            student={student}
            onToggle={handleToggleStatus}
            onOpen={setSelectedStudent}
          />
        ))}
      </div>

      <StudentDetailsModal
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
        onGenerateReport={handleGenerateReport}
      />

      <SearchStudentModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onStudentAdded={handleStudentAdded}
        onStudentNotFound={handleOpenRegister}
        students={students}
      />

      <AddStudent
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStudentCreated={handleStudentCreated}
      />

      <SuccessAlert
        isOpen={successConfig.isOpen}
        message={successConfig.message}
        onClose={() => setSuccessConfig({ isOpen: false, message: "" })}
      />

      <ConfirmAlert
        isOpen={confirmOpen}
        message={confirmMessage}
        onConfirm={confirmAction}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
};

export default StudentCardsToggleContainer;