import React from "react";
import styled from "styled-components";

const CastListStyles = styled.div`
  font-size: ${props => props.theme.fontSize.reading};
  display: grid;
  justify-content: space-around;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  padding: 10px;
  text-align: center;
  & strong {
    color: ${props => props.theme.primary1};
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
      {cast.length
        ? cast.map(char => {
            return (
              <CastListStyles key={char.name}>
                <div>
                  <strong>{char.name}</strong>
                </div>
                <div>
                  <span>{char.description}</span>
                </div>
                {viewing && castList.length ? (
                  castList[index].cast[char.name] ? (
                    <div>
                      <strong>
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
        : null}
    </>
  );
};

export default CastList;
