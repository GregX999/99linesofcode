import React from 'react';
import Link from 'gatsby-link';
import Helmet from 'react-helmet';
import Disqus from '../lib/Disqus';
import Tags from '../components/Tags';
import * as SITE from '../constants.js';

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
    <div className="article">
      <BlogPostHelmet frontmatter={frontmatter} />

      <ArticleHeader frontmatter={frontmatter} />
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <ArticleFooter frontmatter={frontmatter} />

      <Disqus.ThreadEmbed shortname={disqusShortname} config={disqusConfig} />
    </div>
  );
};

export default BlogPost;

const ArticleHeader = ({ frontmatter }) => (
  <div className="article__header">
    <h2>{frontmatter.title}</h2>
    <div className="article__header__details">
      By: {frontmatter.author} | {frontmatter.date}
    </div>
  </div>
);

const ArticleFooter = ({ frontmatter }) => (
  <div className="article__footer">
    <Tags tags={frontmatter.tags} />
  </div>
);

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
