import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { firestore } from "../firebase/firebase.utils";

const SearchForm = styled.form`
  display: grid;
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

const SearchField = styled.div`
  display: flex;
  & button {
    background: ${props => props.theme.primary5};
    color: white;
    min-width: 64px;
  }
`;

const Search = props => {
  const [search, setSearch] = useState("");

  const handleChange = e => {
    const { value } = e.target;
    setSearch(value);
  };

  const handleSubmit = e => {
    e.preventDefault();
    firestore
      .collection("shows")
      .where("keywords", "array-contains", search)
      .get()
      .then(snapshot => {
        const results = snapshot.docs.map(doc => {
          const data = doc.data();
          const id = doc.id;
          return { ...data, id };
        });
        console.log(results);
        return props.getResults(results, search);
      });
  };

  return (
    <SearchForm onSubmit={handleSubmit}>
      <SearchField>
        <input
          placeholder="Find a show"
          value={search}
          onChange={handleChange}
        />
        <button type="submit">→</button>
      </SearchField>
      <p>
        Don't see what you're looking for? <Link to="/addshow">Add a show</Link>
      </p>
    </SearchForm>
  );
};

export default Search;
