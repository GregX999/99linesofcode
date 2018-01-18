import React from "react";
import PropTypes from "prop-types";
import styled, { injectGlobal } from "styled-components";
import Link from "gatsby-link";

const FooterBar = styled.footer`
  background-color: #21252b;
  border-top: 1px solid black;
  color: #d7dae0;
  font-family: "Ubuntu Mono", monospace;
  text-align: center;
  padding: 0.75rem;
  width: 100%;
`;

const FooterLink = styled(Link)`
  color: #9da5b4;

  &:hover {
    color: #d7dae0;
  }
`;

const Footer = ({ pathname }) => (
  <FooterBar
    style={pathname == "/404/" ? { position: "fixed", bottom: "0px" } : {}}
  >
    Site made by <FooterLink to="">Greg Burger</FooterLink> using{" "}
    <FooterLink to="http://www.gatsbyjs.org">Gatsby</FooterLink>. Source code
    available on <FooterLink to="">GitHub</FooterLink>.
  </FooterBar>
);

Footer.propTypes = {
  pathname: PropTypes.string
};

export default Footer;
