import { useState, useEffect } from "react";
import StudentMultiSelect from "../../components/StudentMultiSelect";
import Button from "../../components/Button";
import Input from "../../components/Input";
import ConfirmAlert from "./ConfirmAlert";

const TaskDetailsModal = ({ task, advisors = [], onClose, onSave }) => {

  const [confirmOpen, setConfirmOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    studentIDs: [],
    color: "#ffffff",
    statusKanban: "",
    priority: "",
    limitDate: "",
    description: "",
    files: []
  });

  const [removedFiles, setRemovedFiles] = useState([]);
  const [errors, setErrors] = useState({});

  const normalizeIds = (arr) => (arr || []).map(Number);

  useEffect(() => {
    if (task) {

      const parsedStudents = (task.students || []).map(s =>
        typeof s === "object" ? Number(s.studentID || s.id) : Number(s)
      );

      setForm({
        name: task.name || "",
        studentIDs: normalizeIds(parsedStudents),
        color: task.color || "#ffffff",
        statusKanban: task.statusKanban || "",
        priority: task.priority || "",
        limitDate: task.dateOfEnd || "",
        description: task.notes || "",
        files: []
      });

      setRemovedFiles([]);
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

  const handleSelectChange = (ids) => {
    const cleanIds = normalizeIds(ids);

    setForm(prev => ({
      ...prev,
      studentIDs: cleanIds
    }));

    setErrors(prev => ({
      ...prev,
      studentIDs: ""
    }));
  };

  const handleFileChange = (e) => {
    setForm(prev => ({
      ...prev,
      files: Array.from(e.target.files)
    }));
  };

  const handleRemoveExistingFile = (fileId) => {
    setRemovedFiles(prev => [...prev, fileId]);
  };

  const previewFile = (file) => {
    try {
      const byteCharacters = atob(file.file);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const blob = new Blob(
        [new Uint8Array(byteNumbers)],
        { type: file.fileType }
      );

      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");

    } catch (error) {
      console.error("Error al abrir archivo:", error);
    }
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

    setConfirmOpen(true);
  };

  const handleConfirmSave = () => {
    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("description", form.description || "");
    formData.append("statusKanban", form.statusKanban);
    formData.append("color", form.color);
    formData.append("priority", form.priority);
    formData.append("limitDate", form.limitDate);

    formData.append("studentIDs", JSON.stringify(form.studentIDs));

    console.log("UPDATE studentIDs:", form.studentIDs);
    console.log("TIPOS:", form.studentIDs.map(x => typeof x));
    console.log("JSON:", JSON.stringify(form.studentIDs));

    form.files.forEach(file => {
      formData.append("files", file);
    });

    removedFiles.forEach(id => {
      formData.append("removedFiles", id);
    });

    onSave(task.id, formData);

    setConfirmOpen(false);
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

          <div className="form-group">
            <label>Asignar estudiantes</label>

            <StudentMultiSelect
              students={advisors}
              selected={form.studentIDs}
              onChange={handleSelectChange}
            />

            {errors.studentIDs && (
              <p className="error-message">{errors.studentIDs}</p>
            )}
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
              <option value="DONE">Completado</option>
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

          <div className="form-group">
            <label>Fecha límite</label>
            <Input
              type="date"
              name="limitDate"
              value={form.limitDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Subir nuevos archivos</label>
            <input type="file" multiple onChange={handleFileChange} />
          </div>

          {task.files?.length > 0 && (
            <div className="form-group">
              <label>Archivos actuales</label>

              {task.files
                .filter(file => !removedFiles.includes(file.id))
                .map(file => (
                  <div key={file.id} style={{ display: "flex", justifyContent: "space-between" }}>
                    <button type="button" onClick={() => previewFile(file)}>
                      {file.fileName}
                    </button>

                    <button type="button" onClick={() => handleRemoveExistingFile(file.id)}>
                      ✕
                    </button>
                  </div>
                ))}
            </div>
          )}

          <div className="form-group">
            <label>Descripción</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </div>

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

      <ConfirmAlert
        isOpen={confirmOpen}
        message="¿Deseas guardar los cambios?"
        onConfirm={handleConfirmSave}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
};

export default TaskDetailsModal;