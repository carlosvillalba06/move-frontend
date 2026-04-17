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
    priority: "",
    startDate: (() => {
      const d = new Date();
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    })(),
    limitDate: "",
    description: "",
    files: []
  });

  const [errors, setErrors] = useState({});
  const { user: authUser } = useAuth();

  const activeAdvisors = advisors.filter(advisor => advisor.statusAdviserStudent === true);

  const handleSelectChange = (ids) => {
    const cleanIds = ids.map(Number);
    setForm(prev => ({ ...prev, studentIDs: cleanIds }));
    setErrors(prev => ({ ...prev, studentIDs: "" }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);

    const validFiles = [];
    const invalidFiles = [];

    newFiles.forEach(file => {
      const isImage = file.type.startsWith("image/");
      const isPDF = file.type === "application/pdf";

      if (isImage || isPDF) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file.name);
      }
    });

    if (invalidFiles.length > 0) {
  setErrors(prev => ({
    ...prev,
    files: "Solo se permiten imágenes o archivos PDF"
  }));
}

    setForm(prev => ({
      ...prev,
      files: [...prev.files, ...validFiles]
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

    const dataToSend = new FormData();
    dataToSend.append("name", form.name);
    dataToSend.append("description", form.description || "");
    dataToSend.append("color", form.color || "#ffffff");
    dataToSend.append("priority", form.priority);
    dataToSend.append("startDate", form.startDate);
    dataToSend.append("limitDate", form.limitDate);
    dataToSend.append("studentIDs", JSON.stringify(form.studentIDs));

    form.files.forEach((file) => {
      dataToSend.append("files", file);
    });

    onSave(form, dataToSend);
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
              variant="modal"
              size="md"
              name="name"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
            />
          </div>

          <div className="form-group row-align">
            <label>Asignar</label>
            <div style={{ width: "380px" }}>
              <StudentMultiSelect
                students={activeAdvisors}
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

          <div className="form-grid">
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
              {errors.priority && <p className="error-message">{errors.priority}</p>}
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Fecha inicio</label>
              <Input
                variant="modal"
                size="md"
                type="date"
                name="startDate"
                value={form.startDate}
                readOnly
                style={{ backgroundColor: "#f0f0f0", cursor: "not-allowed" }}
              />
            </div>

            <div className="form-group">
              <label>Fecha límite</label>
              <Input
                variant="modal"
                size="md"
                type="date"
                name="limitDate"
                value={form.limitDate}
                onChange={handleChange}
                error={errors.limitDate}
                min={form.startDate}
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
            <label>Subir archivos</label>
            <div className="file-input-wrapper">
              <input
                id="file-upload"
                type="file"
                multiple
                accept="application/pdf, image/*"
                className="file-input-hidden"
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload" className="file-input-label">
                {form.files.length > 0
                  ? `${form.files.length} seleccionados`
                  : "Adjuntar archivos"}
              </label>
            </div>
          </div>

          {form.files.length > 0 && (
            <div className="file-list-container" style={{ marginTop: "10px" }}>
              {form.files.map((file, index) => (
                <div key={index} style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                  <button type="button" className="btn-file-preview" onClick={() => previewLocalFile(file)}>
                    {file.name}
                  </button>
                  <button type="button" onClick={() => removeFile(index)} style={{ border: "none", background: "none", cursor: "pointer" }}>
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

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