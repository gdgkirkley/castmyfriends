import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { firestore } from "../firebase/firebase.utils";
import Error from "../components/Error";

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
  display: grid;
  justify-content: center;
  grid-template-columns: 1fr 1fr;
  padding: 10px;
  text-align: center;
  & strong {
    color: ${props => props.theme.primary1};
  }
  & span {
    color: ${props => props.theme.accent5};
  }
`;

const Show = props => {
  const [show, setShow] = useState({});
  const [cast, setCast] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getShow() {
      setLoading(true);
      const show = await firestore.doc(`shows/${props.match.params.id}`);
      await firestore
        .doc(`shows/${props.match.params.id}`)
        .collection("cast")
        .get()
        .then(snapshot => {
          snapshot.forEach(snap => {
            setCast(Object.values(snap.data()));
          });
        })
        .catch(err => {
          setErr(err.message);
        });
      show.onSnapshot(snapshot => {
        setShow(snapshot.data());
        setLoading(false);
      });
    }
    getShow();
  }, [props.match.params.id]);

  if (loading) {
    return <ShowStyles>Loading...</ShowStyles>;
  }

  if (err) {
    return <Error error={err} />;
  }

  return (
    <ShowStyles>
      <Title>{show.title}</Title>
      <h4>By {show.playwright}</h4>
      <p>{show.description}</p>
      <h4>Characters</h4>
      {cast.length
        ? cast.map(char => {
            return (
              <CastList key={char.name}>
                <div>
                  <strong>{char.name}</strong>
                </div>
                <div>
                  <span>{char.description}</span>
                </div>
              </CastList>
            );
          })
        : null}
    </ShowStyles>
  );
};

export default Show;
