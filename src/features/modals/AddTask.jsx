import { useState } from "react";

const AddTask = ({ onClose, user, advisors = [], colorsFromBackend = [], onSave }) => {
  const [form, setForm] = useState({
    nameTask: "",
    assignedTo: "",
    tagColor: "",
    deposito: "",
    prioridad: "",
    fechaInicio: "",
    fechaFin: "",
    notas: "",
    archivos: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, archivos: e.target.files });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSend = new FormData();
    Object.keys(form).forEach((key) => {
      if (key === "archivos") {
        Array.from(form.archivos).forEach((file) => dataToSend.append("files", file));
      } else {
        dataToSend.append(key, form[key]);
      }
    });
    onSave(dataToSend);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h3 className="user-title">{user?.name || "Ocampo Vargas Ricardo Naul"}</h3>
        </header>

        <form onSubmit={handleSubmit} className="task-form">
          {/* Nombre de la tarea */}
          <div className="form-group row-align">
            <label>Nombre:</label>
            <input
              type="text"
              name="nameTask"
              className="input-underline"
              value={form.nameTask}
              onChange={handleChange}
            />
          </div>

          {/* Asignación */}
          <div className="form-group row-align">
            <div className="icon-label-dark">
               <span className="material-icons"></span> Asignar
            </div>
            <select
              name="assignedTo"
              className="input-underline select-custom"
              value={form.assignedTo}
              onChange={handleChange}
            >
              <option value="">Seleccionar estudiante</option>
              {advisors?.map((adv) => (
                <option key={adv.id} value={adv.id}>{adv.name}</option>
              ))}
            </select>
          </div>

          {/* Etiqueta y Color */}
          <div className="form-group row-align">
            <div className="icon-label-dark">
               <span className="material-icons">Color</span>
            </div>
            <div className="tag-control-container">
               <div className="tag-preview" style={{ backgroundColor: form.tagColor || '#eee' }}>
                  {form.tagColor ? 'Color' : 'Lima'}
               </div>
               <input
                type="color"
                className="color-input-hidden"
                value={form.tagColor || "#ffffff"}
                onChange={(e) => setForm({ ...form, tagColor: e.target.value })}
              />
            </div>
          </div>

          {/* Grid de Depósito y Prioridad */}
          <div className="form-grid">
            <div className="form-group">
              <label>Depósito</label>
              <select name="deposito" value={form.deposito} onChange={handleChange}>
                <option value="">Seleccionar</option>
                <option value="POR_HACER">Por hacer</option>
              </select>
            </div>
            <div className="form-group">
              <label>Prioridad</label>
              <select name="prioridad" value={form.prioridad} onChange={handleChange}>
                <option value="">Seleccionar</option>
                <option value="MEDIA">Media</option>
              </select>
            </div>
          </div>

          {/* Grid de Fechas */}
          <div className="form-grid">
            <div className="form-group">
              <label>Fecha de inicio</label>
              <input type="date" name="fechaInicio" value={form.fechaInicio} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Fecha de vencimiento</label>
              <input type="date" name="fechaFin" value={form.fechaFin} onChange={handleChange} />
            </div>
          </div>

          {/* Notas */}
          <div className="form-group">
            <label>Notas</label>
            <textarea name="notas" value={form.notas} onChange={handleChange} />
          </div>

          {/* Footer */}
          <div className="form-footer">
            <div className="file-upload">
              <label htmlFor="file-input" className="file-label">Datos adjuntos</label>
              <input id="file-input" type="file" multiple onChange={handleFileChange} />
              <div className="file-hint">Agrega datos adjuntos</div>
            </div>
            <button type="submit" className="btn-save">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTask;