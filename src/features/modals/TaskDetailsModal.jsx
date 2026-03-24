import { useState, useEffect } from "react";

const TaskDetailsModal = ({ task, advisors = [], onClose, onSave }) => {

  const [form, setForm] = useState({
    name: "",
    studentIDs: [],
    color: "",
    statusKanban: "",
    priority: "",
    startDate: "",
    limitDate: "",
    description: ""
  });

  useEffect(() => {
    if (task) {
      setForm({
        name: task.name || "",
        studentIDs: task.studentIDs || [],
        color: task.color || "#ffffff",
        statusKanban: task.statusKanban || "",
        priority: task.priority || "",
        startDate: task.startDate || "",
        limitDate: task.limitDate || "",
        description: task.description || ""
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleStudentChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions);
    const values = selectedOptions.map(option => Number(option.value));
    setForm({ ...form, studentIDs: values });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const dataToSend = {
      ...form,
      id: task.id 
    };

    onSave(dataToSend);
  };

  if (!task) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>

        <button className="close-x" onClick={onClose}>X</button>

        <header className="modal-header">
          <h3>Detalle de tarea</h3>
        </header>

        <form onSubmit={handleSubmit} className="task-form">

          {/* Nombre */}
          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          {/* Descripción */}
          <div className="form-group">
            <label>Descripción</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          {/* Status */}
          <div className="form-group">
            <label>Status</label>
            <select
              name="statusKanban"
              value={form.statusKanban}
              onChange={handleChange}
            >
              <option value="TODO">Por hacer</option>
              <option value="IN_PROGRESS">En proceso</option>
              <option value="DONE">Completado</option>
            </select>
          </div>

          {/* Prioridad */}
          <div className="form-group">
            <label>Prioridad</label>
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
            >
              <option value="LOW">Baja</option>
              <option value="MEDIUM">Media</option>
              <option value="HIGH">Alta</option>
            </select>
          </div>

          {/* Color */}
          <div className="form-group">
            <label>Color</label>
            <input
              type="color"
              value={form.color}
              onChange={(e) =>
                setForm({ ...form, color: e.target.value })
              }
            />
          </div>

          {/* Asignar */}
          <div className="form-group">
            <label>Asignar</label>
            <select
              multiple
              value={form.studentIDs}
              onChange={handleStudentChange}
              style={{ height: "100px" }}
            >
              {advisors.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.firstName} {student.lastName}
                </option>
              ))}
            </select>
          </div>

          {/* Fechas */}
          <div className="form-grid">
            <div className="form-group">
              <label>Inicio</label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Límite</label>
              <input
                type="date"
                name="limitDate"
                value={form.limitDate}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Botones */}
          <div className="form-footer">
            <button type="submit">Guardar cambios</button>
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default TaskDetailsModal;