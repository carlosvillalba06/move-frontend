import React from "react";

function Input({
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  error,
  variant = "default",
  size = "md",
  ...props
}) {
  return (
    <div className="input-container">
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`input input-${variant} input-${size} ${
          error ? "input-error" : ""
        }`}
        {...props}
      />

      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default Input;