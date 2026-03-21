import assert from 'node:assert/strict'
import test from 'node:test'
import { readText } from './helpers/site-paths.mjs'

test('stats page renders metrics and chart data', async () => {
  const html = await readText('stats/index.html')

  assert.ok(html.length > 0, 'stats page HTML should not be empty')

  if (html.includes('No posts yet')) {
    return
  }

  assert.ok(html.includes('Blog Statistics'), 'stats page should include main title')
  assert.ok(html.includes('Total posts'), 'stats page should include Total posts row')
  assert.ok(html.includes('Average per week'), 'stats page should include Average per week row')

  assert.ok(
    html.includes('id="stats-posts-per-year"'),
    'stats page should include posts-per-year chart container',
  )
  assert.ok(
    html.includes('id="stats-content-trends"'),
    'stats page should include content-trends chart container',
  )

  const hasStatsBootstrap = /window\.__STATS_YEARS__\s*=\s*\[/.test(html)
  assert.ok(hasStatsBootstrap, 'stats page should bootstrap window.__STATS_YEARS__ data for charts')

  assert.ok(
    /"year"\s*:/.test(html),
    'window.__STATS_YEARS__ data should contain at least one year entry',
  )
})
