// Lazy-load embeds when they’re visible.
// See: https://twitter.com/whitep4nth3r/status/1518978629593702403
const EMBEDS = [
  {
    selector: '.sassmeister',
    url: '//cdn.sassmeister.com/js/embed.js',
    loaded: false,
  },
  {
    selector: '.codepen',
    url: '//codepen.io/assets/embed/ei.js',
    loaded: false,
  },
  {
    selector: '.twitter-tweet',
    url: '//platform.twitter.com/widgets.js',
    loaded: false,
  },
]

EMBEDS.forEach(embed => {
  const node = document.querySelector(embed.selector)

  if (!node) return

  const handler = entry =>
    !embed.loaded &&
    entry.isIntersecting &&
    (loadJS(embed.url), (embed.loaded = true))

  const observer = new IntersectionObserver(
    entries => entries.forEach(handler),
    { root: null, threshold: 0.1 }
  )

  observer.observe(node)
})
