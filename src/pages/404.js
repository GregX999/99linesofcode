import React from "react";
import Link from "gatsby-link";
import { Title } from "../components/blog-post.js";

const NotFoundPage = () => (
  <div>
    <Title>Not Found</Title>
    <p>You just hit a route that doesn&#39;t exist... oh, the sadness. 🙁</p>
    <p>
      But you can head to <Link to="/">the homepage</Link> and try to find what
      you&#39;re looking for.
    </p>
  </div>
);

export default NotFoundPage;
