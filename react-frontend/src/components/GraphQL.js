import React, { useState, useEffect } from "react";
import axios from "axios";
import Input from "./form-inputs/Input";
import { Link } from "react-router-dom";

export default function GraphQL() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const url = "http://localhost:4000/v1/graphql";

  useEffect(() => {
    const payload = `
    {
        list {
            id
            title
            runtime
            year
            description
        }
    }
    `;

    axios
      .post(url, payload)
      .then((res) => {
        setMovies(res.data.data.list);
      })
      .catch((err) => {
        setError(true);
        console.log(err);
      });
  }, [url]);

  const performSearch = (query) => {
    const payload = `
    {
        search(titleContains: "${query}") {
            id
            title
            runtime
            year
            description
        }
    }
    `;

    axios
      .post(url, payload)
      .then((res) => {
        const found = res.data.data.search;
        if (found.length > 0) {
          setMovies(found);
        } else {
          setMovies([]);
        }
      })
      .catch((err) => {
        setError(true);
        console.log(err);
      });
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    performSearch(e.target.value);
  };

  return (
    <>
      <h2>GraphQL</h2>
      <hr />
      <Input
        title={"Search"}
        type={"text"}
        name={"search"}
        value={searchTerm}
        handleChange={handleChange}
      />
      <div className="list-group">
        {error ? (
          <div>Oops, something went wrong...</div>
        ) : (
          movies.map((m) => (
            <Link
              key={m.id}
              className="list-group-item list-group-item-action"
              to={`/moviesgraphql/${m.id}`}
            >
              <strong>{m.title}</strong>
              <br />
              <small className="text-muted">
                ({m.year} - {m.runtime} minutes)
              </small>
              <br />
              {m.description.slice(0, 100)}...
            </Link>
          ))
        )}
      </div>
    </>
  );
}
