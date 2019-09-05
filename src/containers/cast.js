import React, { useState, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import { auth, createUserProfileDoc } from "../firebase/firebase.utils";
import styled from "styled-components";
import Signin from "../components/Signin";
import Signup from "../components/Signup";
import AddShow from "../components/AddShow";
import Footer from "./footer";
import SearchPage from "./find";
import Show from "./show";

const CastListContainer = styled.div`
  display: grid;
  align-content: space-between;
  justify-content: center;
  grid-template-columns: 1fr;
`;

const Cast = () => {
  const [values, setValues] = useState({
    user: "",
    activeShow: {},
  });

  useEffect(() => {
    const unlisten = auth.onAuthStateChanged(async userAuth => {
      if (userAuth) {
        const currentUser = await createUserProfileDoc(userAuth);
        currentUser.onSnapshot(snapshot => {
          setValues(values => ({
            ...values,
            user: {
              id: snapshot.id,
              ...snapshot.data(),
            },
          }));
        });
      }
    });

    return () => {
      unlisten();
    };
  }, []);

  return (
    <CastListContainer>
      <Switch>
        <Route exact path="/" component={SearchPage} />
        <Route exact path="/signin" component={Signin} />
        <Route exact path="/signup" component={Signup} />
        <Route
          exact
          path="/addshow"
          render={props => <AddShow {...props} user={values.user} />}
        />
        <Route
          exact
          path="/show/:id"
          render={props => <Show {...props} user={values.user} />}
        />
      </Switch>
      <Footer user={values.user} />
    </CastListContainer>
  );
};

export default Cast;
