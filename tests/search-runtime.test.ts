import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '..')
const searchScriptPath = path.join(repoRoot, 'assets/js/search.js')

type SearchEntry = {
	title: string
	lang: string
	tags: string[]
	url: string
	date: string
	guest: string
	external: string
}

function createSearchEntries(total = 30): SearchEntry[] {
	return Array.from({ length: total }, (_, index) => ({
		title: `Accessibility tip ${index}`,
		lang: 'en',
		tags: ['Accessibility', 'posts'],
		url: `/2026/04/20/accessibility-tip-${index}/`,
		date: 'April 20, 2026',
		guest: '&#8203;',
		external: '&#8203;',
	}))
}

type WindowMock = {
	location: URL
	history: {
		replaceState: (_state: unknown, _title: string, href: string) => void
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
	const listeners: Record<string, (ev: { target: { value: string } }) => void> = {}

	const searchInput = {
		value: '',
		addEventListener(event: string, handler: (ev: { target: { value: string } }) => void) {
			listeners[event] = handler
		},
	}
	const resultsContainer = { innerHTML: '' }

	const windowLocation = new URL(
		`https://kittygiraudel.com/blog/search/${query ? `?q=${query}` : ''}`,
	)
	const windowMock: WindowMock = {
		location: windowLocation,
		history: {
			replaceState(_state, _title, href) {
				windowMock.location = new URL(href)
			},
		},
	}

	const context = vm.createContext({
		URL,
		URLSearchParams,
		console,
		document: {
			addEventListener(event: string, callback: () => void) {
				if (event === 'DOMContentLoaded') callback()
			},
			getElementById(id: string) {
				if (id === 'search-input') return searchInput
				if (id === 'results-container') return resultsContainer
				return null
			},
		},
		fetch: () =>
			Promise.resolve({
				ok: true,
				json: () => Promise.resolve(entries),
			}),
		window: windowMock,
	})

	vm.runInContext(source, context)
	await new Promise<void>(resolve => setImmediate(resolve))

	return {
		searchInput,
		resultsContainer,
		listeners,
		location: () => windowMock.location,
	}
}

test('search runtime limits results and keeps query in URL', async () => {
	const entries = createSearchEntries(30)
	const runtime = await runSearchScript({ entries })

	runtime.listeners.input({ target: { value: 'accessibility tip' } })

	assert.ok(runtime.location().searchParams.get('q') === 'accessibility tip')
	assert.equal((runtime.resultsContainer.innerHTML.match(/class="List__item"/g) || []).length, 20)
})

test('search runtime renders no-results message', async () => {
	const entries = createSearchEntries(3)
	const runtime = await runSearchScript({ entries })

	runtime.listeners.input({ target: { value: 'no-match-value' } })

	assert.match(runtime.resultsContainer.innerHTML, /Sorry, I could not find any result/)
})

test('search runtime pre-fills query from URL parameter', async () => {
	const entries = createSearchEntries(10)
	const runtime = await runSearchScript({ entries, query: 'accessibility' })

	assert.equal(runtime.searchInput.value, 'accessibility')
	assert.ok(runtime.resultsContainer.innerHTML.includes('Accessibility tip'))
})
