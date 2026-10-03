import configs from '../../data/writing/stories.json';
import data from '../../data/writing/tracking.json';
import { text, line, dot, linePath, svg, timeline } from './primitives';
import { composeScene } from './stage';
import type { MarkState } from './types';
const config = configs['football-tracking-compactness'];
function frame(id: string) {
  return data.snapshots[
    id === 'disruption'
      ? 2
      : id === 'compactness' || id === 'interpretation'
        ? 7
        : id === 'gap'
          ? 5
          : 0
  ];
}
function projection(m: boolean) {
  const scale = m ? 5.25 : 7.1,
    x = m ? 52 : 195,
    y = m ? 62 : 75;
  return {
    scale,
    x,
    y,
    p: (a: number, b: number) =>
      [x + a * scale, y + (68 - b) * scale] as [number, number],
  };
}
export function trackingState(id: string, m = false): MarkState[] {
  const f = frame(id),
    { p } = projection(m);
  return f.players.map((player) => {
    const [x, y] = p(player.x, player.y);
    return {
      id: player.id,
      x: x + (id === 'compactness' && !m ? 305 : 0),
      y,
      fill: 'var(--accent)',
      opacity: id === 'gap' || id === 'interpretation' ? 0 : 1,
      r: m ? 5 : 8,
    };
  });
}
function field(m: boolean) {
  const { scale: s, x, y } = projection(m),
    w = 52.5 * s,
    h = 68 * s;
  return (
    `<g class="v-pitch"><rect x="${x}" y="${y}" width="${w}" height="${h}"/><rect x="${x}" y="${y + (34 - 20.16) * s}" width="${16.5 * s}" height="${40.32 * s}"/><rect x="${x}" y="${y + (34 - 9.16) * s}" width="${5.5 * s}" height="${18.32 * s}"/><path d="M${x + w},${y + (34 - 9.15) * s} A${9.15 * s},${9.15 * s} 0 0 0 ${x + w},${y + (34 + 9.15) * s}"/></g>` +
    text(x, y - 20, 'Defended goal ← / Home half', 'v-small')
  );
}
function hull(id: string, m: boolean) {
  const f = frame(id),
    { p } = projection(m);
  return `<polygon points="${f.hull.map((pos) => p(pos[0], pos[1]).join(',')).join(' ')}" class="v-region"/>`;
}
function centroid(id: string, m: boolean) {
  const f = frame(id),
    { p } = projection(m);
  const c = p(f.centroid[0], f.centroid[1]);
  return `<path d="M${c[0] - 9},${c[1]}h18 M${c[0]},${c[1] - 9}v18" class="v-centroid"/>`;
}
function labels(id: string, m: boolean) {
  const f = frame(id),
    { p } = projection(m);
  return f.players
    .map((player) => {
      const pos = p(player.x, player.y);
      const n = Number(player.id.replace('Player', ''));
      const dx = n === 3 ? -12 : 9,
        dy = n === 6 ? 18 : -7;
      return text(
        pos[0] + dx,
        pos[1] + dy,
        n,
        'v-player-label',
        n === 3 ? 'end' : 'start',
      );
    })
    .join('');
}
function measurement(id: string, m: boolean) {
  const f = frame(id),
    { p } = projection(m),
    ys = f.players.map((v) => v.y),
    xs = f.players.map((v) => v.x);
  const lo = p(Math.min(...xs), Math.min(...ys)),
    hi = p(Math.max(...xs), Math.max(...ys));
  const bx = lo[0] - 25;
  return (
    line(bx, hi[1], bx, lo[1], 'v-measure') +
    line(bx - 5, hi[1], bx + 5, hi[1], 'v-measure') +
    line(bx - 5, lo[1], bx + 5, lo[1], 'v-measure') +
    text(
      m ? 18 : 90,
      m ? 450 : 605,
      id === 'compactness' ? 'Width 24.900 m' : 'Width 30.861 m',
      'v-strong',
    ) +
    text(
      m ? 18 : 490,
      m ? 477 : 605,
      id === 'compactness' ? 'Length 24.180 m' : 'Length 25.481 m',
      'v-label',
    )
  );
}
function ball(id: string, m: boolean) {
  const f = frame(id),
    { p } = projection(m);
  if (!f.ball) return '';
  const b = p(f.ball[0], f.ball[1]),
    c = p(f.centroid[0], f.centroid[1]);
  return (
    dot(b[0], b[1], m ? 5 : 7, 'v-ball') +
    (id === 'disruption'
      ? line(c[0], c[1], b[0], b[1], 'v-measure') +
        text(m ? 20 : 490, m ? 455 : 605, '22.007 m to the ball', 'v-strong')
      : '')
  );
}
function metricTrace(m: boolean) {
  const w = m ? 380 : 900,
    x = 30,
    y = m ? 180 : 225,
    bw = w - 60,
    bh = m ? 165 : 230,
    project = (v: (typeof data.metrics)[number]) =>
      [
        x + ((v.time_s - 298.88) / 11.24) * bw,
        y + ((35 - v.width_m) / 15) * bh,
      ] as [number, number];
  return (
    text(x, 100, 'Home width (m)', 'v-label') +
    [25, 30, 35]
      .map(
        (v) =>
          line(
            x,
            y + ((35 - v) / 15) * bh,
            w - 30,
            y + ((35 - v) / 15) * bh,
            'v-grid',
          ) + text(x, y + ((35 - v) / 15) * bh - 6, v, 'v-small'),
      )
      .join('') +
    `<path d="${linePath(data.metrics.map(project), (i) => i > 0 && data.metrics[i].time_s - data.metrics[i - 1].time_s > 0.08)}" class="v-trace"/>` +
    `<rect x="${x + ((307.92 - 298.88) / 11.24) * bw}" y="${y}" width="${(1.04 / 11.24) * bw}" height="${bh}" class="v-gap"/>` +
    text(x, y + bh + 32, '298.88 s', 'v-small') +
    text(w - 30, y + bh + 32, '310.12 s', 'v-small', 'end') +
    text(
      w / 2,
      y + bh + 70,
      '1.04 s gap · no interpolation',
      'v-strong',
      'middle',
    )
  );
}
const overlays: Record<string, (m: boolean) => string> = {
  positions: (m) =>
    field(m) +
    labels('positions', m) +
    ball('positions', m) +
    text(
      m ? 20 : 90,
      m ? 465 : 610,
      '298.88 s · observed coordinates',
      'v-label',
    ),
  shape: (m) =>
    field(m) +
    hull('shape', m) +
    centroid('shape', m) +
    labels('shape', m) +
    measurement('shape', m),
  disruption: (m) =>
    field(m) +
    hull('disruption', m) +
    centroid('disruption', m) +
    labels('disruption', m) +
    ball('disruption', m) +
    text(
      m ? 20 : 90,
      m ? 480 : 645,
      '303.08 s · maximum ball distance',
      'v-small',
    ),
  compactness: (m) =>
    m
      ? field(m) +
        hull('compactness', m) +
        centroid('compactness', m) +
        labels('compactness', m) +
        ball('compactness', m) +
        measurement('compactness', m) +
        text(20, 40, '310.12 s · centroid moved 5.073 m', 'v-label')
      : text(
          450,
          40,
          'Observed endpoints · centroid moved 5.073 m',
          'v-label',
          'middle',
        ) +
        `<g transform="translate(-150,0)">${field(false)}${hull('shape', false)}${centroid('shape', false)}${trackingState(
          'positions',
        )
          .map(
            (p) =>
              `<circle cx="${p.x}" cy="${p.y}" r="7" fill="var(--muted)"/>`,
          )
          .join('')}</g>` +
        `<g transform="translate(305,0)">${field(false)}${hull('compactness', false)}${centroid('compactness', false)}${labels('compactness', false)}${ball('compactness', false)}</g>` +
        text(45, 605, '298.88 s · Width 30.861 m', 'v-strong') +
        text(500, 605, '310.12 s · Width 24.900 m', 'v-strong') +
        text(45, 640, 'Length 25.481 m', 'v-label') +
        text(500, 640, 'Length 24.180 m', 'v-label'),
  gap: (m) => metricTrace(m),
  interpretation: (m) =>
    timeline(
      [
        { value: '298.88', label: 'Home recovery / loss' },
        { value: '300.76', label: 'Away recovery / pass' },
        { value: '304.12', label: 'Away pass' },
        { value: '307.92', label: 'Contest / missing ball' },
        { value: '308.96', label: 'Away recovery' },
        { value: '310.12', label: 'Away off-target shot' },
      ],
      m ? 380 : 900,
      m,
    ),
};
export function renderTracking(id: string, m = false, p = false) {
  const state = (s: string, m: boolean) =>
    trackingState(s, m).map((v) => ({
      ...v,
      opacity: s === 'gap' || s === 'interpretation' ? 0 : v.opacity,
    }));
  return composeScene(
    'tracking',
    id,
    config.scenes,
    (s, m) => overlays[s](m),
    state,
    m,
    p,
  );
}
export function trackingOpening() {
  return svg(
    'tracking-hero',
    'Observed Home team shape',
    'Metrica Sample Game 1, 298.88 s',
    field(false) +
      hull('shape', false) +
      trackingState('positions')
        .map((p) => dot(p.x, p.y, 8))
        .join(''),
  );
}
