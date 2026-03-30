import React, { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import userPlaceholder from "../../assets/userMOVE.png";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import DashboardSidebar from "../../components/DashboardSidebar";
import SuccessAlert from "../modals/SuccessAlert";
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

  const [nameForm, setNameForm] = useState({
    firstName: "",
    lastName: ""
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
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

          if (info.logoBase64) {
            setPreviewImage(`data:image/png;base64,${info.logoBase64}`);
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

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);

    try {
      await service.upload(file);
      setAlertMessage("Imagen actualizada correctamente");
      setAlertOpen(true);
    } catch (error) {
      console.error("Error subiendo imagen:", error);
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
      setEditingPassword(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: ""
      });

      setAlertMessage("Contraseña actualizada correctamente");
      setAlertOpen(true);
    } catch (error) {
      console.error("Error cambiando contraseña", error);
    }
  };

  return (
    <DashboardLayout sidebar={<DashboardSidebar role={role} />}>
      <div className="config-container">
        <h1>Configuración {role === "ADMIN" ? "Admin" : "Asesor"}</h1>

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
              variant="modal"
            />


            <Button variant="secondary" size="md" onClick={() => fileInputRef.current.click()}>
              Cambiar imagen
            </Button>
          </div>
        </section>

        <hr />

        <section className="config-section">
          <div className="section-header">
            <h2>Nombre</h2>
            {!editingName ? (

              <Button variant="secondary" size="md" onClick={() => setEditingName(true)}>
                Editar
              </Button>
            ) : (
              <Button variant="secondary" size="md" onClick={handleSaveName}>
                Guardar Cambios
              </Button>
            )}
          </div>

          <div className="input-field">
            <label>Nombre(s)</label>
            <Input
              type="text"
              name="firstName"
              value={nameForm.firstName}
              onChange={handleNameChange}
              disabled={!editingName}
              variant="modal"
              size="md" />


          </div>

          <div className="input-field">
            <label>Apellidos</label>
            <Input
              name="lastName"
              value={nameForm.lastName}
              onChange={handleNameChange}
              disabled={!editingName}
              variant="modal"
              size="md" />

          </div>
        </section>

        <hr />

        <section className="config-section">
          <div className="section-header">
            <h2>Seguridad</h2>
            {!editingPassword ? (
              <Button variant="secondary" size="md" onClick={() => setEditingPassword(true)}>
                Cambiar contraseña
              </Button>
            ) : (
              <Button variant="secondary" size="md" onClick={handleSavePassword}>
                Guardar Contraseña
              </Button>

            )}
          </div>

          <div className="input-field">
            <label>Correo</label>
            <Input type="email" value={user?.email || ""} readOnly variant="modal" size="md" />
          </div>

          {editingPassword && (
            <>
              <div className="input-field">
                <label>Contraseña actual</label>
                <Input
                  type="password"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  variant="modal"
                  size="md"
                />

              </div>

              <div className="input-field">
                <label>Nueva contraseña</label>
                <Input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  variant="modal"
                  size="md"
                />

              </div>
            </>
          )}
        </section>

        <div className="logout-wrapper">
          <Button variant="primary" size="lg" onClick={handleLogout}>
            Cerrar sesión
          </Button>

        </div>
      </div>

      <SuccessAlert
        isOpen={alertOpen}
        mensage={alertMessage}
        onClose={() => setAlertOpen(false)} />


    </DashboardLayout>

  );
};

export default Configuracion;