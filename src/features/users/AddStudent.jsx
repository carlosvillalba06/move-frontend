import React, { useState } from "react";
import { registerStudentRequest } from "../../services/adviserService";

const AddStudent = ({ isOpen, onClose, onStudentCreated }) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: ""
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await registerStudentRequest(form);
      await onStudentCreated();
      setForm({
        firstName: "",
        lastName: "",
        email: ""
      });
      onClose();
    } catch (error) {
      console.error("Error al registrar estudiante:", error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-x" onClick={onClose}>X</button>

        <h2>Registrar estudiante</h2>

        <form onSubmit={handleSubmit}>
          <div className="grid-form">
            <div>
              <label>Nombre(s):</label>
              <input
                type="text"
                name="firstName"
                placeholder="Ej. Carlos Giovanni"
                value={form.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Apellidos:</label>
              <input
                type="text"
                name="lastName"
                placeholder="Ej. Villalba González"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ gridColumn: "span 2" }}>
              <label>Correo institucional:</label>
              <input
                type="email"
                name="email"
                placeholder="usuario@utez.edu.mx"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <footer>
            <button type="submit">Registrar</button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default AddStudent;