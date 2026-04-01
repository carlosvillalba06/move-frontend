import { useState } from "react";
import { useAuth } from "./../../services/authContext";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Select from 'react-select';

const AddTask = ({ onClose, advisors = [], onSave }) => {

  const [form, setForm] = useState({
    name: "",
    studentIDs: [],
    color: "#ffffff",
    statusKanban: "",
    priority: "",
    startDate: "",
    limitDate: "",
    description: "",
    files: []
  });

  const [errors, setErrors] = useState({});
  const { user: authUser } = useAuth();

  const studentOptions = advisors.map(student => ({
    value: student.studentID,
    label: `${student.firstName} ${student.lastName}`
  }));

  const selectedValues = studentOptions.filter(opt =>
    form.studentIDs.includes(opt.value)
  );

  const handleSelectChange = (selectedOptions) => {
    const values = selectedOptions ? selectedOptions.map(opt => opt.value) : [];
    setForm({ ...form, studentIDs: values });
    setErrors({ ...errors, studentIDs: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, files: Array.from(e.target.files) });
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "El nombre es obligatorio";
    if (form.studentIDs.length === 0) newErrors.studentIDs = "Debes asignar al menos un estudiante";
    if (!form.statusKanban) newErrors.statusKanban = "Selecciona un estado";
    if (!form.priority) newErrors.priority = "Selecciona una prioridad";
    if (!form.startDate) newErrors.startDate = "Fecha inicio obligatoria";
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

    const dataToSend = new FormData();

    dataToSend.append("name", form.name);
    dataToSend.append("description", form.description || "");
    dataToSend.append("color", form.color || "");
    dataToSend.append("priority", form.priority || "");
    dataToSend.append("startDate", form.startDate);
    dataToSend.append("limitDate", form.limitDate);

    form.studentIDs.forEach((id) => {
      dataToSend.append("studentIDs", id);
    });

    form.files.forEach((file) => {
      dataToSend.append("files", file);
    });

    onSave(dataToSend);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>

        <button className="close-x" onClick={onClose}>X</button>

        <header className="modal-header">
          <h3>{authUser?.firstName} {authUser?.lastName}</h3>
        </header>

        <form onSubmit={handleSubmit} className="task-form">

          {/* Nombre */}
          <div className="form-group row-align">
            <label>Nombre:</label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
              variant="modal"
            />
          </div>

          {/* Asignar alumnos con React Select */}
          <div className="form-group row-align">
            <label>Asignar</label>
            <div style={{ width: "380px" }}>
              <Select
                isMulti
                options={studentOptions}
                value={selectedValues}
                onChange={handleSelectChange}
                placeholder="Seleccionar estudiantes..."
                noOptionsMessage={() => "No hay estudiantes"}
                classNamePrefix="react-select"
              />
              {errors.studentIDs && (
                <p className="error-message">{errors.studentIDs}</p>
              )}
            </div>
          </div>

          {/* Color */}
          <div className="form-group row-align">
            <label>Color</label>
            <input
              type="color"
              value={form.color}
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
            {errors.statusKanban && (
              <p className="error-message">{errors.statusKanban}</p>
            )}
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
            {errors.priority && (
              <p className="error-message">{errors.priority}</p>
            )}
          </div>

          {/* Fechas */}
          <div className="form-grid">
            <div className="form-group">
              <label>Fecha inicio</label>
              <Input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                error={errors.startDate}
              />
            </div>

            <div className="form-group">
              <label>Fecha límite</label>
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
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          {/* Archivos */}
          <div className="form-footer">
            <input
              type="file"
              multiple
              onChange={handleFileChange}
            />

            <Button type="submit">
              Guardar
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddTask;