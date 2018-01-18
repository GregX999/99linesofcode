import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Link from "gatsby-link";
import Disqus from "disqus-react";
import * as SITE from "../constants.js";

const curlyStart = "{";
const curlyEnd = "}";
const squareStart = "[";
const squareEnd = "]";
const twoSlashes = " //";

const Title = styled.h2`
  font-size: 1.6em;
  padding-left: 0;
  margin-bottom: 0.8rem;

  @media (min-width: 590px) {
    font-size: 2rem;
  }
`;

const Indent0 = styled.div`
  font-size: 1.4em;
  padding-left: 0;
  margin-bottom: 0.6em;

  @media (min-width: 590px) {
    font-size: 1.75rem;
  }
`;

const Indent1 = styled.div`
  font-size: 1.4em;
  padding-left: 1rem;
  margin-bottom: 0.6em;

  @media (min-width: 590px) {
    font-size: 1.75rem;
    padding-left: 2rem;
  }
`;

const Indent2 = styled.div`
  font-size: 1.4em;
  padding-left: 2rem;
  margin-bottom: 0.6em;

  @media (min-width: 590px) {
    font-size: 1.75rem;
    padding-left: 4rem;
  }
`;

const Post = styled.div`
  padding-left: 3rem;
  margin: 1em 0;

  @media (min-width: 590px) {
    padding-left: 6rem;
  }
`;

const PostTitle = styled.h3`
  font-size: 1.2em;
  margin-bottom: 0.3em;

  @media (min-width: 590px) {
    font-size: 1.5rem;
  }
`;

const TitleLink = styled(Link)`
  color: #d7dae0; // light gray
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const PostExcerpt = styled.span`
  font-size: 1em;
  color: #9da5b4; // med gray
  line-height: 1.4em;
`;

const PostData = styled.div`
  font-size: 1em;
  line-height: 1.4em;
`;

const Tag = styled.span`
  &:not(:last-child)::after {
    content: ", ";
  }
`;

const TagLink = styled(Link)`
  color: #e06c75; // red
  display: inline-block;
`;

const TopicHash = ({ tagName }) => {
  const TagValue = styled.span`
    color: #e06c75; // red
  `;

  return (
    <span>
      {curlyStart}
      topic: <TagValue>{tagName}</TagValue>
      {curlyEnd}
    </span>
  );
};

const KeyWord = styled.span`
  color: #c678dd; // purple
`;

const ClassName = styled.span`
  color: #e5c07b; // yellow
`;

const VarLeft = styled.span`
  color: #d19a66; // orange
`;

const Argument = styled.span`
  color: #84c079; // green
`;

const Function = styled.span`
  color: #61afef; // blue
`;

export const FakeCode = styled.div`
  color: #d7dae0; // light gray
  font-size: 0.8rem;
  font-family: "Ubuntu Mono", monospace;

  @media (min-width: 590px) {
    font-size: 1rem;
  }
`;

export const FakeClass = () => (
  <Title>
    <KeyWord>class </KeyWord>
    <ClassName>MyBlog </ClassName>
    <KeyWord>extends </KeyWord>
    <Argument>GregBurger </Argument>
    {curlyStart}
  </Title>
);

export const FakeFunction = ({ tagName }) => (
  <Indent1>
    <KeyWord>function </KeyWord>
    <Function>getBlogPosts</Function>({tagName ? (
      <TopicHash tagName={tagName} />
    ) : (
      ""
    )}) {curlyStart}
  </Indent1>
);

export const FakeReturn = () => (
  <Indent2>
    <KeyWord>return</KeyWord> {curlyStart}
  </Indent2>
);

export const FakeEndBrackets = () => (
  <div>
    <Indent2>{curlyEnd}</Indent2>
    <Indent1>{curlyEnd}</Indent1>
    <Indent0>{curlyEnd}</Indent0>
  </div>
);

export const PostDetails = ({ frontmatter }) => {
  const disqusShortname = SITE.DISQUS_SHORTNAME;
  const disqusConfig = {
    url: `${SITE.SITE_URL}/${frontmatter.path}`,
    identifier: frontmatter.slug,
    title: frontmatter.title
  };

  return (
    <Post>
      <PostTitle>
        <TitleLink to={frontmatter.path}>{frontmatter.title}</TitleLink>
      </PostTitle>
      <PostExcerpt>
        {twoSlashes} {frontmatter.excerpt}
      </PostExcerpt>
      <PostData>
        <VarLeft>date</VarLeft> = <Argument>"{frontmatter.date}"</Argument>
      </PostData>
      <PostData>
        <VarLeft>comments</VarLeft> ={" "}
        <Argument>
          <Disqus.CommentCount
            shortname={disqusShortname}
            config={disqusConfig}
          />
        </Argument>
      </PostData>
      <PostData>
        <VarLeft>topics</VarLeft> = {squareStart}
        {frontmatter.tags.map(tag => {
          return (
            <Tag key={tag}>
              <TagLink key={tag} to={`/tags/${tag}`}>
                {tag}
              </TagLink>
            </Tag>
          );
        })}
        {squareEnd}
      </PostData>
    </Post>
  );
};

PostDetails.propTypes = {
  frontmatter: PropTypes.object
};

const Homepage = () => <div></div>;
export default Homepage;
