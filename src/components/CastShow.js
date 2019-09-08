import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { firestore } from "../firebase/firebase.utils";

const CastingForm = styled.form`
  display: grid;
  align-content: center;
  justify-content: center;
  grid-template-columns: 1fr 1fr;
  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
  & fieldset {
    display: contents;
    border: none;
    margin: 0;
    padding: 0;
    & button {
      margin: 0;
      border-radius: 0px 4px 4px 0px;
      &:disabled {
        background: ${props => props.theme.grey5};
        cursor: normal;
      }
    }
  }
  & input {
    padding: 16px 24px;
    font-size: ${props => props.theme.fontSize.reading};
    border-radius: 4px 0px 0px 4px;
    border: 1px solid ${props => props.theme.grey8};
    &:hover {
      border: 1px solid ${props => props.theme.primary7};
    }
  }
`;

const Instructions = styled.p`
  font-size: ${props => props.theme.fontSize.information};
  color: ${props => props.theme.grey7};
  margin-bottom: 32px;
`;

const CharacterCasting = styled.div`
  display: grid;
  align-items: start;
  justify-items: center;
  margin-bottom: 32px;
  & label {
    display: inline-flex;
    font-weight: bold;
    color: ${props => (props.cast ? props.theme.primary5 : props.theme.grey5)};
  }
  & p {
    font-size: ${props => props.theme.fontSize.information};
    margin: 8px 0px;
    color: ${props => props.theme.grey6};
  }
`;

const CastInput = styled.div`
  display: grid;
  align-items: stretch;
  grid-template-columns: 3fr 1fr;
`;

const CastActors = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin: 8px 0px;
  min-height: 60px;
  width: 80%;
  border: 1px solid ${props => props.theme.accent10};
  & p {
    background: ${props => props.theme.primary5};
    color: white;
    border-radius: ${props => props.theme.borderRadius};
    padding: 8px 16px;
    transition: 0.4s linear;
    margin: 8px;
    &:after {
      content: "x";
      display: none;
    }
    &:hover {
      background: ${props => props.theme.primary4};
      cursor: grab;
      &:after {
        content: "x";
        display: inline-flex;
        margin-left: 8px;
        cursor: pointer;
      }
    }
  }
`;

const CastShow = props => {
  let characters = {};
  props.cast.map(char => {
    return (characters = {
      ...characters,
      [char.name]: "",
      castDescription: "",
    });
  });

  const [values, setValues] = useState(characters);
  const [cast, setCast] = useState({});

  useEffect(() => {
    if (props.castList.id) {
      setCast(props.castList.cast);
    }
  }, [props.castList]);

  const handleChange = e => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleAdd = e => {
    const { name } = e.target;
    const value = values[name];
    const newCast = cast[name] ? [...cast[name], value] : [value];
    setCast({
      ...cast,
      [name]: newCast,
    });
    setValues({
      ...values,
      [name]: "",
    });
  };

  const handleRemove = (name, actor) => {
    const filteredCast = cast[name].filter(char => {
      return char !== actor;
    });
    setCast({
      ...cast,
      [name]: filteredCast,
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const { show } = props;
    if (props.castList) {
      await firestore
        .doc(`users/${props.user.id}/casts/${props.castList.id}`)
        .update({
          cast: cast,
          lastUpdate: new Date(),
        });
      props.getCasts();
      return props.handleCasting();
    }
    await firestore.collection(`users/${props.user.id}/casts`).add({
      id: show.id,
      show: {
        id: show.id,
        title: show.title,
        description: show.description,
        playwright: show.playwright,
        author: show.author,
        translator: show.translator,
      },
      cast: cast,
      created: new Date(),
    });
    props.getCasts();
    props.handleCasting();
  };

  const handleDragStart = (e, actor, char) => {
    e.persist();
    e.dataTransfer.setData("value", actor);
    e.dataTransfer.setData("char", char);
  };

  const handleDragOver = e => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e, name) => {
    e.persist();

    const value = e.dataTransfer.getData("value");
    const newCast = cast[name] ? [...cast[name], value] : [value];

    const oldChar = e.dataTransfer.getData("char");
    let oldCast;
    if (!e.shiftKey) {
      oldCast = cast[oldChar].filter(char => {
        return char !== value;
      });
    } else {
      oldCast = cast[oldChar];
    }

    setCast({
      ...cast,
      [name]: newCast,
      [oldChar]: oldCast,
    });
  };

  const isCast = name => {
    if (!cast[name] || !cast[name].length) return false;
    return true;
  };

  return (
    <div>
      <h3>{props.castList ? "Edit" : "New"} Cast List</h3>
      <Instructions>
        Drag and drop to move an actor, or hold shift and drop to copy.
      </Instructions>
      <CastingForm method="post" onSubmit={handleSubmit}>
        <fieldset>
          {props.cast &&
            props.cast.map(char => {
              return (
                <CharacterCasting key={char.name} cast={isCast(char.name)}>
                  <label htmlFor={char.name}>{char.name}</label>
                  <p>{char.description}</p>
                  <CastInput>
                    <input
                      type="text"
                      value={values[char.name]}
                      onChange={handleChange}
                      name={char.name}
                      id={char.name}
                    />
                    <button
                      type="button"
                      name={char.name}
                      onClick={handleAdd}
                      disabled={!values[char.name]}
                    >
                      +
                    </button>
                  </CastInput>
                  <CastActors
                    onDrop={e => handleDrop(e, char.name)}
                    onDragOver={handleDragOver}
                  >
                    {cast[char.name] &&
                      cast[char.name].map(actor => {
                        return (
                          <p
                            key={actor}
                            name={actor}
                            id={actor}
                            onClick={() => handleRemove(char.name, actor)}
                            onDragStart={e =>
                              handleDragStart(e, actor, char.name)
                            }
                            draggable
                          >
                            {actor}
                          </p>
                        );
                      })}
                  </CastActors>
                </CharacterCasting>
              );
            })}
        </fieldset>
        <button type="submit">Save Cast</button>
      </CastingForm>
    </div>
  );
};

export default CastShow;
