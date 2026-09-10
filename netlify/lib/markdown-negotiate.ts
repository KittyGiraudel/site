import Accept from '@hapi/accept'

export const NOT_FOUND_MARKDOWN_TITLE = 'Not Found'

/**
 * True iff RFC 7231-style negotiation among given representations picks
 * `text/markdown` over `text/html` (respecting `q`, ordering, etc.).
 *
 * Distinct from the simple header check in the edge `config`, which only tests
 * whether `Accept` mentions Markdown so Netlify invokes the function at all.
 */
export function prefersMarkdown(accept: string | null): boolean {
	if (!accept) return false
	return Accept.mediaType(accept, ['text/html', 'text/markdown']) === 'text/markdown'
}

/**
 * Rough token estimate from UTF-8 byte length (~4 bytes per token, common for
 * Latin-ish Markdown). Used for `x-markdown-tokens` only; not a tokenizer.
 * Returns `0` when the length is unknown or invalid. Empty body is reported as
 * `1` so the header stays a positive integer.
 */
export function estimateTokens(byteLength: number): number {
	if (!Number.isFinite(byteLength) || byteLength < 0) return 0
	if (byteLength === 0) return 1
	return Math.max(1, Math.ceil(byteLength / 4))
}

/**
 * Append `token` to `Vary` if it is not already listed (case-insensitive).
 * Preserves existing tokens such as `Accept-Encoding` so CDNs keep varying on
 * both content negotiation and compression.
 */
export function appendVary(headers: Headers, token: string): void {
	const existing = headers.get('vary')
	if (!existing) {
		headers.set('vary', token)
		return
	}
	const parts = existing
		.split(',')
		.map(part => part.trim())
		.filter(Boolean)
	if (parts.some(part => part.toLowerCase() === token.toLowerCase())) return
	headers.set('vary', [...parts, token].join(', '))
}

export function isMissingStatus(status: number): boolean {
	return status === 404 || status === 410
}

/**
 * Maps a negotiable HTML pathname to its static Markdown twin, or `null`.
 *
 * Homepage: `/` and `/index.html` → `/index.md`.
 * Posts: `/YYYY/MM/DD/slug/` (and `index.html`) → `…/index.md`.
 *
 * Uses string `join` for post paths so tooling does not treat `${segment}/`
 * patterns inside template literals like regex literals.
 */
export function getMarkdownTwin(pathname: string): string | null {
	if (pathname === '/' || /^\/index\.html$/i.test(pathname)) return '/index.md'

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

export function notFoundMarkdownBody(origin: string): string {
	const base = origin.replace(/\/$/, '')
	return `# ${NOT_FOUND_MARKDOWN_TITLE}

This path does not exist on kittygiraudel.com (HTTP 404).

Where to look next:

- [llms.txt](${base}/llms.txt) — curated index and when-to-use guidance for agents
- [agent.txt](${base}/agent.txt) — same routing notes in a dedicated instruction file
- [Sitemap](${base}/sitemap.xml) — exhaustive URL list
- [Articles](${base}/blog/) — blog index
- [Home](${base}/) — Markdown twin at [${base}/index.md](${base}/index.md)
`
}

export function markdownBytesResponse(
	text: string,
	status: number,
	upstreamHeaders?: Headers,
): Response {
	const headers = new Headers(upstreamHeaders)
	headers.set('content-type', 'text/markdown; charset=utf-8')
	appendVary(headers, 'Accept')
	const body = new TextEncoder().encode(text)
	headers.delete('transfer-encoding')
	headers.set('content-length', String(body.byteLength))
	headers.set('x-markdown-tokens', String(estimateTokens(body.byteLength)))
	return new Response(body, { status, headers })
}

export function markdownNotFoundResponse(origin: string): Response {
	return markdownBytesResponse(notFoundMarkdownBody(origin), 404)
}
