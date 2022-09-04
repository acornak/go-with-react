export default function Select(props) {
  const {
    title,
    name,
    value,
    handleChange,
    options,
    errorDiv,
    errorMsg,
    className,
  } = props;

  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label">
        {title}
      </label>
      <select
        className={`form-select ${className}`}
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
      >
        {options.map((option) => (
          <option
            className="form-select"
            value={option.id}
            label={option.value}
            key={option.id}
          >
            {option.value}
          </option>
        ))}
      </select>
      <div className={errorDiv}>{errorMsg}</div>
    </div>
  );
}
