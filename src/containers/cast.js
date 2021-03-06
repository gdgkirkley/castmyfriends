import React, { useState, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import { auth, createUserProfileDoc } from "../firebase/firebase.utils";
import styled from "styled-components";
import Signin from "../components/Signin";
import Signup from "../components/Signup";
import AddShow from "../components/AddShow";
import EditShow from "../components/EditShow";
import Header from "./header";
import Footer from "./footer";
import SearchPage from "./find";
import Show from "./show";
import Profile from "./profile";

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

  const setActiveShow = show => {
    if (show === values.activeShow) return;
    console.log("running");
    setValues({
      ...values,
      activeShow: show,
    });
  };

  const setUserNull = () => {
    setValues({
      ...values,
      user: null,
    });
  };

  return (
    <CastListContainer>
      <Header user={values.user} setUserNull={setUserNull} />
      <Switch>
        <Route path="/signin" render={() => <Signin user={values.user} />} />
        <Route path="/signup" component={Signup} />
        <Route
          path="/addshow"
          render={props => <AddShow {...props} user={values.user} />}
        />
        <Route
          exact
          path="/show/:id/edit"
          render={props => (
            <EditShow {...props} user={values.user} show={values.activeShow} />
          )}
        />
        <Route
          path="/show/:id"
          render={props => (
            <Show {...props} user={values.user} setActiveShow={setActiveShow} />
          )}
        />
        <Route
          path="/profile"
          render={props => <Profile {...props} user={values.user} />}
        />
        <Route exact path="/" component={SearchPage} />
      </Switch>
      <Footer user={values.user} setUserNull={setUserNull} />
    </CastListContainer>
  );
};

export default Cast;
