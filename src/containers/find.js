import React, { useState } from "react";
import styled from "styled-components";
import Search from "../components/Search";
import SearchResults from "../components/SearchResults";

const SearchPageResults = styled.div`
  display: grid;
  align-items: center;
  justify-content: center;
`;

const SearchPage = () => {
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState({
    searched: false,
    term: "",
  });

  const getResults = (results, searchTerm) => {
    setResults(results);
    setSearch({
      searched: true,
      term: searchTerm,
    });
  };
  return (
    <SearchPageResults>
      <Search getResults={getResults} />
      <SearchResults results={results} search={search} />
    </SearchPageResults>
  );
};

export default SearchPage;
