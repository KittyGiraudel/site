import assert from 'node:assert/strict'
import { readdir, readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import { siteDir } from './helpers/site-paths.ts'

async function expectFile(relativePath: string) {
	const full = path.join(siteDir, relativePath)
	const s = await stat(full)
	assert.ok(s.isFile(), `${relativePath} should exist as a file`)
}

async function expectDirectoryWithFiles(relativePath: string) {
	const full = path.join(siteDir, relativePath)
	const s = await stat(full)
	assert.ok(s.isDirectory(), `${relativePath} should exist as a directory`)
	const files = await readdir(full)
	assert.ok(files.length > 0, `${relativePath} should not be empty`)
}

test('core assets exist in built site', async () => {
	await Promise.all([
		// Text files
		expectFile('robots.txt'),
		expectFile('humans.txt'),
		expectFile('llms.txt'),
		expectFile('agent.txt'),
		expectFile('.well-known/security.txt'),
		// Images
		expectFile('apple-touch-icon.png'),
		expectFile('favicon.ico'),
		// JSON files
		expectFile('blog/search/data.json'),
		expectFile('manifest.json'),
		// XML directories
		expectFile('sitemap.xml'),
		expectFile('rss/index.xml'),
		// Netlify configuration
		expectFile('_headers'),
		expectFile('_redirects'),
		expectFile('404.html'),
	])

	await Promise.all([
		expectDirectoryWithFiles('assets'),
		expectDirectoryWithFiles('assets/js'),
		expectDirectoryWithFiles('assets/images'),
	])
})

test('Netlify _headers ships a small Content-Security-Policy', async () => {
	const headers = await readFile(path.join(siteDir, '..', 'public', '_headers'), 'utf8')
	const policyLine = headers.split('\n').find(line => line.startsWith('  Content-Security-Policy:'))
	assert.ok(policyLine, '_headers should set Content-Security-Policy on /*')
	const policy = policyLine.replace('  Content-Security-Policy:', '').trim()

	for (const directive of [
		"default-src 'self'",
		"object-src 'none'",
		"frame-ancestors 'none'",
		"base-uri 'self'",
		"script-src 'self' 'unsafe-inline'",
		'https://giscus.app',
		'https://codepen.io',
		'https://public.codepenassets.com',
		'https://cdn.jsdelivr.net/npm/chart.js@4.5.1/',
		'https://cdn.jsdelivr.net/npm/apexcharts@3.54.1/',
		'https://cdn.jsdelivr.net/npm/howler@2.2.4/',
	]) {
		assert.ok(policy.includes(directive), `CSP should include ${directive}`)
	}

	assert.equal(
		/(?:^| )https:\/\/cdn\.jsdelivr\.net(?:;| |$)/.test(policy),
		false,
		'CSP should not allow the whole jsDelivr origin',
	)

	assert.equal(policy.includes('unsafe-eval'), false, 'CSP should not allow unsafe-eval')
})
