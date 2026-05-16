---
name: article-image
description: Generate cohesive editorial blog cover images for posts in this Eleventy site. Use when the user asks to create, draft, or generate an article image, post cover, Open Graph image, OG image, social card, or banner for a blog post.
---

# Article Image

## Workflow

When asked to generate an article image:

1. Identify the target post. If no post is named, use the currently focused post when available; otherwise ask for the post path.
2. Read the target post and extract the title, description, tags, slug, and main concept.
3. Distill the article into one central visual metaphor. Prefer the article's data flow, conceptual tension, or before/after state over a collage of sections.
4. Generate a landscape image prompt using the shared visual direction below.
5. Use the image generation tool only when the user explicitly asks to generate the image.
6. Recommend `/assets/images/<slug>/banner.avif` as the final front matter image path.

## Shared Visual Direction

Use this baseline, adapted to the article:

```txt
A refined editorial tech illustration for a blog post titled "[ARTICLE TITLE]".
Landscape composition, 1.91:1 (1200x630) ratio, designed as a blog card/cover
image. Use a minimalist personal blog aesthetic: soft off-white paper background,
subtle grain texture, gentle shadows, elegant clean spacing.
Palette centered on warm pink (#dd7eb4) and medium blue (#267cb9),
with muted charcoal and pale gray accents.

Style: modern flat vector, thin line art, soft translucent gradients,
dotted connector lines, delicate code-inspired glyphs, calm and polished.
No photorealism, no 3D render, no stock image feel.
Avoid official logos; small text chips such as "11ty", "data.json",
"<a>", "aria-live", or "cache" are fine when they support the concept.

Typography in image: avoid large readable text. Keep any labels tiny,
clean, and secondary. Ensure strong readability at thumbnail sizes,
with a clear silhouette and enough negative space for card layouts.
```

## Concept Patterns

- Routing or semantic HTML posts: show the mismatch and resolution, such as `button` to `<a>` or reload to client-side navigation.
- Build pipeline posts: show source input to transformation steps to cached or optimized output.
- Accessibility posts: include restrained semantic hints such as `label`, `aria-live`, or `status` without turning the image into documentation.
- DOM or runtime posts: show the browser or DOM node, the state being lost, and the small mechanism that restores or preserves it.

## Output

Before generating, briefly summarize the intended concept in one sentence. After generating, mention the suggested front matter value:

```yaml
image: /assets/images/<slug>/banner.avif
```
