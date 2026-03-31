import { useState, useEffect } from "react";
import Button from "../../components/Button";
import Input from "../../components/Input";

const TaskDetailsModal = ({ task, advisors = [], onClose, onSave }) => {

  const [form, setForm] = useState({
    name: "",
    studentIDs: [],
    color: "#ffffff",
    statusKanban: "",
    priority: "",
    startDate: "",
    limitDate: "",
    description: ""
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {

      const studentIDs = Array.isArray(task?.students)
        ? task.students
        : [];

      setForm({
        name: task.name || "",
        studentIDs,
        color: task.color || "#ffffff",
        statusKanban: task.statusKanban || "",
        priority: task.priority || "",
        limitDate: task.dateOfEnd
          ? task.dateOfEnd.split("T")[0]
          : "",
        description: task.notes || "" // 🔥 FIX
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value
    }));

    setErrors(prev => ({
      ...prev,
      [name]: ""
    }));
  };

  const handleStudentChange = (e) => {
    const values = Array.from(e.target.selectedOptions)
      .map(option => Number(option.value))
      .filter(v => !isNaN(v));

    setForm(prev => ({
      ...prev,
      studentIDs: values
    }));

    setErrors(prev => ({
      ...prev,
      studentIDs: ""
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "El nombre es obligatorio";
    if (!form.studentIDs.length) newErrors.studentIDs = "Debes asignar al menos un estudiante";
    if (!form.statusKanban) newErrors.statusKanban = "Selecciona un estado";
    if (!form.priority) newErrors.priority = "Selecciona una prioridad";
    if (!form.limitDate) newErrors.limitDate = "Fecha límite obligatoria";

    return newErrors;
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const data = {
      name: form.name,
      description: form.description?.trim() || "Sin descripción",
      statusKanban: form.statusKanban,
      color: form.color,
      priority: form.priority,
      limitDate: form.limitDate,
      studentIDs: form.studentIDs
    };

    console.log("DATA:", data);

    onSave(task.id, data);
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
          <div className="form-group row-align">
            <label>Nombre</label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
              variant="modal"
            />
          </div>

          {/* Estudiantes */}
          <div className="form-group row-align">
            <label>Asignar</label>
            <select
              className="input input-modal"
              multiple
              value={form.studentIDs}
              onChange={handleStudentChange}
              style={{ height: "80px", width: "380px" }}
            >
              {advisors.length === 0 ? (
                <option disabled>No hay estudiantes</option>
              ) : (
                advisors.map((student) => (
                  <option
                    key={student.studentID}
                    value={student.studentID}
                  >
                    {student.firstName} {student.lastName}
                  </option>
                ))
              )}
            </select>

            {errors.studentIDs && (
              <p className="error-message">{errors.studentIDs}</p>
            )}
          </div>

          {/* Color */}
          <div className="form-group row-align">
            <label>Color</label>
            <input
              type="color"
              value={form.color}
              onChange={(e) =>
                setForm(prev => ({ ...prev, color: e.target.value }))
              }
            />
          </div>

          {/* Status */}
          <div className="form-group">
            <label>Status</label>
            <select
              className="input input-modal"
              name="statusKanban"
              value={form.statusKanban}
              onChange={handleChange}
            >
              <option value="">Seleccionar</option>
              <option value="TODO">Por hacer</option>
              <option value="IN_PROGRESS">En progreso</option>
              <option value="DONE">Completado</option>
            </select>

            {errors.statusKanban && (
              <p className="error-message">{errors.statusKanban}</p>
            )}
          </div>

          {/* Prioridad */}
          <div className="form-group">
            <label>Prioridad</label>
            <select
              className="input input-modal"
              name="priority"
              value={form.priority}
              onChange={handleChange}
            >
              <option value="">Seleccionar</option>
              <option value="LOW">Baja</option>
              <option value="MEDIUM">Media</option>
              <option value="HIGH">Alta</option>
            </select>

            {errors.priority && (
              <p className="error-message">{errors.priority}</p>
            )}
          </div>

          {/* Fechas */}
          <div className="form-grid">
            <div className="form-group">
              <label>Límite</label>
              <Input
                type="date"
                name="limitDate"
                value={form.limitDate}
                onChange={handleChange}
                error={errors.limitDate}
              />
            </div>
          </div>

          {/* Descripción */}
          <div className="form-group">
            <label>Descripción</label>
            <textarea
              className="input input-modal"
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          {/* Botones */}
          <div className="form-footer">
            <Button variant="secondary" onClick={onClose}>
              Cancelar
            </Button>

            <Button variant="primary" type="submit">
              Guardar Cambios
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default TaskDetailsModal;