import React from "react";
import styled from "styled-components";
import Link from "gatsby-link";
import Helmet from "react-helmet";

import {
  FakeCode,
  FakeClass,
  FakeFunction,
  FakeReturn,
  FakeEndBrackets,
  PostDetails
} from "../components/homepage.js";

const HomepageHelmet = () => {
  return (
    <Helmet
      title="99 Lines of Code"
      meta={[
        {
          name: "description",
          content:
            "An eclectic collection of coding thoughts, ideas and examples."
        },
        { name: "keywords", content: "" }
      ]}
    />
  );
};

const IndexPage = ({ data, pathContext }) => {
  const { edges: posts } = data.allMarkdownRemark;
  return (
    <FakeCode>
      <HomepageHelmet />
      <FakeClass />
      <FakeFunction />
      <FakeReturn />

      {posts.map(({ node: post }) => {
        const { frontmatter } = post;
        return <PostDetails frontmatter={frontmatter} key={frontmatter.slug} />;
      })}

      <FakeEndBrackets />
    </FakeCode>
  );
};

export const query = graphql`
  query IndexQuery {
    allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
      totalCount
      edges {
        node {
          frontmatter {
            title
            date(formatString: "MMM DD, YYYY")
            path
            tags
            excerpt
            slug
          }
        }
      }
    }
  }
`;

export default IndexPage;
