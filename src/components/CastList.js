import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const CastListStyles = styled.div`
  font-size: ${props => props.theme.fontSize.reading};
  display: grid;
  justify-content: space-around;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  padding: 10px;
  text-align: center;
  @media (max-width: 768px) {
    grid-auto-flow: row;
    grid-gap: 8px;
    &.description {
      display: none;
    }
  }
  & strong {
    color: ${props => props.theme.primary1};
    &.actor {
      color: ${props => props.theme.primary5};
    }
  }
  & span {
    color: ${props => props.theme.accent5};
  }
`;

const CastList = props => {
  const {
    cast,
    viewing: { viewing, index },
    castList,
  } = props;

  return (
    <>
      {cast.length ? (
        cast.map(char => {
          return (
            <CastListStyles key={char.name}>
              <div>
                <strong>{char.name}</strong>
              </div>
              {!viewing && (
                <div>
                  <span>{char.description}</span>
                </div>
              )}
              {viewing && castList.length ? (
                castList[index].cast[char.name] ? (
                  <div>
                    <strong className="actor">
                      {castList[index].cast[char.name].join(", ")}
                    </strong>
                  </div>
                ) : (
                  <div>
                    <strong>No actor found...</strong>
                  </div>
                )
              ) : null}
            </CastListStyles>
          );
        })
      ) : (
        <p>
          Hmm... looks like there are no characters to be found. You can help by
          <Link to={`/show/${props.showId}/edit`}> adding them now!</Link>
        </p>
      )}
    </>
  );
};

export default CastList;
