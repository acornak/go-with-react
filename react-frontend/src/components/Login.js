import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Input from "./form-inputs/Input";
import Alert from "./ui-components/Alert";

export default function Login(props) {
  const { handleJwtChange } = props;
  const [errors, setErrors] = useState([]);
  const [alert, setAlert] = useState({
    type: "d-none",
    message: "",
  });
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  // TODO: move
  const url = `http://localhost:4000/`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // validation
    let errors = [];

    if (user.email === "") {
      errors.push("email");
    }

    if (user.password === "") {
      errors.push("password");
    }

    setErrors(errors);

    if (errors.length > 0) {
      return false;
    }

    const data = new FormData(e.target);
    const payload = Object.fromEntries(data.entries());

    axios
      .post(url + "v1/signin", JSON.stringify(payload))
      .then((res) => {
        handleJwtChange(res.data.response);
        navigate("/admin");
      })
      .catch((err) => {
        setAlert({
          type: "alert-danger",
          message: "Failed to log in: " + err.response.data.error.message,
        });
      });
  };

  // TODO: move to utils
  const hasError = (key) => {
    return errors.indexOf(key) !== -1;
  };

  return (
    <>
      <h2>Login</h2>
      <hr />
      <Alert alertType={alert.type} alertMessage={alert.message} />{" "}
      <form className="pt-3" onSubmit={handleSubmit}>
        <Input
          title={"Email"}
          type={"email"}
          name={"email"}
          handleChange={handleChange}
          placeholder={"Enter email"}
          className={hasError("email") && "is-invalid"}
          errorDiv={hasError("email") ? "text-danger" : "d-none"}
          errorMsg={"Please enter a valid email address"}
        />
        <Input
          title={"Password"}
          type={"password"}
          name={"password"}
          handleChange={handleChange}
          placeholder={"Enter password"}
          className={hasError("password") && "is-invalid"}
          errorDiv={hasError("password") ? "text-danger" : "d-none"}
          errorMsg={"Please enter a password"}
        />
        <hr />
        <button className="btn btn-primary">Login</button>
      </form>
    </>
  );
}
