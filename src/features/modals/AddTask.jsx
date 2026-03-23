import { useState } from "react";
import { useAuth } from "./../../services/authContext";

const AddTask = ({ onClose, advisors = [], onSave }) => {

  const [form, setForm] = useState({
    name: "",
    studentIDs: [],
    color: "",
    statusKanban: "",
    priority: "",
    startDate: "",
    limitDate: "",
    description: "",
    files: []
  });

  const { user: authUser } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleStudentChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions);
    const values = selectedOptions.map(option => Number(option.value));

    setForm({ ...form, studentIDs: values });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, files: e.target.files });
  };

  console.log("advisors en modal:", advisors);
  const handleSubmit = (e) => {
    e.preventDefault();

    const dataToSend = new FormData();

    dataToSend.append("name", form.name);
    dataToSend.append("description", form.description);
    dataToSend.append("color", form.color);
    dataToSend.append("priority", form.priority);
    dataToSend.append("startDate", form.startDate);
    dataToSend.append("limitDate", form.limitDate);

    form.studentIDs.forEach((id) => {
      dataToSend.append("studentIDs", id);
    });

    if (form.files && form.files.length > 0) {
      Array.from(form.files).forEach((file) => {
        dataToSend.append("files", file);
      });
    }

    onSave(dataToSend);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>

        <header className="modal-header">
          <h3>{authUser?.firstName} {authUser?.lastName}</h3>
        </header>

        <form onSubmit={handleSubmit} className="task-form">

          {/* Nombre */}
          <div className="form-group row-align">
            <label>Nombre:</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Asignar */}
          <div className="form-group row-align">
            <label>Asignar</label>
            <select
              multiple
              value={form.studentIDs}
              onChange={handleStudentChange}
              style={{ height: "120px" }}
            >
              {advisors.length === 0 ? (
                <option disabled>No hay estudiantes</option>
              ) : (
                advisors.map((student) => (
                  <option
                    key={student.id || student.email}
                    value={student.id}
                  >
                    {student.firstName || ""} {student.lastName || ""}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Color */}
          <div className="form-group row-align">
            <label>Color</label>
            <input
              type="color"
              value={form.color || "#ffffff"}
              onChange={(e) =>
                setForm({ ...form, color: e.target.value })
              }
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
              <option value="">Seleccionar</option>
              <option value="TODO">Por hacer</option>
              <option value="IN_PROGRESS">En progreso</option>
              <option value="DONE">Hecho</option>
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
              <option value="">Seleccionar</option>
              <option value="LOW">Baja</option>
              <option value="MEDIUM">Media</option>
              <option value="HIGH">Alta</option>
            </select>
          </div>

          {/* Fechas */}
          <div className="form-grid">
            <div className="form-group">
              <label>Fecha inicio</label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Fecha límite</label>
              <input
                type="date"
                name="limitDate"
                value={form.limitDate}
                onChange={handleChange}
              />
            </div>
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

          {/* Archivos */}
          <div className="form-footer">
            <input type="file" multiple onChange={handleFileChange} />
            <button type="submit">Guardar</button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddTask;