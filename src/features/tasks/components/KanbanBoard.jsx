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

      setTasks(Array.isArray(tasksRes?.data || tasksRes) ? tasksRes?.data || tasksRes : []);
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
      await updateTaskStatusRequest(taskId, newStatus);
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, statusKanban: newStatus } : t));
    } catch (error) {}
  };

  const handleUpdateTask = async (id, formData) => {
    try {
      await updateTaskRequest(id, formData);
      await loadData();
      setAlertMessage("Tarea actualizada correctamente");
      setAlertOpen(true);
    } catch (error) {}
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTaskRequest(id);
      await loadData();
      setAlertMessage("Tarea eliminada correctamente");
      setAlertOpen(true);
    } catch (error) {}
  };

  // SOLO PDF DEL DTO
  const handleGenerateProjectReport = async (startDate, endDate) => {
    try {
      setIsReportModalOpen(false);
      if (!startDate || !endDate) {
        setAlertMessage("Selecciona ambas fechas");
        setAlertOpen(true);
        return;
      }

      const res = await getAdviserReportRequest(startDate, endDate);
      const report = res?.data || res;
      const { totalStudents, totalTasks, tasksToDo, tasksDoing, tasksDone, averageGrade, taskDetailReportDto } = report;

      const reportHTML = `
        <html>
          <head>
            <title>Reporte de Proyecto</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; color: #000; }
              h1 { text-align: center; }
              h2 { margin-top: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 10px; }
              th, td { border: 1px solid #333; padding: 6px; text-align: left; }
              th { background-color: #000; color: #fff; }
            </style>
          </head>
          <body>
            <h1>Reporte de Proyecto</h1>
            <h2>Resumen</h2>
            <p><strong>Periodo:</strong> ${startDate} - ${endDate}</p>
            <p><strong>Total de estudiantes:</strong> ${totalStudents}</p>
            <p><strong>Total de tareas:</strong> ${totalTasks}</p>
            <p><strong>Tareas por hacer:</strong> ${tasksToDo}</p>
            <p><strong>Tareas en progreso:</strong> ${tasksDoing}</p>
            <p><strong>Tareas completadas:</strong> ${tasksDone}</p>
            <p><strong>Promedio de calificaciones:</strong> ${averageGrade ?? "N/A"}</p>

            <h2>Detalle de Tareas</h2>
            ${taskDetailReportDto?.length
              ? `<table>
                  <thead>
                    <tr>
                      <th>Tarea</th><th>Estado</th><th>Responsable</th><th>Calificación</th><th>Comentarios</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${taskDetailReportDto.map(t => `
                      <tr>
                        <td>${t.name || "Tarea"}</td>
                        <td>${t.status}</td>
                        <td>${t.studentName || "N/A"}</td>
                        <td>${t.grade ?? "-"}</td>
                        <td>${t.feedback ?? "-"}</td>
                      </tr>
                    `).join("")}
                  </tbody>
                </table>`
              : "<p>No hay tareas registradas</p>"
            }
          </body>
        </html>
      `;

      const win = window.open("", "_blank");
      win.document.write(reportHTML);
      win.document.close();
      win.focus();
      win.print();
      win.close();
    } catch (error) {
      setAlertMessage("Error al generar el reporte");
      setAlertOpen(true);
    }
  };

  return (
    <main style={{ padding: "20px" }}>
      <header style={{ textAlign: "center", marginBottom: "20px" }}>
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