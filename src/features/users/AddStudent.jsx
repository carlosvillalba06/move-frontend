import React, { useState, useEffect } from "react";
import { registerStudentRequest, addStudentToBoardRequest } from "../../services/adviserService";
import Button from "../../components/Button";
import Input from "../../components/Input";

const AddStudent = ({ isOpen, onClose, onStudentCreated, defaultEmail }) => {

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (defaultEmail) {
      setForm(prev => ({
        ...prev,
        email: defaultEmail
      }));
    }
  }, [defaultEmail]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });

    setErrors({
      ...errors,
      [name]: ""
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

    setLoading(true);

    try {
      const studentData = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim()
      };

      await registerStudentRequest(studentData);

      await addStudentToBoardRequest(studentData.email);

      await onStudentCreated(studentData);

      setForm({
        firstName: "",
        lastName: "",
        email: ""
      });

      setErrors({});
      onClose();

    } catch (error) {
      setErrors({
        email: error.message || "Error al registrar"
      });
    } finally {
      setLoading(false);
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
                value={form.firstName}
                onChange={handleChange}
                error={errors.firstName}
              />
            </div>

            <div>
              <label>Apellidos:</label>
              <Input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                error={errors.lastName}
              />
            </div>

            <div style={{ gridColumn: "span 2" }}>
              <label>Correo:</label>
              <Input
                name="email"
                value={form.email}
                readOnly
              />
            </div>

          </div>

          <footer>
            <Button type="submit">
              {loading ? "Registrando..." : "Registrar"}
            </Button>
          </footer>

        </form>
      </div>
    </div>
  );
};

export default AddStudent;