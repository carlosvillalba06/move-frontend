import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import Button from "../../components/Button";
import AuthLayout from "../../components/layouts/AuthLayout";
import { resetPasswordRequest } from "../../services/authService";
import SuccessAlert from "../modals/SuccessAlert";

const ForgotPasswordEmail = () => {

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

  const mapErrorMessage = (message) => {
    if (!message) return "Ocurrió un error";

    const msg = message.toLowerCase();

    if (msg.includes("user") && msg.includes("not")) {
      return "No existe una cuenta con este correo";
    }

    if (msg.includes("invalid")) {
      return "El correo no es válido";
    }

    if (msg.includes("verified")) {
      return "Este correo ya está verificado";
    }

    return message; 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      await resetPasswordRequest(email);

      localStorage.setItem("email", email);
      localStorage.setItem("processType", "reset");

      setShowAlert(true);

    } catch (err) {


      let message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Ocurrió un error";

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

          <h1>Recuperar contraseña</h1>

          <form className="login-form" onSubmit={handleSubmit}>

            <label className="label">Correo</label>

            <Input
              name="email"
              placeholder="Ingresa tu correo"
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

export default ForgotPasswordEmail;