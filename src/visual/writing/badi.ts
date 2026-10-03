import configs from '../../data/writing/stories.json';
import data from '../../data/writing/badi.json';
import { text, line, dot, bars, linePath, svg, timeline } from './primitives';
import { composeScene } from './stage';
import type { MarkState } from './types';
const config = configs['badi-analytics'];
function seriesPos(i: number, m: boolean) {
  const w = m ? 380 : 900,
    x = 30 + ((w - 60) * i) / (data.series.length - 1),
    y = (m ? 320 : 480) - (data.series[i].value / 40000) * (m ? 230 : 340);
  return { x, y };
}
export function badiState(id: string, m = false): MarkState[] {
  const w = m ? 380 : 900;
  return data.series.map((_, i) => {
    let { x, y } = seriesPos(i, m),
      opacity = 1;
    if (id === 'window') {
      x = 30 + ((i % 12) * (w - 60)) / 12;
      y = (m ? 135 : 180) + Math.floor(i / 12) * (m ? 85 : 130);
      opacity = i < 24 ? 0.2 : 1;
    }
    if (id === 'forecast') {
      x = 40 + ((i % 12) * (w - 80)) / 11;
      y = (m ? 150 : 210) + Math.floor(i / 12) * 70;
      opacity = i < 12 ? 1 : 0;
    }
    if (!['records', 'window', 'forecast'].includes(id)) opacity = 0;
    return {
      id: 'sale-' + i,
      x,
      y,
      opacity,
      fill: 'var(--accent)',
      r: m ? 4 : 6,
    };
  });
}
const overlays: Record<string, (m: boolean) => string> = {
  records: (m) => {
    const w = m ? 380 : 900,
      ys = m ? [320, 205, 90] : [480, 310, 140];
    return (
      text(30, 45, 'Monthly items sold · example dataset', 'v-label') +
      ys
        .map(
          (y, i) =>
            line(30, y, w - 30, y, 'v-grid') +
            text(30, y - 8, [0, 20000, 40000][i], 'v-small'),
        )
        .join('') +
      `<path d="${linePath(
        data.series.map((_, i) => {
          const p = seriesPos(i, m);
          return [p.x, p.y];
        }),
      )}" class="v-trace"/>` +
      text(30, m ? 360 : 540, data.series[0].date, 'v-small') +
      text(w - 30, m ? 360 : 540, data.series.at(-1)!.date, 'v-small', 'end') +
      text(
        w / 2,
        m ? 425 : 605,
        'Observed values; no forecast plotted',
        'v-strong',
        'middle',
      )
    );
  },
  window: (m) => {
    return (
      text(30, 50, '12 consecutive observations → 1 target', 'v-strong') +
      [0, 1, 2]
        .map((i) =>
          text(
            30,
            (m ? 105 : 145) + i * (m ? 85 : 130),
            i === 2 ? 'Latest input window' : 'Earlier window',
            'v-label',
          ),
        )
        .join('') +
      text(30, m ? 430 : 605, 'Scaling fitted on training data only', 'v-small')
    );
  },
  forecast: (m) => {
    const w = m ? 380 : 900,
      y = m ? 245 : 345;
    return (
      text(w / 2, 60, 'LSTM(64) → Dense(1)', 'v-strong', 'middle') +
      line(40, m ? 150 : 210, w - 40, m ? 150 : 210) +
      `<path d="M${w * 0.5},${y} C${w * 0.8},${y - 80} ${w * 0.95},${y + 50} ${w * 0.55},${y + 65}" class="v-loop"/>` +
      dot(w * 0.5, y, 14) +
      text(w * 0.5, y - 30, 'Predict one step', 'v-label', 'middle') +
      text(w * 0.5, y + 115, 'Append → shift → repeat', 'v-strong', 'middle') +
      text(
        w * 0.5,
        y + 155,
        '12 monthly steps; no accuracy claim',
        'v-small',
        'middle',
      )
    );
  },
  insights: (m) => {
    const w = m ? 380 : 900;
    return (
      bars(data.topItems, 6000, w, m) +
      text(
        20,
        m ? 448 : 600,
        `Coffee + Bread: ${data.pair.count} / ${data.baskets.toLocaleString('en-US')} baskets`,
        'v-strong',
      )
    );
  },
  contract: (m) => {
    const w = m ? 380 : 900,
      y = m ? 100 : 170,
      gap = m ? 90 : 100,
      nx = m ? 30 : 220;
    const labels = [
      'Android input',
      'Cloud / service',
      'Python forecast',
      'Flask response',
    ];
    if (!m) {
      const xs = [90, 325, 565, 810];
      return (
        labels
          .map(
            (label, i) =>
              `${i ? line(xs[i - 1] + 18, 300, xs[i] - 18, 300) : ''}${dot(xs[i], 300, 12)}${text(xs[i], 250, label, 'v-strong', 'middle')}`,
          )
          .join('') +
        line(690, 170, 690, 435, 'v-dashed') +
        text(810, 365, 'Original records', 'v-label', 'middle') +
        text(
          450,
          510,
          'Returned records ≠ returned forecasts',
          'v-strong',
          'middle',
        ) +
        text(
          450,
          560,
          'The response boundary is part of the implementation.',
          'v-small',
          'middle',
        )
      );
    }
    return (
      labels
        .map(
          (s, i) =>
            `${i ? line(nx, y + (i - 1) * gap + 18, nx, y + i * gap - 20) : ''}${dot(nx, y + i * gap, 9)}${text(nx + 25, y + i * gap + 5, s, 'v-strong')}`,
        )
        .join('') +
      text(
        w / 2,
        m ? 470 : 625,
        'Returned records ≠ returned forecasts',
        'v-small',
        'middle',
      )
    );
  },
  evidence: (m) =>
    timeline(
      [
        { value: '2022', label: 'Bangkit team prototype' },
        { value: 'Source', label: 'Forecast + basket analysis' },
        { value: 'Demo', label: 'Graduation presentation' },
        { value: 'Open', label: 'Accuracy / adoption evidence' },
      ],
      m ? 380 : 900,
      m,
    ),
};
export const renderBadi = (id: string, m = false, p = false) =>
  composeScene(
    'badi',
    id,
    config.scenes,
    (s, m) => overlays[s](m),
    badiState,
    m,
    p,
  );
export function badiOpening() {
  return svg(
    'badi-hero',
    'BADI example sales series',
    'Repository example, not customer income',
    overlays.records(false),
  );
}
