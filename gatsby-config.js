module.exports = {
  siteMetadata: {
    title: `99 Lines of Code`
  },
  plugins: [
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-prismjs`,
            classPrefix: "language-"
          },
          `gatsby-plugin-sharp`,
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 800,
              linkImagesToOriginal: false,
              sizeByPixelDensity: true
            }
          }
        ]
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `src`,
        path: `${__dirname}/src`
      }
    }
  ]
};
