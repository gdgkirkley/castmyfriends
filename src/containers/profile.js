import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { firestore } from "../firebase/firebase.utils";
import { formatDate } from "../lib/helpers";

const Profile = props => {
  const [casts, setCasts] = useState([]);
  useEffect(() => {
    if (!props.user) return;

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
    }
    getCasts();
  }, [props.user]);

  return (
    <div>
      <p>You have casts for:</p>
      {casts.length
        ? casts.map(cast => {
            return (
              <div key={cast.id}>
                <Link to={`/show/${cast.show.id}`}>{cast.show.title}</Link>
                <p>
                  Created on{" "}
                  {formatDate(cast.created.toDate(), {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </p>
              </div>
            );
          })
        : null}
    </div>
  );
};

export default Profile;
