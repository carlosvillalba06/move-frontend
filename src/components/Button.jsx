import React from "react";

function Button({
  variant = "primary",
  size = "md",
  children,
  ...props
}) {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;