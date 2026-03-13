function InputPassword({
  type = "password",
  name,
  placeholder,
  value,
  onChange,
  error
}) {

  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={error ? "input input-error" : "input"}
    />
  );

}

export default InputPassword;