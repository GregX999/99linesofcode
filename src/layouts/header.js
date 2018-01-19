import React from "react";
import styled from "styled-components";
import Link from "gatsby-link";

const Logotype = styled.h1`
  font-size: 2rem;
`;

const LogotypeLink = styled(Link)`
  color: #d7dae0;
  text-decoration: none;
`;

const HeaderBar = styled.header`
  background-color: #21252b;
  border-bottom: 1px solid black;
  font-family: "Ubuntu Mono", monospace;
  padding: 0.75rem;
  position: fixed;
  top: 0;
  width: 100%;
  flex-shrink: 0;
  z-index: 2;
`;

const Header = () => (
  <HeaderBar>
    <Logotype>
      <LogotypeLink to="/">99LinesOfCode</LogotypeLink>
    </Logotype>
  </HeaderBar>
);

export default Header;
