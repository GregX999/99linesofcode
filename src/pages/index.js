import React from 'react';
import Link from 'gatsby-link';
import Helmet from 'react-helmet';
import PostList from '../components/PostList';

const IndexPage = ({ data, pathContext }) => {
  const { edges: posts } = data.allMarkdownRemark;

  return (
    <div>
      <HomepageHelmet />
      <PostList posts={posts} />
    </div>
  );
};

export default IndexPage;

const HomepageHelmet = () => {
  return (
    <Helmet
      title="99 Lines of Code"
      meta={[
        {
          name: 'description',
          content:
            'An eclectic collection of coding thoughts, ideas and examples.'
        },
        { name: 'keywords', content: '' }
      ]}
    />
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
            date(formatString: "MMM DD YYYY")
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
