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
      body {
        font-family: Arial, sans-serif;
        background: #f4f4f4;
        margin: 0;
        padding: 20px;
        color: #222;
      }

      .container {
        max-width: 900px;
        margin: auto;
        background: #fff;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      }

      .header {
        text-align: center;
        border-bottom: 2px solid #ddd;
        padding-bottom: 15px;
        margin-bottom: 20px;
      }

      .logo {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        object-fit: cover;
        margin-bottom: 10px;
      }

      .header h1 {
        margin: 10px 0 5px;
        color: #111;
      }

      .info {
        color: #555;
        font-size: 14px;
      }

      .section-title {
        margin-top: 25px;
        margin-bottom: 10px;
        color: #111;
        border-left: 4px solid #333;
        padding-left: 10px;
      }

      .stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 15px;
        margin: 20px 0;
      }

      .card {
        background: #fafafa;
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 15px;
        text-align: center;
      }

      .card h3 {
        margin: 0;
        font-size: 13px;
        color: #777;
      }

      .card p {
        font-size: 20px;
        margin: 5px 0 0;
        font-weight: bold;
        color: #111;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 15px;
      }

      th {
        background: #222;
        color: #fff;
        padding: 10px;
        font-size: 13px;
      }

      td {
        padding: 10px;
        border-bottom: 1px solid #ddd;
        font-size: 13px;
        text-align: center;
      }

      tr:nth-child(even) {
        background: #f9f9f9;
      }

      .no-data {
        text-align: center;
        color: #777;
        margin-top: 15px;
      }
    </style>
  </head>

  <body>
    <div class="container">

      <div class="header">
        ${student.logo && student.logo !== "SIN LOGO"
          ? `<img src="data:image/png;base64,${student.logo}" class="logo" />`
          : ""
        }

        <h1>Reporte de Estudiante</h1>
        <div class="info">${data.fullName}</div>
        <div class="info">${data.email}</div>
        <div class="info">Activo: ${data.active ? "Sí" : "No"}</div>
        <div class="info">Periodo: ${startDate} - ${endDate}</div>
      </div>

      <div class="section-title">Métricas</div>

      <div class="stats">
        <div class="card">
          <h3>Total tareas</h3>
          <p>${data.totalTasks ?? 0}</p>
        </div>

        <div class="card">
          <h3>Por hacer</h3>
          <p>${data.tasksToDo ?? 0}</p>
        </div>

        <div class="card">
          <h3>En proceso</h3>
          <p>${data.tasksDoing ?? 0}</p>
        </div>

        <div class="card">
          <h3>Completadas</h3>
          <p>${data.tasksDone ?? 0}</p>
        </div>

        <div class="card">
          <h3>Promedio</h3>
          <p>${data.averageGrade ?? "-"}</p>
        </div>

        <div class="card">
          <h3>Entregas a tiempo</h3>
          <p>${data.onTimePercentage != null ? data.onTimePercentage + "%" : "-"}</p>
        </div>
      </div>

      <div class="section-title">Historial de Tareas</div>

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
          : `<p class="no-data">No hay tareas registradas</p>`
        }

    </div>
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