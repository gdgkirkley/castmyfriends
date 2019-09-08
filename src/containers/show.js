import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { firestore } from "../firebase/firebase.utils";
import Error from "../components/Error";
import CastList from "../components/CastList";
import CastShow from "../components/CastShow";
import { formatDate } from "../lib/helpers";

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
  const [userCasts, setUserCasts] = useState({});
  const [viewingCasts, setViewingCasts] = useState({
    viewing: false,
    index: 0,
  });

  const { setActiveShow } = props;
  useEffect(() => {
    async function getShow() {
      setLoading(true);
      const show = await firestore
        .doc(`shows/${props.match.params.id}`)
        .get()
        .catch(err => {
          setErr(err.message);
        });
      const data = show.data();
      const id = show.id;
      setShow({ id, ...data });
      setCast(data.cast || []);
      setLoading(false);
    }
    getShow();
  }, [props.match.params.id]);

  useEffect(() => {
    setActiveShow(show);
  }, [show]);

  useEffect(() => {
    if (!props.user) return;

    async function getCasts() {
      const castRef = await firestore
        .collection(`users/${props.user.id}/casts`)
        .where("show.id", "==", props.match.params.id)
        .get();
      const newUserCasts = [];
      castRef.docs.map(doc => {
        const data = doc.data();
        const id = doc.id;
        const newCast = { ...data, id };
        return newUserCasts.push(newCast);
      });
      setUserCasts(newUserCasts);
    }
    getCasts();
  }, [props.user, props.match.params.id]);

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
    setViewingCasts({
      viewing: false,
      index: viewingCasts.index,
    });
  };

  const handleViewingCasts = () => {
    setViewingCasts({
      viewing: !viewingCasts.viewing,
      index: viewingCasts.index,
    });
  };

  const handleCastListChange = e => {
    setViewingCasts({
      viewing: true,
      index: e.target.value,
    });
  };

  const handleCastListEdit = () => {
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
        {!casting && userCasts.length && (
          <button type="button" onClick={handleViewingCasts}>
            {viewingCasts.viewing ? "Go Back" : "My Cast Lists"}
          </button>
        )}
        {viewingCasts.viewing ? (
          <button type="button" onClick={handleCastListEdit}>
            {casting ? "Go Back" : "Edit Cast"}
          </button>
        ) : (
          <button type="button" onClick={handleCasting}>
            {casting ? "Go Back" : "Cast This Show!"}
          </button>
        )}
      </div>
      <h4>Characters</h4>
      {viewingCasts.viewing && userCasts.length && (
        <p>
          Viewing cast created on{" "}
          <select onChange={handleCastListChange}>
            {userCasts.map((cast, index) => {
              return (
                <option value={index} key={cast.id}>
                  {formatDate(cast.created.toDate(), {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </option>
              );
            })}
          </select>
        </p>
      )}
      {casting ? (
        <CastShow
          cast={cast}
          show={show}
          user={props.user}
          handleCasting={handleCasting}
          castList={viewingCasts.viewing && userCasts[viewingCasts.index]}
        />
      ) : (
        <>
          <CastList cast={cast} castList={userCasts} viewing={viewingCasts} />
        </>
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
      <Link to={`/show/${show.id}/edit`}>Edit Show</Link>
    </ShowStyles>
  );
};

export default Show;
