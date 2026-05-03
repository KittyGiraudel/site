import fs from 'node:fs'
import path from 'node:path'
import { eleventyImageTransformPlugin } from '@11ty/eleventy-img'
import type { EleventyConfig } from '11ty.ts'

// Persisted on Netlify via `netlify-plugin-cache`; copied into the publication
// folder after build (`eleventy.after`).
const CACHE_DIR = '.cache/@11ty/img/'

// Public URL path for built rasters (`<picture>` / `srcset`); mirrors folder
// under `dir.output`.
const URL_PATH = '/img/'

/**
 * Responsive images via `@11ty/eleventy-img` HTML transform + cache dir for CI.
 * Copies optimized files into the publish folder after production builds (`eleventy.after`).
 */
export default function imageTransformPlugin(eleventyConfig: EleventyConfig) {
	eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
		// Disk output under .cache so Netlify can restore between builds (see netlify.toml).
		// https://www.zachleat.com/web/faster-builds-with-eleventy-img/
		outputDir: CACHE_DIR,
		urlPath: URL_PATH,
		formats: ['avif', 'webp'],
		// Default widths cap raster output (~80ch column × ~2× DPR). Omit "auto" so
		// full-resolution sources are not duplicated in srcset. Per-image overrides
		// (e.g. card thumbnails) use eleventy:widths in markup.
		widths: [640, 960, 1280, 1600],
		htmlOptions: {
			// Per-img attributes win over these defaults.
			imgAttributes: {
				// Use loading="eager" in HTML or the `lazy` option from the figure
				// partial for above-the-fold images.
				loading: 'lazy',
				decoding: 'async',
				// Default sizes matches .Container (80ch); required when using eager +
				// multiple widths.
				sizes: '(max-width: 48rem) calc(100vw - 2em), 80ch',
			},
			pictureAttributes: {},
		},
	})

	eleventyConfig.on('eleventy.after', () => {
		if (process.env.ELEVENTY_RUN_MODE === 'serve') return
		if (!fs.existsSync(CACHE_DIR)) return
		const dest = path.join(
			path.resolve(eleventyConfig.directories.output),
			...URL_PATH.split('/').filter(Boolean),
		)
		fs.mkdirSync(dest, { recursive: true })
		fs.cpSync(CACHE_DIR, dest, { recursive: true })
	})
}
