import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function Movie() {
  const { id } = useParams();
  const [movie, setMovie] = useState([]);
  const [error, setError] = useState(false);
  const url = `http://localhost:4000/v1/movie/${id}`;

  useEffect(() => {
    axios
      .get(url)
      .then((res) => {
        setMovie(res.data.movie);
      })
      .catch((err) => {
        setError(true);
        console.log(err);
      });
  }, [url]);

  if (error) {
    return <div>Oops, something went wrong...</div>;
  }

  const movieGenres = () => {
    const res = [];
    if (movie.genres) {
      for (const key in movie.genres) {
        res.push(movie.genres[key]);
      }
    }
    return res;
  };

  return (
    <>
      <h2>Movie: {movie.title}</h2>
      <div className="float-start">
        <small>Rating: {movie.mpaa_rating}</small>
      </div>
      <div className="float-end">
        {movieGenres().map((m, index) => (
          <span className="badge bg-secondary me-1" key={index}>
            {m}
          </span>
        ))}
      </div>
      <div className="clearfix"></div>
      <hr />
      <table className="table table-compact table-striped">
        <thead></thead>
        <tbody>
          <tr>
            <td>
              <strong>Title:</strong>
            </td>
            <td>
              <strong>{movie.title}</strong>
            </td>
          </tr>
          <tr>
            <td>
              <strong>Description:</strong>
            </td>
            <td>{movie.description}</td>
          </tr>
          <tr>
            <td>
              <strong>Run time:</strong>
            </td>
            <td>{movie.runtime} minutes</td>
          </tr>
          <tr>
            <td>
              <strong>Release year:</strong>
            </td>
            <td>{movie.year}</td>
          </tr>
          <tr>
            <td>
              <strong>Rating:</strong>
            </td>
            <td>{"*".repeat(movie.rating)}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
