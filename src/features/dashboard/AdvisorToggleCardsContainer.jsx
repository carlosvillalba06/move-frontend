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
  const [showSuccess, setShowSuccess] = useState(false);

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
  const handleDisable = (email) => {

    setConfirmMessage("¿Seguro que deseas deshabilitar este asesor?");

    setConfirmAction(() => async () => {

      await disableUserRequest(email);

      setAdvisors(prev =>
        prev.map(a =>
          a.email === email ? { ...a, status: false } : a
        )
      );

      setConfirmOpen(false);
    });

    setConfirmOpen(true);
  };
  // ---------- HABILITAR ----------
  const handleEnable = (email) => {

    setConfirmMessage("¿Seguro que deseas habilitar este asesor?");

    setConfirmAction(() => async () => {

      await enableUserRequest(email);

      setAdvisors(prev =>
        prev.map(a =>
          a.email === email ? { ...a, status: true } : a
        )
      );

      setConfirmOpen(false);
    });

    setConfirmOpen(true);
  };

  // ---------- ABRIR MODAL REGISTRO ----------
  const handleAddAdvisor = () => {
    setIsModalOpen(true);
  };

  // ---------- CERRAR MODAL ----------
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // ---------- CUANDO SE REGISTRA ----------
  const handleAdvisorRegistered = (newAdvisor) => {

    setAdvisors(prev => [...prev, newAdvisor]);

    setIsModalOpen(false);
    setShowSuccess(true);
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
            onEnable={handleEnable}
            onDisable={handleDisable}
          />
        ))}
      </div>

      <AddAdvisor
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAdvisorCreated={loadAdvisors}
      />

      <SuccessAlert
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
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