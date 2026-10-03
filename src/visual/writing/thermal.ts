import configs from '../../data/writing/stories.json';
import data from '../../data/writing/thermal.json';
import { text, line, dot, bar, svg, timeline } from './primitives';
import { composeScene } from './stage';
import type { MarkState } from './types';
const config = configs['breast-thermal-classification'];
const palette = [
  '#274977',
  '#367dae',
  '#45bfc5',
  '#e7d46d',
  '#ee9a45',
  '#d55346',
];
function intensity(i: number) {
  const x = i % 11,
    y = Math.floor(i / 11);
  return Math.min(
    5,
    Math.floor(6 * Math.exp(-((x - 7) ** 2 + (y - 5) ** 2) / 12)),
  );
}
export function thermalState(id: string, m = false): MarkState[] {
  const w = m ? 380 : 900,
    scale = m ? 1 : 1.75;
  return Array.from({ length: 121 }, (_, i) => {
    let x = w / 2 + ((i % 11) - 5) * 17 * scale,
      y = (m ? 205 : 310) + (Math.floor(i / 11) - 5) * 17 * scale,
      opacity = 1;
    if (id === 'features') {
      x = w * 0.28 + ((i % 11) - 5) * 11 * scale;
      y = (m ? 190 : 285) + (Math.floor(i / 11) - 5) * 11 * scale;
    }
    if (id === 'extractors') {
      const side = i < 61 ? -1 : 1,
        j = i % 61;
      x = w / 2 + side * w * 0.24 + ((j % 8) - 3.5) * 12 * scale;
      y = (m ? 215 : 330) + (Math.floor(j / 8) - 3.5) * 12 * scale;
    }
    if (id === 'classifier') {
      x = w * 0.22 + ((i % 11) - 5) * 5 * scale;
      y = (m ? 180 : 270) + (Math.floor(i / 11) - 5) * 5 * scale;
    }
    if (!['heat', 'features', 'extractors', 'classifier'].includes(id))
      opacity = 0;
    return { id: 'heat-' + i, x, y, opacity, fill: palette[intensity(i)] };
  });
}
const overlays: Record<string, (m: boolean) => string> = {
  heat: (m) => {
    const w = m ? 380 : 900,
      y = m ? 330 : 520;
    return (
      text(w / 2, 45, 'Relative intensity · schematic', 'v-label', 'middle') +
      palette
        .map(
          (c, i) =>
            `<rect x="${w / 2 - 90 + i * 30}" y="${y}" width="30" height="10" fill="${c}"/>`,
        )
        .join('') +
      text(w / 2 - 90, y + 34, 'Lower', 'v-label') +
      text(w / 2 + 90, y + 34, 'Higher', 'v-label', 'end') +
      text(w / 2, y + 80, 'Patterns, not a diagnosis.', 'v-strong', 'middle')
    );
  },
  dataset: (m) => {
    const w = m ? 380 : 900,
      cw = (w - 40) / 3,
      x0 = 20,
      top = m ? 135 : 185,
      h = m ? 180 : 250;
    return (
      text(w / 2, 55, '1,842 images · 614 per class', 'v-strong', 'middle') +
      data.classes
        .map((name, i) => {
          const x = x0 + i * cw;
          let y = top;
          return (
            text(x + cw / 2, top - 25, name, 'v-label', 'middle') +
            data.splits
              .map((s, j) => {
                const ph = (h * s.perClass) / 614;
                const p =
                  `<rect x="${x + 5}" y="${y}" width="${cw - 10}" height="${ph - 3}" fill="${['#d99358', '#818a9e', '#4c6169'][j]}"/>` +
                  text(
                    x + cw / 2,
                    y + ph / 2 + 5,
                    s.perClass,
                    'v-light',
                    'middle',
                  );
                y += ph;
                return p;
              })
              .join('')
          );
        })
        .join('') +
      text(
        w / 2,
        top + h + 40,
        'Train 1,290 / Validation 369 / Test 183',
        'v-small',
        'middle',
      ) +
      data.splits
        .map(
          (split, i) =>
            `<circle cx="${20 + (i * (w - 40)) / 3}" cy="${top + h + 75}" r="5" fill="${['#d99358', '#818a9e', '#4c6169'][i]}"/>` +
            text(32 + (i * (w - 40)) / 3, top + h + 80, split.label, 'v-small'),
        )
        .join('')
    );
  },
  features: (m) => {
    const w = m ? 380 : 900,
      cy = m ? 190 : 285;
    return (
      text(w * 0.28, 55, 'Image pattern', 'v-strong', 'middle') +
      line(w * 0.45, cy, w * 0.57, cy) +
      text(w * 0.73, 55, 'Feature representation', 'v-strong', 'middle') +
      Array.from(
        { length: 8 },
        (_, i) =>
          `<rect x="${w * 0.6 + i * (m ? 8 : 20)}" y="${cy - 50 + i * 6}" width="${m ? 5 : 12}" height="${100 - i * 6}" fill="${palette[i % 6]}" opacity=".7"/>`,
      ).join('') +
      text(
        w / 2,
        m ? 365 : 525,
        'Spatial values → learned representation',
        'v-label',
        'middle',
      ) +
      text(
        w / 2,
        m ? 400 : 560,
        'Conceptual; no exported activations',
        'v-small',
        'middle',
      )
    );
  },
  extractors: (m) => {
    const w = m ? 380 : 900;
    return (
      text(w / 2, 40, 'One input', 'v-strong', 'middle') +
      line(w / 2, 60, w / 2, 90) +
      line(w * 0.26, 90, w * 0.74, 90) +
      line(w * 0.26, 90, w * 0.26, 115) +
      line(w * 0.74, 90, w * 0.74, 115) +
      text(w * 0.26, 140, 'VGG16', 'v-strong', 'middle') +
      text(w * 0.74, 140, 'ResNet50', 'v-strong', 'middle') +
      text(w * 0.26, m ? 330 : 490, 'Representation A', 'v-label', 'middle') +
      text(w * 0.74, m ? 330 : 490, 'Representation B', 'v-label', 'middle') +
      text(
        w / 2,
        m ? 390 : 575,
        'Same classification problem',
        'v-label',
        'middle',
      )
    );
  },
  classifier: (m) => {
    const w = m ? 380 : 900,
      y = m ? 185 : 270;
    return (
      text(w * 0.22, 65, 'CNN features', 'v-strong', 'middle') +
      text(w * 0.62, 65, 'XGBoost', 'v-strong', 'middle') +
      line(w * 0.35, y, w * 0.49, y) +
      dot(w * 0.5, y, 7) +
      line(w * 0.5, y, w * 0.65, y - 65) +
      line(w * 0.5, y, w * 0.65, y + 65) +
      dot(w * 0.65, y - 65, 6) +
      dot(w * 0.65, y + 65, 6) +
      [
        [-65, 'Healthy'],
        [0, 'Benign'],
        [65, 'Malignant'],
      ]
        .map(
          ([dy, name], i) =>
            line(w * 0.65, y + (i < 2 ? -65 : 65), w * 0.8, y + Number(dy)) +
            text(w * 0.82, y + Number(dy) + 5, name, 'v-small'),
        )
        .join('') +
      text(
        w / 2,
        m ? 375 : 540,
        'Representation + tree ensemble',
        'v-strong',
        'middle',
      ) +
      text(
        w / 2,
        m ? 410 : 580,
        'Method diagram; no prediction values',
        'v-small',
        'middle',
      )
    );
  },
  experiment: (m) => {
    const w = m ? 380 : 900,
      x = 20,
      bw = w - 100;
    return (
      text(x, 35, 'Accuracy (%) · source-labelled', 'v-label') +
      data.results
        .map((r, i) => {
          const y = 85 + i * (m ? 165 : 215);
          return (
            text(x, y, r.label, 'v-strong') +
            bar(x, y + 25, (bw * r.train) / 100, 12, 'v-bar-muted') +
            text(w - 12, y + 38, r.train + '', 'v-label', 'end') +
            bar(x, y + 62, (bw * r.validation) / 100) +
            text(w - 12, y + 75, r.validation + '', 'v-strong', 'end') +
            (r.alternative
              ? `${line(x + (bw * r.alternative) / 100, y + 55, x + (bw * r.alternative) / 100, y + 83, 'v-dashed')}${text(x, y + 114, 'Original About: 73.17% · unresolved', 'v-small')}`
              : '')
          );
        })
        .join('') +
      text(
        x,
        m ? 445 : 595,
        'Muted: training / Accent: article validation',
        'v-small',
      )
    );
  },
  confusion: (m) => {
    const w = m ? 380 : 900,
      size = m ? 72 : 115,
      x = w / 2 - size * 1.2,
      y = m ? 140 : 190;
    return (
      text(w / 2, 45, 'Predicted class', 'v-label', 'middle') +
      ['H', 'B', 'M']
        .map((n, i) => text(x + (i + 0.5) * size, 100, n, 'v-strong', 'middle'))
        .join('') +
      data.classes
        .map((n, i) =>
          text(x - 15, y + (i + 0.5) * size, n[0], 'v-label', 'end'),
        )
        .join('') +
      Array.from(
        { length: 9 },
        (_, i) =>
          `<rect x="${x + (i % 3) * size}" y="${y + Math.floor(i / 3) * size}" width="${size - 4}" height="${size - 4}" class="v-unknown"/>${text(x + ((i % 3) + 0.5) * size, y + (Math.floor(i / 3) + 0.5) * size + 7, '?', 'v-strong', 'middle')}`,
      ).join('') +
      text(
        w / 2,
        m ? 415 : 595,
        'Counts unavailable · H / B / M',
        'v-label',
        'middle',
      )
    );
  },
  outcome: (m) =>
    timeline(
      [
        { value: '2024', label: 'IEEE CENIM publication' },
        { value: 'Next', label: 'Reconcile reported accuracy' },
        { value: 'Next', label: 'Verify patient separation' },
        { value: 'Next', label: 'External evaluation' },
      ],
      m ? 380 : 900,
      m,
    ),
};
export const renderThermal = (id: string, m = false, p = false) =>
  composeScene(
    'thermal',
    id,
    config.scenes,
    (s, m) => overlays[s](m),
    thermalState,
    m,
    p,
    'cell',
  );
export function thermalOpening() {
  return svg(
    'thermal-hero',
    'Schematic heat field',
    'Conceptual, not a patient image',
    thermalState('heat')
      .map(
        (p) =>
          `<rect x="${p.x - 8}" y="${p.y - 8}" width="16" height="16" fill="${p.fill}"/>`,
      )
      .join(''),
  );
}
