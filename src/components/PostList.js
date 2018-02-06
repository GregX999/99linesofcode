import React from 'react';
import PostSummary from './PostSummary';

const PostList = ({ posts, selectedTag }) => (
  <div className="post-list">
    {posts.map(({ node: post }) => {
      const { frontmatter } = post;
      return (
        <PostSummary
          frontmatter={frontmatter}
          key={frontmatter.slug}
          selectedTag={selectedTag}
        />
      );
    })}
  </div>
);

export default PostList;
