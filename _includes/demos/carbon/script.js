/**
 * @typedef {Object} PayoutEntry
 * @property {number} year
 * @property {string} monAbbr
 * @property {number} amount
 * @property {boolean} [estimated]
 */

/**
 * @typedef {Object} PostMonthStat
 * @property {number} year
 * @property {number} monthIndex
 * @property {number} postCount
 */

/**
 * @typedef {Object} CarbonVizSummary
 * @property {number[]} values
 * @property {number} total
 * @property {number} avg
 * @property {number} count
 * @property {string} bestLabel
 * @property {number} bestValue
 * @property {('year'|'month')} unit
 */

/**
 * @typedef {Object} CarbonVizState
 * @property {string[]} labels
 * @property {number[]} payouts
 * @property {number[]} articles
 * @property {string} rangeLabel
 * @property {CarbonVizSummary} summary
 * @property {('yearly'|'monthly')} mode
 * @property {string|number} range
 */

const MONTH_ORDER = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Simple helper to sum numeric arrays.
 * @param {number[]} array
 * @returns {number}
 */
function sum(array) {
  return array.reduce((sum, value) => sum + value, 0);
}

/**
 * Stateful data/visualisation layer for the Carbon payouts chart.
 *
 * It owns:
 * - raw and extrapolated payout entries
 * - aggregation to monthly / yearly views
 * - range filtering in trailing N years
 * - Chart.js dataset updates
 */
class CarbonViz {
  /**
   * @param {Object} options
   * @param {PayoutEntry[]} options.entries Cleaned monthly payout entries.
   * @param {PostMonthStat[]} options.postsPerMonth Monthly post statistics from the site.
   * @param {CanvasRenderingContext2D} options.ctx 2D rendering context for the chart canvas.
   * @param {Object} options.colors Colour palette for the chart (axis, grid, bar, line, etc.).
   *        Resolved colour palette, typically derived from CSS custom properties.
   */
  constructor({ entries, postsPerMonth, ctx, colors }) {
    if (!colors) throw new Error('Colors are required');
    if (!ctx) throw new Error('Canvas context is required');

    this.entries = Array.isArray(entries) ? entries.slice() : [];
    this.postsPerMonth = Array.isArray(postsPerMonth) ? postsPerMonth.slice() : [];

    this.currentMode = 'yearly'; // 'yearly' | 'monthly'
    this.currentRange = 'all'; // 'all' | '5y' | '3y' | '2y' | '1y'

    this.yearlyPostsMap = this.buildYearlyPostsMap(this.postsPerMonth);
    this.estimatedEntries = this.buildEstimatedEntries(this.entries, 5);
    this.allEntries = this.entries.slice();
    this.currentEntriesForTooltip = [];

    this.colors = colors;
    this.chart = this.initChart(ctx);
  }

  /**
   * Pre-compute total posts per year for fast yearly lookups.
   * @param {PostMonthStat[]} months
   * @returns {Map<number, number>}
   */
  buildYearlyPostsMap(months) {
    return months.reduce((map, m) => {
      const key = m.year;
      map.set(key, (map.get(key) || 0) + m.postCount);
      return map;
    }, new Map());
  }

