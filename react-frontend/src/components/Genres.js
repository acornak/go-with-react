import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Genres() {
  const [genres, setGenres] = useState([]);
  const [error, setError] = useState(false);
  const url = "http://localhost:4000/v1/genres";

  useEffect(() => {
    axios
      .get(url)
      .then((res) => {
        setGenres(res.data.genres);
      })
      .catch((err) => {
        setError(true);
        console.log(err);
      });
  }, [url]);

  return (
    <>
      <h2>Genres:</h2>
      <ul>
        {error ? (
          <div>Ooops, something went wrong...</div>
        ) : (
          genres.map((m) => (
            <li key={m.id}>
              <Link to={`/genre/${m.id}`}>{m.genre_name}</Link>
            </li>
          ))
        )}
      </ul>
    </>
  );
}
