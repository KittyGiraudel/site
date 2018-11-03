module.exports = {
  staticFileGlobs: ['_site/**/*.html', '_site/assets/css/*.css'],
  runtimeCaching: [
    {
      urlPattern: /^https?:\/\/\w+.cloudfront.net\/bundles\/\w+.js$/,
      handler: 'cacheFirst'
    }
  ]
}
