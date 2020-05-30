import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import styled from "styled-components";
import { firestore } from "../firebase/firebase.utils";
import Error from "./Error";

export const AddShowForm = styled.form`
  display: grid;
  background: ${(props) => (props.loading ? "grey" : "none")};
  & input,
  textarea {
    padding: 16px 24px;
    margin-bottom: 24px;
    margin-top: 8px;
    font-size: ${(props) => props.theme.fontSize.reading};
    border-radius: ${(props) => props.theme.borderRadius};
    border: 1px solid ${(props) => props.theme.grey8};
    width: 100%;
    &:hover {
      border: 1px solid ${(props) => props.theme.primary7};
    }
  }
  & label {
    font-size: ${(props) => props.theme.fontSize.emphasis};
    margin: 8px 0px;
  }
  & button {
    background: ${(props) => props.theme.primary5};
    color: white;
    border: none;
    padding: 16px 24px;
    &:hover {
      cursor: pointer;
      background: ${(props) => props.theme.primary4};
    }
  }
`;

export const AddCharacterField = styled.div`
  display: grid;
  justify-content: center;
  align-items: center;
  grid-template-columns: 1fr;
  grid-gap: 16px;
  padding: 16px 0px;
  margin-bottom: 16px;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
  & div {
    display: grid;
  }
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
    background-color: ${(props) => props.theme.primary5};
    color: #fff;
    padding: 4px 8px;
    border-radius: ${(props) => props.theme.borderRadius};
  }
`;

export const AddedCharacters = styled.div`
  display: grid;
  border: 1px solid ${(props) => props.theme.accent9};
  padding: 16px 24px;
  margin: 16px 0px;
`;

export const Character = styled.div`
  display: grid;
  grid-gap: 24px;
  grid-template-columns: 1fr 1fr 0.2fr;
  justify-content: space-around;
  align-items: center;
`;

export const Credits = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-content: space-between;
  grid-gap: 24px;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-gap: 0px;
  }
`;

const AddShow = (props) => {
  const [values, setValues] = useState({
    title: "",
    description: "",
    playwright: "",
    author: "",
    translator: "",
    book: "",
    music: "",
    lyrics: "",
    name: "",
    charDescription: "",
    cast: [],
    tags: [],
    error: "",
    loading: false,
    redirect: false,
    newShowId: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleAddCharacter = (e) => {
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
    const newChars = values.cast.filter((char) => {
      return char.name !== name;
    });
    setValues({
      ...values,
      cast: [...newChars],
    });
  };

  const separateTags = (tags) => {
    return tags.toLowerCase().replace(" ", "").split(",");
  };

  const separateTitle = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-zA-Z ]/g, "")
      .split(" ");
  };

  const getFirstLetter = (title) => {
    return title.toLowerCase().charAt(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!values.cast.length) {
      return alert("Cannot create a show with no characters!");
    }
    setValues({
      ...values,
      loading: true,
    });
    const sepTags = separateTags(values.tags);
    const titleSearch = separateTitle(values.title);
    const keywords = titleSearch.concat(sepTags);
    const firstLetter = getFirstLetter(values.title);
    const newShow = await firestore
      .collection("shows")
      .add({
        title: values.title,
        description: values.description,
        playwright: values.playwright,
        author: values.author,
        translator: values.translator,
        book: values.book,
        music: values.music,
        lyrics: values.lyrics,
        tags: sepTags,
        keywords: keywords,
        firstLetter: firstLetter,
        castSize: values.cast.length,
        cast: values.cast,
        createdAt: new Date(),
        createdBy: props.user.id || 0,
      })
      .catch((err) => {
        setValues({
          ...values,
          error: err,
          loading: false,
        });
      });
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
    <AddShowForm
      role="form"
      onSubmit={handleSubmit}
      loading={values.loading ? values.loading : undefined}
      method="post"
    >
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
      <h2>Credits</h2>
      <Credits>
        <label htmlFor="playwright">
          Playwright
          <input
            type="text"
            placeholder="William Shakespeare"
            name="playwright"
            id="playwright"
            value={values.playwright}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="book">
          Book
          <input
            type="text"
            placeholder="Wrote the book of the musical"
            name="book"
            id="book"
            value={values.book}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="music">
          Music
          <input
            type="text"
            placeholder="Wrote the music of the musical"
            name="music"
            id="music"
            value={values.music}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="lyrics">
          Lyrics
          <input
            type="text"
            placeholder="Wrote the lyrics of the musical"
            name="lyrics"
            id="lyrics"
            value={values.lyrics}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="author">
          Author
          <input
            type="text"
            placeholder="Wrote the original work"
            name="author"
            id="author"
            value={values.author}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="translator">
          Translator
          <input
            type="text"
            placeholder="Translated the work from it's original language"
            name="translator"
            id="translator"
            value={values.translator}
            onChange={handleChange}
          />
        </label>
      </Credits>
      <h2>Add Characters</h2>
      <AddCharacterField>
        <div>
          <label htmlFor="name">Character Name</label>
          <input
            type="text"
            placeholder="Character"
            name="name"
            id="name"
            value={values.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="charDescription">Character Description</label>
          <textarea
            placeholder="Character Description"
            name="charDescription"
            id="charDescription"
            value={values.charDescription}
            onChange={handleChange}
          />
        </div>
        <button type="button" onClick={handleAddCharacter}>
          Add
        </button>
      </AddCharacterField>
      <legend>Added Characters</legend>
      <AddedCharacters>
        {values.cast.length ? (
          values.cast.map((char, index) => {
            return (
              <Character key={`${char.name}-${index}`}>
                <p>{char.name}</p>
                <p>{char.description}</p>
                <button
                  type="button"
                  onClick={(e) => handleRemoveCharacter(e, char.name)}
                >
                  X
                </button>
              </Character>
            );
          })
        ) : (
          <p>Nothing to display! Add a character above.</p>
        )}
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
