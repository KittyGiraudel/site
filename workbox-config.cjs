module.exports = {
  globDirectory: '_site',
  // Only precache critical static assets. HTML and content images are fetched
  // from the network so new content is visible without a hard refresh, and so
  // first-time visitors do not download all historical blog media upfront.
  globPatterns: [
    'assets/**/*.{js,css}',
    'favicon.ico',
    'apple-touch-icon.png',
    'manifest.json',
    'humans.txt',
  ],
  swDest: '_site/service-worker.js',
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
  // Cache images on-demand with limits instead of precaching everything.
  runtimeCaching: [
    {
      urlPattern: /\.(?:png|jpg|jpeg|gif|svg|webp|avif)$/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'images',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        },
      },
    },
  ],
}
