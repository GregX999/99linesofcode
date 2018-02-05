import React from 'react';
import Link from 'gatsby-link';

const Header = () => (
  <div className="header">
    <Link to="/">
      <h1 className="header__logotype">99LinesOfCode</h1>
    </Link>
    <h2 className="header__subtitle">
      An eclectic collection of coding thoughts, ideas and examples.
    </h2>
  </div>
);

export default Header;
