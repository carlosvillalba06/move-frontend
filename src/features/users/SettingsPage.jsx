import React, { useContext } from "react";
import userPlaceholder from "../../assets/userMOVE.png";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import DashboardSidebar from "../../components/DashboardSidebar";
import { useAuth } from "../../services/authContext";

const Configuracion = () => {
    
    const { user } = useAuth();
    const role = user?.rol;

    return (
        <DashboardLayout sidebar={<DashboardSidebar role={role}/>}>
            <div className="config-container">
                <h1>Configuración</h1>

                <section className="config-section">
                    <h2>Imagen de perfil</h2>
                    <div className="profile-edit">
                        <img
                            src={userPlaceholder}
                            alt="Perfil"
                            className="profile-img"
                        />
                        <button className="text-btn">Cambiar imagen</button>
                    </div>
                </section>

                <hr />

                <section className="config-section">
                    <div className="section-header">
                        <h2>Nombre</h2>
                        <button className="text-btn">Editar</button>
                    </div>

                    <div className="input-field">
                        <label>Nombre(s)</label>
                        {/* Si tu backend no envía nombre aún, puedes dejar un string vacío o un fallback */}
                        <input type="text" defaultValue={user?.nombre || ""} />
                    </div>

                    <div className="input-field">
                        <label>Apellidos</label>
                        <input type="text" defaultValue={user?.apellidos || ""} />
                    </div>
                </section>

                <hr />

                <section className="config-section">
                    <h2>Seguridad</h2>

                    <div className="input-field">
                        <label>Correo</label>
                        {/* Cargamos el email real del usuario registrado */}
                        <input type="email" defaultValue={user?.email || ""} readOnly />
                    </div>

                    <div className="input-field">
                        <label>Contraseña</label>
                        <div className="password-wrapper">
                            <input type="password" defaultValue="********" readOnly />
                            <span className="eye">👁</span>
                        </div>
                    </div>

                    <button className="text-btn">Cambiar contraseña</button>
                </section>
            </div>
        </DashboardLayout>
    );
};

export default Configuracion;