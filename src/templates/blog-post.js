import React from 'react';
import styled from 'styled-components';
import Link from 'gatsby-link';
import Helmet from 'react-helmet';
import Disqus from '../lib/Disqus';
// import Disqus from "disqus-react";
import * as SITE from '../constants.js';

import {
  ArticleHeader,
  ArticleFooter,
  Content
} from '../components/blog-post.js';

const BlogPostHelmet = ({ frontmatter }) => {
  return (
    <Helmet
      title={`${frontmatter.title} @ 99 Lines of Code`}
      meta={[
        { name: 'description', content: frontmatter.title },
        { name: 'keywords', content: `${frontmatter.tags.join(', ')}` }
      ]}
    />
  );
};

const BlogPost = ({ data, location, pathContext }) => {
  const { markdownRemark: post } = data;
  const { frontmatter, html } = post;
  const { prev, next } = pathContext;

  const disqusShortname = SITE.DISQUS_SHORTNAME;
  const disqusConfig = {
    url: `${SITE.SITE_URL}/${frontmatter.path}`,
    identifier: frontmatter.slug,
    title: frontmatter.title
  };

  return (
    <article>
      <BlogPostHelmet frontmatter={frontmatter} />

      <ArticleHeader frontmatter={frontmatter} />
      <Content dangerouslySetInnerHTML={{ __html: html }} />

      <Disqus.ThreadEmbed shortname={disqusShortname} config={disqusConfig} />
    </article>
  );
};

export const pageQuery = graphql`
  query BlogPostByPath($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        title
        date(formatString: "MMM DD, YYYY")
        path
        author
        tags
        excerpt
        slug
      }
    }
  }
`;

export default BlogPost;
