import React from 'react'
import Link from 'gatsby-link'

const Tags = ({ pathContext }) => {
  const { posts, tagName } = pathContext

  if (posts) {
    return (
      <div>
        <span>
          Posts about { tagName }:
        </span>

        <ul>
          { posts.map(post => {
            return (
              <li>
                <Link to={ post.node.frontmatter.path }>
                  { post.node.frontmatter.title }
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}

export default Tags
