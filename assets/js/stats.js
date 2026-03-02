document.addEventListener('DOMContentLoaded', () => {
  const years = window.__STATS_YEARS__ || []
  const postsPerYearEl = document.querySelector('#stats-posts-per-year')
  const contentTrendsEl = document.querySelector('#stats-content-trends')

  if (!Array.isArray(years) || years.length === 0) return
  if (!postsPerYearEl && !contentTrendsEl) return

  const init = () => {
    if (!window.ApexCharts) return
    if (postsPerYearEl) renderPostsPerYearChart(postsPerYearEl, years)
    if (contentTrendsEl) renderContentTrendsChart(contentTrendsEl, years)
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

  const chart = new ApexCharts(container, {
    chart: { type: 'bar' },
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
}

function renderContentTrendsChart(container, years) {
  if (!window.ApexCharts) return

  const categories = years.map(year => String(year.year))
  const avgWords = years.map(year => year.avgWordCount)
  const avgParagraphs = years.map(year => year.avgParagraphCount)
  const postsPerYear = years.map(year => year.postCount)

  if (!categories.length) return

  const chart = new ApexCharts(container, {
    chart: { type: 'line' },
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
}

function formatter(value) {
  return value === 1 ? '1 post' : `${value} posts`
}
