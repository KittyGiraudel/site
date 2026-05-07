import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'
import { parseHTML } from 'linkedom'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '..')
const searchScriptPath = path.join(repoRoot, 'assets/js/search.js')

type SearchEntry = {
	title: string
	lang: string
	tags: string[]
	url: string
	date: string
	guest: string | null
	external: string | null
}

function createSearchEntries(total = 30): SearchEntry[] {
	return Array.from({ length: total }, (_, index) => ({
		title: `Accessibility tip ${index}`,
		lang: 'en',
		tags: ['Accessibility', 'posts'],
		url: `/2026/04/20/accessibility-tip-${index}/`,
		date: 'April 20, 2026',
		guest: null,
		external: null,
	}))
}

function buildMockSearchDom() {
	const window = parseHTML(`
		<html>
			<body>
				<form>
					<input id="search-input" type="search">
				</form>
				<section id="search-region" aria-busy="true">
					<ul id="search-list"></ul>
					<p id="search-empty" hidden>No results</p>
					<p id="search-error" hidden>Search index error</p>
				</section>
				<template id="search-result-template">
					<li class="List__item">
						<span class="List__secondary-content"></span>
						<a class="List__primary-content"></a>
						<ul class="Tags NoListMarker" hidden></ul>
					</li>
				</template>
				<template id="search-tag-template">
					<li><a class="Tag__link"></a></li>
				</template>
			</body>
		</html>
	`)
	const document = window.document
	const requiredElement = <T extends Element>(selector: string) => {
		const element = document.querySelector<T>(selector)
		if (!element) throw new Error(`Missing test fixture element: ${selector}`)
		return element
	}

	return {
		window,
		document,
		searchInput: requiredElement<HTMLInputElement>('#search-input'),
		resultsList: requiredElement<HTMLOListElement>('#search-list'),
		noResults: requiredElement<HTMLElement>('#search-empty'),
	}
}

async function runSearchScript({
	entries,
	query = '',
}: {
	entries: SearchEntry[]
	query?: string
}) {
	const source = await readFile(searchScriptPath, 'utf8')
	const dom = buildMockSearchDom()
	const { window, document, searchInput, resultsList, noResults } = dom

	let windowLocation = new URL(
		`https://kittygiraudel.com/blog/search/${query ? `?q=${query}` : ''}`,
	)
	Object.defineProperties(window, {
		location: {
			configurable: true,
			get: () => windowLocation,
		},
		history: {
			configurable: true,
			value: {
				replaceState(_state: unknown, _title: string, href: string) {
					windowLocation = new URL(href)
				},
			},
		},
	})

	const context = vm.createContext({
		URL,
		URLSearchParams,
		console,
		document,
		fetch: () =>
			Promise.resolve({
				ok: true,
				json: () => Promise.resolve(entries),
			}),
		window,
	})

	vm.runInContext(source, context)
	document.dispatchEvent(new window.Event('DOMContentLoaded'))
	// Flush promise chains from async DOMContentLoaded (Search.from → bind + restore).
	await Promise.resolve()
	await Promise.resolve()
	await new Promise<void>(resolve => setImmediate(resolve))

	return {
		searchInput,
		resultsList,
		noResults,
		window,
		location: () => windowLocation,
	}
}

test('search runtime limits results and keeps query in URL', async () => {
	const entries = createSearchEntries(30)
	const runtime = await runSearchScript({ entries })

	runtime.searchInput.value = 'accessibility tip'
	runtime.searchInput.dispatchEvent(new runtime.window.Event('input'))

	assert.ok(runtime.location().searchParams.get('q') === 'accessibility tip')
	assert.equal((runtime.resultsList.innerHTML.match(/class="List__item"/g) || []).length, 20)
})

test('search runtime renders no-results message', async () => {
	const entries = createSearchEntries(3)
	const runtime = await runSearchScript({ entries })

	runtime.searchInput.value = 'no-match-value'
	runtime.searchInput.dispatchEvent(new runtime.window.Event('input'))

	assert.equal(runtime.resultsList.innerHTML, '')
	assert.equal(runtime.noResults.hidden, false)
})

test('search runtime pre-fills query from URL parameter', async () => {
	const entries = createSearchEntries(10)
	const runtime = await runSearchScript({ entries, query: 'accessibility' })

	assert.equal(runtime.searchInput.value, 'accessibility')
	assert.ok(runtime.resultsList.innerHTML.includes('Accessibility tip'))
})

test('search runtime formats guest and external host in secondary line', async () => {
	const entries: SearchEntry[] = [
		{
			title: 'Sample post',
			lang: 'en',
			tags: [],
			url: '/2026/01/01/sample-post/',
			date: 'January 01, 2026',
			guest: 'Alex Example',
			external: 'CSS-Tricks',
		},
	]
	const runtime = await runSearchScript({ entries })

	runtime.searchInput.value = 'sample'
	runtime.searchInput.dispatchEvent(new runtime.window.Event('input'))

	assert.ok(
		runtime.resultsList.innerHTML.includes('January 01, 2026 by Alex Example at CSS-Tricks'),
	)
})
