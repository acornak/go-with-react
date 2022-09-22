import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Movies from "./components/Movies";
import Movie from "./components/Movie";
import Home from "./components/Home";
import Admin from "./components/Admin";
import Genres from "./components/Genres";
import Genre from "./components/Genre";
import EditMovie from "./components/EditMovie";
import Login from "./components/Login";
import GraphQL from "./components/GraphQL";
import MovieGraphQL from "./components/MovieGraphQL";

export default function App() {
  const [jwt, setJwt] = useState(window.localStorage.getItem("jwt"));

  const handleJwtChange = (token) => {
    setJwt(token);
  };

  const logout = () => {
    setJwt(null);
    window.localStorage.removeItem("jwt");
  };

  let loginLink;

  if (jwt === null) {
    loginLink = (
      <Link to="/login">
        <div className="btn btn-primary">Login</div>
      </Link>
    );
  } else {
    loginLink = (
      <Link to="/login" onClick={() => logout()}>
        <div className="btn btn-secondary">Logout</div>
      </Link>
    );
  }

  console.log(jwt);

  return (
    <Router>
      <div className="container">
        <div className="row">
          <div className="col mt-3">
            <h1 className="mt-3">Go Watch a Movie!</h1>
          </div>
          <div className="col mt-3 text-end ">{loginLink}</div>
          <hr />
          <hr className="mb-3" />
        </div>
        <div className="row">
          <div className="col-md-2">
            <nav>
              <div className="list-group">
                <Link to="/" className="list-group-item list-group-item-action">
                  Home
                </Link>
                <Link
                  to="/movies"
                  className="list-group-item list-group-item-action"
                >
                  Movies
                </Link>
                <Link
                  to="/genres"
                  className="list-group-item list-group-item-action"
                >
                  Genres
                </Link>
                <Link
                  to="/graphql"
                  className="list-group-item list-group-item-action"
                >
                  GraphQL
                </Link>
                {jwt !== null && (
                  <>
                    <Link
                      to="/admin/movie/0"
                      className="list-group-item list-group-item-action"
                    >
                      Add movie
                    </Link>
                    <Link
                      to="/admin"
                      className="list-group-item list-group-item-action"
                    >
                      Manage Catalogue
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
          <div className="col-md-10">
            <Routes>
              <Route path="/movies/:id" element={<Movie />} />
              <Route path="/moviesgraphql/:id" element={<MovieGraphQL />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/admin" element={<Admin jwt={jwt} />} />
              <Route
                path="/admin/movie/:id"
                element={<EditMovie jwt={jwt} />}
              />
              <Route path="/" element={<Home />} />
              <Route exact path="/genres" element={<Genres />} />
              <Route exact path="/genre/:genre_id" element={<Genre />} />
              <Route
                exact
                path="/login"
                element={<Login handleJwtChange={handleJwtChange} />}
              />
              <Route exact path="/graphql" element={<GraphQL />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}
