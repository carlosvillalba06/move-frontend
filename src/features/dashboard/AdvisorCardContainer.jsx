import React, { useEffect, useState } from "react";
import AdvisorCard from "./cards/AdvisorCard.jsx";
import { getAllAdvisersRequest } from "../../services/adminService";
import SearchBar from "../../components/SearchBar.jsx";

const AdvisorCardsContainer = () => {
  const [search, setSearch] = useState("");
  const [advisors, setAdvisors] = useState([]);

  const filteredAdvisors = advisors.filter(a =>
    `${a.firstName || ""} ${a.lastName || ""} ${a.email || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  useEffect(() => {
    const loadAdvisors = async () => {
      try {
        const res = await getAllAdvisersRequest();
        const data = res?.data || res;
        setAdvisors(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error cargando asesores", error);
      }
    };

    loadAdvisors();
  }, []);

  return (
    <div>
      <SearchBar setSearch={setSearch} />

      <br />

      <div className="grid">
        {filteredAdvisors.map((advisor) => (
          <AdvisorCard key={advisor.id} advisor={advisor} />
        ))}
      </div>
    </div>
  );
};

export default AdvisorCardsContainer;