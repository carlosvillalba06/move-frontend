import React, { useState } from "react";
import { registerAdvisorRequest } from "../../services/adminService";
import Button from "../../components/Button";
import Input from "../../components/Input";

const AddAdvisor = ({ isOpen, onClose, onAdvisorCreated }) => {

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
    } else if (!form.email.includes("@")) {
      newErrors.email = "Correo inválido";
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
      await registerAdvisorRequest(form);
      await onAdvisorCreated();

      setForm({
        firstName: "",
        lastName: "",
        email: ""
      });

      setErrors({});
      onClose();
    } catch (error) {
      console.error(error);
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
              <Input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                error={errors.firstName}
                placeholder="Ej. Juan"
                variant="modal"
                size="md"
              />
            </div>

            <div>
              <label>Apellidos:</label>
              <Input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                error={errors.lastName}
                placeholder="Ej. Pérez López"
                variant="modal"
                size="md"
              />
            </div>

            <div style={{ gridColumn: "span 2" }}>
              <label>Correo:</label>
              <Input
                name="email"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="correo@empresa.com"
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

export default AddAdvisor;