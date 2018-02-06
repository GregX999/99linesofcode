import React from 'react';
import Link from 'gatsby-link';
import Header from '../components/Header';
import Footer from '../components/Footer';

require('../css/index.scss');
require('../css//markdown.css');
require('../css/prism_theme.css');

const TemplateWrapper = ({ children }) => (
  <div className="page">
    <Header />
    <div className="content">{children()}</div>
    <Footer />
  </div>
);

export default TemplateWrapper;
