import React, { useState } from "react";
import styled from "styled-components";
import { signInWithGoogle } from "../firebase/firebase.utils";

const SignInForm = styled.form`
  display: grid;
  justify-content: space-around;
  & input {
    width: 100%;
    padding: 16px 24px;
    margin: 8px 0px;
    border-radius: ${props => props.theme.borderRadius};
    border: 1px solid ${props => props.theme.grey8};
    transition: 0.4s linear;
    font-size: ${props => props.theme.fontSize.reading};
    &:hover,
    &:focus,
    &:active {
      border: 1px solid ${props => props.theme.primary8};
    }
  }
  & button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    font-size: ${props => props.theme.fontSize.reading};
    margin: 24px 0px;
    padding: 8px 16px;
    background: white;
    border: 1px solid ${props => props.theme.primary8};
    & img {
      margin: 0px 8px;
    }
  }
`;

const Signin = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  return (
    <SignInForm onSubmit={e => e.preventDefault()}>
      <input
        type="email"
        name="email"
        value={values.email}
        placeholder="janesmith@gmail.com"
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        value={values.password}
        placeholder="Password"
        onChange={handleChange}
      />
      <button>Sign In</button>
      <button onClick={signInWithGoogle}>
        <img
          src="https://www.gstatic.com/mobilesdk/160512_mobilesdk/auth_service_google.svg"
          alt="Google"
        />
        Sign in with Google
      </button>
    </SignInForm>
  );
};

export default Signin;
