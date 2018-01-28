import React from 'react';
import PropTypes from 'prop-types';
import styled, { injectGlobal } from 'styled-components';
import Link from 'gatsby-link';

const FooterBar = styled.footer`
  background-color: #21252b;
  border-top: 1px solid black;
  color: #d7dae0;
  font-family: 'Ubuntu Mono', monospace;
  text-align: center;
  padding: 0.75rem;
  width: 100%;
  flex-shrink: 0;
`;

const FooterLink = styled(Link)`
  color: #9da5b4;

  &:hover {
    color: #d7dae0;
  }
`;

const Footer = () => (
  <FooterBar>
    Site made by <a>Greg Burger</a> using{' '}
    <a href="http://www.gatsbyjs.org" target="_blank">
      Gatsby
    </a>. Source code available on{' '}
    <a href="https://github.com/GregX999/99linesofcode" target="_blank">
      GitHub
    </a>.
  </FooterBar>
);

export default Footer;
