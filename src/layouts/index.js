import React from "react";
import PropTypes from "prop-types";
import styled, { injectGlobal } from "styled-components";
import Link from "gatsby-link";
import Header from "./header.js";
import Footer from "./footer.js";
import Content from "./content.js";

import "./reset.css";
import "./markdown.css";
require("prismjs/themes/prism-okaidia.css");

injectGlobal`
  .darkBackground {
    background: #282c34;
    color: white;
  }
  .whiteBackground {
    background: white;
    color: black;
  }
`;

class TemplateWrapper extends React.Component {
  componentDidMount() {
    this.setBodyClass();
  }

  componentDidUpdate() {
    this.setBodyClass();
  }

  setBodyClass() {
    if (this.props.location.pathname == "/") {
      document.body.classList.add("darkBackground");
      document.body.classList.remove("whiteBackground");
    } else {
      document.body.classList.remove("darkBackground");
      document.body.classList.add("whiteBackground");
    }
  }

  render() {
    return (
      <div>
        <link
          href="https://fonts.googleapis.com/css?family=Open+Sans:400|Ubuntu+Mono&amp;subset=latin-ext"
          rel="stylesheet"
        />
        <Header />
        <Content content={this.props.children()} />
        <Footer pathname={this.props.location.pathname} />
      </div>
    );
  }
}

TemplateWrapper.propTypes = {
  children: PropTypes.func
};

export default TemplateWrapper;
