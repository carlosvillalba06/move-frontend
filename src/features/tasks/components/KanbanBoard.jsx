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
          <label style={{ fontWeight: "bold" }}>Desde:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc", marginTop: "5px" }}
            />
          </label>
          <label style={{ fontWeight: "bold" }}>Hasta:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc", marginTop: "5px" }}
            />
          </label>
        </div>

        <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "10px" }}>
          <Button variant="primary" onClick={() => onGenerate(startDate, endDate)}>Generar</Button>
          <Button variant="secundary" onClick={onClose}>Cancelar</Button>
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

  const loadData = useCallback(async () => {
    try {
      let tasksRes;
      let studentsRes = [];

      if (isAdminView && adviserId) {
        tasksRes = await getTasksByAdviserRequest(adviserId);
      } else {
        tasksRes = await getTasksRequest();
        studentsRes = await getAllStudentsRequest();
      }

      const rawTasks = tasksRes?.data || tasksRes || [];

      const normalizedTasks = rawTasks.map(t => ({
        ...t,
        statusKanban: statusAdapter.toFrontend(t.statusKanban)
      }));

      setTasks(Array.isArray(normalizedTasks) ? normalizedTasks : []);
      setStudents(Array.isArray(studentsRes?.data || studentsRes) ? studentsRes?.data || studentsRes : []);

    } catch (error) {
      setAlertMessage("Error cargando datos");
      setAlertOpen(true);
    }
  }, [adviserId, isAdminView]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateTask = async (form) => {
    try {
      await addTaskRequest(isAdminView ? { ...form, adviserId } : form);
      await loadData();
      setAlertMessage("Tarea creada correctamente");
      setAlertOpen(true);
    } catch (error) {
      setAlertMessage("Error al crear la tarea");
      setAlertOpen(true);
    }
  };

  const handleMoveTask = async (taskId, newStatus) => {
    try {
      const backendStatus = statusAdapter.toBackend(newStatus);
      await updateTaskStatusRequest(taskId, backendStatus);

      setTasks(prev =>
        prev.map(t =>
          t.id === taskId
            ? { ...t, statusKanban: newStatus }
            : t
        )
      );
    } catch (error) {
      setAlertMessage("Error al mover tarea");
      setAlertOpen(true);
    }
  };

  const handleUpdateTask = async (id, formData) => {
    try {
      await updateTaskRequest(id, formData);
      await loadData();
      setAlertMessage("Tarea actualizada correctamente");
      setAlertOpen(true);
    } catch (error) { }
  };

  const handleDeleteTask = async (id) => {
    setAlertMessage("Los asesores no tienen permisos para eliminar tareas");
    setAlertOpen(true);
    return; 
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
        setAlertMessage("Selecciona ambas fechas");
        setAlertOpen(true);
        return;
      }

      const res = await getAdviserReportRequest(startDate, endDate, adviserId);
      const report = res?.data || res;
      
      const { totalStudents, totalTasks, tasksToDo, tasksDoing, tasksDone, averageGrade, taskDetailReportDto } = report;

      const formatDate = (date) => {
        if (!date) return "-";
        const d = new Date(date);
        return d.toLocaleDateString();
      };

      const reportHTML = `
        <html>
          <head>
            <title>Reporte de Proyecto</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 30px; color: #333; }
              h1 { text-align: center; margin-bottom: 10px; }
              h2 { margin-top: 30px; border-bottom: 2px solid #000; padding-bottom: 5px; }
              .summary p { margin: 5px 0; font-size: 14px; }
              .summary b { display: inline-block; width: 180px; }
              table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 13px; }
              th, td { border: 1px solid #000; padding: 8px; text-align: center; }
              th { background-color: #000; color: #fff; }
              tr:nth-child(even) { background-color: #f5f5f5; }
              .no-data { margin-top: 10px; font-style: italic; color: #666; }
              .footer { margin-top: 40px; text-align: right; font-size: 12px; color: #888; }
            </style>
          </head>
          <body>
            <h1>Reporte de Proyecto</h1>
            <div class="summary">
              <h2>Resumen</h2>
              <p><b>Periodo:</b> ${startDate} - ${endDate}</p>
              <p><b>Total estudiantes:</b> ${totalStudents ?? 0}</p>
              <p><b>Total tareas:</b> ${totalTasks ?? 0}</p>
              <p><b>Por hacer:</b> ${tasksToDo ?? 0}</p>
              <p><b>En proceso:</b> ${tasksDoing ?? 0}</p>
              <p><b>Completadas:</b> ${tasksDone ?? 0}</p>
              <p><b>Promedio:</b> ${averageGrade ?? "N/A"}</p>
            </div>
            <h2>Detalle de tareas</h2>
            ${taskDetailReportDto?.length ? `
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
                  ${taskDetailReportDto.map(t => `
                    <tr>
                      <td>${t.taskName || "-"}</td>
                      <td>${translateStatus(t.status) || "-"}</td>
                      <td>${t.studentName || "-"}</td>
                      <td>${t.grade ?? "-"}</td>
                      <td>${formatDate(t.date)}</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            ` : `<p class="no-data">No hay datos en este periodo</p>`}
            <div class="footer">Generado automáticamente</div>
          </body>
        </html>
      `;

      const win = window.open("", "_blank");
      win.document.write(reportHTML);
      win.document.close();
      win.focus();
      setTimeout(() => {
        win.print();
        win.close();
      }, 500);
    } catch (error) {
      setAlertMessage("Error al generar el reporte");
      setAlertOpen(true);
    }
  };

  return (
    <main style={{ padding: "20px" }}>
      <header style={{ textAlign: "right", marginBottom: "30px", marginRight: "20px" }}>
        <Button variant="primary" onClick={() => setIsReportModalOpen(true)}>
          Generar Reporte por Proyecto
        </Button>
      </header>

      <section className="kanban-board" style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
        <KanbanColumn
          title="Por hacer"
          status="TODO"
          tasks={tasks}
          advisors={students}
          onCreateTask={handleCreateTask}
          onMoveTask={handleMoveTask}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
        />

        <KanbanColumn
          title="En proceso"
          status="IN_PROGRESS"
          tasks={tasks}
          advisors={students}
          onCreateTask={handleCreateTask}
          onMoveTask={handleMoveTask}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
        />

        <KanbanColumn
          title="Completado"
          status="DONE"
          tasks={tasks}
          advisors={students}
          onCreateTask={handleCreateTask}
          onMoveTask={handleMoveTask}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
        />
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