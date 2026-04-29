import Accept from '@hapi/accept'
import type { Config, Context } from '@netlify/edge-functions'

/**
 * Scope at the platform boundary: internal post pathnames, `GET` only (Netlify
 * Edge manifest allows no other safe method here), and `Accept` containing
 * `text/markdown`.
 */
export const config: Config = {
	pattern: [
		String.raw`^/\d{4}/\d{2}/\d{2}/[^/]+/?$`,
		String.raw`^/\d{4}/\d{2}/\d{2}/[^/]+/index\.html$`,
		String.raw`^/\d{4}/\d{2}/\d{2}/[^/]+/index\.md$`,
	],
	method: 'GET',
	header: { accept: 'text/markdown' },
}

/**
 * Markdown content negotiation (Markdown for Agents style) for internal blog
 * posts only.
 *
 * ## What this does
 *
 * Eleventy already emits a static Markdown twin next to each HTML post:
 * `/YYYY/MM/DD/slug/index.html` and `/YYYY/MM/DD/slug/index.md`. Browsers keep
 * requesting HTML as usual. When a client sends an `Accept` header where
 * negotiated type is `text/markdown`, we answer the same HTML URL with the
 * body of the twin `.md` file, plus `Content-Type`, `Vary`, and
 * `x-markdown-tokens`.
 *
 * No Markdown twins exist for `/`, `/about/`, `/resume/`, etc., so we do not
 * negotiate there: those requests never hit this edge (see `config.pattern`).
 *
 * ## Request flow (high level)
 *
 * 1. Platform filters: Netlify only invokes this function when the pathname
 *    matches an internal post URL, the method is `GET`, and `Accept` mentions
 *    `text/markdown` (only a substring gate).
 * 2. Direct `.md`: If the URL is already the twin (`…/index.md`), pass through
 *    to the static file (`context.next()`). Otherwise continue.
 * 3. Negotiation: use `@hapi/accept` so `q` values and `text/html` vs
 *   `text/markdown` are resolved per RFC 7231; only continue if Markdown wins.
 * 4. Twin path: map the HTML-style URL to `…/index.md` (see `getMarkdownTwin`).
 * 5. Load twin: `context.next(innerRequest)` loads the static file from the
 *    same deploy (no public `fetch()` loop to our own origin). Inner `Accept`
 *    is reset to a generic wildcard value so the `header` gate does not match
 *    and this edge is not re-invoked for the inner URL.
 * 6. Fallback: if the twin is missing (404, etc.), replay the original
 *    request so the client gets HTML like a normal visitor.
 * 7. Response: copy upstream headers, normalize Markdown `Content-Type`,
 *    set `Vary: Accept`, set `Content-Length` to the UTF-8 byte size of the
 *    body, add token hint.
 */
export default async function markdownNegotiation(
	request: Request,
	context: Context,
): Promise<Response | undefined> {
	const url = new URL(request.url)
	const { pathname } = url

	// Direct `.md` requests: serve the static file as Netlify normally would.
	// Must run before negotiation so the inner `context.next(innerRequest)` chain
	// does not recurse on Markdown-winning Accept headers.
	if (pathname.toLowerCase().endsWith('.md')) {
		return context.next()
	}

	// If the Accept header provides `text/markdown`, but it’s not the preference,
	// abort the edge function as there is nothing to do.
	if (!prefersMarkdown(request.headers.get('accept'))) return

	// If we cannot find a Markdown twin for that path for any reason, abort the
	// edge function as there is nothing we can do.
	const twinPath = getMarkdownTwin(pathname)
	if (!twinPath) return

	// Subrequest to the static twin. Reset the `Accept` header so we do not
	// negotiate again on the inner pass; the `.md` pathname is enough for the
	// early exit above.
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

	// External posts and any URL without a generated twin: behave like a normal
	// visit.
	if (!upstream.ok || upstream.status === 404) {
		return context.next(request)
	}

	const headers = new Headers(upstream.headers)
	headers.set('content-type', 'text/markdown; charset=utf-8')
	headers.set('vary', 'accept')

	// Build the body as UTF-8 bytes so Content-Length matches what we send.
	// Dropping the copied header alone relies on the runtime to infer length from
	// a string body; setting it explicitly avoids any mismatch if headers were
	// merged oddly.
	const text = await upstream.text()
	const body = new TextEncoder().encode(text)
	headers.delete('transfer-encoding')
	headers.set('content-length', String(body.byteLength))
	headers.set('x-markdown-tokens', String(estimateTokens(body.byteLength)))

	return new Response(body, { status: upstream.status, headers })
}

/**
 * True iff RFC 7231-style negotiation among given representations picks
 * `text/markdown` over `text/html` (respecting `q`, ordering, etc.).
 *
 * Distinct from the simple header check in the config, which only tests
 * whether `Accept` mentions Markdown so Netlify invokes this edge at all.
 */
function prefersMarkdown(accept: string | null): boolean {
	if (!accept) return false
	return Accept.mediaType(accept, ['text/html', 'text/markdown']) === 'text/markdown'
}

/**
 * Rough token estimate from UTF-8 byte length (~4 bytes per token, common for
 * Latin-ish Markdown). Used for `x-markdown-tokens` only; not a tokenizer.
 * Returns `0` when the length is unknown or invalid. Empty body is reported as
 * `1` so the header stays
 * a positive integer.
 */
function estimateTokens(byteLength: number): number {
	if (!Number.isFinite(byteLength) || byteLength < 0) return 0
	if (byteLength === 0) return 1
	return Math.max(1, Math.ceil(byteLength / 4))
}

/**
 * Maps a post HTML pathname to the static twin Markdown pathname, or
 * `null` if the pathname does not look like a post directory or `index.html`.
 *
 * Uses string `join` for the path so tooling does not treat `${segment}/`
 * patterns inside template literals like regex literals.
 */
function getMarkdownTwin(pathname: string): string | null {
	const HTML_PATH_RE = /^\/(\d{4})\/(\d{2})\/(\d{2})\/([^/]+)\/index\.html$/i
	const EXTLESS_PATH_RE = /^\/(\d{4})\/(\d{2})\/(\d{2})\/([^/]+)\/?$/

	let match = pathname.match(HTML_PATH_RE)
	if (!match?.[1] || !match[2] || !match[3] || !match[4]) {
		match = pathname.match(EXTLESS_PATH_RE)
		if (!match?.[1] || !match[2] || !match[3] || !match[4]) return null
	}
	const [, year, month, day, slug] = match
	return ['', year, month, day, slug, 'index.md'].join('/')
}
