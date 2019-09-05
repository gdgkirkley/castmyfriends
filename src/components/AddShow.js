import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import styled from "styled-components";
import { firestore } from "../firebase/firebase.utils";
import Error from "./Error";

const AddShowForm = styled.form`
  display: grid;
  background: ${props => (props.loading ? "grey" : "none")};
  & input,
  textarea {
    padding: 16px 24px;
    margin-bottom: 24px;
    font-size: ${props => props.theme.fontSize.reading};
    border-radius: ${props => props.theme.borderRadius};
    border: 1px solid ${props => props.theme.grey8};
    &:hover {
      border: 1px solid ${props => props.theme.primary7};
    }
  }
  & label {
    font-size: ${props => props.theme.fontSize.emphasis};
    margin: 8px 0px;
  }
  & button {
    background: ${props => props.theme.primary5};
    color: white;
    border: none;
    padding: 16px 24px;
    &:hover {
      cursor: pointer;
      background: ${props => props.theme.primary4};
    }
  }
`;

const AddCharacterField = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 1fr 1fr 0.2fr;
  grid-gap: 16px;
  border: 1px solid ${props => props.theme.primary1};
  padding: 16px 24px;
  margin-bottom: 16px;
  & input,
  textarea {
    display: inline-flex;
    width: 100%;
    margin: 0;
    min-height: 64px;
    height: 100%;
    font-family: "Roboto", Arial, Helvetica, sans-serif;
    resize: vertical;
  }
  & legend {
    background-color: ${props => props.theme.primary5};
    color: #fff;
    padding: 4px 8px;
    border-radius: ${props => props.theme.borderRadius};
  }
`;

const AddedCharacters = styled.div`
  display: grid;
  border: 1px solid ${props => props.theme.primary1};
  padding: 16px 24px;
  margin-bottom: 16px;
`;

const Character = styled.div`
  display: grid;
  grid-gap: 24px;
  grid-template-columns: 1fr 1fr 0.2fr;
  justify-content: space-around;
  align-items: center;
`;

const AddShow = props => {
  const [values, setValues] = useState({
    title: "",
    description: "",
    playwright: "",
    author: "",
    translator: "",
    name: "",
    charDescription: "",
    cast: [],
    tags: [],
    error: "",
    loading: false,
    redirect: false,
    newShowId: "",
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleAddCharacter = e => {
    e.preventDefault();
    const newChar = { name: values.name, description: values.charDescription };
    setValues({
      ...values,
      cast: [...values.cast, newChar],
      name: "",
      charDescription: "",
    });
  };

  const handleRemoveCharacter = (e, name) => {
    e.preventDefault();
    const newChars = values.cast.filter(char => {
      return char.name !== name;
    });
    setValues({
      ...values,
      cast: [...newChars],
    });
  };

  const separateTags = tags => {
    return tags
      .toLowerCase()
      .replace(" ", "")
      .split(",");
  };

  const separateTitle = title => {
    return title
      .toLowerCase()
      .replace(/[^a-zA-Z ]/g, "")
      .split(" ");
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setValues({
      ...values,
      loading: true,
    });
    const sepTags = separateTags(values.tags);
    const titleSearch = separateTitle(values.title);
    const newShow = await firestore
      .collection("shows")
      .add({
        title: values.title,
        description: values.description,
        playwright: values.playwright,
        author: values.author,
        translator: values.translator,
        tags: sepTags,
        keywords: titleSearch,
        cast: values.cast,
        createdAt: new Date(),
        createdBy: props.user.id || 0,
      })
      .catch(err => {
        setValues({
          ...values,
          error: err,
          loading: false,
        });
      });
    // if (newShow.id) {
    //   await firestore
    //     .doc(`shows/${newShow.id}`)
    //     .collection("cast")
    //     .add({
    //       ...values.cast,
    //     });
    // }
    setValues({
      ...values,
      loading: false,
      redirect: true,
      newShowId: newShow.id,
    });
  };

  if (values.redirect) {
    return <Redirect to={`show/${values.newShowId}`} />;
  }

  return (
    <AddShowForm onSubmit={handleSubmit} loading={values.loading} method="post">
      <h2>Add a New Show</h2>
      <Error error={values.error} />
      <label htmlFor="title">Title</label>
      <input
        type="text"
        placeholder="Hamlet"
        name="title"
        id="title"
        value={values.title}
        onChange={handleChange}
        required
      />
      <label htmlFor="description">Show Description</label>
      <input
        type="text"
        placeholder="Hamlet is about a boy"
        name="description"
        id="description"
        value={values.description}
        onChange={handleChange}
        required
      />
      <label htmlFor="playwright">Playwright</label>
      <input
        type="text"
        placeholder="William Shakespeare"
        name="playwright"
        id="playwright"
        value={values.playwright}
        onChange={handleChange}
      />
      <label htmlFor="author">Author</label>
      <input
        type="text"
        placeholder="Author"
        name="author"
        id="author"
        value={values.author}
        onChange={handleChange}
      />
      <label htmlFor="translator">Translator</label>
      <input
        type="text"
        placeholder="Translator"
        name="translator"
        id="translator"
        value={values.translator}
        onChange={handleChange}
      />
      <legend>Add Characters</legend>
      <AddCharacterField>
        <input
          type="text"
          placeholder="Character"
          name="name"
          id="name"
          value={values.name}
          onChange={handleChange}
        />
        <textarea
          placeholder="Character Description"
          name="charDescription"
          id="charDescription"
          value={values.charDescription}
          onChange={handleChange}
        />
        <button type="button" onClick={handleAddCharacter}>
          Add
        </button>
      </AddCharacterField>
      <legend>Added Characters</legend>
      <AddedCharacters>
        {values.cast.map((char, index) => {
          return (
            <Character key={`${char.name}-${index}`}>
              <p>{char.name}</p>
              <p>{char.description}</p>
              <button
                type="button"
                onClick={e => handleRemoveCharacter(e, char.name)}
              >
                X
              </button>
            </Character>
          );
        })}
      </AddedCharacters>
      <label htmlFor="tags">Show Tags</label>
      <input
        type="text"
        placeholder="Add show tags, separated by a comma"
        name="tags"
        id="tags"
        value={values.tags}
        onChange={handleChange}
        required
      />
      <button type="submit">Add{values.loading && "ing"} Show</button>
    </AddShowForm>
  );
};

export default AddShow;
