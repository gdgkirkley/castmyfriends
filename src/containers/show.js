import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { firestore } from "../firebase/firebase.utils";
import Error from "../components/Error";

const ShowStyles = styled.div`
  display: grid;
  justify-content: center;
  align-items: center;
  text-align: center;
  & button {
    padding: 16px 24px;
    margin: 24px;
    color: white;
    background: ${props => props.theme.primary5};
    border: none;
    border-radius: ${props => props.theme.borderRadius};
    font-size: ${props => props.theme.fontSize.emphasis};
    &:hover {
      background: ${props => props.theme.primary4};
      cursor: pointer;
    }
  }
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

const Wiki = styled.div`
  display: grid;
  justify-content: center;
  align-items: center;
  background: ${props => props.theme.grey10};
  padding: 16px;
`;

const WikiContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  text-align: left;
  align-items: start;
  justify-items: center;
  & h3 {
    margin: 0%;
  }
`;

const PlaceHolderImg = styled.div`
  height: 200px;
  width: 200px;
  background: ${props => props.theme.grey8};
`;

const Show = props => {
  const [show, setShow] = useState({});
  const [cast, setCast] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [wiki, setWiki] = useState({});

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
        setShow({
          id: snapshot.id,
          ...snapshot.data(),
        });
        setLoading(false);
      });
    }
    getShow();
  }, [props.match.params.id]);

  useEffect(() => {
    if (show.title) {
      async function getWiki() {
        const requestTitle = formatRequestTitle(show.title);
        fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${requestTitle}`,
          {
            method: "get",
          }
        )
          .then(res => res.json())
          .then(res => {
            console.log(res);

            setWiki(res);
          })
          .catch(err => {
            setErr(err.message);
          });
      }
      getWiki();
    }
  }, [show.title]);

  const formatRequestTitle = title => {
    return title.replace(" ", "_");
  };

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
      <Link to={`cast/${show.id}`}>
        <button type="button">Cast this Show!</button>
      </Link>
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
      <h2>Learn More</h2>
      {wiki.title && wiki.title !== "Not found." ? (
        <Wiki>
          <h4>From Wikipedia:</h4>
          <WikiContent>
            {wiki.thumbnail ? (
              <img
                src={wiki.thumbnail.source}
                width={wiki.thumbnail.width}
                height={wiki.thumbnail.height}
                alt={wiki.title}
              />
            ) : (
              <PlaceHolderImg />
            )}
            <div>
              <h3>
                <a
                  href={wiki.content_urls.desktop.page}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {wiki.title}
                </a>
              </h3>
              <p>{wiki.extract}</p>
              <a
                href={wiki.content_urls.desktop.page}
                target="_blank"
                rel="noopener noreferrer"
              >
                Keep Reading
              </a>
            </div>
          </WikiContent>
        </Wiki>
      ) : null}
    </ShowStyles>
  );
};

export default Show;
