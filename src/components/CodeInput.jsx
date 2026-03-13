import React, { useRef } from "react";

function CodeInput({ length = 4, onComplete }) {

  const inputs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;

    if (!/^[0-9]?$/.test(value)) return;

    if (value && index < length - 1) {
      inputs.current[index + 1].focus();
    }

    const code = inputs.current
      .map((input) => input.value)
      .join("");

    if (code.length === length && onComplete) {
      onComplete(code);
    }
  };

  const handleKeyDown = (e, index) => {

    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputs.current[index - 1].focus();
    }

  };

  return (
    <div className="code-input-container">

      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          type="text"
          maxLength="1"
          className="code-input"
          ref={(el) => (inputs.current[index] = el)}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
        />
      ))}

    </div>
  );
}

export default CodeInput;