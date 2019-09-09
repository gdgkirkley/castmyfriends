import React from "react";
import styled from "styled-components";

const ErrorMessage = styled.div`
  max-width: 80%;
  font-size: ${props => props.theme.fontSize.reading};
  line-height: 1.5;
  border-radius: ${props => props.theme.borderRadius};
  background: ${props => props.theme.warning5};
  color: ${props => props.theme.grey1};
  padding: 20px;
  margin: 32px;
`;

const Error = props => {
  if (!props.error) return null;
  return <ErrorMessage>{props.error}</ErrorMessage>;
};

export default Error;
