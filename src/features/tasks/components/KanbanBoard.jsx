import React, { useEffect, useState, useCallback } from "react";
import KanbanColumn from "./KanbanColumn";
import SuccessAlert from "../../modals/SuccessAlert";
import Button from "../../../components/Button";

import {
  getTasksRequest,
  addTaskRequest,
  updateTaskStatusRequest,
  deleteTaskRequest,
  updateTaskRequest,
  getAllStudentsRequest,
  getAdviserReportRequest
} from "../../../services/adviserService";

import { getTasksByAdviserRequest } from "../../../services/adminService";
import { getAdviserReportByAdminRequest } from "../../../services/adminService";
import { statusAdapter } from "../../../services/utils/statusAdapter";

const ReportDateModal = ({ isOpen, onClose, onGenerate }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center",
      justifyContent: "center", zIndex: 1000
    }}>
      <div style={{
        background: "#fff", padding: "25px 30px", borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)", width: "350px"
      }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Generar Reporte</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <label><b>Desde:</b>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </label>

          <label><b>Hasta:</b>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </label>
        </div>

        <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "10px" }}>
          <Button variant="primary" onClick={() => onGenerate(startDate, endDate)}>
            Generar
          </Button>

          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
};

const KanbanBoard = ({ adviserId, isAdminView = false }) => {
  const [tasks, setTasks] = useState([]);
  const [students, setStudents] = useState([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const permissions = {
    canCreate: !isAdminView,
    canEdit: !isAdminView,
    canDelete: !isAdminView,
    canMove: !isAdminView,
    canView: true,
    canGenerateReport: true
  };

  const showAlert = (message) => {
    setAlertMessage(message);
    setAlertOpen(true);
  };

  const loadData = useCallback(async () => {
    try {
      let tasksRes;
      let studentsRes = null;

      if (isAdminView && adviserId) {
        tasksRes = await getTasksByAdviserRequest(adviserId);
      } else {
        tasksRes = await getTasksRequest();
        studentsRes = await getAllStudentsRequest();
      }

      const rawTasks = tasksRes?.data || tasksRes || [];
      console.log("Tareas crudas recibidas:", rawTasks);

      const normalizedTasks = Array.isArray(rawTasks)
        ? rawTasks.map(t => ({
          ...t,
          statusKanban: statusAdapter.toFrontend(t.statusKanban)
        }))
        : [];

      setTasks(normalizedTasks);

      const studentsData = studentsRes?.data || studentsRes || [];
      setStudents(Array.isArray(studentsData) ? studentsData : []);

    } catch {
      showAlert("Error cargando datos");
    }
  }, [adviserId, isAdminView]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateTask = async (form) => {
    if (!permissions.canCreate) {
      showAlert("No puedes crear tareas porque eres administrador");
      return;
    }

    try {
      await addTaskRequest(isAdminView ? { ...form, adviserId } : form);
      await loadData();
      showAlert("Tarea creada correctamente");
    } catch {
      showAlert("Error al crear la tarea");
    }
  };

  const handleMoveTask = async (taskId, newStatus) => {
    if (!permissions.canMove) {
      showAlert("No puedes mover tareas porque eres administrador");
      return;
    }

    try {
      await updateTaskStatusRequest(taskId, newStatus);

      setTasks(prev =>
        prev.map(t =>
          t.id === taskId ? { ...t, statusKanban: newStatus } : t
        )
      );
    } catch {
      showAlert("Error al mover tarea");
    }
  };

  const handleUpdateTask = async (id, formData) => {
    if (!permissions.canEdit) {
      showAlert("No puedes editar tareas porque eres administrador");
      return;
    }

    try {
      await updateTaskRequest(id, formData);
      await loadData();
      showAlert("Tarea actualizada correctamente");
    } catch {
      showAlert("Error al actualizar tarea");
    }
  };

  const handleDeleteTask = async (id) => {
    if (!permissions.canDelete) {
      showAlert("No puedes eliminar tareas porque eres administrador");
      return;
    }

    try {
      await deleteTaskRequest(id);
      await loadData();
      showAlert("Tarea eliminada correctamente");
    } catch {
      showAlert("Error al eliminar la tarea");
    }
  };

  const translateStatus = (status) => {
    if (status === "TODO") return "Por hacer";
    if (status === "IN_PROGRESS") return "En proceso";
    if (status === "DONE") return "Completado";
    return status;
  };

  const handleGenerateProjectReport = async (startDate, endDate) => {
    try {
      setIsReportModalOpen(false);

      if (!startDate || !endDate) {
        showAlert("Selecciona ambas fechas");
        return;
      }

      let res;

      if (isAdminView) {
        res = await getAdviserReportByAdminRequest(adviserId, startDate, endDate);
      } else {
        res = await getAdviserReportRequest(startDate, endDate, adviserId);
      }

      const report = res?.data || res || {};
      

      const {
        totalStudents,
        totalTasks,
        tasksToDo,
        tasksDoing,
        tasksDone,
        averageGrade,
        taskDetailReportDto
      } = report;

      const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString();
      };

      const win = window.open("", "_blank");

      if (!win) {
        showAlert("Permite ventanas emergentes");
        return;
      }

      win.document.write(`
  <html>
    <head>
      <title>Reporte</title>
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
          border-bottom: 2px solid #ddd;
          margin-bottom: 20px;
          padding-bottom: 10px;
        }

        .header h1 {
          margin: 0;
          color: #111;
        }

        .period {
          color: #666;
          font-size: 14px;
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
          font-size: 14px;
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
          margin-top: 20px;
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
          margin-top: 20px;
        }
      </style>
    </head>

    <body>
      <div class="container">
        
        <div class="header">
          <h1>Reporte de Proyecto</h1>
          <div class="period">Periodo: ${startDate} - ${endDate}</div>
        </div>

        <div class="stats">
          <div class="card">
            <h3>Total estudiantes</h3>
            <p>${totalStudents ?? 0}</p>
          </div>

          <div class="card">
            <h3>Total tareas</h3>
            <p>${totalTasks ?? 0}</p>
          </div>

          <div class="card">
            <h3>Promedio</h3>
            <p>${averageGrade ?? "N/A"}</p>
          </div>

          <div class="card">
            <h3>Por hacer</h3>
            <p>${tasksToDo ?? 0}</p>
          </div>

          <div class="card">
            <h3>En proceso</h3>
            <p>${tasksDoing ?? 0}</p>
          </div>

          <div class="card">
            <h3>Completadas</h3>
            <p>${tasksDone ?? 0}</p>
          </div>
        </div>

        ${taskDetailReportDto?.length
          ? `
            <table>
              <thead>
                <tr>
                  <th>Tarea</th>
                  <th>Estado</th>
                  <th>Estudiante</th>
                  <th>Calificación</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                ${taskDetailReportDto.map(t => 
                  `
                  

                  <tr>
                    <td>${t.taskName || "-"}</td>
                   <td>${translateStatus(statusAdapter.toFrontend(t.status))}</td>
                    <td>${t.studentName || "-"}</td>
                    <td>${t.grade ?? "-"}</td>
                    <td>${formatDate(t.date)}</td>
                    
                  </tr>
                `).join("")}
              </tbody>
            </table>
          `
          : `<p class="no-data">No hay datos</p>`
        }

      </div>
    </body>
  </html>
`);
      win.document.close();
      win.focus();
      setTimeout(() => {
        win.print();
        win.close();
      }, 500);

    } catch {
      showAlert("Error al generar el reporte");
    }
  };

  return (
    <main style={{ padding: "20px" }}>
      <header style={{ textAlign: "right", marginBottom: "30px" }}>
        <Button variant="primary" onClick={() => setIsReportModalOpen(true)}>
          Generar Reporte por Proyecto
        </Button>
      </header>

      <section style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
        {["TODO", "IN_PROGRESS", "DONE"].map(status => (
          <KanbanColumn
            key={status}
            title={translateStatus(status)}
            status={status}
            tasks={tasks}
            advisors={students}
            onCreateTask={handleCreateTask}
            onMoveTask={handleMoveTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            isReadOnly={isAdminView}
          />
        ))}
      </section>

      <ReportDateModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onGenerate={handleGenerateProjectReport}
      />

      <SuccessAlert
        isOpen={alertOpen}
        message={alertMessage}
        onClose={() => setAlertOpen(false)}
      />
    </main>
  );
};

export default KanbanBoard; 