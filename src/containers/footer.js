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
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  align-items: center;
  @media (max-width: 768px) {
    grid-auto-columns: 1fr;
  }
  & button {
    border: none;
    background: none;
    font-size: ${props => props.theme.fontSize.information};
    color: ${props => props.theme.primary5};
    padding: 0;
    margin: 0;
    @media (max-width: 768px) {
      margin-top: 16px;
    }
  }
  & a {
    @media (max-width: 768px) {
      margin-top: 16px;
    }
  }
`;

const Footer = props => {
  const { user } = props;

  const handleSignout = () => {
    auth.signOut();
    props.setUserNull();
  };

  return (
    <FooterStyles>
      <p>
        Hi{props.user && " " + props.user.displayName}! Cast My Show is an app
        that lets you cast your friends in your favourite shows!
      </p>
      <FooterNav>
        <Link to="/">Find a Show</Link>
        {user && user.email ? (
          <>
            <Link to="/addshow">Add a Show</Link>

            <button onClick={handleSignout}>Sign Out</button>
          </>
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
