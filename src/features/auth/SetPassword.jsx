import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import AuthLayout from "../../components/layouts/AuthLayout";
import { setPasswordRequest } from "../../services/authService";
import Input from "../../components/Input";

const SetPassword = () => {

  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setErrors({ ...errors, password: "" });
    setFormError("");
  };

  const handleConfirmChange = (e) => {
    setConfirmPassword(e.target.value);
    setErrors({ ...errors, confirmPassword: "" });
    setFormError("");
  };

  const validate = () => {

    const newErrors = {};

    if (!password && !confirmPassword) {
      setFormError("Ingresa tu contraseña");
      return false;
    }

    if (!password) {
      newErrors.password = "La contraseña es obligatoria";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirma tu contraseña";
    }

    if (password && confirmPassword && password !== confirmPassword) {
      setFormError("Las contraseñas no coinciden");
      return false;
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!validate()) return;

    try {

      await setPasswordRequest(password);

      localStorage.removeItem("email");
      localStorage.removeItem("processType");
      localStorage.removeItem("passwordToken");

      navigate("/login");

    } catch (err) {

      setFormError(err.message);

    }

  };

  return (
    <AuthLayout>
      <main className="login-container">

        <section className="login-box">

          <h1>Establecer tu contraseña</h1>

          <form className="login-form" onSubmit={handleSubmit}>

            <div>

              <label className="label">Contraseña</label>

              <Input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={password}
                onChange={handlePasswordChange}
                error={errors.password}
                variant="login"
                size="full"
              />

            </div>

            <div>

              <label className="label">Confirmar contraseña</label>

              <Input
                type="password"
                name="confirmPassword"
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                onChange={handleConfirmChange}
                error={errors.confirmPassword}
                variant="login"
                size="full"
              />

            </div>

            {formError && (
              <p className="error-message">{formError}</p>
            )}

            <br />
            <br />

            <Button variant="primary" size="full" type="submit">
              Registrarte
            </Button>

          </form>

        </section>

      </main>
    </AuthLayout>
  );
};

export default SetPassword;