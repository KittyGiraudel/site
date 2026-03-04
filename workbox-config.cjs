module.exports = {
  globDirectory: '_site',
  // Only precache static assets. HTML is fetched from the network so that new
  // content (like freshly published articles) is visible on a regular reload.
  globPatterns: ['**/*.{js,txt,ico,jpg,png,css,jpeg,gif,svg}'],
  swDest: '_site/service-worker.js',
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
}