  /**
   * Produce synthetic history by extrapolating backwards from the first real year,
   * roughly following article volume while staying in a plausible band.
   *
   * @param {PayoutEntry[]} baseEntries
   * @param {number} [yearsBack=3] How many years of synthetic history to generate.
   * @returns {PayoutEntry[]}
   */
  buildEstimatedEntries(baseEntries, yearsBack = 3) {
    if (!baseEntries.length) return [];

    const monthsToAdd = yearsBack * 12;
    const firstYear = baseEntries[0].year;
    const firstYearMonths = baseEntries.filter(e => e.year === firstYear);
    const baseline =
      sum(firstYearMonths.map(m => m.amount)) /
      (firstYearMonths.length || 1);

    const firstYearArticles = this.postsPerMonth.filter(m => m.year === firstYear);
    const avgArticlesPerMonth =
      sum(firstYearArticles.map(m => m.postCount)) /
      (firstYearArticles.length || 1);

    const globalScale = 0.7;

    const estimates = [];
    const first = baseEntries[0];
    let year = first.year;
    let monthIndex = MONTH_ORDER.indexOf(first.monAbbr);

    for (let i = 1; i <= monthsToAdd; i++) {
      monthIndex -= 1;
      if (monthIndex < 0) {
        monthIndex = 11;
        year -= 1;
      }
      const monAbbr = MONTH_ORDER[monthIndex];
      const articleCount = this.getArticleCount(year, monAbbr);

      const rawRatio =
        avgArticlesPerMonth > 0 ? articleCount / avgArticlesPerMonth : 1;
      const ratio = Math.min(Math.max(rawRatio, 0.3), 1.2);
      const scaledBaseline = baseline * globalScale * ratio;

      const seed = year * 100 + monthIndex;
      const noiseRaw = Math.sin(seed * 12.9898) * 43758.5453;
      const noiseUnit = noiseRaw - Math.floor(noiseRaw);
      const jitter = 1 + (noiseUnit - 0.5) * 0.08;

      estimates.unshift({
        year,
        monAbbr,
        monthIndex,
        amount: scaledBaseline * jitter,
        estimated: true,
      });
    }

    return estimates;
  }

  /**
   * Articles published for a given (year, month).
   * @param {number} year
   * @param {string} monAbbr
   * @returns {number}
   */
  getArticleCount(year, monAbbr) {
    const monthIndex = MONTH_ORDER.indexOf(monAbbr);
    if (monthIndex === -1) return 0;
    const hit = this.postsPerMonth.find(
      m => m.year === year && m.monthIndex === monthIndex,
    );
    return hit ? hit.postCount : 0;
  }

  /**
   * Articles published in a given year.
   * @param {number} year
   * @returns {number}
   */
  getYearlyArticleCount(year) {
    return this.yearlyPostsMap.get(year) || 0;
  }

  /**
   * Map payout entries to parallel article-count series
   * matching the current display mode.
   * @param {PayoutEntry[]} entries
   * @returns {number[]}
   */
  getArticlesForEntries(entries) {
    if (this.currentMode === 'yearly') {
      return entries.map(e => this.getYearlyArticleCount(e.year));
    }
    return entries.map(e => this.getArticleCount(e.year, e.monAbbr));
  }

  /**
   * Aggregate monthly-like entries into yearly buckets,
   * preserving the estimated flag when any constituent month was synthetic.
   *
   * @param {PayoutEntry[]} sourceEntries
   * @returns {PayoutEntry[]}
   */
  buildYearlyEntries(sourceEntries) {
    const byYear = new Map();

    for (const entry of sourceEntries) {
      const { year } = entry;
      const existing =
        byYear.get(year) || { year, monAbbr: 'Year', amount: 0, estimated: false };
      existing.amount += entry.amount;
      if (entry.estimated) existing.estimated = true;
      byYear.set(year, existing);
    }

    return Array.from(byYear.values()).sort((a, b) => a.year - b.year);
  }

  /**
   * Filter entries to a trailing N-year window in monthly mode.
   * @param {string|number} range
   * @returns {PayoutEntry[]}
   */
  filterEntries(range) {
    if (range === 'all') return this.allEntries.slice();
    if (!this.allEntries.length) return [];

    const last = this.allEntries[this.allEntries.length - 1];
    const lastMonthIndex = MONTH_ORDER.indexOf(last.monAbbr);
    const lastAbsolute = last.year * 12 + lastMonthIndex;

    const yearsWindow = this.parseYearsWindow(range);
    if (!yearsWindow) return this.allEntries.slice();

    const monthsWindow = yearsWindow * 12;
    const minAbsolute = lastAbsolute - (monthsWindow - 1);

    return this.allEntries.filter(e => {
      const idx = e.year * 12 + MONTH_ORDER.indexOf(e.monAbbr);
      return idx >= minAbsolute;
    });
  }

