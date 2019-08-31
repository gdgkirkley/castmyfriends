import React, { useState } from "react";
import styled from "styled-components";

const SearchForm = styled.form`
  display: flex;
  width: 100%;
  justify-content: center;
  & input {
    width: 100%;
    padding: 16px 24px;
    border-radius: ${props => props.theme.borderRadius};
    border: 1px solid ${props => props.theme.grey8};
    transition: 0.4s linear;
    font-size: ${props => props.theme.fontSize.reading};
    &:hover,
    &:focus,
    &:active {
      border: 1px solid ${props => props.theme.primary8};
    }
  }
`;

const Search = () => {
  const [search, setSearch] = useState("");

  const handleChange = e => {
    const { value } = e.target;
    setSearch(value);
  };

  const handleSubmit = e => {
    e.preventDefault();
  };

  return (
    <SearchForm onSubmit={handleSubmit}>
      <input placeholder="Find a show" value={search} onChange={handleChange} />
    </SearchForm>
  );
};

export default Search;
