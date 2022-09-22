import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Genres() {
  const [genres, setGenres] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/v1/genres`)
      .then((res) => {
        setGenres(res.data.genres);
      })
      .catch((err) => {
        setError(true);
        console.log(err);
      });
  }, []);

  return (
    <>
      <h2>Genres:</h2>
      <div className="list-group">
        {error ? (
          <div>Ooops, something went wrong...</div>
        ) : (
          genres.map((g) => (
            <Link
              to={`/genre/${g.id}`}
              state={{ genreName: g.genre_name }}
              className="list-group-item list-group-item-action"
              key={g.id}
            >
              {g.genre_name}
            </Link>
          ))
        )}
      </div>
    </>
  );
}
