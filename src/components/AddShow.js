import React, { useState } from "react";
import styled from "styled-components";
import { firestore } from "../firebase/firebase.utils";
import Error from "./Error";

const AddShowForm = styled.form`
  display: grid;
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

const AddCharacterField = styled.fieldset`
  display: grid;
  align-items: center;
  grid-template-columns: 1fr 1fr 1fr;
  border: none;
  padding: 0;
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
    error: "",
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

  const handleSubmit = async e => {
    e.preventDefault();
    const newShow = await firestore
      .collection("shows")
      .add({
        title: values.title,
        description: values.description,
        playwright: values.playwright,
        author: values.author,
        translator: values.translator,
        createdAt: new Date(),
        createdBy: props.user.id || 0,
      })
      .catch(err => {
        setValues({
          ...values,
          error: err,
        });
      });
    if (newShow.id) {
      await firestore
        .doc(`shows/${newShow.id}`)
        .collection("cast")
        .add({
          ...values.cast,
        });
    }
  };

  return (
    <AddShowForm onSubmit={handleSubmit}>
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
      />
      <label htmlFor="description">Show Description</label>
      <input
        type="text"
        placeholder="Hamlet is about a boy"
        name="description"
        id="description"
        value={values.description}
        onChange={handleChange}
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
          Add Character
        </button>
        <div>
          <h3>Added Characters</h3>
          {values.cast.map((char, index) => {
            return (
              <div key={`${char.name}-${index}`}>
                {char.name}
                <br />
                {char.description}
              </div>
            );
          })}
        </div>
      </AddCharacterField>
      <button type="submit">Add Show</button>
    </AddShowForm>
  );
};

export default AddShow;
