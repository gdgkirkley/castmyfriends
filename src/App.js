import React from "react";
import { BrowserRouter } from "react-router-dom";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
import Cast from "./containers/cast";

const theme = {
  primary1: "#170647",
  primary2: "#200A5C",
  primary3: "#341782",
  primary4: "#4A29A3",
  primary5: "#5D33CC",
  primary6: "#7D5CD6",
  primary7: "#9A7DE8",
  primary8: "#B9A3F5",
  primary9: "#DBCFFC",
  primary10: "#F4F0FF",
  accent1: "#4C0E01",
  accent2: "#651301",
  accent3: "#981C01",
  accent4: "#CA2602",
  accent5: "#FD2F02",
  accent6: "#FD5935",
  accent7: "#FE8267",
  accent8: "#FEAC9A",
  accent9: "#FFD5CC",
  accent10: "#FFF3F0",
  grey1: "#222222",
  grey2: "#3B3B3B",
  grey3: "#535353",
  grey4: "#6E6E6E",
  grey5: "#878787",
  grey6: "#A1A1A1",
  grey7: "#BABABA",
  grey8: "#D4D4D4",
  grey9: "#EDEDED",
  grey10: "#F6F6F6",
  warning1: "#610509",
  warning2: "#BD0F16",
  warning3: "#EC131B",
  warning4: "#F47176",
  warning5: "#F9B8BB",
  fontSize: {
    smallPrint: "11px",
    information: "14px",
    reading: "17px",
    emphasis: "21px",
    highLevel: "25px",
    subHeading: "34px",
    title: "42px",
    display: "51px",
    banner: "68px",
  },
  maxWidth: "800px",
  bs: "0 12px 24px 0 rgba(0,0,0,0.09)",
  borderRadius: "4px",
};

const StyledPage = styled.div`
  background: white;
  color: ${props => props.theme.black};
  font-family: "Roboto", Arial, Helvetica, sans-serif;
`;

const Inner = styled.div`
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
  padding: 2rem;
  display: grid;
  grid-template-columns: 1fr;
  justify-content: center;
  grid-gap: 60px;
`;

const Head = styled.div`
  font-family: "Viga", Arial, Helvetica, sans-serif;
  font-size: ${theme.fontSize.display};
  color: ${theme.primary5};
  text-align: center;
  margin: 50px 0px;
  & span {
    color: ${theme.accent5};
  }
`;

const GlobalStyle = createGlobalStyle`
    html {
        box-sizing: border-box;
        font-size: 10px;
    }
    *, *:before, *:after {
        box-sizing: inherit;
    }
    body {
        padding: 0;
        margin: 0;
        font-size: 1.7rem;
        line-height: 1;
    }
    a {
        text-decoration: none;
        color: ${props => props.theme.black};
        &:hover{
        cursor: pointer;
        }
        &.btn {
          padding: 10px 20px;
          margin: 2rem 0rem;
          color: ${props => props.theme.grey};
          background: ${props => props.theme.lightgrey};
          &:hover {
            background: ${props => props.theme.grey};
            color: ${props => props.theme.lightgrey};
          }
        }
    }
    h1, h2, h3, h4, h5, h6 {
      font-family: "Roboto Condensed", Arial, Helvetica, sans-serif;
    }
`;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <StyledPage>
        <Inner>
          <Head>
            Cast My <span>Friends</span>
          </Head>
          <BrowserRouter>
            <Cast />
          </BrowserRouter>
        </Inner>
        <GlobalStyle />
      </StyledPage>
    </ThemeProvider>
  );
}

export default App;
