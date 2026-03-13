function Button({
  variant = "primary",
  text = "Wihooo",
  onClick,
  type = "button",
  disabled = false
}) {

  const className =
    variant === "primary"
      ? "button-primary"
      : "button-secondary";

  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
}

export default Button;