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

const TagpageHelmet = ({ tagName }) => {
  return (
    <Helmet
      title="99 Lines of Code"
      meta={[
        {
          name: "description",
          content: `All the posts about ${tagName}`
        },
        { name: "keywords", content: { tagName } }
      ]}
    />
  );
};

const Tags = ({ pathContext }) => {
  const { posts, tagName } = pathContext;

  return (
    <FakeCode>
      <TagpageHelmet tagName={tagName} />
      <FakeClass />
      <FakeFunction tagName={tagName} />
      <FakeReturn />

      {posts.map(({ node: post }) => {
        const { frontmatter } = post;
        return <PostDetails frontmatter={frontmatter} key={frontmatter.slug} />;
      })}

      <FakeEndBrackets />
    </FakeCode>
  );
};

export default Tags;
