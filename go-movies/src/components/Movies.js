import React, { useState, useEffect } from "react";

export default function Movies() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    setMovies([
      { id: 1, title: "The Shawshank Redeption", runtime: 142 },
      { id: 2, title: "The Godfather", runtime: 175 },
      { id: 3, title: "The Dark Knight", runtime: 153 },
    ]);
  }, []);

  return (
    <>
      <h2>Movies</h2>

      <ul>{movies && movies.map((m) => <li key={m.id}>{m.title}</li>)}</ul>
    </>
  );
}
