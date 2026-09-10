import type { Config, Context } from '@netlify/edge-functions'
import {
	getMarkdownTwin,
	isMissingStatus,
	markdownBytesResponse,
	markdownNotFoundResponse,
	prefersMarkdown,
} from '../lib/markdown-negotiate.ts'

/**
 * Invoke on GET requests whose `Accept` mentions `text/markdown` (substring
 * gate). Path is unrestricted so the homepage, post twins, and missing URLs
 * can all be negotiated; browsers do not send that Accept value and skip this
 * function.
 */
export const config: Config = {
	pattern: ['^/$', '^/.+$'],
	method: 'GET',
	header: { accept: 'text/markdown' },
}

/**
 * Markdown content negotiation (Markdown for Agents / acceptmarkdown.com).
 *
 * Eleventy emits Markdown twins for the homepage (`/index.md`) and internal
 * posts (`/YYYY/MM/DD/slug/index.md`). When RFC 7231 negotiation prefers
 * `text/markdown`, this function serves the twin at the HTML URL with
 * `Content-Type: text/markdown`, `Vary` including `Accept`, and
 * `x-markdown-tokens`.
 *
 * Missing paths keep a real 404/410 status. If Markdown is preferred, the
 * body is a short Markdown recovery page (sitemap, llms.txt, blog). Pages
 * without a twin (`/about/`, …) still fall through to HTML.
 *
 * ## Request flow (high level)
 *
 * 1. Platform filters: `GET` and `Accept` mentioning `text/markdown`.
 * 2. Direct `.md`: pass through to the static file; if that is missing, serve
 *    the Markdown 404 body.
 * 3. Negotiation: `@hapi/accept` must pick Markdown over HTML (`q` values).
 * 4. Twin: map `/` or a post pathname to `index.md` and `context.next` that
 *    file. Inner `Accept` is reset to a wildcard so this function is not
 *    re-invoked.
 * 5. Twin miss: replay the original request (HTML 200 for pages that exist
 *    without a twin, or HTML 404).
 * 6. If the origin status is 404/410, replace the body with Markdown 404.
 */
export default async function markdownNegotiation(
	request: Request,
	context: Context,
): Promise<Response | undefined> {
	const url = new URL(request.url)
	const { pathname } = url
	const origin = url.origin

	if (!prefersMarkdown(request.headers.get('accept'))) return

	if (pathname.toLowerCase().endsWith('.md')) {
		const upstream = await context.next()
		if (isMissingStatus(upstream.status)) return markdownNotFoundResponse(origin)
		return upstream
	}

	const twinPath = getMarkdownTwin(pathname)
	if (twinPath) {
		const innerUrl = new URL(twinPath, url.origin).toString()
		const innerHeaders = new Headers(request.headers)
		innerHeaders.delete('accept')
		innerHeaders.set('accept', '*/*')

		const upstream = await context.next(
			new Request(innerUrl, {
				method: request.method,
				headers: innerHeaders,
				redirect: 'manual',
			}),
		)

		if (upstream.ok) {
			return markdownBytesResponse(await upstream.text(), upstream.status, upstream.headers)
		}
	}

	const original = await context.next(request)
	if (isMissingStatus(original.status)) return markdownNotFoundResponse(origin)
	return original
}
