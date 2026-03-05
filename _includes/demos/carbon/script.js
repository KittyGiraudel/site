const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function buildEstimatedEntries(baseEntries, yearsBack = 3) {
  if (!baseEntries.length) return [];
  const monthsToAdd = yearsBack * 12;

  // Use the average of the first full year as a baseline for extrapolation.
  const firstYear = baseEntries[0].year;
  const firstYearMonths = baseEntries.filter(e => e.year === firstYear);
  const baseline =
    firstYearMonths.reduce((sum, m) => sum + m.amount, 0) /
    (firstYearMonths.length || 1);

  // Derive a soft monthly scaling factor from that same year so that
  // earlier estimates roughly follow publishing activity, without exploding
  // for very busy months.
  const firstYearArticles = postsPerMonth.filter(m => m.year === firstYear);
  const avgArticlesPerMonth =
    firstYearArticles.reduce((sum, m) => sum + m.postCount, 0) /
    (firstYearArticles.length || 1);
  // Global scale so extrapolated months stay clearly below your best historic months.
  const globalScale = 0.7;

  const estimates = [];
  const first = baseEntries[0];
  let year = first.year;
  let monthIndex = monthOrder.indexOf(first.monAbbr);

  // Step backwards month by month, assigning the baseline amount.
  for (let i = 1; i <= monthsToAdd; i++) {
    monthIndex -= 1;
    if (monthIndex < 0) {
      monthIndex = 11;
      year -= 1;
    }
    const monAbbr = monthOrder[monthIndex];
    const articleCount = getArticleCount(year, monAbbr);
    // Ratio of how "busy" this month is compared to the baseline year.
    const rawRatio =
      avgArticlesPerMonth > 0 ? articleCount / avgArticlesPerMonth : 1;
    // Clamp the ratio so estimates stay within a plausible band while still
    // expressing relative differences (quieter vs busier months).
    const ratio = Math.min(Math.max(rawRatio, 0.3), 1.2);
    const scaledBaseline = baseline * globalScale * ratio;

    // Add a tiny deterministic jitter so extrapolated months don't look dead flat
    // while remaining visually subtle (~±4%).
    const seed = year * 100 + monthIndex;
    const noiseRaw = Math.sin(seed * 12.9898) * 43758.5453;
    const noiseUnit = noiseRaw - Math.floor(noiseRaw); // 0..1
    const jitter = 1 + (noiseUnit - 0.5) * 0.08;

    estimates.unshift({
      year,
      monAbbr,
      monthIndex,
      amount: scaledBaseline * jitter,
    });
  }

  return estimates;
}

// Go ~6 years back from 2019 to reach your first known "ads existed" date in 2013.
const estimatedEntries = buildEstimatedEntries(realEntries, 6);
let allEntries = realEntries.slice();
let currentRange = 'all';

function getArticleCount(year, monAbbr) {
  const monthIndex = monthOrder.indexOf(monAbbr)
  if (monthIndex === -1) return 0
  const hit = postsPerMonth.find(m => m.year === year && m.monthIndex === monthIndex)
  return hit ? hit.postCount : 0
}

function filterEntries(range) {
  if (range === 'all') return allEntries.slice();
  if (!allEntries.length) return [];

  // Trailing N×12 months based on the latest month in the data.
  const last = allEntries[allEntries.length - 1];
  const lastMonthIndex = monthOrder.indexOf(last.monAbbr);
  const lastAbsolute = last.year * 12 + lastMonthIndex;

  let yearsWindow = 0;
  if (range === '5y') yearsWindow = 5;
  if (range === '3y') yearsWindow = 3;
  if (range === '2y') yearsWindow = 2;
  if (range === '1y') yearsWindow = 1;
  if (!yearsWindow) return allEntries.slice();

  const monthsWindow = yearsWindow * 12;
  const minAbsolute = lastAbsolute - (monthsWindow - 1);

  return allEntries.filter(e => {
    const idx = e.year * 12 + monthOrder.indexOf(e.monAbbr);
    return idx >= minAbsolute;
  });
}

function entriesToLabels(entries) {
  return entries.map(e => {
    const idx = monthOrder.indexOf(e.monAbbr);
    const m = String(idx + 1).padStart(2, '0');
    return `${e.year}-${m}`;
  });
}

function updateRangeLabel(entries) {
  const el = document.getElementById('rangeLabel');
  if (!el) return;
  if (!entries.length) {
    el.textContent = 'No data';
    return;
  }
  const first = entries[0];
  const last = entries[entries.length - 1];
  const firstLabel = `${first.monAbbr} ${first.year}`;
  const lastLabel = `${last.monAbbr} ${last.year}`;
  el.textContent = firstLabel === lastLabel
    ? firstLabel
    : `${firstLabel} → ${lastLabel}`;
}

