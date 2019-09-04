import React, { useState, useEffect } from "react";
import { firestore } from "../firebase/firebase.utils";

const CastShow = props => {
  const [show, setShow] = useState({});
  const [cast, setCast] = useState([]);
  useEffect(() => {
    async function getShow() {
      const show = await firestore.doc(`shows/${props.match.params.id}`);
      const cast = await firestore
        .doc(`shows/${props.match.params.id}`)
        .collection("cast");
      show.onSnapshot(snapshot => {
        console.log(snapshot.data());
        setShow(snapshot.data());
      });
      cast.onSnapshot(snapshot => {
        setCast(snapshot.data());
      });
    }
    getShow();
  }, []);

  return (
    <div>
      <h3>{show.title}</h3>
      <h4>By {show.playwright}</h4>
    </div>
  );
};

export default CastShow;
