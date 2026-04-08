import React, { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import userPlaceholder from "../../assets/userMOVE.png";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import DashboardSidebar from "../../components/DashboardSidebar";
import SuccessAlert from "../modals/successAlert";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { useAuth } from "../../services/authContext";

import {
  getAdminInformationRequest,
  uploadLogoRequest,
  updateAdminInformationRequest
} from "../../services/adminService";

import {
  getAdviserInformationRequest,
  uploadLogoAdviserRequest,
  updateAdviserInformationRequest
} from "../../services/adviserService";

import {
  resetPasswordRequest,
  verifyCodeRequest,
  setPasswordRequest
} from "../../services/authService";

const Configuracion = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const role = user?.rol;

  const [data, setData] = useState(null);
  const [previewImage, setPreviewImage] = useState(userPlaceholder);

  const fileInputRef = useRef(null);

  const [editingName, setEditingName] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);

  const [step, setStep] = useState(1); // 1: enviar código, 2: verificar, 3: nueva contraseña
  const [code, setCode] = useState("");

  const [nameForm, setNameForm] = useState({
    firstName: "",
    lastName: ""
  });

  const [passwordForm, setPasswordForm] = useState({
    newPassword: ""
  });

  const service = useMemo(() => {
    return role === "ADMIN"
      ? {
          getInfo: getAdminInformationRequest,
          upload: uploadLogoRequest,
          update: updateAdminInformationRequest
        }
      : {
          getInfo: getAdviserInformationRequest,
          upload: uploadLogoAdviserRequest,
          update: updateAdviserInformationRequest
        };
  }, [role]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const response = await service.getInfo();
        const info = response?.data || response;

        if (info) {
          setData(info);
          setNameForm({
            firstName: info.firstName || "",
            lastName: info.lastName || ""
          });

          if (info.logo) {
            setPreviewImage(`data:image/png;base64,${info.logo}`);
          }
        }
      } catch (error) {
        console.error("Error obteniendo información:", error);
      }
    };

    if (role) fetchInfo();
  }, [role, service]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);

      await service.upload(file);

      const response = await service.getInfo();
      const info = response?.data || response;

      if (info?.logo) {
        setPreviewImage(`data:image/png;base64,${info.logo}`);
      }

      setAlertMessage("Imagen actualizada correctamente");
      setAlertOpen(true);
      setData(info);

    } catch (error) {
      console.error("Error subiendo imagen:", error);
      setAlertMessage("Error al subir la imagen");
      setAlertOpen(true);
    }
  };

  const handleNameChange = (e) => {
    setNameForm({
      ...nameForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveName = async () => {
    try {
      await service.update(nameForm);

      setData((prev) => ({
        ...prev,
        firstName: nameForm.firstName,
        lastName: nameForm.lastName
      }));

      setEditingName(false);
      setAlertMessage("Nombre actualizado correctamente");
      setAlertOpen(true);

    } catch (error) {
      console.error("Error actualizando nombre", error);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSavePassword = async () => {
    try {
      const email = user?.email;

      if (step === 1) {
        await resetPasswordRequest(email);
        setAlertMessage("Código enviado al correo");
        setAlertOpen(true);
        setStep(2);
      }

      else if (step === 2) {
        await verifyCodeRequest(email, code);
        setAlertMessage("Código verificado");
        setAlertOpen(true);
        setStep(3);
      }

      else if (step === 3) {
        await setPasswordRequest(passwordForm.newPassword);

        setAlertMessage("Contraseña actualizada correctamente");
        setAlertOpen(true);

        setEditingPassword(false);
        setStep(1);
        setPasswordForm({ newPassword: "" });
        setCode("");
      }

    } catch (error) {
      console.error(error);
      setAlertMessage("Error en el proceso");
      setAlertOpen(true);
    }
  };

  return (
    <DashboardLayout sidebar={<DashboardSidebar role={role} />}>
      <div className="config-container">
        <h1>Configuración {role === "ADMIN" ? "Admin" : "Asesor"}</h1>

        {/* IMAGEN */}
        <section className="config-section">
          <h2>Imagen de perfil</h2>
          <div className="profile-edit">
            <img src={previewImage} alt="Perfil" className="profile-img" />

            <input
              type="file"
              ref={fileInputRef}
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />

            <Button
              variant="secondary"
              size="md"
              onClick={() => fileInputRef.current.click()}
            >
              Cambiar imagen
            </Button>
          </div>
        </section>

        <hr />

        {/* NOMBRE */}
        <section className="config-section">
          <div className="section-header">
            <h2>Nombre</h2>

            {!editingName ? (
              <Button onClick={() => setEditingName(true)}>Editar</Button>
            ) : (
              <Button onClick={handleSaveName}>Guardar Cambios</Button>
            )}
          </div>

          <Input
            name="firstName"
            value={nameForm.firstName}
            onChange={handleNameChange}
            disabled={!editingName}
          />

          <Input
            name="lastName"
            value={nameForm.lastName}
            onChange={handleNameChange}
            disabled={!editingName}
          />
        </section>

        <hr />

        {/* SEGURIDAD */}
        <section className="config-section">
          <div className="section-header">
            <h2>Seguridad</h2>

            {!editingPassword ? (
              <Button onClick={() => setEditingPassword(true)}>
                Cambiar contraseña
              </Button>
            ) : (
              <Button onClick={handleSavePassword}>
                {step === 1 && "Enviar código"}
                {step === 2 && "Verificar código"}
                {step === 3 && "Guardar contraseña"}
              </Button>
            )}
          </div>

          <Input type="email" value={user?.email || ""} readOnly />

          {editingPassword && (
            <>
              {step === 2 && (
                <Input
                  placeholder="Código de verificación"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              )}

              {step === 3 && (
                <Input
                  type="password"
                  name="newPassword"
                  placeholder="Nueva contraseña"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                />
              )}
            </>
          )}
        </section>

        <div className="logout-wrapper">
          <Button onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </div>
      </div>

      <SuccessAlert
        isOpen={alertOpen}
        message={alertMessage}
        onClose={() => setAlertOpen(false)}
      />
    </DashboardLayout>
  );
};

export default Configuracion;