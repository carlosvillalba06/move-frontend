import React, { useState } from "react";
import { registerAdvisorRequest } from "../../services/adminService";
const AddAdvisor = ({ isOpen, onClose, onAdvisorCreated }) => {
  if (!isOpen) return null;

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await registerAdvisorRequest(form);
      await onAdvisorCreated();
      alert("Asesor registrado correctamente");

      onClose(); 
    } catch (error) {
      console.error(error);
      alert("Error al registrar asesor");
    }
  };

  return (

        <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-x" onClick={onClose}>X</button>

        <h2>Registrar asesor</h2>

        <form onSubmit={handleSubmit}>
          <div className="grid-form">

            <div>
              <label>Nombre(s):</label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Apellidos:</label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Correo:</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
            </div>

          </div>

          <footer>
            <button type="submit">Registrar</button>
          </footer>

        </form>
      </div>
    </div>

  )

}

export default AddAdvisor;