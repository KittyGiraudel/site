import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { load } from 'cheerio'
import utilities from '../build/utilities.ts'

// Production inlines `{% styles %}` as a <style data-helmet> wherever the
// partial is rendered. The fleuron partial is rendered inside <p class="Metadata">.
const fixture = `<!doctype html><html><head><title>t</title></head><body>
<p class="Metadata"><time>June 29, 2026</time><style data-helmet data-style="/assets/css/components/fleuron.css">.Fleuron{color:red}</style><span class="Fleuron">❦</span><span id="page-reading-time">21-minute read</span></p>
</body></html>`

test('helmet is registered before HTML minification', () => {
	const config = readFileSync(new URL('../eleventy.config.ts', import.meta.url), 'utf8')
	const helmetAt = config.indexOf("config.addTransform('helmet'")
	const minifyAt = config.indexOf("config.addTransform('htmlmin'")

	assert.ok(helmetAt !== -1, 'helmet transform should be registered')
	assert.ok(minifyAt !== -1, 'htmlmin transform should be registered')
	assert.ok(
		helmetAt < minifyAt,
		'helmet must run before htmlmin so a <style> inside <p> is hoisted before removeOptionalTags',
	)
})

test('hoisting styles before minification keeps the metadata paragraph intact', async () => {
	const hoisted = utilities.helmet(fixture, 'index.html')
	const minified = await utilities.minifyHTML(hoisted, 'index.html')
	const $ = load(minified)

	assert.equal($('.Metadata .Fleuron').length, 1)
	assert.equal($('.Metadata #page-reading-time').length, 1)
	assert.equal($('head style[data-style="/assets/css/components/fleuron.css"]').length, 1)
	assert.equal($('body style').length, 0)
	assert.equal($('p').filter((_, el) => $(el).text().trim() === '').length, 0)
})
