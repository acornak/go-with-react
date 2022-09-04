import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import Input from "./form-inputs/Input";
import Textarea from "./form-inputs/Textarea";
import Select from "./form-inputs/Select";
import "./EditMovie.css";

export default function EditMovie() {
  const { id } = useParams();
  const [error, setError] = useState(false);
  const [movie, setMovie] = useState({
    title: "",
    release_date: "",
    runtime: "",
    mpaa_rating: "",
    rating: "",
    description: "",
  });

  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (id > 0) {
      const url = `http://localhost:4000/v1/movie/${id}`;
      axios
        .get(url)
        .then((res) => {
          const release_date = new Date(res.data.movie.release_date);
          setMovie({
            title: res.data.movie.title,
            release_date: release_date.toISOString().split("T")[0],
            runtime: res.data.movie.runtime,
            mpaa_rating: res.data.movie.mpaa_rating,
            rating: res.data.movie.rating,
            description: res.data.movie.description,
          });
        })
        .catch((err) => {
          setError(true);
          console.log(err);
        });
    }
  }, [id]);

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
    const url = "http://localhost:4000/v1/admin/editmovie";

    axios
      .post(url, JSON.stringify(payload))
      .then((res) => console.log(res))
      .catch((err) => {
        setError(true);
        console.log(err);
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

  if (error) {
    return <div>Oops, something went wrong...</div>;
  }

  return (
    <>
      <h2>Add/Edit Movie</h2>
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
      </form>

      <div className="mt-3">
        <pre>{JSON.stringify(movie, null, 3)}</pre>
      </div>
    </>
  );
}
