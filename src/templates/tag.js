import React from 'react';
import Link from 'gatsby-link';
import Helmet from 'react-helmet';
import PostList from '../components/PostList';

const Tags = ({ pathContext }) => {
  const { posts, tagName } = pathContext;

  return (
    <div>
      <TagHelmet />
      <PostList posts={posts} selectedTag={tagName} />
    </div>
  );
};

export default Tags;

const TagHelmet = ({ tagName }) => {
  return (
    <Helmet
      title="99 Lines of Code"
      meta={[
        {
          name: 'description',
          content: `All the posts about ${tagName}`
        },
        { name: 'keywords', content: { tagName } }
      ]}
    />
  );
};
