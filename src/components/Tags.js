import React from 'react';
import Link from 'gatsby-link';

const Tags = ({ tags, selectedTag }) => (
  <div className="post-summary__tags-wrapper">
    Topics:
    <ul className="post-summary__tag-list">
      {tags.map(tag => (
        <li
          className={`tag ${
            tag == selectedTag ? 'tag--selected' : 'tag--default'
          }`}
          key={tag}
        >
          <Link to={tag == selectedTag ? '/' : `/tags/${tag}`}>{tag}</Link>
        </li>
      ))}
    </ul>
  </div>
);

export default Tags;
