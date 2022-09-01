import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Movies from "./components/Movies";
import Movie from "./components/Movie";
import Home from "./components/Home";
import Admin from "./components/Admin";
import Genres from "./components/Genres";
import Genre from "./components/Genre";

export default function App() {
  return (
    <Router>
      <div className="container">
        <div className="row">
          <h1 className="mt-3">Go Watch a Movie!</h1>
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
                  to="/admin"
                  className="list-group-item list-group-item-action"
                >
                  Manage Catalogue
                </Link>
              </div>
            </nav>
          </div>
          <div className="col-md-10">
            <Routes>
              <Route path="/movies/:id" element={<Movie />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/" element={<Home />} />
              <Route exact path="/genres" element={<Genres />} />
              <Route exact path="/genre/:genre_id" element={<Genre />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}
