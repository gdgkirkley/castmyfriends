import React, { useState } from "react";
import styled from "styled-components";

const CastingForm = styled.form`
  display: grid;
  align-content: center;
  justify-content: center;
  grid-template-columns: 1fr 1fr;
  & fieldset {
    display: contents;
    border: none;
    margin: 0;
    padding: 0;
    & label {
      display: inline-flex;
      font-weight: bold;
    }
    & button {
      margin: 0;
      border-radius: 0px 4px 4px 0px;
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

const CharacterCasting = styled.div`
  display: grid;
  align-items: start;
  justify-items: center;
  margin-bottom: 32px;
  & p {
    font-size: ${props => props.theme.fontSize.information};
    margin: 8px 0px;
    color: ${props => props.theme.grey6};
  }
`;

const CastInput = styled.div`
  display: grid;
  align-items: start;
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
      cursor: pointer;
      &:after {
        content: "x";
        display: inline-flex;
        margin-left: 8px;
      }
    }
  }
`;

const CastShow = props => {
  const [values, setValues] = useState({});
  const [cast, setCast] = useState({});

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

  const handleSubmit = e => {
    e.preventDefault();
  };

  const handleDragStart = (e, actor) => {
    e.persist();
    e.dataTransfer.setData("value", actor);
    console.log("Drag", e);
  };

  const handleDragOver = e => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e, name) => {
    e.persist();
    const value = e.dataTransfer.getData("value");
    const newCast = cast[name] ? [...cast[name], value] : [value];
    setCast({
      ...cast,
      [name]: newCast,
    });
  };

  return (
    <div>
      <CastingForm method="post" onSubmit={handleSubmit}>
        <fieldset>
          {props.cast.map(char => {
            return (
              <CharacterCasting key={char.name}>
                <label htmlFor={char.name}>{char.name}</label>
                <p>{char.description}</p>
                <CastInput>
                  <input
                    type="text"
                    defaultValue={char.name}
                    value={values[char.name]}
                    onChange={handleChange}
                    name={char.name}
                    id={char.name}
                  />
                  <button type="button" name={char.name} onClick={handleAdd}>
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
                          onDragStart={e => handleDragStart(e, actor)}
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
