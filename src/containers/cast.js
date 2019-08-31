import React, { useState, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import { auth, createUserProfileDoc } from "../firebase/firebase.utils";
import styled from "styled-components";
import Search from "../components/Search";
import Signin from "../components/Signin";
import Signup from "../components/Signup";
import Footer from "./footer";

const CastListContainer = styled.div`
  display: grid;
  align-content: space-between;
  justify-content: center;
  grid-template-columns: 1fr;
`;

const Cast = () => {
  const [values, setValues] = useState({
    user: "",
  });

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      const currentUser = createUserProfileDoc(user);
      setValues({
        ...values,
        user: currentUser,
      });
    });
  }, []);

  return (
    <CastListContainer>
      <Switch>
        <Route exact path="/" component={Search} />
        <Route exact path="/signin" component={Signin} />
        <Route exact path="/signup" component={Signup} />
      </Switch>
      <Footer user={values.user} />
    </CastListContainer>
  );
};

export default Cast;
