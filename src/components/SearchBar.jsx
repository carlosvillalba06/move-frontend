import React, { useState, useEffect, useRef } from "react";

const SearchBar = ({ setSearch, statusFilter, setStatusFilter }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSelect = (value) => {
    setStatusFilter(value);
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getLabel = () => {
    if (statusFilter === "ACTIVE") return "Activos";
    if (statusFilter === "INACTIVE") return "Inactivos";
    return "Todos";
  };

  return (
    <div className="search-container" style={{ position: "relative" }} ref={dropdownRef}>

      <div className="search-input">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>

        <input
          type="text"
          placeholder="Buscar asesor"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div 
        className="filter-button" 
        onClick={() => setOpen(!open)}
        style={{ cursor: "pointer", display: "flex", gap: "5px", alignItems: "center" }}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="black">
          <path d="M3 6h18v2H3V6zm3 5h12v2H6v-2zm3 5h6v2H9v-2z"/>
        </svg>

        <span>Filtros ({getLabel()})</span>
      </div>

      {open && (
        <div style={{
          position: "absolute",
          top: "45px",
          right: "0",
          background: "#fff",
          border: "1px solid #ddd",
          borderRadius: "8px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          padding: "10px",
          width: "180px",
          zIndex: 10
        }}>
          <p style={{ fontWeight: "bold", marginBottom: "8px" }}>
            Estado
          </p>

          <div onClick={() => handleSelect("ALL")} style={{ padding: "5px", cursor: "pointer" }}>
            Todos
          </div>

          <div onClick={() => handleSelect("ACTIVE")} style={{ padding: "5px", cursor: "pointer" }}>
            Activos
          </div>

          <div onClick={() => handleSelect("INACTIVE")} style={{ padding: "5px", cursor: "pointer" }}>
            Inactivos
          </div>

          <hr />

          <div 
            onClick={() => {
              setSearch("");
              setStatusFilter("ALL");
              setOpen(false);
            }}
            style={{ padding: "5px", cursor: "pointer", color: "red" }}
          >
            Limpiar filtros
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;