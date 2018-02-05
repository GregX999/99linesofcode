import React from 'react';
import Link from 'gatsby-link';
import Disqus from '../lib/Disqus';
import Tags from './tags';
import * as SITE from '../constants.js';

const PostSummary = ({ frontmatter, selectedTag }) => {
  return (
    <div className="post-summary">
      <Link to={`/${frontmatter.path}`}>
        <h3 className="post-summary__title">{frontmatter.title}</h3>
      </Link>
      <p>{frontmatter.excerpt}</p>

      <Date date={frontmatter.date} />
      <Tags tags={frontmatter.tags} selectedTag={selectedTag} />

      <CommentCount frontmatter={frontmatter} />
    </div>
  );
};

export default PostSummary;

//
// Sub-components
//

const Date = ({ date }) => {
  const date_parts = date.split(' ');

  return (
    <div className="post-summary__date">
      <span className="post-summary__date__month">{date_parts[0]}</span>
      <span className="post-summary__date__day">{date_parts[1]}</span>
      <span className="post-summary__date__year">{date_parts[2]}</span>
    </div>
  );
};

const CommentCount = ({ frontmatter }) => {
  const disqusShortname = SITE.DISQUS_SHORTNAME;
  const disqusConfig = {
    url: `${SITE.SITE_URL}/${frontmatter.path}`,
    identifier: frontmatter.slug,
    title: frontmatter.title
  };

  return (
    <div className="post-summary__comment-count">
      <Disqus.CommentCount shortname={disqusShortname} config={disqusConfig} />
      &nbsp;comments
    </div>
  );
};
