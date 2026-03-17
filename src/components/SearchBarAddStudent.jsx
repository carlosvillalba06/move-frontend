import React from "react";

const SearchBarAddStudent = ({ setSearch, onAddStudent }) => {
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

      <button className="add-button" onClick={onAddStudent}>
        <span className="plus-icon">+</span>
        Agregar estudiante
      </button>

    </div>
  );
};

export default SearchBarAddStudent;