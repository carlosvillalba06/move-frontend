import React, { useEffect, useState } from "react";
import SearchBarAddAdvisor from "../../components/SearchBarAddAdvisor.jsx";
import AdvisorToggleCard from "./cards/AdvisorToggleCard.jsx";
import { getAllAdvisersRequest } from "../../services/adminService";
import { disableUserRequest, enableUserRequest } from "../../services/authService.js";

import AddAdvisor from "../users/AddAdvisor.jsx";
import SuccessAlert from "../modals/SuccessAlert.jsx";
import ConfirmAlert from "../modals/ConfirmAlert.jsx";

const AdvisorCardsToggleContainer = () => {

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

  const filteredAdvisors = advisors.filter(a =>
    (a.firstName + " " + a.lastName + " " + a.email)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const loadAdvisors = async () => {
    try {
      const res = await getAllAdvisersRequest();
      setAdvisors(res);
    } catch (error) {
      console.error("Error cargando asesores", error);
    }
  };

  useEffect(() => {
    loadAdvisors();
  }, []);

  const handleAdvisorCreated = async () => {
    await loadAdvisors();
    setSuccessConfig({
      isOpen: true,
      message: "Asesor registrado con éxito"
    });
  };

  const handleToggleStatus = (advisor) => {
    const isActive = advisor.status;

    const actionText = isActive ? "deshabilitar" : "habilitar";

    setConfirmMessage(`¿Seguro que deseas ${actionText} este asesor?`);

    setConfirmAction(() => async () => {
      try {
        if (isActive) {
          await disableUserRequest(advisor.email);
        } else {
          await enableUserRequest(advisor.email);
        }

        setAdvisors(prev =>
          prev.map(a =>
            a.email === advisor.email
              ? { ...a, status: !isActive }
              : a
          )
        );

        setSuccessConfig({
          isOpen: true,
          message: isActive
            ? "Asesor deshabilitado"
            : "Asesor habilitado"
        });

      } catch (error) {
        console.error("Error al cambiar estado", error);
      } finally {
        setConfirmOpen(false);
      }
    });

    setConfirmOpen(true);
  };

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
        {filteredAdvisors.map((advisor) => (
          <AdvisorToggleCard
            key={advisor.email}
            advisor={advisor}
            onToggle={handleToggleStatus}
          />
        ))}
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
        onConfirm={confirmAction}
        onCancel={() => setConfirmOpen(false)}
      />

    </div>
  );
};

export default AdvisorCardsToggleContainer;