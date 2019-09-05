import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { firestore } from "../firebase/firebase.utils";
import Error from "../components/Error";
import CastList from "../components/CastList";
import CastShow from "../components/CastShow";

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
  const [casting, setCasting] = useState(false);

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
        const activeShow = {
          id: snapshot.id,
          ...snapshot.data(),
        };
        setShow(activeShow);
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

  const handleCasting = () => {
    setCasting(!casting);
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
      <div>
        <button type="button" onClick={handleCasting}>
          {casting ? "Go Back" : "Cast this Show!"}
        </button>
      </div>
      <h4>Characters</h4>
      {casting ? (
        <CastShow
          cast={cast}
          show={show}
          user={props.user}
          handleCasting={handleCasting}
        />
      ) : (
        <CastList cast={cast} />
      )}
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
