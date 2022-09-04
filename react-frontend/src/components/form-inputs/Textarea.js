export default function Textarea(props) {
  const {
    title,
    name,
    value,
    rows,
    handleChange,
    errorDiv,
    errorMsg,
    className,
  } = props;

  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label">
        {title}
      </label>
      <textarea
        className={`form-control ${className}`}
        id={name}
        name={name}
        value={value}
        rows={rows ? rows : "3"}
        onChange={handleChange}
      />
      <div className={errorDiv}>{errorMsg}</div>
    </div>
  );
}
