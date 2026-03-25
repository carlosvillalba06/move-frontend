import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerRequest } from "../../services/authService";
import Input from "../../components/Input";
import Button from "../../components/Button";
import AuthLayout from "../../components/layouts/AuthLayout";

const RegisterEmail = () => {

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

      await registerRequest(email);
      localStorage.setItem("email", email);
      localStorage.setItem("processType", "register");
      navigate("/verify-code");

    } catch (err) {

      setError(err.message);

    } finally {

      setLoading(false);

    }

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

            {error && (
              <p className="error-message">{error}</p>
            )}

            <br />
            <br />
            <Button variant="primary" size="full" type="submit">
              Continuar
            </Button>

          </form>

        </section>

      </main>

    </AuthLayout>
  );
};

export default RegisterEmail;