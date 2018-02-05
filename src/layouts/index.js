import React from 'react';
import Link from 'gatsby-link';
import Header from '../components/Header';
import Footer from '../components/Footer';

import '../css/index.scss';
import '../css//markdown.css';
require('prismjs/themes/prism-okaidia.css');

const TemplateWrapper = ({ children }) => (
  <div className="page">
    <Header />
    <div className="content">{children()}</div>
    <Footer />
  </div>
);

export default TemplateWrapper;
