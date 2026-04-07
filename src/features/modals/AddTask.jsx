import { useState } from "react";
import { useAuth } from "./../../services/authContext";
import Button from "../../components/Button";
import Input from "../../components/Input";
import StudentMultiSelect from "../../components/StudentMultiSelect";

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

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [errors, setErrors] = useState({});
  const { user: authUser } = useAuth();

  const handleSelectChange = (ids) => {
    const cleanIds = ids.map(Number); 

    setForm(prev => ({
      ...prev,
      studentIDs: cleanIds
    }));

    setErrors(prev => ({
      ...prev,
      studentIDs: ""
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setForm(prev => ({
      ...prev,
      files: [...prev.files, ...newFiles]
    }));
    e.target.value = null;
  };

  const removeFile = (index) => {
    setForm(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const previewLocalFile = (file) => {
    const url = URL.createObjectURL(file);
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "El nombre es obligatorio";
    if (!form.studentIDs.length) newErrors.studentIDs = "Debes asignar al menos un estudiante";
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
    dataToSend.append("color", form.color || "#ffffff");
    dataToSend.append("priority", form.priority);
    dataToSend.append("startDate", form.startDate);
    dataToSend.append("limitDate", form.limitDate);

    dataToSend.append("studentIDs", JSON.stringify(form.studentIDs));

    console.log("studentIDs:", form.studentIDs);
    console.log("TIPOS:", form.studentIDs.map(x => typeof x));
    console.log("JSON:", JSON.stringify(form.studentIDs));

    form.files.forEach((file) => {
      dataToSend.append("files", file);
    });

    onSave(dataToSend);

    ;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-x" onClick={onClose}>X</button>

        <header className="modal-header">
          <h3>Nueva Tarea - {authUser?.firstName} {authUser?.lastName}</h3>
        </header>

        <form onSubmit={handleSubmit} className="task-form">

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

          <div className="form-group row-align">
            <label>Asignar</label>
            <div style={{ width: "380px" }}>
              <StudentMultiSelect
                students={advisors}
                selected={form.studentIDs}
                onChange={handleSelectChange}
              />
              {errors.studentIDs && (
                <p className="error-message">{errors.studentIDs}</p>
              )}
            </div>
          </div>

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

          <div className="form-group">
            <label>Descripción</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Subir nuevos archivos</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              style={{ marginBottom: "10px" }}
            />

            {form.files.length > 0 && (
              <div className="file-list-container">
                {form.files.map((file, index) => (
                  <div key={index} style={{ display: "flex", justifyContent: "space-between" }}>
                    <button type="button" onClick={() => previewLocalFile(file)}>
                      {file.name}
                    </button>
                    <button type="button" onClick={() => removeFile(index)}>
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-footer">
            <Button variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Guardar Tarea</Button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddTask;