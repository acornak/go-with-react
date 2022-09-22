import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

export default function Genre() {
  const location = useLocation();
  const { genreName } = location.state;
  const { genre_id } = useParams();
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/v1/movies/${genre_id}`)
      .then((res) => {
        setMovies(res.data.movies);
      })
      .catch((err) => {
        setError(true);
        console.log(err);
      });
  }, [genre_id]);

  return (
    <>
      <h2>Genre: {genreName}</h2>
      {movies ? (
        <div className="list-group">
          {error ? (
            <div>Oops, something went wrong...</div>
          ) : (
            movies.map((m) => (
              <Link
                to={`/movies/${m.id}`}
                className="list-group-item list-group-item-action"
                key={m.id}
              >
                {m.title}
              </Link>
            ))
          )}
        </div>
      ) : (
        <div>No movies in this category...</div>
      )}
    </>
  );
}
