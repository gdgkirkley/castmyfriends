import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { firestore } from "../firebase/firebase.utils";
import Error from "./Error";
import {
  AddShowForm,
  AddCharacterField,
  AddedCharacters,
  Character,
  Credits,
} from "./AddShow";

const EditShow = props => {
  const { show } = props;
  const loadedTags = show.tags && show.tags.toString();
  const [values, setValues] = useState({
    title: show.title || "",
    description: show.description || "",
    playwright: show.playwright || "",
    author: show.author || "",
    translator: show.translator || "",
    book: show.book || "",
    music: show.music || "",
    lyrics: show.lyrics || "",
    name: "",
    charDescription: "",
    cast: show.cast || [],
    tags: loadedTags || [],
    error: "",
    loading: false,
    redirect: false,
  });

  useEffect(() => {
    if (!show.title) {
      async function getShow() {
        const show = await firestore
          .doc(`shows/${props.match.params.id}`)
          .get()
          .catch(err => {
            setValues(values => ({
              ...values,
              err,
            }));
          });
        const data = show.data();
        const id = show.id;
        const loadTags = data.tags.toString();
        setValues(values => ({
          ...values,
          id,
          ...data,
          tags: loadTags,
        }));
      }
      getShow();
    }
  }, [show.title, props.match.params.id]);

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
    const keywords = titleSearch.concat(sepTags);
    await firestore
      .doc(`shows/${show.id}`)
      .update({
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
        cast: values.cast,
      })
      .catch(err => {
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
    });
  };

  if (values.redirect) {
    return <Redirect to={`show/${show.id}`} />;
  }

  return (
    <AddShowForm onSubmit={handleSubmit} method="post">
      <h2>Edit {values.title}</h2>
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
      <button type="submit">Updat{values.loading ? "ing" : "e"} Show</button>
    </AddShowForm>
  );
};

export default EditShow;
