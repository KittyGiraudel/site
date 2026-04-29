/**
 * Match site theme for charts. Tooltip defaults are light while body text uses
 * light-dark(); without this, dark mode yields pale text on a pale tooltip.
 * Mirrors ThemeManager (including before main.js calls mount()).
 */
function statsChartThemeMode() {
	const tm = window.ThemeManager
	if (tm?.themes) {
		const { themes } = tm
		const pref = tm.theme
		if (pref === themes.DARK) return 'dark'
		if (pref === themes.LIGHT) return 'light'
	}
	if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'dark'
	return 'light'
}

function statsChartTheme() {
	return { mode: statsChartThemeMode() }
}

function statsChartSurface() {
	return {
		theme: statsChartTheme(),
		chart: { background: 'transparent' },
	}
}

function bindStatsChartsThemeListener(charts) {
	if (!window.ThemeManager?.onThemeChanged || charts.length === 0) return
	window.ThemeManager.onThemeChanged(() => {
		charts.forEach(chart => {
			chart.updateOptions(statsChartSurface())
		})
	})
}

document.addEventListener('DOMContentLoaded', () => {
	const years = window.__STATS_YEARS__ || []
	const postsPerYearEl = document.querySelector('#stats-posts-per-year')
	const contentTrendsEl = document.querySelector('#stats-content-trends')

	if (!Array.isArray(years) || years.length === 0) return
	if (!postsPerYearEl && !contentTrendsEl) return

	const init = () => {
		if (!window.ApexCharts) return
		const charts = []
		if (postsPerYearEl) charts.push(renderPostsPerYearChart(postsPerYearEl, years))
		if (contentTrendsEl) charts.push(renderContentTrendsChart(contentTrendsEl, years))
		bindStatsChartsThemeListener(charts.filter(Boolean))
	}

	if (typeof loadJS === 'function' && !window.ApexCharts) {
		loadJS('https://cdn.jsdelivr.net/npm/apexcharts', init)
	} else if (window.ApexCharts) {
		init()
	}
})

function renderPostsPerYearChart(container, years) {
	if (!window.ApexCharts) return

	const categories = years.map(year => String(year.year))
	const counts = years.map(year => year.postCount)

	if (!categories.length) return

	const surface = statsChartSurface()
	const chart = new ApexCharts(container, {
		...surface,
		chart: { ...surface.chart, type: 'bar' },
		series: [{ name: 'Posts', data: counts }],
		xaxis: { categories },
		dataLabels: { enabled: true },
		tooltip: { y: { formatter } },
		plotOptions: { bar: { horizontal: false } },
		responsive: [
			{
				breakpoint: 768,
				options: {
					plotOptions: { bar: { horizontal: true } },
					legend: { position: 'bottom' },
				},
			},
		],
	})

	chart.render()
	return chart
}

function renderContentTrendsChart(container, years) {
	if (!window.ApexCharts) return

	const categories = years.map(year => String(year.year))
	const avgWords = years.map(year => year.avgWordCount)
	const avgParagraphs = years.map(year => year.avgParagraphCount)
	const postsPerYear = years.map(year => year.postCount)

	if (!categories.length) return

	const surface = statsChartSurface()
	const chart = new ApexCharts(container, {
		...surface,
		chart: { ...surface.chart, type: 'line' },
		series: [
			{ name: 'Avg words', data: avgWords },
			{ name: 'Avg paragraphs', data: avgParagraphs },
			{ name: 'Posts', data: postsPerYear, yAxisIndex: 1 },
		],
		xaxis: { categories },
		dataLabels: { enabled: false },
		yaxis: [
			{
				title: { text: 'Words / paragraphs' },
			},
			{
				opposite: true,
				title: { text: 'Posts per year' },
				min: 0,
			},
		],
		stroke: { curve: 'smooth' },
		tooltip: {
			shared: true,
			intersect: false,
		},
	})

	chart.render()
	return chart
}

function formatter(value) {
	return value === 1 ? '1 post' : `${value} posts`
}
