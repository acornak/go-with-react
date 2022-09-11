const Alert = (props) => {
  const { alertType, alertMessage } = props;
  return (
    <div className={`alert ${alertType}`} role="alert">
      {alertMessage}
    </div>
  );
};

export default Alert;
