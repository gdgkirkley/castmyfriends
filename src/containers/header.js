import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import CastIcon from "../components/icons/Cast";

const Head = styled.div`
  display: grid;
  justify-content: space-between;
  grid-template-columns: 1.5fr 1fr;
  margin: 30px 0px;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    justify-content: center;
    border-bottom: 1px solid ${props => props.theme.primary10};
  }
`;

const Logo = styled.div`
  font-family: "Viga", Arial, Helvetica, sans-serif;
  font-size: ${props => props.theme.fontSize.display};
  color: ${props => props.theme.primary5};
  text-align: left;
  margin: 10px 0px;
  @media (max-width: 768px) {
    text-align: center;
  }
  & span {
    color: ${props => props.theme.accent5};
  }
`;

const Nav = styled.div`
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  justify-items: flex-end;
  align-items: center;
  margin: 10px 0px;
  & a {
    max-width: 192px;
    display: flex;
    justify-content: center;
    cursor: pointer;
    font-size: ${props => props.theme.fontSize.emphasis};
    border: 1px solid ${props => props.theme.primary8};
    border-radius: ${props => props.theme.borderRadius};
    position: relative;
    padding: 16px;
    transition: 0.4s linear;
    &.signup {
      background: ${props => props.theme.accent5};
      border: none;
      color: white;
      &:hover {
        color: white;
        background: ${props => props.theme.accent6};
      }
    }
    @media (max-width: 768px) {
      justify-content: center;
    }
    &:hover {
      color: white;
      background: ${props => props.theme.primary5};
    }
    & svg {
      width: 20px;
    }
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
        {user && user.email ? (
          <Link to="/profile">My Casts</Link>
        ) : (
          <>
            <Link to="/signin">Sign In</Link>
            <Link to="/signup" className="signup">
              Sign Up
            </Link>
          </>
        )}
      </Nav>
    </Head>
  );
};

export default Header;
