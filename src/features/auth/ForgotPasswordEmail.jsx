import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import Button from "../../components/Button";
import AuthLayout from "../../components/layouts/AuthLayout";
import { resetPasswordRequest } from "../../services/authService";

const ForgotPasswordEmail = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!validate()) return;

    try {

      setLoading(true);

      // Llama al endpoint del backend
      await resetPasswordRequest(email);

      // Guardar datos para el flujo
      localStorage.setItem("email", email);
      localStorage.setItem("processType", "reset");

      navigate("/verify-code");

    } catch (err) {

      setError(err.message || "Ocurrió un error");

    } finally {

      setLoading(false);

    }

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
            />

            {error && (
              <p className="error-message">{error}</p>
            )}

            <Button
              variant="primary"
              text={loading ? "Enviando..." : "Continuar"}
              type="submit"
              disabled={loading}
            />

          </form>

        </section>

      </main>

    </AuthLayout>
  );
};

export default ForgotPasswordEmail;