function updateSummary(entries, labels) {
  const values = entries.map(e => e.amount);
  const total = values.reduce((s, v) => s + v, 0);
  const avg = values.length ? total / values.length : 0;
  const bestIndex = values.length
    ? values.reduce((bestI, v, i) => (v > values[bestI] ? i : bestI), 0)
    : -1;
  const bestLabel = bestIndex >= 0 ? labels[bestIndex] : '–';
  const bestValue = bestIndex >= 0 ? values[bestIndex] : 0;

  document.getElementById('totalValue').textContent =
    `$${total.toFixed(2)}`;
  document.getElementById('monthsValue').textContent =
    `${values.length}`;
  document.getElementById('avgValue').textContent =
    `$${avg.toFixed(2)}`;
  document.getElementById('bestMonthValue').textContent =
    `${bestLabel} · $${bestValue.toFixed(2)}`;

  return values;
}

const ctx = document.getElementById('payoutsChart').getContext('2d');
const initialEntries = filterEntries(currentRange);
const initialLabels = entriesToLabels(initialEntries);
updateRangeLabel(initialEntries);
const initialValues = updateSummary(initialEntries, initialLabels);
const initialArticles = initialEntries.map(e => getArticleCount(e.year, e.monAbbr));

const chart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: initialLabels,
    datasets: [
      {
        type: 'bar',
        label: 'Payout (USD)',
        data: initialValues,
        borderRadius: 6,
        backgroundColor: 'rgb(56 189 248 / 0.65)',
        borderColor: 'rgb(56 189 248 / 0.8)',
        borderWidth: 1.5,
        maxBarThickness: 22,
        yAxisID: 'y',
        order: 2,
      },
      {
        type: 'line',
        label: 'Articles',
        data: initialArticles,
        borderColor: 'rgb(236 72 153 / 0.95)',
        backgroundColor: 'rgb(236 72 153 / 0.08)',
        borderWidth: 2.5,
        tension: 0.25,
        pointRadius: 3,
        pointBackgroundColor: 'rgb(236 72 153)',
        yAxisID: 'y1',
        order: 1,
      },
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    datasets: {
      bar: { order: 1 },
      line: { order: 2 },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: ctx => {
            const label = ctx.dataset.label || ''
            if (label === 'Payout (USD)') return `$${ctx.parsed.y.toFixed(2)}`
            if (label === 'Articles') return `${ctx.parsed.y} article${ctx.parsed.y === 1 ? '' : 's'}`
            return ctx.parsed.y
          },
        }
      }
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 0,
          minRotation: 0,
          color: '#9ca3af',
          autoSkip: true,
          maxTicksLimit: 10
        },
        grid: { display: false }
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: '#9ca3af',
          callback: v => `$${v}`
        },
        grid: {
          color: 'rgb(55 65 81 / 0.3)',
          zeroLineColor: 'rgb(156 163 175 / 0.8)'
        }
      },
      y1: {
        position: 'right',
        beginAtZero: true,
        ticks: {
          color: '#9ca3af',
          callback: v => `${v}`,
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    }
  }
});

const estimatesWrapper = document.getElementById('estimatesWrapper');
const estimatesToggle = document.getElementById('estimatesToggle');

document.querySelectorAll('.range-toggle button').forEach(btn => {
  btn.addEventListener('click', () => {
    const range = btn.getAttribute('data-range');
    currentRange = range;
    Array.from(document
      .querySelectorAll('.range-toggle button'))
      .forEach(b => {
        b.classList.toggle('is-active', b === btn)
      });

    // Only allow extrapolated history in the "All" view.
    if (range !== 'all') {
      allEntries = realEntries.slice();
      if (estimatesToggle) {
        estimatesToggle.checked = false;
      }
      if (estimatesWrapper) {
        estimatesWrapper.style.display = 'none';
      }
    } else if (estimatesWrapper) {
      estimatesWrapper.style.display = '';
    }

    const filtered = filterEntries(range);
    const labels = entriesToLabels(filtered);
    const values = updateSummary(filtered, labels);
    updateRangeLabel(filtered);
    const articles = filtered.map(e => getArticleCount(e.year, e.monAbbr));

    chart.data.labels = labels;
    chart.data.datasets[0].data = values;
    chart.data.datasets[1].data = articles;
    chart.update();
  });
});

if (estimatesToggle) {
  estimatesToggle.addEventListener('change', () => {
    allEntries = estimatesToggle.checked
      ? estimatedEntries.concat(realEntries)
      : realEntries.slice();

    const filtered = filterEntries(currentRange);
    const labels = entriesToLabels(filtered);
    const values = updateSummary(filtered, labels);
    updateRangeLabel(filtered);
    const articles = filtered.map(e => getArticleCount(e.year, e.monAbbr));

    chart.data.labels = labels;
    chart.data.datasets[0].data = values;
    chart.data.datasets[1].data = articles;
    chart.update();
  });
}
