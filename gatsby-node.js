const path = require("path");

const createTagPages = (createPage, posts) => {
  const tagPageTemplate = path.resolve("src/templates/tag.js");
  const allTagsTemplate = path.resolve("src/templates/all-tags.js");

  const postsByTag = {};

  posts.forEach(post => {
    if (post.node.frontmatter.tags) {
      post.node.frontmatter.tags.forEach(tag => {
        if (!postsByTag[tag]) {
          postsByTag[tag] = [];
        }

        postsByTag[tag].push(post);
      });
    }
  });

  const tags = Object.keys(postsByTag);

  createPage({
    path: "/tags",
    component: allTagsTemplate,
    context: {
      tags: tags.sort()
    }
  });

  tags.forEach(tagName => {
    const posts = postsByTag[tagName];

    createPage({
      path: `/tags/${tagName}`,
      component: tagPageTemplate,
      context: {
        posts,
        tagName
      }
    });
  });
};

exports.createPages = ({ boundActionCreators, graphql }) => {
  const { createPage } = boundActionCreators;
  const blogPostTemplate = path.resolve("src/templates/blog-post.js");

  return new Promise((resolve, reject) => {
    resolve(
      graphql(`
        {
          allMarkdownRemark(
            sort: { order: DESC, fields: [frontmatter___date] }
          ) {
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
      `).then(result => {
        if (result.errors) {
          reject(results.errors);
        }

        const posts = result.data.allMarkdownRemark.edges;

        createTagPages(createPage, posts);

        posts.forEach((post, i) => {
          createPage({
            path: post.node.frontmatter.path,
            component: blogPostTemplate,
            context: {
              path: post.node.frontmatter.path,
              next: i === 0 ? null : posts[i - 1].node.frontmatter,
              prev:
                i === posts.length - 1 ? null : posts[i + 1].node.frontmatter
            }
          });
        });

        return;
      })
    );
  });
};
