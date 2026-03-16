import React, { useEffect, useState, useRef } from "react";
import userPlaceholder from "../../assets/userMOVE.png";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import DashboardSidebar from "../../components/DashboardSidebar";
import { useAuth } from "../../services/authContext";
import { getAdminInformationRequest, uploadLogoRequest } from "../../services/adminService";

const Configuracion = () => {

    const { user } = useAuth();
    const role = user?.rol;

    const [adminData, setAdminData] = useState(null);
    const [previewImage, setPreviewImage] = useState(userPlaceholder);

    const fileInputRef = useRef(null);

    useEffect(() => {

        const fetchAdminInfo = async () => {
            try {

                const response = await getAdminInformationRequest();
                const data = response?.data || response;

                if (data) {

                    setAdminData(data);

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



    return (
        <DashboardLayout sidebar={<DashboardSidebar role={role} />}>

            <div className="config-container">

                <h1>Configuración</h1>

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

                <section className="config-section">

                    <div className="section-header">

                        <h2>Nombre</h2>

                        <button className="text-btn">
                            Editar
                        </button>

                    </div>

                    <div className="input-field">

                        <label>Nombre(s)</label>

                        <input
                            type="text"
                            value={adminData?.firstName || ""}
                            readOnly
                        />

                    </div>

                    <div className="input-field">

                        <label>Apellidos</label>

                        <input
                            type="text"
                            value={adminData?.lastName || ""}
                            readOnly
                        />

                    </div>

                </section>

                <hr />

                <section className="config-section">

                    <h2>Seguridad</h2>

                    <div className="input-field">

                        <label>Correo</label>

                        <input
                            type="email"
                            value={user?.email || ""}
                            readOnly
                        />

                    </div>

                    <div className="input-field">

                        <label>Contraseña</label>

                        <div className="password-wrapper">

                            <input
                                type="password"
                                value="********"
                                readOnly
                            />

                            <span className="eye">👁</span>

                        </div>

                    </div>

                    <button className="text-btn">
                        Cambiar contraseña
                    </button>

                </section>


                

            </div>

        </DashboardLayout>
    );
};

export default Configuracion;