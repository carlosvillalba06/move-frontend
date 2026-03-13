import React from "react";

const SearchBar = () => {
  return (
    <div className="search-container">
      <div className="search-input">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input type="text" placeholder="Buscar tarea" />
      </div>
      
      <div className="filter-button">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="black">
          <path d="M3 6h18v2H3V6zm3 5h12v2H6v-2zm3 5h6v2H9v-2z"/>
        </svg>
        <span>Filtros</span>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </div>
    </div>
  );
};

export default SearchBar;