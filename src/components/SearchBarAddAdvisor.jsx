import React from "react";

const SearchBarAddAdvisor = ({ setSearch, onAddAdvisor }) => {
  return (
    <div className="search-container">

      <div className="search-input">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>

        <input
          type="text"
          placeholder="Buscar asesor"
          onChange={(e) => setSearch?.(e.target.value)}
        />
      </div>

      <button className="add-button" onClick={onAddAdvisor}>
        <span className="plus-icon">+</span>
        Agregar asesor
      </button>

    </div>
  );
};

export default SearchBarAddAdvisor;