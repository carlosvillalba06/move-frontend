import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerRequest } from "../../services/authService";
import Input from "../../components/Input";
import Button from "../../components/Button";
import AuthLayout from "../../components/layouts/AuthLayout";
import SuccessAlert from "../modals/SuccessAlert";

const RegisterEmail = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError("");
  };

  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      setError("Ingresa tu correo");
      return false;
    }

    if (!emailRegex.test(email)) {
      setError("Ingresa un correo válido");
      return false;
    }

    return true;
  };


  const cleanErrorMessage = (message) => {
    if (!message) return "Ocurrió un error";

    const parts = message.split(/(?<=\bverified\b)/i);

    // Elimina duplicados
    const unique = [...new Set(parts)];

    return unique.join(" ").trim();
  };

  const mapErrorMessage = (message) => {

  const msg = message.toLowerCase();

  if (msg.includes("already been verified")) {
    return "Este correo ya tiene una cuenta registrada";
  }

  if (msg.includes("user already exists")) {
    return "Este correo ya está registrado";
  }

  if (msg.includes("invalid email")) {
    return "El correo no es válido";
  }

  if (msg.includes("user not found")) {
    return "Este correo no está registrado";
  }

  return message;
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      await registerRequest(email);

      localStorage.setItem("email", email);
      localStorage.setItem("processType", "register");

      setShowAlert(true);

    } catch (err) {

      let message = err.message || "Ocurrió un error";

      message = cleanErrorMessage(message);
      message = mapErrorMessage(message);

      setError(message);

    } finally {
      setLoading(false);
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    navigate("/verify-code");
  };

  return (
    <AuthLayout>
      <main className="login-container">

        <section className="login-box">

          <h1>Registrarte</h1>

          <form className="login-form" onSubmit={handleSubmit}>

            <label className="label">Correo</label>

            <Input
              name="email"
              placeholder="Correo"
              value={email}
              onChange={handleChange}
              error={error}
              variant="login"
              size="full"
            />


            <br />
            <br />

            <Button
              variant="primary"
              size="full"
              type="submit"
              disabled={loading}
            >
              {loading ? "Enviando..." : "Continuar"}
            </Button>

          </form>

        </section>

        <SuccessAlert
          isOpen={showAlert}
          message="El código se ha enviado a tu correo"
          onClose={handleCloseAlert}
        />

      </main>
    </AuthLayout>
  );
};

export default RegisterEmail;