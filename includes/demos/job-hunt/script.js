/**
 * @typedef {Object} JobHuntDatum
 * @property {string} id
 * @property {string} label
 * @property {number} count
 * @property {string} [stage]
 */

/**
 * @typedef {Object} JobHuntData
 * @property {number} total
 * @property {JobHuntDatum[]} stages
 * @property {JobHuntDatum[]} outcomes
 */

/**
 * Format a count as a percentage of all applications.
 * @param {number} count
 * @param {number} total
 * @returns {string}
 */
function formatPercent(count, total) {
  return `${Math.round((count / total) * 100)}%`;
}

/**
 * Resolve a CSS custom property to a concrete color string.
 *
 * Reading a custom property directly returns its declared token list, which
 * does not resolve `light-dark()`. Assigning it to an actual `<color>`
 * property on a probe element forces the browser to resolve it.
 * @param {HTMLElement} element
 * @param {string} name
 * @returns {string}
 */
function getColor(element, name) {
  const probe = document.createElement('span');
  probe.style.color = `var(${name})`;
  probe.style.display = 'none';
  element.appendChild(probe);
  const resolved = getComputedStyle(probe).color;
  probe.remove();
  return resolved;
}

/**
 * @param {HTMLElement} root
 * @param {JobHuntData} data
 */
function renderSummary(root, data) {
  const noInterview = data.stages.find(item => item.id === 'no-interview');
  const ghosted = data.outcomes.find(item => item.id === 'ghosted');
  const conversations = data.total - noInterview.count;

  root.querySelector('[data-summary="total"]').textContent = String(data.total);
  root.querySelector('[data-summary="no-interview"]').textContent = formatPercent(
    noInterview.count,
    data.total,
  );
  root.querySelector('[data-summary="ghosted"]').textContent = formatPercent(
    ghosted.count,
    data.total,
  );
  root.querySelector('[data-summary="interview"]').textContent = String(conversations);
}

/**
 * @param {HTMLElement} root
 * @param {JobHuntData} data
 */
function renderJobHuntChart(root, data) {
  const canvas = root.querySelector('#jobHuntChart');
  const content = root.querySelector('#job-hunt-viz-content');
  const ctx = canvas.getContext('2d');
  const labels = ['Process depth', 'Final outcome'];
  const colors = {
    noInterview: getColor(root, '--viz-no-interview'),
    oneInterview: getColor(root, '--viz-one-interview'),
    twoInterviews: getColor(root, '--viz-two-interviews'),
    threeInterviews: getColor(root, '--viz-three-interviews'),
    immediateRejection: getColor(root, '--viz-immediate-rejection'),
    ghosted: getColor(root, '--viz-ghosted'),
    rejectedAfterInterview: getColor(root, '--viz-rejected-after-interview'),
    axis: getColor(root, '--viz-axis'),
    grid: getColor(root, '--viz-grid'),
    fg: getColor(root, '--viz-fg'),
  };

  const stageColors = {
    'no-interview': colors.noInterview,
    'one-interview': colors.oneInterview,
    'two-interviews': colors.twoInterviews,
    'three-interviews': colors.threeInterviews,
  };

  const outcomeColors = {
    'immediate-rejection': colors.immediateRejection,
    ghosted: colors.ghosted,
    'rejected-after-interview': colors.rejectedAfterInterview,
  };

  const stageDatasets = data.stages.map(stage => ({
    label: stage.label,
    data: [stage.count, 0],
    backgroundColor: stageColors[stage.id],
    borderColor: 'transparent',
    borderWidth: 0,
    borderSkipped: false,
    stack: 'applications',
  }));

  const outcomeDatasets = data.outcomes.map(outcome => ({
    label: outcome.label,
    data: [0, outcome.count],
    backgroundColor: outcomeColors[outcome.id],
    borderColor: 'transparent',
    borderWidth: 0,
    borderSkipped: false,
    stack: 'applications',
  }));

  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [...stageDatasets, ...outcomeDatasets],
    },
    options: {
      animation: {
        duration: 650,
        easing: 'easeOutQuart',
      },
      maintainAspectRatio: false,
      indexAxis: 'y',
      responsive: true,
      scales: {
        x: {
          stacked: true,
          max: data.total,
          grid: { color: colors.grid },
          ticks: {
            color: colors.axis,
            callback: value => `${value}`,
          },
          title: {
            display: true,
            text: 'Applications',
            color: colors.axis,
          },
        },
        y: {
          stacked: true,
          grid: { display: false },
          ticks: {
            color: colors.fg,
            font: { weight: 600 },
          },
        },
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 12,
            boxHeight: 12,
            color: colors.fg,
            filter: (item, chartData) => {
              const dataset = chartData.datasets[item.datasetIndex];
              return dataset.data.some(value => value > 0);
            },
          },
        },
        tooltip: {
          callbacks: {
            label: context => {
              const count = context.raw;
              if (!count) return null;
              return `${context.dataset.label}: ${count} (${formatPercent(count, data.total)})`;
            },
          },
          filter: item => item.raw > 0,
        },
      },
    },
  });

  content.hidden = false;
  return chart;
}

function bootstrap() {
  const root = document.querySelector('#job-hunt-viz');
  if (!root || typeof Chart === 'undefined') return;

  renderSummary(root, jobHuntData);
  let chart = renderJobHuntChart(root, jobHuntData);

  // Chart.js rasterises colors at render time, so when the theme changes
  // we destroy and re-render to pick up the new `light-dark()` values.
  window.ThemeManager?.onThemeChanged(() => {
    chart.destroy();
    chart = renderJobHuntChart(root, jobHuntData);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
