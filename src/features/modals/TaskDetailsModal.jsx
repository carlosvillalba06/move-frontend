import { useState, useEffect } from "react";
import Button from "../../components/Button";
import Input from "../../components/Input";

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

  const [errors, setErrors] = useState({});

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

    setErrors({
      ...errors,
      [name]: ""
    });
  };

  const handleStudentChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions);
    const values = selectedOptions.map(option => Number(option.value));

    setForm({ ...form, studentIDs: values });

    setErrors({
      ...errors,
      studentIDs: ""
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "El nombre es obligatorio";
    }

    if (form.studentIDs.length === 0) {
      newErrors.studentIDs = "Debes asignar al menos un estudiante";
    }

    if (!form.statusKanban) {
      newErrors.statusKanban = "Selecciona un estado";
    }

    if (!form.priority) {
      newErrors.priority = "Selecciona una prioridad";
    }

    if (!form.startDate) {
      newErrors.startDate = "Fecha inicio obligatoria";
    }

    if (!form.limitDate) {
      newErrors.limitDate = "Fecha límite obligatoria";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

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
          <div className="form-group row-align">
            <label>Nombre</label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
              variant="modal"
              size="md"
            />
          </div>

          {/* Asignar */}
          <div className="form-group row-align">
            <label>Asignar</label>
            <select
              className="input input-modal"
              multiple
              value={form.studentIDs}
              onChange={handleStudentChange}
              style={{ height: "60px", width: "380px" }}
            >
              {advisors.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.firstName} {student.lastName}
                </option>
              ))}
            </select>
            {errors.studentIDs && <p className="error-message">{errors.studentIDs}</p>}
          </div>

          {/* Color */}
          <div className="form-group row-align">
            <label>Color</label>
            <input style={{
              borderRadius: '10px',
              border: '10px',
              cursor: 'pointer'
            }}
              className="input-modal"
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
            {errors.statusKanban && <p className="error-message">{errors.statusKanban}</p>}
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
            {errors.priority && <p className="error-message">{errors.priority}</p>}
          </div>

          {/* Fechas */}
          <div className="form-grid">
            <div className="form-group">
              <label>Inicio</label>
              <Input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                error={errors.startDate}
                variant="modal"
              />
            </div>

            <div className="form-group">
              <label>Límite</label>
              <Input
                type="date"
                name="limitDate"
                value={form.limitDate}
                onChange={handleChange}
                error={errors.limitDate}
                variant="modal"
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
            <Button variant="secondary" size="md" onClick={onClose}>
              Cancelar
            </Button>

            <Button variant="primary" size="md" type="submit">
              Guardar Cambios
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default TaskDetailsModal;