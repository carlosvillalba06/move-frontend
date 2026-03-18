AddTask.jsx
const AddTask = ({ }) => {

return (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <button className="close-x" onClick={onClose}>X</button>

      <h3 className="name-Asesor">Ocampo Vargas Ricardo Naul</h3>

      <form onSubmit={handleSubmit} className="task-form">
        {/* Nombre de la tarea */}
        <div className="form-row">
          <input
            type="text"
            className="input-main-title"
            value={form.nameTask}
            onChange={handleChange}
            name="nameTask"
          />
        </div>

        {/* Asignación */}
        <div className="form-row assignment-container">
          <div className="btn-asignar-badge">
            <span className="icon">👤+</span> Asignar
          </div>
          <input 
            type="text" 
            className="input-assigned-name" 
            value="Carlos Giovanni Villaba González" 
            readOnly 
          />
        </div>

        {/* Selector de Etiquetas (Colores) */}
        <div className="form-row tag-selection">
          <span className="icon-tag">🏷️</span>
          <select 
            className={select-tag-color ${form.tagColor}} 
            name="tagColor"
            value={form.tagColor}
            onChange={handleChange}
          >
            <option value="bg-lima">Lima</option>
            <option value="bg-azul">Azul</option>
            <option value="bg-rojo">Rojo</option>
            <option value="bg-naranja">Naranja</option>
          </select>
        </div>

        {/* Grid de 2 columnas */}
        <div className="form-grid-columns">
          <div className="input-group">
            <label>Depósito</label>
            <select name="deposito" onChange={handleChange}><option value=""></option></select>
          </div>
          <div className="input-group">
            <label>Prioridad</label>
            <select name="prioridad" onChange={handleChange}><option value=""></option></select>
          </div>
          <div className="input-group">
            <label>Fecha de inicio</label>
            <div className="date-input-wrapper">
              <input type="text" placeholder="Inicia en cualquier momento" />
              <span className="calendar-icon">📅</span>
            </div>
          </div>
          <div className="input-group">
            <label>Fecha de vencimiento</label>
            <div className="date-input-wrapper">
              <input type="text" placeholder="Vence en cualquier momento" />
              <span className="calendar-icon">📅</span>
            </div>
          </div>
        </div>

        {/* Notas */}
        <div className="form-row">
          <label className="label-block">Notas</label>
          <textarea className="textarea-custom" name="notas" rows="4"></textarea>
        </div>

        {/* Footer */}
        <div className="form-footer-action">
          <div className="attachments">
            <label>Datos adjuntos</label>
            <button type="button" className="btn-attachment-add">Agrega datos adjuntos</button>
          </div>
          <button type="submit" className="btn-submit-save">Guardar</button>
        </div>
      </form>
    </div>
  </div>
);

};