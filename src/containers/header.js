import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { auth } from "../firebase/firebase.utils";

const Head = styled.div`
  display: grid;
  justify-content: center;
`;

const Logo = styled.div`
  font-family: "Viga", Arial, Helvetica, sans-serif;
  font-size: ${props => props.theme.fontSize.display};
  color: ${props => props.theme.primary5};
  text-align: center;
  margin: 10px 0px;
  & span {
    color: ${props => props.theme.accent5};
  }
`;

const Nav = styled.div`
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0px;
  & a {
    display: flex;
    justify-content: center;
    cursor: pointer;
    font-size: ${props => props.theme.fontSize.emphasis};
    width: 192px;
    position: relative;
    padding: 16px;
  }
`;

const Header = props => {
  const { user } = props;

  return (
    <Head>
      <Logo>
        <Link to="/">
          Cast My <span>Show</span>
        </Link>
      </Logo>
      <Nav>
        <Link to="/">Find a Show</Link>
        {user && user.email ? (
          <Link to="/profile">
            <span>My Casts</span>
          </Link>
        ) : (
          <>
            <Link to="/signin">Sign In</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </Nav>
    </Head>
  );
};

export default Header;
