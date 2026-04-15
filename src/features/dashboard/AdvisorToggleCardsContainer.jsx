import React, { useEffect, useState } from "react";
import SearchBarAddAdvisor from "../../components/SearchBarAddAdvisor.jsx";
import AdvisorToggleCard from "./cards/AdvisorToggleCard.jsx";
import { getAllAdvisersRequest } from "../../services/adminService";
import { disableUserRequest, enableUserRequest } from "../../services/authService.js";

import AddAdvisor from "../users/AddAdvisor.jsx";
import SuccessAlert from "../modals/SuccessAlert.jsx";
import ConfirmAlert from "../modals/ConfirmAlert.jsx";

const AdvisorToggleCardsContainer = () => {

  const [search, setSearch] = useState("");
  const [advisors, setAdvisors] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [successConfig, setSuccessConfig] = useState({
    isOpen: false,
    message: ""
  });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);

  // 🔍 Filtrado seguro
  const filteredAdvisors = Array.isArray(advisors)
    ? advisors.filter(a =>
        `${a.firstName?.trim() || ""} ${a.lastName?.trim() || ""} ${a.email || ""}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    : [];

  // 🔄 Cargar asesores
  const loadAdvisors = async () => {
    try {
      const res = await getAllAdvisersRequest();
      const data = res?.data || res;

      console.log("Respuesta del servidor:", res);
      console.log("Advisors cargados:", data);

      setAdvisors(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando asesores", error);
      setAdvisors([]);
    }
  };

  useEffect(() => {
    loadAdvisors();
  }, []);

  // ✅ Después de crear asesor
  const handleAdvisorCreated = async (advisor) => {
    await loadAdvisors();

    setSuccessConfig({
      isOpen: true,
      message: `Asesor ${advisor.firstName} registrado con éxito`
    });
  };

  // 🔥 CAMBIO DE ESTADO (FIX REAL)
  const handleToggleStatus = (advisor) => {
    console.log("Advisor seleccionado:", advisor);

    const isActive = advisor.status;
    const actionText = isActive ? "deshabilitar" : "habilitar";

    setConfirmMessage(`¿Seguro que deseas ${actionText} este asesor?`);

    setConfirmAction(() => async () => {
      try {
        console.log("Cambiando estado para:", advisor.email);

        let res;

        if (isActive) {
          res = await disableUserRequest(advisor.email);
        } else {
          res = await enableUserRequest(advisor.email);
        }

        console.log("RESPUESTA BACKEND:", res);

        // 🔥 IMPORTANTE: refrescar desde backend
        await loadAdvisors();

        setSuccessConfig({
          isOpen: true,
          message: isActive
            ? "Asesor deshabilitado"
            : "Asesor habilitado"
        });

      } catch (error) {
        console.error("Error al cambiar estado", error);

        setSuccessConfig({
          isOpen: true,
          message: "Error al cambiar el estado del asesor"
        });

      } finally {
        setConfirmOpen(false);
      }
    });

    setConfirmOpen(true);
  };

  // 📌 Modal
  const handleAddAdvisor = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>

      <SearchBarAddAdvisor
        setSearch={setSearch}
        onAddAdvisor={handleAddAdvisor}
      />

      <br />

      <div className="grid">
        {filteredAdvisors.length > 0 ? (
          filteredAdvisors.map((advisor, index) => (
            <AdvisorToggleCard
              key={advisor.id ?? `advisor-${index}`}
              advisor={advisor}
              onToggle={handleToggleStatus}
            />
          ))
        ) : (
          <p>No hay asesores disponibles</p>
        )}
      </div>

      <AddAdvisor
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAdvisorCreated={handleAdvisorCreated}
      />

      <SuccessAlert
        isOpen={successConfig.isOpen}
        message={successConfig.message}
        onClose={() =>
          setSuccessConfig({ isOpen: false, message: "" })
        }
      />

      <ConfirmAlert
        isOpen={confirmOpen}
        message={confirmMessage}
        onConfirm={() => confirmAction && confirmAction()}
        onCancel={() => setConfirmOpen(false)}
      />

    </div>
  );
};

export default AdvisorToggleCardsContainer;