import { useState, useEffect } from "react";
import Select from "react-select";
import Button from "../../components/Button";
import Input from "../../components/Input";
import ConfirmAlert from "../modals/ConfirmAlert";
import SuccessAlert from "../modals/SuccessAlert";

const TaskDetailsModal = ({ task, advisors = [], onClose, onSave }) => {

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

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

  console.log("TAREA EN DETALLE:", task);
  const [removedFiles, setRemovedFiles] = useState([]); 
  const [errors, setErrors] = useState({});

  const studentOptions = advisors.map(student => ({
    value: student.studentID,
    label: `${student.firstName} ${student.lastName}`
  }));

  const selectedStudents = studentOptions.filter(opt => 
    form.studentIDs.includes(opt.value)
  );

  useEffect(() => {
    if (task) {
      const studentIDs = Array.isArray(task?.students)
        ? task.students.filter(id => id !== undefined && id !== null)
        : [];

      setForm({
        name: task.name || "",
        studentIDs,
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

  const handleSelectChange = (selectedOptions) => {
    const values = selectedOptions ? selectedOptions.map(opt => opt.value) : [];
    
    setForm(prev => ({
      ...prev,
      studentIDs: values
    }));

    setErrors(prev => ({
      ...prev,
      studentIDs: ""
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    setForm(prev => ({
      ...prev,
      files
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

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: file.fileType });

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
    formData.append("description", form.description?.trim() || "Sin descripción");
    formData.append("statusKanban", form.statusKanban);
    formData.append("color", form.color);
    formData.append("priority", form.priority);
    formData.append("limitDate", form.limitDate);

    form.studentIDs.forEach(id => {
      formData.append("studentIDs", String(id));
    });

    form.files.forEach(file => {
      formData.append("files", file);
    });

    removedFiles.forEach(id => {
      formData.append("removedFiles", id);
    });

    onSave(task.id, formData);

    setConfirmOpen(false);
    setAlertMessage("Tarea actualizada correctamente");
    setAlertOpen(true);
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

          <div className="form-group row-align">
            <label>Asignar</label>
            <div style={{ width: "380px" }}>
              <Select
                isMulti
                options={studentOptions}
                value={selectedStudents}
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
          </div>

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
          </div>

          <div className="form-group">
            <label>Límite</label>
            <Input
              type="date"
              name="limitDate"
              value={form.limitDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Subir nuevos archivos</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
            />
          </div>

          {task.files?.length > 0 && (
            <div className="form-group">
              <label>Archivos actuales</label>

              {task.files
                .filter(file => !removedFiles.includes(file.id))
                .map(file => (
                  <div
                    key={file.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "5px"
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => previewFile(file)}
                      style={{
                        color: "blue",
                        textDecoration: "underline",
                        background: "none",
                        border: "none",
                        cursor: "pointer"
                      }}
                    >
                      {file.fileName}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveExistingFile(file.id)}
                      style={{
                        color: "red",
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        fontWeight: "bold"
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
            </div>
          )}

          <div className="form-group">
            <label>Descripción</label>
            <textarea
              className="input input-modal"
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
        message="¿Seguro que quieres guardar los cambios?"
        onConfirm={handleConfirmSave}
        onCancel={() => setConfirmOpen(false)}
      />

      <SuccessAlert
        isOpen={alertOpen}
        mensage={alertMessage}
        onClose={() => setAlertOpen(false)}
      />
    </div>
  );
};

export default TaskDetailsModal;