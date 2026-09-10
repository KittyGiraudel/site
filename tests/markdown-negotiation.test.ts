import assert from 'node:assert/strict'
import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import markdownNegotiation from '../netlify/edge-functions/markdown-negotiation.ts'
import {
	appendVary,
	getMarkdownTwin,
	markdownNotFoundResponse,
	notFoundMarkdownBody,
	prefersMarkdown,
} from '../netlify/lib/markdown-negotiate.ts'
import { siteDir } from './helpers/site-paths.ts'

const repoRoot = path.resolve(siteDir, '..')

test('getMarkdownTwin maps homepage and posts', () => {
	assert.equal(getMarkdownTwin('/'), '/index.md')
	assert.equal(getMarkdownTwin('/index.html'), '/index.md')
	assert.equal(
		getMarkdownTwin('/2026/03/11/serving-markdown-to-llms-with-11ty/'),
		'/2026/03/11/serving-markdown-to-llms-with-11ty/index.md',
	)
	assert.equal(
		getMarkdownTwin('/2026/03/11/serving-markdown-to-llms-with-11ty/index.html'),
		'/2026/03/11/serving-markdown-to-llms-with-11ty/index.md',
	)
	assert.equal(getMarkdownTwin('/about/'), null)
	assert.equal(getMarkdownTwin('/blog/'), null)
})

test('prefersMarkdown respects q-values', () => {
	assert.equal(prefersMarkdown(null), false)
	assert.equal(prefersMarkdown('text/markdown'), true)
	assert.equal(prefersMarkdown('text/html, text/markdown;q=0.8'), false)
	assert.equal(prefersMarkdown('text/markdown, text/html;q=0.9'), true)
})

test('appendVary keeps Accept-Encoding and adds Accept', () => {
	const headers = new Headers({ vary: 'accept-encoding' })
	appendVary(headers, 'Accept')
	assert.equal(headers.get('vary'), 'accept-encoding, Accept')
	appendVary(headers, 'Accept')
	assert.equal(headers.get('vary'), 'accept-encoding, Accept')
})

test('markdown 404 body points agents at recovery URLs', () => {
	const body = notFoundMarkdownBody('https://kittygiraudel.com')
	assert.match(body, /HTTP 404/)
	assert.match(body, /https:\/\/kittygiraudel\.com\/llms\.txt/)
	assert.match(body, /https:\/\/kittygiraudel\.com\/sitemap\.xml/)
	assert.match(body, /https:\/\/kittygiraudel\.com\/blog\//)

	const response = markdownNotFoundResponse('https://kittygiraudel.com')
	assert.equal(response.status, 404)
	assert.match(response.headers.get('content-type') ?? '', /text\/markdown/)
	assert.match(response.headers.get('vary') ?? '', /Accept/i)
})

test('llms.txt and agent.txt include when-to-use guidance', async () => {
	const llms = await readFile(path.join(repoRoot, 'public/llms.txt'), 'utf8')
	const agent = await readFile(path.join(repoRoot, 'public/agent.txt'), 'utf8')
	for (const text of [llms, agent]) {
		assert.match(text, /## When to use this/)
		assert.match(text, /Accept: text\/markdown/)
		assert.match(text, /a11y-dialog/)
	}
})

test('HTML 404 template links a sitemap and llms.txt', async () => {
	const html = await readFile(path.join(repoRoot, 'pages/404.liquid'), 'utf8')
	assert.match(html, /\/sitemap\.xml/)
	assert.match(html, /\/llms\.txt/)
	assert.match(html, /\/blog\//)
})

test('homepage markdown twin exists in production builds', async t => {
	const full = path.join(siteDir, 'index.md')
	try {
		const s = await stat(full)
		assert.ok(s.isFile())
	} catch {
		t.skip('index.md is only emitted when RENDER_MARKDOWN_ALTERNATIVE is on')
		return
	}
	const text = await readFile(full, 'utf8')
	assert.match(text, /^# Kitty Giraudel/m)
	assert.match(text, /llms\.txt/)
	assert.match(text, /Accept: text\/markdown/)
})

function mockContext(handler: (request: Request) => Promise<Response> | Response) {
	return {
		next: (request?: Request) => {
			const req = request ?? new Request('https://kittygiraudel.com/passthrough')
			return Promise.resolve(handler(req))
		},
	}
}

test('edge function serves homepage markdown twin', async () => {
	const twin = '# Kitty Giraudel\n'
	const context = mockContext(request => {
		assert.equal(new URL(request.url).pathname, '/index.md')
		return new Response(twin, {
			status: 200,
			headers: {
				'content-type': 'text/plain',
				vary: 'accept-encoding',
			},
		})
	})

	const response = await markdownNegotiation(
		new Request('https://kittygiraudel.com/', {
			headers: { accept: 'text/markdown' },
		}),
		context as never,
	)

	assert.ok(response)
	assert.equal(response.status, 200)
	assert.equal(response.headers.get('content-type'), 'text/markdown; charset=utf-8')
	assert.equal(response.headers.get('vary'), 'accept-encoding, Accept')
	assert.equal(await response.text(), twin)
})

test('edge function serves markdown 404 for missing paths', async () => {
	const context = mockContext(() => {
		return new Response('<html>not found</html>', {
			status: 404,
			headers: { 'content-type': 'text/html' },
		})
	})

	const response = await markdownNegotiation(
		new Request('https://kittygiraudel.com/this-path-does-not-exist', {
			headers: { accept: 'text/markdown' },
		}),
		context as never,
	)

	assert.ok(response)
	assert.equal(response.status, 404)
	assert.match(response.headers.get('content-type') ?? '', /text\/markdown/)
	assert.match(await response.text(), /llms\.txt/)
})

test('edge function leaves HTML pages without a twin unchanged', async () => {
	const html = '<html>about</html>'
	const context = mockContext(request => {
		assert.equal(new URL(request.url).pathname, '/about/')
		return new Response(html, {
			status: 200,
			headers: { 'content-type': 'text/html; charset=utf-8' },
		})
	})

	const response = await markdownNegotiation(
		new Request('https://kittygiraudel.com/about/', {
			headers: { accept: 'text/markdown' },
		}),
		context as never,
	)

	assert.ok(response)
	assert.equal(response.status, 200)
	assert.equal(await response.text(), html)
})
