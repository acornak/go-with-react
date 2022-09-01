import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Genre() {
  const { genre_id } = useParams();
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(false);
  const url = `http://localhost:4000/v1/movies/${genre_id}`;

  useEffect(() => {
    axios
      .get(url)
      .then((res) => {
        console.log(res);
        setMovies(res.data.movies);
      })
      .catch((err) => {
        setError(true);
        console.log(err);
      });
  }, [url]);

  if (!movies) {
    return <div>No movies in this category...</div>;
  }

  return (
    <>
      <h2>Movies</h2>
      <ul>
        {error ? (
          <div>Oops, something went wrong...</div>
        ) : (
          movies.map((m) => (
            <li key={m.id}>
              <Link to={`/movies/${m.id}`}>{m.title}</Link>
            </li>
          ))
        )}
      </ul>
    </>
  );
}
