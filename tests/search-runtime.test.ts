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

function escapeAttr(value: string) {
	return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;')
}

function buildMockSearchDom() {
	const form = {
		addEventListener(_type: string, _handler: (...args: unknown[]) => void) {
			// no-op for submit prevention in tests
		},
	}

	const searchInput: {
		value: string
		addEventListener: (event: string, handler: (ev: { target: { value: string } }) => void) => void
		closest: (sel: string) => typeof form | null
	} = {
		value: '',
		addEventListener(event: string, handler: (ev: { target: { value: string } }) => void) {
			listeners[event] = handler
		},
		closest(sel: string) {
			return sel === 'form' ? form : null
		},
	}

	const listeners: Record<string, (ev: { target: { value: string } }) => void> = {}

	function serializeElement(node: {
		tagName: string
		className?: string
		attributes?: Record<string, string>
		innerHTML?: string
		textContent?: string
		hidden?: boolean
		style?: Record<string, string>
		children?: ReturnType<typeof makeResultLi>[]
	}): string {
		const tag = node.tagName.toLowerCase()
		const attrs: string[] = []
		if (node.className) attrs.push(`class="${escapeAttr(node.className)}"`)
		if (node.hidden) attrs.push('hidden')
		if (node.attributes) {
			for (const [k, v] of Object.entries(node.attributes)) {
				if (v !== undefined && v !== null) attrs.push(`${k}="${escapeAttr(String(v))}"`)
			}
		}
		if (node.style) {
			const parts = Object.entries(node.style).map(([k, v]) => `${k}: ${v}`)
			if (parts.length) attrs.push(`style="${escapeAttr(parts.join('; '))}"`)
		}

		const href = 'href' in node ? (node as { href?: string }).href : undefined
		if (href) attrs.push(`href="${escapeAttr(String(href))}"`)

		const open = attrs.length ? `${tag} ${attrs.join(' ')}` : tag
		if (tag === 'br' || tag === 'img') {
			return `<${open} />`
		}

		let inner = node.innerHTML ?? ''
		if (!inner && node.textContent !== undefined) {
			inner = escapeAttr(node.textContent).replace(/&amp;#8203;/g, '&#8203;')
			// keep numeric entities from test data
			inner = inner.replace(/&amp;#(\d+);/g, '&#$1;')
		}
		if (node.children?.length) {
			inner = node.children.map(c => serializeElement(c)).join('')
		}

		return `<${open}>${inner}</${tag}>`
	}

	function makeTagLi(): {
		tagName: string
		children: unknown[]
		querySelector(sel: string): { tagName: string; href: string; textContent: string } | null
	} {
		const link = {
			tagName: 'A',
			className: 'Tag__link',
			href: '',
			textContent: '',
			setAttribute(_n: string, _v: string) {},
			getAttribute(name: string) {
				return name === 'href' ? link.href : null
			},
		}
		const li = {
			tagName: 'LI',
			children: [link],
			querySelector(sel: string) {
				if (sel === 'a') return link
				if (sel === 'li') return li
				return null
			},
		}
		return li
	}

	function makeResultLi(): {
		tagName: string
		className: string
		innerHTML: string
		textContent: string
		children: unknown[]
		querySelector(sel: string): unknown
	} {
		const secondary = {
			tagName: 'SPAN',
			className: 'List__secondary-content',
			innerHTML: '',
		}
		const link = {
			tagName: 'A',
			className: 'List__primary-content',
			href: '',
			textContent: '',
			style: {} as Record<string, string>,
			attributes: {} as Record<string, string>,
			setAttribute(n: string, v: string) {
				link.attributes[n] = v
			},
			removeAttribute(n: string) {
				delete link.attributes[n]
			},
			getAttribute(n: string) {
				return link.attributes[n] ?? null
			},
		}
		const tagsUl = {
			tagName: 'UL',
			className: 'Tags NoListMarker',
			hidden: true,
			children: [] as ReturnType<typeof makeTagLi>[],
			replaceChildren() {
				tagsUl.children = []
			},
			appendChild(child: ReturnType<typeof makeTagLi>) {
				tagsUl.children.push(child)
				return child
			},
		}

		const li = {
			tagName: 'LI',
			className: 'List__item',
			innerHTML: '',
			textContent: '',
			children: [secondary, link, tagsUl],
			querySelector(sel: string) {
				if (sel === '.List__secondary-content') return secondary
				if (sel === '.List__primary-content') return link
				if (sel === '.Tags') return tagsUl
				if (sel === 'li') return li
				return null
			},
		}
		;(secondary as { textContent?: string }).textContent = ''
		return li
	}

	const resultTemplate = {
		content: {
			cloneNode() {
				const li = makeResultLi()
				return {
					firstElementChild: li,
					querySelector(sel: string) {
						return sel === 'li' ? li : null
					},
				}
			},
		},
	}

	const tagTemplate = {
		content: {
			cloneNode() {
				const tagLi = makeTagLi()
				return {
					firstElementChild: tagLi,
					querySelector(sel: string) {
						return tagLi.querySelector(sel)
					},
				}
			},
		},
	}

	const resultsList: {
		innerHTML: string
		replaceChildren: (...nodes: unknown[]) => void
	} = {
		innerHTML: '',
		replaceChildren(...nodes: unknown[]) {
			if (nodes.length === 0) {
				resultsList.innerHTML = ''
				return
			}
			const frag = nodes[0] as { _children?: { outerHTML: string }[] }
			const parts = frag._children ?? []
			resultsList.innerHTML = parts.map(p => p.outerHTML).join('')
		},
	}

	const noResults = {
		hidden: true,
		removeAttribute(name: string) {
			if (name === 'hidden') this.hidden = false
		},
		setAttribute(name: string, _value: string) {
			if (name === 'hidden') this.hidden = true
		},
	}

	const indexError = {
		hidden: true,
	}

	const resultsRegion = {
		attributes: {} as Record<string, string>,
		setAttribute(name: string, value: string) {
			this.attributes[name] = value
		},
		removeAttribute(name: string) {
			delete this.attributes[name]
		},
	}

	function attachOuterHTML(node: {
		tagName: string
		className?: string
		children?: { outerHTML?: string }[]
		querySelector?: (sel: string) => unknown
		innerHTML?: string
		textContent?: string
		hidden?: boolean
		style?: Record<string, string>
		attributes?: Record<string, string>
		href?: string
	}) {
		if (!Object.hasOwn(node, 'outerHTML')) {
			Object.defineProperty(node, 'outerHTML', {
				configurable: true,
				get() {
					return serializeElement(node as Parameters<typeof serializeElement>[0])
				},
			})
		}
		if (node.children) {
			for (const child of node.children) {
				if (child && typeof child === 'object' && !Object.hasOwn(child, 'outerHTML')) {
					attachOuterHTML(child as Parameters<typeof attachOuterHTML>[0])
				}
			}
		}
	}

	function enhanceFragmentClone(clone: {
		firstElementChild: ReturnType<typeof makeResultLi>
		querySelector: (sel: string) => unknown
	}) {
		const li = clone.firstElementChild
		attachOuterHTML(li)
		const tagsUl = li.querySelector('.Tags') as {
			appendChild: (c: ReturnType<typeof makeTagLi>) => unknown
			children: ReturnType<typeof makeTagLi>[]
		}
		const origAppend = tagsUl.appendChild.bind(tagsUl)
		tagsUl.appendChild = (c: ReturnType<typeof makeTagLi>) => {
			origAppend(c)
			attachOuterHTML(c)
			return c
		}
	}

	const origResultClone = resultTemplate.content.cloneNode.bind(resultTemplate.content)
	resultTemplate.content.cloneNode = () => {
		const clone = origResultClone()
		enhanceFragmentClone(clone as Parameters<typeof enhanceFragmentClone>[0])
		return clone
	}

	const origTagClone = tagTemplate.content.cloneNode.bind(tagTemplate.content)
	tagTemplate.content.cloneNode = () => {
		const clone = origTagClone()
		const li = (clone as { firstElementChild: ReturnType<typeof makeTagLi> }).firstElementChild
		attachOuterHTML(li)
		return clone
	}

	const documentFragmentFactory = () => {
		const children: { outerHTML: string }[] = []
		return {
			_children: children,
			appendChild(node: { outerHTML: string }) {
				children.push(node)
				return node
			},
			get firstElementChild() {
				return children[0] ?? null
			},
		}
	}

	return {
		searchInput,
		resultsList,
		noResults,
		indexError,
		resultsRegion,
		listeners,
		resultTemplate,
		tagTemplate,
		documentFragmentFactory,
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
	const {
		searchInput,
		resultsList,
		noResults,
		indexError,
		resultsRegion,
		listeners,
		documentFragmentFactory,
	} = dom

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

	const documentStub = {
		addEventListener(event: string, callback: () => void) {
			if (event === 'DOMContentLoaded') callback()
		},
		getElementById(id: string) {
			if (id === 'search-input') return searchInput
			if (id === 'search-results-list') return resultsList
			if (id === 'no-results') return noResults
			if (id === 'search-index-error') return indexError
			if (id === 'search-results-region') return resultsRegion
			if (id === 'search-result-template') return dom.resultTemplate
			if (id === 'search-tag-template') return dom.tagTemplate
			return null
		},
		querySelector(sel: string) {
			const id = /^#([\w-]+)$/.exec(sel)
			if (id) return documentStub.getElementById(id[1])
			return null
		},
		createDocumentFragment: () => documentFragmentFactory(),
	}

	const context = vm.createContext({
		URL,
		URLSearchParams,
		console,
		document: documentStub,
		fetch: () =>
			Promise.resolve({
				ok: true,
				json: () => Promise.resolve(entries),
			}),
		window: windowMock,
	})

	vm.runInContext(source, context)
	// Flush promise chains from async DOMContentLoaded (Search.from → bind + restore).
	await Promise.resolve()
	await Promise.resolve()
	await new Promise<void>(resolve => setImmediate(resolve))

	return {
		searchInput,
		resultsList,
		noResults,
		listeners,
		location: () => windowMock.location,
	}
}

test('search runtime limits results and keeps query in URL', async () => {
	const entries = createSearchEntries(30)
	const runtime = await runSearchScript({ entries })

	runtime.listeners.input({ target: { value: 'accessibility tip' } })

	assert.ok(runtime.location().searchParams.get('q') === 'accessibility tip')
	assert.equal((runtime.resultsList.innerHTML.match(/class="List__item"/g) || []).length, 20)
})

test('search runtime renders no-results message', async () => {
	const entries = createSearchEntries(3)
	const runtime = await runSearchScript({ entries })

	runtime.listeners.input({ target: { value: 'no-match-value' } })

	assert.equal(runtime.resultsList.innerHTML, '')
	assert.equal(runtime.noResults.hidden, false)
})

test('search runtime pre-fills query from URL parameter', async () => {
	const entries = createSearchEntries(10)
	const runtime = await runSearchScript({ entries, query: 'accessibility' })

	assert.equal(runtime.searchInput.value, 'accessibility')
	assert.ok(runtime.resultsList.innerHTML.includes('Accessibility tip'))
})
