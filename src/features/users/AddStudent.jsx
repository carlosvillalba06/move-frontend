import React, { useState } from "react";
import { registerStudentRequest } from "../../services/adviserService";
import Button from "../../components/Button";
import Input from "../../components/Input";

const AddStudent = ({ isOpen, onClose, onStudentCreated }) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: ""
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

    setErrors({
      ...errors,
      [e.target.name]: ""
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!form.firstName.trim()) {
      newErrors.firstName = "El nombre es obligatorio";
    }

    if (!form.lastName.trim()) {
      newErrors.lastName = "Los apellidos son obligatorios";
    }

    if (!form.email.trim()) {
      newErrors.email = "El correo es obligatorio";
    } 

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await registerStudentRequest(form);
      await onStudentCreated();

      setForm({
        firstName: "",
        lastName: "",
        email: ""
      });

      setErrors({});
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
              <Input
                name="firstName"
                placeholder="Ej. Carlos Giovanni"
                value={form.firstName}
                onChange={handleChange}
                error={errors.firstName}
                variant="modal"
                size="md"
              />
            </div>

            <div>
              <label>Apellidos:</label>
              <Input
                name="lastName"
                placeholder="Ej. Villalba González"
                value={form.lastName}
                onChange={handleChange}
                error={errors.lastName}
                variant="modal"
                size="md"
              />
            </div>

            <div style={{ gridColumn: "span 2" }}>
              <label>Correo institucional:</label>
              <Input
                name="email"
                placeholder="usuario@utez.edu.mx"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
                variant="modal"
                size="md"
              />
            </div>

          </div>

          <footer>
            <Button variant="primary" size="sm" type="submit">
              Registrar
            </Button>
          </footer>

        </form>
      </div>
    </div>
  );
};

export default AddStudent;