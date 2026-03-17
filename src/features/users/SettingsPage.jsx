import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import userPlaceholder from "../../assets/userMOVE.png";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import DashboardSidebar from "../../components/DashboardSidebar";

import { useAuth } from "../../services/authContext";
import {
  getAdminInformationRequest,
  uploadLogoRequest
} from "../../services/adminService";

const Configuracion = () => {

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const role = user?.rol;

  const [adminData, setAdminData] = useState(null);
  const [previewImage, setPreviewImage] = useState(userPlaceholder);

  const fileInputRef = useRef(null);

  // estados edición
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

  const handleLogout = () => {   
    logout();
    navigate("/login");
  };

  // cargar información admin
  useEffect(() => {

    const fetchAdminInfo = async () => {

      try {

        const response = await getAdminInformationRequest();
        const data = response?.data || response;

        if (data) {

          setAdminData(data);

          setNameForm({
            firstName: data.firstName || "",
            lastName: data.lastName || ""
          });

          if (data.logoBase64) {
            setPreviewImage(`data:image/png;base64,${data.logoBase64}`);
          }
        }

      } catch (error) {
        console.error("Error obteniendo información del admin:", error);
      }
    };

    if (role === "ADMIN") {
      fetchAdminInfo();
    }

  }, [role]);

  // cambiar imagen
  const handleImageChange = async (e) => {

    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };

    reader.readAsDataURL(file);

    try {

      await uploadLogoRequest(file);

    } catch (error) {
      console.error("Error subiendo logo:", error);
    }

  };

  // cambiar inputs nombre
  const handleNameChange = (e) => {

    setNameForm({
      ...nameForm,
      [e.target.name]: e.target.value
    });

  };

  // guardar nombre
  const handleSaveName = async () => {

    try {

      // aquí llamarías tu endpoint
      // await updateAdminNameRequest(nameForm);

      setAdminData(prev => ({
        ...prev,
        firstName: nameForm.firstName,
        lastName: nameForm.lastName
      }));

      setEditingName(false);

    } catch (error) {
      console.error("Error actualizando nombre", error);
    }

  };

  // cambiar contraseña
  const handlePasswordChange = (e) => {

    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });

  };

  const handleSavePassword = async () => {

    try {

      // await changePasswordRequest(passwordForm)

      setEditingPassword(false);

      setPasswordForm({
        currentPassword: "",
        newPassword: ""
      });

    } catch (error) {
      console.error("Error cambiando contraseña", error);
    }

  };

  return (

    <DashboardLayout sidebar={<DashboardSidebar role={role} />}>

      <div className="config-container">

        <h1>Configuración</h1>

        {/* PERFIL */}

        <section className="config-section">

          <h2>Imagen de perfil</h2>

          <div className="profile-edit">

            <img
              src={previewImage}
              alt="Perfil"
              className="profile-img"
            />

            <input
              type="file"
              ref={fileInputRef}
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />

            <button
              className="text-btn"
              onClick={() => fileInputRef.current.click()}
            >
              Cambiar imagen
            </button>

          </div>

        </section>

        <hr />

        {/* NOMBRE */}

        <section className="config-section">

          <div className="section-header">

            <h2>Nombre</h2>

            {!editingName ? (

              <button
                className="text-btn"
                onClick={() => setEditingName(true)}
              >
                Editar
              </button>

            ) : (

              <button
                className="text-btn"
                onClick={handleSaveName}
              >
                Guardar cambios
              </button>

            )}

          </div>

          <div className="input-field">

            <label>Nombre(s)</label>

            <input
              type="text"
              name="firstName"
              value={nameForm.firstName}
              onChange={handleNameChange}
              disabled={!editingName}
            />

          </div>

          <div className="input-field">

            <label>Apellidos</label>

            <input
              type="text"
              name="lastName"
              value={nameForm.lastName}
              onChange={handleNameChange}
              disabled={!editingName}
            />

          </div>

        </section>

        <hr />

        {/* SEGURIDAD */}

        <section className="config-section">

          <div className="section-header">

            <h2>Seguridad</h2>

            {!editingPassword ? (

              <button
                className="text-btn"
                onClick={() => setEditingPassword(true)}
              >
                Cambiar contraseña
              </button>

            ) : (

              <button
                className="text-btn"
                onClick={handleSavePassword}
              >
                Guardar contraseña
              </button>

            )}

          </div>

          <div className="input-field">

            <label>Correo</label>

            <input
              type="email"
              value={user?.email || ""}
              readOnly
            />

          </div>

          {editingPassword && (

            <>
              <div className="input-field">

                <label>Contraseña actual</label>

                <input
                  type="password"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                />

              </div>

              <div className="input-field">

                <label>Nueva contraseña</label>

                <input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                />

              </div>
            </>

          )}

        </section>

        {/* LOGOUT */}

        <div className="logout-wrapper">

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>

        </div>

      </div>

    </DashboardLayout>

  );
};

export default Configuracion;