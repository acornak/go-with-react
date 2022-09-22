import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Admin(props) {
  const { jwt } = props;
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const url = "http://localhost:4000/v1/movies";

    axios
      .get(url)
      .then((res) => {
        setMovies(res.data.movies);
      })
      .catch((err) => {
        setError(true);
        console.log(err);
      });
  }, []);

  // TOOD:
  if (jwt === null) {
    navigate("/login");
    return;
  }

  return (
    <>
      <h2>Manage Catalogue</h2>
      <div className="list-group">
        {error ? (
          <div>Oops, something went wrong...</div>
        ) : (
          movies.map((m) => (
            <Link
              to={`/admin/movie/${m.id}`}
              className="list-group-item list-group-item-action"
              key={m.id}
            >
              {m.title}
            </Link>
          ))
        )}
      </div>
    </>
  );
}