  /**
   * Entries suitable for the current display mode (yearly vs monthly),
   * including any trailing-window filtering.
   *
   * @param {string|number} range
   * @returns {PayoutEntry[]}
   */
  getEntriesForCurrentMode(range) {
    if (this.currentMode === 'yearly') {
      const yearlyAll = this.buildYearlyEntries(this.allEntries);
      if (range === 'all') return yearlyAll;
      if (!yearlyAll.length) return [];
      const years = yearlyAll.map(e => e.year);
      const maxYear = Math.max(...years);
      const yearsWindow = this.parseYearsWindow(range);
      if (!yearsWindow) return yearlyAll;
      const minYear = maxYear - (yearsWindow - 1);
      return yearlyAll.filter(e => e.year >= minYear);
    }

    return this.filterEntries(range);
  }

  /**
   * Convert entries to x-axis labels for the current mode.
   * @param {PayoutEntry[]} entries
   * @returns {string[]}
   */
  entriesToLabels(entries) {
    if (this.currentMode === 'yearly') {
      return entries.map(e => String(e.year));
    }
    return entries.map(e => {
      const idx = MONTH_ORDER.indexOf(e.monAbbr);
      const m = String(idx + 1).padStart(2, '0');
      return `${e.year}-${m}`;
    });
  }

  /**
   * Human-readable label describing the visible time span.
   * @param {PayoutEntry[]} entries
   * @returns {string}
   */
  buildRangeLabel(entries) {
    if (!entries.length) {
      return 'No data';
    }
    const first = entries[0];
    const last = entries[entries.length - 1];
    const firstLabel =
      this.currentMode === 'yearly'
        ? `${first.year}`
        : `${first.monAbbr} ${first.year}`;
    const lastLabel =
      this.currentMode === 'yearly'
        ? `${last.year}`
        : `${last.monAbbr} ${last.year}`;
    return firstLabel === lastLabel ? firstLabel : `${firstLabel} → ${lastLabel}`;
  }

  /**
   * Compute summary statistics for the current view.
   * @param {PayoutEntry[]} entries
   * @param {string[]} labels
   * @returns {CarbonVizSummary}
   */
  buildSummary(entries, labels) {
    const values = entries.map(e => e.amount);
    const total = values.reduce((s, v) => s + v, 0);
    const avg = values.length ? total / values.length : 0;
    const bestIndex = values.length
      ? values.reduce((bestI, v, i) => (v > values[bestI] ? i : bestI), 0)
      : -1;
    const bestLabel = bestIndex >= 0 ? labels[bestIndex] : '–';
    const bestValue = bestIndex >= 0 ? values[bestIndex] : 0;
    const unit = this.currentMode === 'yearly' ? 'year' : 'month';

    return {
      values,
      total,
      avg,
      count: values.length,
      bestLabel,
      bestValue,
      unit,
    };
  }

  /**
   * Normalise a range token (e.g. "3y" or 3) into a positive year count.
   * @param {string|number} range
   * @returns {number} 0 when the range means "all".
   */
  parseYearsWindow(range) {
    if (range === 'all' || range == null) return 0;
    if (typeof range === 'number') {
      return Number.isFinite(range) && range > 0 ? range : 0;
    }
    if (typeof range === 'string') {
      const token = range.endsWith('y') ? range.slice(0, -1) : range;
      const value = Number.parseInt(token, 10);
      return Number.isNaN(value) || value <= 0 ? 0 : value;
    }
    return 0;
  }

  /**
   * Change the aggregation mode (yearly vs monthly).
   * @param {'yearly'|'monthly'} mode
   * @returns {CarbonVizState|null}
   */
  setMode(mode) {
    if (!mode || mode === this.currentMode) return null;
    this.currentMode = mode;
    if (this.currentMode === 'yearly' && this.currentRange !== 'all') {
      // Yearly view only supports the full range.
      this.currentRange = 'all';
    }
    return this.refresh();
  }

