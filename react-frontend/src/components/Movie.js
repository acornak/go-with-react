import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function Movie(props) {
  const { id } = useParams();
  const [movie, setMovie] = useState({});

  useEffect(() => {
    setMovie({
      id,
      title: "The Shawshank Redemption",
      runtime: 150,
    });
  }, [id]);

  return (
    <>
      <h2>Movie: {movie.title}</h2>
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
              <strong>Run time:</strong>
            </td>
            <td>
              <strong>{movie.runtime} minutes</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
