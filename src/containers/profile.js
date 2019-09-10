import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { firestore } from "../firebase/firebase.utils";
import { formatDate } from "../lib/helpers";

const ProfileStyle = styled.div`
  display: grid;
  justify-content: center;
  text-align: center;
  & h2 {
    align-self: flex-start;
  }
`;

const CastLink = styled.div`
  display: grid;
  border-bottom: 1px solid ${props => props.theme.accent9};
  margin: 16px 0px;
  padding: 8px 0px;
  & h4 {
    margin: 0;
  }
`;

const Created = styled.p`
  font-size: ${props => props.theme.fontSize.information};
`;

const Profile = props => {
  const [casts, setCasts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!props.user) return;
    setLoading(true);
    async function getCasts() {
      const castRef = await firestore
        .collection(`users/${props.user.id}/casts`)
        .get();
      const newUserCasts = [];
      castRef.docs.map(doc => {
        const data = doc.data();
        const id = doc.id;
        const newCast = { ...data, id };
        return newUserCasts.push(newCast);
      });
      setCasts(newUserCasts);
      setLoading(false);
    }
    getCasts();
  }, [props.user]);

  if (!props.user | loading) {
    return <ProfileStyle>Loading...</ProfileStyle>;
  }

  return (
    <ProfileStyle>
      <h2>You have casts for:</h2>
      {!casts.length ? (
        <div>
          You have no casts... <Link to="/">Find a show!</Link>
        </div>
      ) : null}
      {casts.length
        ? casts.map(cast => {
            return (
              <CastLink key={cast.id}>
                <Link to={`/show/${cast.show.id}`}>{cast.show.title}</Link>
                <Created>
                  Created on{" "}
                  {formatDate(cast.created.toDate(), {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </Created>
              </CastLink>
            );
          })
        : null}
    </ProfileStyle>
  );
};

export default Profile;
