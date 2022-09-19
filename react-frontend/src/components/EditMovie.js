import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

import Input from "./form-inputs/Input";
import Textarea from "./form-inputs/Textarea";
import Select from "./form-inputs/Select";
import Alert from "./ui-components/Alert";
import "./EditMovie.css";

export default function EditMovie(props) {
  const { jwt } = props;
  const { id } = useParams();
  const [movie, setMovie] = useState({
    id: "",
    title: "",
    release_date: "",
    runtime: "",
    mpaa_rating: "",
    rating: "",
    description: "",
  });
  const [alert, setAlert] = useState({
    type: "d-none",
    message: "",
  });
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();
  const url = `http://localhost:4000/`;
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + jwt,
    },
  };

  useEffect(() => {
    if (id > 0) {
      axios
        .get(url + `v1/movie/${id}`)
        .then((res) => {
          const release_date = new Date(res.data.movie.release_date);
          setMovie({
            id: id,
            title: res.data.movie.title,
            release_date: release_date.toISOString().split("T")[0],
            runtime: res.data.movie.runtime,
            mpaa_rating: res.data.movie.mpaa_rating,
            rating: res.data.movie.rating,
            description: res.data.movie.description,
          });
        })
        .catch((err) => {
          // todo:
          console.log(err);
        });
    }
  }, [id, url]);

  // TODO:
  if (jwt === null) {
    navigate("/login");
    return;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    // validation
    let errors = [];
    if (movie.title === "") {
      errors.push("title");
    }

    if (movie.description === "") {
      errors.push("description");
    }

    if (movie.release_date === "") {
      errors.push("release_date");
    } else {
      const release_date = new Date(movie.release_date);
      const now = Date.now();
      const oldestMovie = new Date("01-01-1888");
      if (oldestMovie > release_date || release_date > now) {
        errors.push("release_date");
      }
    }

    if (movie.runtime === "") {
      errors.push("runtime");
    } else if (Number(movie.runtime) < 0) {
      errors.push("runtime");
    }

    if (movie.mpaa_rating === "") {
      errors.push("mpaa_rating");
    }

    if (movie.rating === "") {
      errors.push("rating");
    } else {
      const convertedRatign = Number(movie.rating);
      if (convertedRatign < 1 || convertedRatign > 5) {
        errors.push("rating");
      }
    }

    setErrors(errors);

    if (errors.length > 0) {
      return false;
    }

    const data = new FormData(e.target);
    const payload = Object.fromEntries(data.entries());

    console.log(config);

    axios
      .post(url + "v1/admin/editmovie", JSON.stringify(payload), config)
      .then(() => navigate("/admin"))
      .catch((err) => {
        setAlert({
          type: "alert-danger",
          message: "Failed to save changes: " + err.response.data.error.message,
        });
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMovie((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const hasError = (key) => {
    return errors.indexOf(key) !== -1;
  };

  const mpaaOptions = [
    { id: "G", value: "G" },
    { id: "PG", value: "PG" },
    { id: "PG13", value: "PG13" },
    { id: "R", value: "R" },
    { id: "NC17", value: "NC17" },
  ];

  const confirmDelete = () => {
    confirmAlert({
      title: "Delete movie",
      message: "Are you sure?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            axios
              .get(url + `v1/admin/deletemovie/${id}`, config)
              .then(() => navigate("/admin"))
              .catch((err) => {
                setAlert({
                  type: "alert-danger",
                  message:
                    "Failed to delete movie: " +
                    err.response.data.error.message,
                });
              });
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  return (
    <>
      <h2>Add/Edit Movie</h2>
      <Alert alertType={alert.type} alertMessage={alert.message} />
      <hr />
      <form method="post" onSubmit={handleSubmit}>
        <input type="hidden" name="id" id="id" value={movie.id} />
        <Input
          name={"title"}
          title={"Title"}
          type={"text"}
          value={movie.title}
          handleChange={handleChange}
          placeholder={"Enter movie name"}
          className={hasError("title") && "is-invalid"}
          errorDiv={hasError("title") ? "text-danger" : "d-none"}
          errorMsg={"Please enter title"}
        />

        <Input
          name={"release_date"}
          title={"Release date"}
          type={"date"}
          value={movie.release_date}
          handleChange={handleChange}
          className={hasError("release_date") && "is-invalid"}
          errorDiv={hasError("release_date") ? "text-danger" : "d-none"}
          errorMsg={"Please enter valid release date"}
        />

        <Input
          name={"runtime"}
          title={"Runtime"}
          type={"number"}
          value={movie.runtime}
          handleChange={handleChange}
          className={hasError("runtime") && "is-invalid"}
          errorDiv={hasError("runtime") ? "text-danger" : "d-none"}
          errorMsg={"Please enter valid runtime"}
        />

        <Select
          name={"mpaa_rating"}
          title={"MPAA Rating"}
          value={movie.mpaa_rating}
          handleChange={handleChange}
          options={mpaaOptions}
          className={hasError("mpaa_rating") && "is-invalid"}
          errorDiv={hasError("mpaa_rating") ? "text-danger" : "d-none"}
          errorMsg={"Please enter MPAA Rating"}
        />

        <Input
          name={"rating"}
          title={"Rating (number of *)"}
          type={"number"}
          value={movie.rating}
          handleChange={handleChange}
          className={hasError("rating") && "is-invalid"}
          errorDiv={hasError("rating") ? "text-danger" : "d-none"}
          errorMsg={"Please enter valid rating value from 1 to 5"}
        />

        <Textarea
          name={"description"}
          title={"Description"}
          value={movie.description}
          handleChange={handleChange}
          className={hasError("description") && "is-invalid"}
          errorDiv={hasError("description") ? "text-danger" : "d-none"}
          errorMsg={"Please enter description"}
        />

        <hr />

        <button className="btn btn-primary">Save</button>
        <Link to="/admin" className="btn btn-warning ms-1">
          Cancel
        </Link>
        {id > 0 && (
          <a
            href="#!"
            onClick={() => confirmDelete()}
            className="btn btn-danger ms-1"
          >
            Delete
          </a>
        )}
      </form>
    </>
  );
}
