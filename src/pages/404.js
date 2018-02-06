import React from 'react';
import Link from 'gatsby-link';

const NotFoundPage = () => (
  <div className="error404">
    <h2>Not Found</h2>
    <p>You just hit a route that doesn&#39;t exist... oh, the sadness. 🙁</p>
    <p>
      But you can head to <Link to="/">the homepage</Link> and try to find what
      you&#39;re looking for.
    </p>
  </div>
);

export default NotFoundPage;
