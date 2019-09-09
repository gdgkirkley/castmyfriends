import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Result = styled.div`
  display: grid;
  border-bottom: 1px solid ${props => props.theme.accent9};
  margin: 16px 0px;
  padding: 8px 0px;
  & h4 {
    margin: 0;
  }
`;

const Credits = styled.p`
  font-size: ${props => props.theme.fontSize.information};
  color: ${props => props.theme.primary2};
  margin: 0;
  padding: 0;
`;

const CastInfo = styled.div`
  font-size: ${props => props.theme.fontSize.information};
  color: ${props => props.theme.primary1};
`;

const SearchResults = props => {
  const { results } = props;
  if (!results.length) return null;
  return (
    <div>
      {!results.length &&
        props.search.searched &&
        `Nothing found for "${props.search.term}"...`}
      {results.length ? <h2>Search Results ({results.length})</h2> : null}
      <div>
        {results.map((show, index) => {
          return (
            <Result key={show.id}>
              <h4>
                <Link
                  to={{
                    pathname: `/show/${show.id}`,
                  }}
                >
                  {show.title}
                </Link>
              </h4>
              <Credits>
                {show.playwright && <span>By {show.playwright}</span>}
                {show.author && <span>Author: {show.author}</span>}
                {show.translator && <span>Translator: {show.translator}</span>}
              </Credits>
              <CastInfo>Cast: {show.cast.length}</CastInfo>
            </Result>
          );
        })}
      </div>
    </div>
  );
};

export default SearchResults;
