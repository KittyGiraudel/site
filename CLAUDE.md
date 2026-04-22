# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start        # Dev server with hot reload (incremental builds)
npm run build    # Production build + service worker generation
npm test         # Node.js native test runner (all _tests/*.test.mjs)
npm run format   # Biome formatter (write mode)
```

Single test: `node --test _tests/head.test.mjs`

## Architecture

This is a personal blog/portfolio site (kittygiraudel.com) built with **Eleventy 3.x** (ES modules) using **Liquid** templates and **Markdown** for content.

### Content collections

- `_posts/YYYY-MM-DD-slug.md` — Blog posts. Filenames determine the URL (`/:year/:month/:day/:slug/`) and `creation_date`. The `update_date` is derived from git history via `_data/git.js`.
- `_pages/snippets/` — Code snippets (layout: `snippet`)
- `_pages/recipes/` — Recipes (layout: `recipe`, with `ingredients` and `steps` front matter arrays)
- `_pages/` — All other static pages (Liquid or Markdown)

### Front matter conventions

Posts support: `title`, `description`, `tags` (Title Case), `guest` (guest author name), `external` (URL — listed but not locally rendered), `deprecated` (boolean), `edits` (array), `toc` (boolean, default true), `image`.

### Data files (`_data/`)

- `site.js` — Global config: URL, author, nav, feature flags
- `git.js` — Maps file paths to last-modified dates (used for `update_date`)
- `projects.json`, `speaking.json` — Structured content for those pages

### Custom plugins (`_plugins/`)

- `utilities.js` — HTML minification, emoji a11y wrapping (`<span role="img" aria-label>`), markdown rendering, callout shortcodes, custom Liquid filters
- `post-stats.js` — Aggregates word counts, reading times, tag popularity across all posts; exposed as `postStats` collection
- `toc.js` — Builds hierarchical table of contents from h2/h3/h4 headings
- `heading-anchors.js` — Auto-injects anchor links into headings (production only)

### Asset pipeline

- **Development**: CSS/JS linked externally for fast reloads
- **Production**: CSS/JS inlined into HTML; HTML is minified; service worker precaches critical assets (Workbox, `workbox-config.cjs`)

### Template conventions

- Use `{% render %}` for partials, not `{% include %}` — parameters must be passed explicitly
- Many partials accept an `inline` flag to toggle asset inlining
- Output transforms run after rendering: emoji wrapping, heading anchors, em-dash `<abbr>`, helmet (moves `data-helmet` elements to `<head>`), footnotes

### Testing

Tests in `_tests/` use Node.js's native `test` module with Cheerio for DOM assertions. They validate the built output — run `npm run build` before running tests in CI. Tests cover: meta tags, Open Graph, structured data (JSON-LD), RSS, sitemap, asset paths.

### Deployment

Hosted on Netlify. `_redirects` and `_headers` are passthrough-copied to output. Draft posts are hidden in production (`renderDrafts` flag in `.eleventy.js`).

### Edge function: Markdown content negotiation

`netlify/edge-functions/markdown-negotiation.ts` implements [Markdown for Agents](https://md.ai) — when a client sends `Accept: text/markdown` on a blog post URL, the edge function serves the static `.md` twin (`/YYYY/MM/DD/slug/index.md`) that Eleventy emits alongside the HTML, with `Content-Type: text/markdown`, `Vary: Accept`, and an `x-markdown-tokens` hint. Only internal post URLs are in scope (pattern `^\d{4}/\d{2}/\d{2}/[^/]+`); pages like `/about/` have no twin and are never intercepted. RFC 7231 `q`-value negotiation is handled by `@hapi/accept` — if `text/html` wins, the function is a no-op.