  /**
   * Change the trailing-window range (e.g. "3y", 5, or "all").
   * @param {string|number} range
   * @returns {CarbonVizState|null}
   */
  setRange(range) {
    if (!range || range === this.currentRange) return null;
    this.currentRange = range;
    if (range !== 'all') {
      this.allEntries = this.entries.slice();
    }

    return this.refresh();
  }

  /**
   * Toggle inclusion of extrapolated history alongside real entries.
   * @param {boolean} enabled
   * @returns {CarbonVizState}
   */
  setEstimatesEnabled(enabled) {
    this.allEntries = enabled
      ? this.estimatedEntries.concat(this.entries)
      : this.entries.slice();
    return this.refresh();
  }

  /**
   * Initialise the underlying Chart.js instance.
   * @param {CanvasRenderingContext2D} ctx
   * @returns {import('chart.js').Chart|null}
   */
  initChart(ctx) {
    if (!ctx) return null;
    const self = this;

    return new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [
          {
            type: 'bar',
            label: 'Payout (USD)',
            data: [],
            borderRadius: 6,
            backgroundColor: this.colors.bar,
            borderColor: this.colors.barBorder,
            borderWidth: 1.5,
            maxBarThickness: 22,
            yAxisID: 'y',
            order: 2,
          },
          {
            type: 'line',
            label: 'Articles',
            data: [],
            borderColor: this.colors.line,
            backgroundColor: this.colors.lineFill,
            borderWidth: 2.5,
            tension: 0.25,
            pointRadius: 3,
            pointBackgroundColor: this.colors.linePoint,
            yAxisID: 'y1',
            order: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        datasets: { bar: { order: 1 }, line: { order: 2 } },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label(context) {
                const label = context.dataset.label || '';
                if (label === 'Payout (USD)') {
                  const entry = self.currentEntriesForTooltip?.[context.dataIndex];
                  const suffix = entry?.estimated ? ' (estimated)' : '';
                  return `$${context.parsed.y.toFixed(2)}${suffix}`;
                }
                if (label === 'Articles') {
                  const v = context.parsed.y;
                  return `${v} article${v === 1 ? '' : 's'}`;
                }
                return context.parsed.y;
              },
            },
          },
        },
        scales: {
          x: {
            ticks: {
              maxRotation: 0,
              minRotation: 0,
              color: this.colors.axis,
              autoSkip: true,
              maxTicksLimit: 10,
            },
            grid: { display: false },
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: this.colors.axis,
              callback: v => `$${v}`,
            },
            grid: {
              color: this.colors.grid,
              zeroLineColor: 'rgb(156 163 175 / 0.8)',
            },
          },
          y1: {
            position: 'right',
            beginAtZero: true,
            ticks: { color: this.colors.axis, callback: v => `${v}` },
            grid: { drawOnChartArea: false },
          },
        },
      },
    });
  }

  /**
   * Recompute data for the current mode/range and update the chart.
   * @returns {CarbonVizState}
   */
  refresh() {
    const entries = this.getEntriesForCurrentMode(this.currentRange);
    const labels = this.entriesToLabels(entries);
    const summary = this.buildSummary(entries, labels);
    const rangeLabel = this.buildRangeLabel(entries);
    const articles = this.getArticlesForEntries(entries);

    this.currentEntriesForTooltip = entries;

    if (this.chart) {
      this.chart.data.labels = labels;
      this.chart.data.datasets[0].data = summary.values;
      this.chart.data.datasets[1].data = articles;
      this.chart.update();
    }

    return {
      labels,
      payouts: summary.values,
      articles,
      rangeLabel,
      summary: {
        total: summary.total,
        avg: summary.avg,
        count: summary.count,
        bestLabel: summary.bestLabel,
        bestValue: summary.bestValue,
        unit: summary.unit,
      },
      mode: this.currentMode,
      range: this.currentRange,
    };
  }
}

