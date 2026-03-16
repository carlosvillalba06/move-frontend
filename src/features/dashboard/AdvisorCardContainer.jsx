import React, { useEffect, useState } from "react";
import AdvisorCard from "./cards/AdvisorCard.jsx";
import { getAllBoardsRequest } from "../../services/adminService";

const AdvisorCardsContainer = () => {

  const [advisors, setAdvisors] = useState([]);

  useEffect(() => {
    const loadAdvisors = async () => {
      try {
        const res = await getAllBoardsRequest();
        setAdvisors(res);
      } catch (error) {
        console.error("Error cargando asesores", error);
      }
    };

    loadAdvisors();
  }, []);

  return (
    <div className="grid">
      {advisors.map((advisor) => (
        <AdvisorCard key={advisor.id} advisor={advisor} />
      ))}
    </div>
  );
};

export default AdvisorCardsContainer;