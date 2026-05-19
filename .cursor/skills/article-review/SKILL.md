---
name: article-review
description: Publish-readiness review for blog posts — content, structure, flow, typos, demos, code, SEO, facts, and STYLEGUIDE compliance. Use when the user asks to review, proofread, or audit an article or draft before publishing.
---

# Article Review

Goal: determine whether a post is **ready to go live**. Read [STYLEGUIDE.md](../../../STYLEGUIDE.md) for editorial and formatting rules; apply them without restating them in the report. This skill adds publish-readiness checks beyond the styleguide.

## Workflow

1. **Identify the target** — `posts/YYYY-MM-DD-slug.md`, editor draft, or pasted content.
2. **Read STYLEGUIDE.md** — Especially [Editorial checklist](STYLEGUIDE.md#editorial-checklist) and [Things to avoid](STYLEGUIDE.md#things-to-avoid).
3. **Read the full article** — Front matter, body, Liquid shortcodes, footnote assigns, embedded demos, code blocks.
4. **Follow references** — Open linked posts, demo files under `includes/demos/`, cited source URLs, and GitHub permalinks when claims or code depend on them.
5. **Verify what you can** — Asset paths exist; demo partials resolve; internal URLs use `/YYYY/MM/DD/slug/` form. Run `npm start` or `npm run build` when interactively verifying demos, anchors, or rendered output is needed.
6. **Report** — Use the output format below. Quote short excerpts; propose concrete fixes.

## Review dimensions

### Content and accuracy

- Does the post deliver what the title and description promise?
- Are technical claims accurate? Trace APIs, flags, versions, and behavior against docs or the linked repo when possible.
- Flag unsupported claims, outdated information, internal contradictions, and logical gaps (missing steps, non sequiturs, causation without evidence).
- Distinguish opinion from fact; opinions should be reasoned, not presented as universal truth.
- Credit sources; ensure attributions match [Links](STYLEGUIDE.md#links) conventions.

### Structure and reading flow

- Opening hooks without restating the title ([Document structure](STYLEGUIDE.md#document-structure)).
- Section order makes sense; each `##` earns its place; no orphaned or redundant sections.
- Heading hierarchy is logical (`##` → `###`, no skipped levels).
- Paragraph length and pacing: no walls of text; dense stretches broken up appropriately.
- Closing reflection (Wrapping up / Lessons learned / etc.) — not a bullet recap of the whole post.
- Transitions between sections; reader always knows *why* the next section exists.

### Editorial style and formatting

Work through STYLEGUIDE sections; cite the section name when flagging (e.g. “Footnotes”, “Things to avoid”). Run the [Editorial checklist](STYLEGUIDE.md#editorial-checklist) and report only failures.

Includes: voice, locale, typography, links, figures, callouts vs blockquotes, footnotes, code block conventions, lists.

### Typos and copy-editing

- Spelling (American English per styleguide).
- Grammar, punctuation, curly quotes, en/em dashes used appropriately.
- Consistent terminology within the post (product names, acronyms after first `<abbr>`).
- Front matter `title` in APA title case; `description` is one clean sentence.

### Code snippets

- Snippets match what the prose describes; no stale or misleading examples.
- Language tags present; indentation uses tabs ([Code blocks](STYLEGUIDE.md#code-blocks)).
- Liquid in fences is escaped (`{% raw %}` or zero-width spaces).
- Focused blocks with `// …` where appropriate; teaching comments explain intent, not mechanics.
- When the post references production code, spot-check the linked file or path if available.
- Flag security-sensitive patterns only when clearly wrong for the context (hardcoded secrets, dangerous copy-paste).

### Demos

Posts embed demos via `{% render "demos/…" %}`.

For each embed:

- Confirm the partial exists under `includes/demos/`.
- Read associated `script.js`, `styles.css`, `data.js` when the article discusses their behavior.
- Prose around the demo should explain what to try and what to notice (context before; interpretation after if needed).
- Flag broken paths, missing `noscript` warnings where JS is required, or demos that contradict the article.
- If the article teaches something interactive but has no demo (and similar posts in the archive use one), note it as a **Consider** — not a blocker unless the post explicitly promises interactivity.

Do not build new demos during review unless the user asks; only assess existing ones.

### SEO and discoverability

Front matter drives meta tags and OG cards (see `tests/head.test.ts`).

- `title` — clear, accurate, APA title case, no trailing period.
- `description` — single sentence; works as OG/RSS summary; not a keyword dump.
- `tags` — Title Case; reuse existing tags where sensible.
- `image` — path set and file exists under `assets/images/<slug>/`. **Flag if missing**; do not generate (use the `article-image` skill when asked).
- Filename `YYYY-MM-DD-kebab-case-slug.md` matches intended publish date and URL.
- `draft: true` should be removed before publish.
- First paragraph and headings give enough context for search and social previews.

### Assets and build

- Figure paths under `/assets/images/<slug>/`; meaningful `alt` distinct from caption.
- No bare Markdown images; CodePen embeds use `codepen.liquid` when present.
- Note if a local preview build is recommended to confirm anchors, demos, or footnote rendering.

## Severity

- **Must fix** — Blocks publish: factual errors, broken links/paths, missing required front matter, styleguide violations with wrong semantics (blockquote vs callout, bare images, spaces in code blocks), misleading code, broken or missing demo files referenced in the post, `draft: true` left on, missing `alt`.
- **Should fix** — Weakens the post materially: poor flow, vague claims without support, SEO description weak or wrong length, voice drift, checklist gaps, code that doesn’t match prose, demo lacks context.
- **Consider** — Polish: tighter prose, optional demo, friendlier closing, fewer em dashes, optional OG image format upgrade (AVIF/WebP per styleguide).

## Output format

```markdown
# Review: [Post title]

**File:** `posts/…`
**Verdict:** Ready to publish | Needs revision | Major rework

## Summary
[2–4 sentences: readiness, main blockers, overall quality.]

## Must fix
- **[Category]** — `excerpt…` → fix.

## Should fix
- …

## Consider
- …

## Publish checklist
- [ ] Editorial checklist (STYLEGUIDE) — pass / N items failing
- [ ] Content accurate and complete
- [ ] Code and demos verified
- [ ] SEO front matter (`title`, `description`, `tags`, `image`)
- [ ] `draft` removed, filename/date correct
- [ ] Local preview (`npm start`) if demos or anchors need human check

## Strengths
[1–3 specific positives.]
```

Keep findings actionable. Do not dump STYLEGUIDE content into the report.

## When asked to fix

Apply minimal diffs for agreed findings. Re-read changed sections. For factual or technical corrections, confirm with the author when uncertain rather than inventing details.

## Out of scope

- **Generating** OG/cover images — flag absence only; use `article-image` when the user wants one created.
- **Rewriting for a different angle** unless asked — review improves readiness, not the thesis.
- **Deploying or committing** — unless explicitly requested.