if (typeof realEntries !== 'undefined' && typeof postsPerMonth !== 'undefined') {
  const root = document.querySelector('#carbon-viz') || document.body;
  const styles = getComputedStyle(root);
  const readVar = name => styles.getPropertyValue(name).trim();

  const colors = {
    axis: readVar('--viz-axis') || '#9ca3af',
    grid: readVar('--viz-grid') || 'rgb(55 65 81 / 0.3)',
    bar: readVar('--viz-bar') || 'rgb(56 189 248 / 0.65)',
    barBorder: readVar('--viz-bar-border') || 'rgb(56 189 248 / 0.8)',
    line: readVar('--viz-line') || 'rgb(236 72 153 / 0.95)',
    lineFill: readVar('--viz-line-fill') || 'rgb(236 72 153 / 0.08)',
    linePoint: readVar('--viz-line-point') || 'rgb(236 72 153)',
  };

  const canvas = document.querySelector('#payoutsChart');
  const ctx = canvas ? canvas.getContext('2d') : null;

  const carbonViz = new CarbonViz({ entries: realEntries, postsPerMonth, ctx, colors });

  const elements = {
    rangeLabel: document.querySelector('#rangeLabel'),
    estimatesWrapper: document.querySelector('#estimatesWrapper'),
    estimatesToggle: document.querySelector('#estimatesToggle'),
    totalValue: document.querySelector('#totalValue'),
    monthsValue: document.querySelector('#monthsValue'),
    avgValue: document.querySelector('#avgValue'),
    bestMonthValue: document.querySelector('#bestMonthValue'),
    bestPeriodUnit: document.querySelector('#bestPeriodUnit'),
    avgPeriodUnit: document.querySelector('#avgPeriodUnit'),
  };

  const modeButtons = Array.from(
    document.querySelectorAll('.mode-toggle button'),
  );
  const rangeButtons = Array.from(
    document.querySelectorAll('.range-toggle button'),
  );

  function updateText(element, text) {
    if (element) {
      element.textContent = text;
    }
  }

  function applyState(state) {
    if (!state) return;

    updateText(elements.rangeLabel, state.rangeLabel);
    updateText(elements.totalValue, `$${state.summary.total.toFixed(2)}`);
    updateText(elements.monthsValue, String(state.summary.count));
    updateText(elements.avgValue, `$${state.summary.avg.toFixed(2)}`);
    updateText(elements.bestMonthValue, `${state.summary.bestLabel} · $${state.summary.bestValue.toFixed(2)}`);
    updateText(elements.bestPeriodUnit, state.summary.unit);
    updateText(elements.avgPeriodUnit, state.summary.unit);

    modeButtons.forEach(btn => {
      const mode = btn.getAttribute('data-mode');
      btn.classList.toggle('is-active', mode === state.mode);
    });

    rangeButtons.forEach(btn => {
      const range = btn.getAttribute('data-range');
      btn.classList.toggle('is-active', range === state.range);
      if (range !== 'all') {
        btn.style.display = state.mode === 'yearly' ? 'none' : '';
      }
    });

    if (elements.estimatesWrapper) {
      elements.estimatesWrapper.style.display =
        state.range === 'all' ? '' : 'none';
    }
    
    if (state.range !== 'all' && elements.estimatesToggle) {
      elements.estimatesToggle.checked = false;
    }
  }

  // Initial render
  applyState(carbonViz.refresh());

  modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-mode');
      const state = carbonViz.setMode(mode);
      applyState(state);
    });
  });

  rangeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const range = btn.getAttribute('data-range');
      const state = carbonViz.setRange(range);
      applyState(state);
    });
  });

  if (elements.estimatesToggle) {
    elements.estimatesToggle.addEventListener('change', () => {
      const state = carbonViz.setEstimatesEnabled(
        elements.estimatesToggle.checked,
      );
      applyState(state);
    });
  }
}
