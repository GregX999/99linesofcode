import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Link from "gatsby-link";

export const ArticleHeader = ({ frontmatter }) => {
  const HeaderWrapper = styled.header``;
  return (
    <HeaderWrapper>
      <Title>{frontmatter.title}</Title>
      <LineItem>postedBy("{frontmatter.author}")</LineItem>
      <LineItem>postedOn("{frontmatter.date}")</LineItem>
      <LineItem>
        topics ={" "}
        {frontmatter.tags.map(tag => {
          return (
            <Tag key={tag}>
              <TagLink key={tag} to={`/tags/${tag}`}>
                {tag}
              </TagLink>
            </Tag>
          );
        })}
      </LineItem>
    </HeaderWrapper>
  );
};

ArticleHeader.propTypes = {
  frontmatter: PropTypes.object
};

export const Content = styled.div`
  font-size: 1rem;
  line-height: 1.5em;
  margin: 2rem 0;
`;

export const ArticleFooter = ({ next, prev }) => {
  const FooterWraper = styled.footer`
    border: 1px solid #999;
    border-radius: 0.5em;
    margin-bottom: 2rem;
    padding: 1em 1em 0 1em;
  `;
  return (
    <FooterWraper>
      {prev && (
        <p>
          Previous post was: <Link to={prev.path}>{prev.title}</Link>
        </p>
      )}

      {next && (
        <p>
          Next up is: <Link to={next.path}>{next.title}</Link>
        </p>
      )}
    </FooterWraper>
  );
};

ArticleFooter.propTypes = {
  next: PropTypes.object,
  prev: PropTypes.object
};

//
// Local components
//

const Title = styled.h2`
  font-family: "Ubuntu Mono", monospace;
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const LineItem = styled.div`
  font-family: "Ubuntu Mono", monospace;
  font-size: 1rem;
  margin-bottom: 0.3rem;
`;

const Tag = styled.span`
  &:not(:last-child)::after {
    content: ", ";
  }
`;

const TagLink = styled(Link)``;
