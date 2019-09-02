import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { auth } from "../firebase/firebase.utils";

const FooterStyles = styled.div`
  font-size: ${props => props.theme.fontSize.information};
  display: grid;
  justify-content: center;
  text-align: center;
  margin: 50px 0px;
`;

const FooterNav = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
`;

const Footer = props => {
  const { user } = props;
  return (
    <FooterStyles>
      <p>
        Hi {props.user.displayName}! Cast My Friends is an app that lets you
        cast your friends in your favourite shows!
      </p>
      <FooterNav>
        <Link to="/">Find a Show</Link>
        {user && user.email ? (
          <button onClick={() => auth.signOut()}>Sign Out</button>
        ) : (
          <>
            <Link to="/signin">Sign In</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </FooterNav>
    </FooterStyles>
  );
};

export default Footer;
