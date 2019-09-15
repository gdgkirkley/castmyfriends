import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { firestore } from "../firebase/firebase.utils";
import Error from "./Error";
import { titleCase } from "../lib/helpers";

const SearchForm = styled.form`
  display: grid;
  width: 100%;
  justify-content: center;
  text-align: center;
  & input {
    width: 100%;
    padding: 16px 24px;
    border-radius: 4px 0px 0px 4px;
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
  width: 100%;
  & button {
    background: ${props => props.theme.primary5};
    border: none;
    color: white;
    min-width: 64px;
    border-radius: 0px 4px 4px 0px;
    &:hover {
      cursor: pointer;
      background: ${props => props.theme.primary4};
    }
  }
`;

const BottomText = styled.p`
  font-size: ${props => props.theme.fontSize.information};
`;

const Search = props => {
  const [search, setSearch] = useState("");
  const [err, setErr] = useState("");

  const handleChange = e => {
    const { value } = e.target;
    setSearch(value);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const lowerSearch = search.toLowerCase();
    const titleSearch = titleCase(search);
    let results = [];

    let result = await Promise.all([
      firestore
        .collection("shows")
        .where("keywords", "array-contains", lowerSearch)
        .orderBy("title")
        .limit(50)
        .get(),
      firestore
        .collection("shows")
        .where("title", "==", titleSearch)
        .limit(5)
        .get(),
    ]).catch(err => {
      setErr(err.message);
    });
    if (result) {
      result.map(query => {
        return query.docs.map(doc => {
          const data = doc.data();
          const id = doc.id;
          return results.push({ ...data, id });
        });
      });
      const finalResult = Array.from(new Set(results.map(show => show.id))).map(
        id => {
          return {
            id: id,
            ...results.find(show => show.id === id),
          };
        }
      );
      props.getResults(finalResult, search);
    }
  };

  return (
    <SearchForm onSubmit={handleSubmit}>
      <Error error={err} />
      <SearchField>
        <input
          placeholder="Find a show by keyword"
          value={search}
          onChange={handleChange}
        />
        <button type="submit">→</button>
      </SearchField>
      <BottomText>
        Don't see what you're looking for? <Link to="/addshow">Add a show</Link>
      </BottomText>
    </SearchForm>
  );
};

export default Search;
