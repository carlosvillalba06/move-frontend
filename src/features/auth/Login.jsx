import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Input from "../../components/Input";
import InputPassword from "../../components/Input-password";
import Button from "../../components/Button";
import AuthLayout from "../../components/layouts/AuthLayout";
import { useAuth } from "../../services/authContext";

const Login = () => {

  const navigate = useNavigate();
  const { login, session } = useAuth();

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    setErrors(prev => ({
      ...prev,
      [name]: ""
    }));

    setServerError("");
  };

  const validate = () => {

    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      newErrors.email = "El correo es obligatorio";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Ingresa un correo válido";
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!validate()) return;

    try {

      setLoading(true);
      setServerError("");

      const success = await login(
        formData.email,
        formData.password
      );

      if (!success) {
        setServerError("Credenciales incorrectas");
        return;
      }

      // leer sesión guardada
      const storedSession = JSON.parse(localStorage.getItem("session"));
      const role = storedSession?.user?.rol?.toLowerCase();

      if (role === "admin") navigate("/admin/dashboard");
      else if (role === "advisor") navigate("/advisor/dashboard");
      else navigate("/dashboard");

    } catch (err) {

      setServerError("Error al iniciar sesión");

    } finally {

      setLoading(false);

    }

  };

  return (

    <AuthLayout>

      <main className="login-container">

        <section className="login-box">

          <h1>Iniciar sesión</h1>

          <form className="login-form" onSubmit={handleSubmit}>

            <div>
              <label className="label">Correo</label>

              <Input
                name="email"
                placeholder="Correo"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />
            </div>

            <div>

              <label className="label">Contraseña</label>

              <InputPassword
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
              />

            </div>

            <p>
              <Link to="/forgot-password">
                ¿Olvidaste tu contraseña?
              </Link>
            </p>

            {serverError && (
              <p className="error-message">
                {serverError}
              </p>
            )}

            <Button
              variant="primary"
              text={loading ? "Iniciando sesión..." : "Iniciar sesión"}
              type="submit"
              disabled={loading}
            />

            <p>
              <Link to="/register">
                Crear cuenta
              </Link>
            </p>

          </form>

        </section>

      </main>

    </AuthLayout>

  );

};

export default Login;
