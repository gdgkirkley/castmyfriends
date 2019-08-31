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

const Footer = props => {
  const { user } = props;
  return (
    <FooterStyles>
      <p>
        Cast My Friends is an app that lets you cast your friends in your
        favourite shows!
      </p>
      <Link to="/">Find a Show</Link>
      {user ? (
        <button onClick={() => auth.signOut()}>Sign Out</button>
      ) : (
        <Link to="/signin">Sign In</Link>
      )}
    </FooterStyles>
  );
};

export default Footer;
