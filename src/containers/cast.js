import React, { useState, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import { auth } from "../firebase/firebase.utils";
import styled from "styled-components";
import Search from "../components/Search";
import Signin from "../components/Signin";
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
    let unsubscribeFromAuth = auth.onAuthStateChanged(user => {
      setValues({
        ...values,
        user,
      });
    });

    return unsubscribeFromAuth();
  }, [values]);

  return (
    <CastListContainer>
      <Switch>
        <Route exact path="/" component={Search} />
        <Route exact path="/signin" component={Signin} />
      </Switch>
      <Footer user={values.user} />
    </CastListContainer>
  );
};

export default Cast;
