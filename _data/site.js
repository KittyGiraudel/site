import { CONFIG } from '../.eleventy.js'

export default {
  url: 'https://kittygiraudel.com',
  description:
    'I’m Kitty Giraudel, a transfeminine web engineer based in Berlin, focused on accessibility and inclusivity.',
  author: 'Kitty Giraudel',
  environment: process.env.NODE_ENV,
  time: new Date(),
  pubDate: new Date(2012, 10, 10),
  job_notice: {
    text: 'I am currently looking for a new role!',
    url: 'https://www.linkedin.com/posts/kitty-giraudel_dear-network-i-am-still-looking-for-my-next-activity-7429088570906341376-YSpl?utm_source=share&utm_medium=member_desktop&rcm=ACoAADH-Z8wBKlEvSxzpoXA6lJuBciBD7TZuM0M',
  },
  nav: [
    { path: '/blog/', label: 'Blog' },
    { path: '/projects/', label: 'Projects' },
    { path: '/snippets/', label: 'Snippets' },
    { path: '/talks/', label: 'Talks' },
    { path: '/about/', label: 'About' },
  ],
  configuration: {
    minify_html: CONFIG.minifyHTML,
    inline_scripts: CONFIG.inlineScripts,
    inline_styles: CONFIG.inlineStyles,
    service_worker: CONFIG.serviceWorker,
  },
}
