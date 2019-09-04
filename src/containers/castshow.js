import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { firestore } from "../firebase/firebase.utils";

const ShowStyles = styled.div`
  display: grid;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const Title = styled.div`
  font-size: ${props => props.theme.fontSize.title};
`;

const CastList = styled.div`
  font-size: ${props => props.theme.fontSize.reading};
  & span {
    color: ${props => props.theme.accent5};
  }
`;

const CastShow = props => {
  const [show, setShow] = useState({});
  const [cast, setCast] = useState([]);
  useEffect(() => {
    async function getShow() {
      const show = await firestore.doc(`shows/${props.match.params.id}`);
      await firestore
        .doc(`shows/${props.match.params.id}`)
        .collection("cast")
        .get()
        .then(snapshot => {
          snapshot.forEach(snap => {
            setCast(Object.values(snap.data()));
          });
        });
      show.onSnapshot(snapshot => {
        console.log(snapshot.data());
        setShow(snapshot.data());
      });
    }
    getShow();
  }, [props.match.params.id]);

  return (
    <ShowStyles>
      <Title>{show.title}</Title>
      <h4>By {show.playwright}</h4>
      {cast.length &&
        cast.map(char => {
          return (
            <CastList key={char.name}>
              <strong>{char.name}</strong>
              <span>{char.description}</span>
            </CastList>
          );
        })}
    </ShowStyles>
  );
};

export default CastShow;
