import React from "react";
import styled from "styled-components";
import Link from "gatsby-link";
import Helmet from "react-helmet";
import Disqus from "disqus-react";
import * as SITE from "../constants.js";

import {
  ArticleHeader,
  ArticleFooter,
  Content
} from "../components/blog-post.js";

const BlogPostHelmet = ({ frontmatter }) => {
  return (
    <Helmet
      title={`${frontmatter.title} @ 99 Lines of Code`}
      meta={[
        { name: "description", content: frontmatter.title },
        { name: "keywords", content: `${frontmatter.tags.join(", ")}` }
      ]}
    />
  );
};

class DiscussThread extends React.Component {
  componentDidMount() {
    if (document.getElementById("discus_thread_script")) {
      DISQUS.reset({
        reload: true,
        config: this.disqus_config
      });
    } else {
      var d = document,
        s = d.createElement("script");
      s.src = "https://99linesofcode.disqus.com/embed.js";
      s.id = "discus_thread_script";
      s.setAttribute("data-timestamp", +new Date());
      (d.head || d.body).appendChild(s);
    }
  }

  disqus_config() {
    this.page.url = `${SITE.SITE_URL}/${this.props.frontmatter.slug}`;
    this.page.identifier = this.props.frontmatter.slug;
  }

  render() {
    return <div id="disqus_thread" />;
  }
}

const Template = ({ data, location, pathContext }) => {
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
      <ArticleFooter next={next} prev={prev} />

      <Disqus.DiscussionEmbed
        shortname={disqusShortname}
        config={disqusConfig}
      />
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

export default Template;
