import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyCodeRequest } from "../../services/authService";
import CodeInput from "../../components/CodeInput";
import Button from "../../components/Button";
import AuthLayout from "../../components/layouts/AuthLayout";

const VerifyCode = () => {

  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleComplete = (value) => {
    setCode(value);
    setError("");
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (code.length !== 6) {
      setError("Ingresa el código completo");
      return;
    }

    try {

      setLoading(true);

      const email = localStorage.getItem("resetEmail");
      const processType = localStorage.getItem("processType");

      await verifyCodeRequest(email, code);

      if (processType === "register") {
        navigate("/set-password");
      } else {
        navigate("/reset-password");
      }

    } catch (err) {

      setError(err.message || "Código incorrecto");

    } finally {

      setLoading(false);

    }

  };

  return (
    <AuthLayout>

      <main className="login-container">

        <section className="login-box">

          <h1>Verificar código</h1>

          <p>Ingresa el código enviado a tu correo</p>

          <form onSubmit={handleSubmit}>

            <CodeInput length={6} onComplete={handleComplete} />

            {error && (
              <p className="error-message">{error}</p>
            )}

            <Button
              variant="primary"
              text={loading ? "Verificando..." : "Verificar"}
              type="submit"
              disabled={loading}
            />

          </form>

        </section>

      </main>

    </AuthLayout>
  );
};

export default VerifyCode;