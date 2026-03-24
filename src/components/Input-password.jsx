function InputPassword({
  type = "password",
  name,
  placeholder,
  value,
  onChange,
  error
}) {

  return (

    <div>

      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={error ? "input input-error" : "input"}

      />

      {error && <p className="error-message">{error}</p>}

    </div>
  );

}

export default InputPassword;