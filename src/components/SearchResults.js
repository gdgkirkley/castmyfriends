import React from "react";
import { Link } from "react-router-dom";

const SearchResults = props => {
  const { results } = props;
  if (!results.length) return null;
  return (
    <div>
      {!results.length &&
        props.search.searched &&
        `Nothing found for "${props.search.term}"...`}
      {results.length ? <h2>Search Results ({results.length})</h2> : null}
      {results.map((show, index) => {
        return (
          <p key={show.id}>
            {index + 1}.{" "}
            <Link
              to={{
                pathname: `/show/${show.id}`,
              }}
            >
              {show.title} by {show.playwright}
            </Link>
          </p>
        );
      })}
    </div>
  );
};

export default SearchResults;
