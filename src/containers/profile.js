import React, { useEffect, useState } from "react";
import { firestore } from "../firebase/firebase.utils";
import { get } from "http";

const Profile = props => {
  const [casts, setCasts] = useState({});
  useEffect(() => {
    if (!props.user) return;

    async function getCasts() {
      const castRef = await firestore
        .collection(`users/${props.user.id}/casts`)
        .get();
      castRef.docs.map(doc => {
        const data = doc.data();
        const id = doc.id;
        setCasts({ ...data, id });
      });
    }
    getCasts();
  }, [props.user]);

  return (
    <div>
      <p>You have casts for:</p>
      <p>{casts.id && casts.show.title}</p>
    </div>
  );
};

export default Profile;
