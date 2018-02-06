import React from 'react';
import Link from 'gatsby-link';

const NotFoundPage = () => (
  <div className="error404">
    <h2>There's Nothing Over Here</h2>
    <p>You just hit a route that doesn't exist... oh, the sadness. 🙁</p>
    <p>
      I'm not sure what you're looking for, but maybe you can find it if you
      head back to <Link to="/">the homepage</Link>.
    </p>
  </div>
);

export default NotFoundPage;
