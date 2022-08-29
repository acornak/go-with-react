import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function CategoryPage() {
  const { pathname } = useLocation();

  return (
    <div>
      <h2>Categories</h2>
      <ul>
        <li>
          <Link to={`${pathname}/drama`}>Drama</Link>
        </li>
        <li>
          <Link to={`${pathname}/comedy`}>Comedy</Link>
        </li>
        <li>
          <Link to={`${pathname}/horror`}>Horror</Link>
        </li>
      </ul>
    </div>
  );
}
