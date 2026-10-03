import {
  data,
  marks,
  frame,
  positions,
  candidateOrder,
  rowY,
  number,
  axisLimits,
} from './state';
import {
  scenes,
  sceneById,
  type Scene,
} from '../../data/scrolly/recruitment-story';
const escape = (s: string | number) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        c
      ]!,
  );
const text = (
  x: number,
  y: number,
  value: string | number,
  cls = 'r-label',
  anchor = 'start',
) =>
  `<text x="${x}" y="${y}" class="${cls}" text-anchor="${anchor}">${escape(value)}</text>`;
const line = (x1: number, y1: number, x2: number, y2: number, cls = 'r-rule') =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}"/>`;
const candidateRows = (scene: Scene, mobile: boolean) => {
  const { w } = frame(mobile),
    order = candidateOrder(scene);
  return data.candidates
    .map((c) => {
      const i = order.findIndex((p) => p.id === c.id),
        y = rowY(i, mobile);
      const label = mobile ? c.name : c.name;
      const x = mobile ? 30 : 60,
        barX = mobile ? 30 : 350,
        barY = mobile ? 27 : 4,
        barW = mobile ? w - 95 : w - 460;
      return `<g data-candidate="${escape(c.id)}" class="r-candidate ${c.rank === 1 ? 'r-winner' : c.similarityRank === 1 ? 'r-nearest' : ''}" style="transform:translateY(${y}px)">${text(x, 12, label, mobile ? 'r-name-mobile' : 'r-name')}${text(mobile ? w - 12 : w - 45, 12, scene === 'brief' ? 'similar #' + c.similarityRank : 'brief #' + c.rank, 'r-label', 'end')}<rect x="${barX}" y="${barY}" height="${mobile ? 4 : 13}" width="${(barW * c.score) / 100}" class="r-score-bar"/>${text(mobile ? w - 12 : w - 45, mobile ? 34 : 38, number(c.score), 'r-value', 'end')}</g>`;
    })
    .join('');
};
export function overlay(scene: Scene, mobile = false) {
  const { w, h } = frame(mobile, scene),
    center = w / 2;
  if (scene === 'population') {
    return positions
      .map((p, i) => {
        const cols = mobile ? 2 : 4,
          cx = (w / cols) * ((i % cols) + 0.5),
          cy =
            (mobile ? 80 : 180) + Math.floor(i / cols) * (mobile ? 118 : 250);
        const count =
          data.counts.eligibleByPosition[
            p as keyof typeof data.counts.eligibleByPosition
          ];
        return (
          text(cx, cy - (mobile ? 43 : 95), p, 'r-group', 'middle') +
          text(
            cx,
            cy + (mobile ? 42 : 95),
            count + ' eligible',
            'r-label',
            'middle',
          )
        );
      })
      .join('');
  }
  if (scene === 'profiles') {
    const limits = axisLimits();
    const bottom = h - (mobile ? 85 : 110),
      span = bottom - 95;
    let s = line(55, bottom, w - 45, bottom) + line(55, 95, 55, bottom);
    for (let i = 0; i <= limits.interceptions; i++) {
      const y = bottom - (i / limits.interceptions) * span;
      s +=
        line(55, y, w - 45, y, 'r-grid') + text(43, y + 5, i, 'r-tick', 'end');
    }
    for (let i = 0; i <= limits.long; i += 5) {
      const x = 55 + (i / limits.long) * (w - 100);
      s += text(x, bottom + 23, i, 'r-tick', 'middle');
    }
    s +=
      text(55, 65, 'Interceptions / 90', 'r-label') +
      text(center, bottom + 50, 'Long passes / 90', 'r-label', 'middle');
    s += text(w - 45, 65, 'Centre backs', 'r-group', 'end');
    if (!mobile) {
      s +=
        text(80, 645, '● Katrine Veje', 'r-target-label') +
        text(330, 645, '● Josie Green', 'r-nearest-label') +
        text(580, 645, '● Kadeisha Buchanan', 'r-winner-label');
    } else {
      s +=
        text(55, 89, '● Veje', 'r-target-label') +
        text(140, 89, '● Green', 'r-nearest-label') +
        text(240, 89, '● Buchanan', 'r-winner-label');
    }
    return s;
  }
  if (scene === 'pipeline') {
    const categories = ['PASS', 'CARRY', 'INTERCEPTION', 'SHOT', 'PRESSURE'];
    let s =
      text(center, 55, '495,189', 'r-big-number', 'middle') +
      text(center, 85, 'verified events / 132 matches', 'r-label', 'middle');
    if (mobile) {
      s +=
        text(center, 140, 'PASS · CARRY · SHOT', 'r-label', 'middle') +
        line(center, 160, center, 180, 'r-flow-line') +
        line(center, 225, center, 265, 'r-flow-line') +
        text(center, 205, 'Validate → aggregate', 'r-group', 'middle');
      s += text(
        center,
        295,
        'Katrine Veje / profile',
        'r-name-mobile',
        'middle',
      );
      s += text(
        center,
        390,
        number(data.target.profile.interceptions) + ' interceptions / 90',
        'r-label',
        'middle',
      );
      s += text(
        center,
        418,
        number(data.target.profile.long_passes) + ' long passes / 90',
        'r-label',
        'middle',
      );
    } else {
      categories.forEach((c, i) => {
        s +=
          text(70, 190 + i * 66, c, 'r-group') +
          line(225, 185 + i * 66, 400, 315, 'r-flow-line');
      });
      s +=
        `<circle cx="445" cy="315" r="58" class="r-gate"/>` +
        text(445, 309, 'Validate', 'r-group', 'middle') +
        text(445, 339, '& aggregate', 'r-label', 'middle');
      s +=
        line(510, 315, 740, 315, 'r-flow-line') +
        text(740, 235, 'Katrine Veje', 'r-name', 'middle') +
        text(740, 267, 'Everton / CB profile', 'r-label', 'middle');
      s +=
        text(
          640,
          340,
          number(data.target.profile.passes_attempted) + ' passes / 90',
          'r-label',
        ) +
        text(
          640,
          370,
          number(data.target.profile.interceptions) + ' interceptions / 90',
          'r-label',
        ) +
        text(
          640,
          400,
          number(data.target.profile.long_passes) + ' long passes / 90',
          'r-label',
        );
      s += text(
        740,
        475,
        '12 active similarity dimensions',
        'r-label',
        'middle',
      );
    }
    for (let i = 0; i < (mobile ? 10 : 24); i++) {
      const x = mobile ? 100 + (i % 5) * 44 : 270 + (i % 6) * 30,
        y = mobile
          ? 232 + Math.floor(i / 5) * 18
          : 200 + Math.floor(i / 6) * 67;
      s += `<circle cx="${x}" cy="${y}" r="2.5" class="r-event" style="--flow-delay:${i * 20}ms;--flow-x:${(mobile ? 190 : 445) - x}px;--flow-y:${(mobile ? 265 : 315) - y}px"/>`;
    }
    return s;
  }
  if (scene === 'similarity') {
    const start = mobile ? 35 : 80,
      end = w - (mobile ? 35 : 80),
      y = mobile ? 320 : 490,
      limits = axisLimits();
    let s =
      line(start, y, end, y) +
      text(start, mobile ? 95 : 135, 'Target: Katrine Veje', 'r-target-label');
    for (let i = 0; i <= limits.distance; i += 2) {
      const x = start + (i / limits.distance) * (end - start);
      s += line(x, y, x, y + 7) + text(x, y + 29, i, 'r-tick', 'middle');
    }
    s += text(center, y + 60, 'Profile distance →', 'r-label', 'middle');
    s += text(
      start,
      mobile ? 407 : 595,
      'Closest: Josie Green / 2.44',
      'r-nearest-label',
    );
    s += text(
      start,
      mobile ? 433 : 627,
      'Smaller distance = closer profile',
      'r-label',
    );
    return s;
  }
  if (scene === 'brief' || scene === 'ranking') {
    let s = text(
      mobile ? 15 : 35,
      45,
      scene === 'brief'
        ? 'A brief introduces priorities.'
        : 'The brief changes the order.',
      'r-group',
    );
    s += text(
      mobile ? 15 : 35,
      78,
      'Interceptions 3 · Tackles 2 · Long passes 1',
      'r-label',
    );
    s += text(
      mobile ? 15 : 35,
      h - 25,
      'Historical CB brief / scores out of 100',
      'r-label',
    );
    return s;
  }
  if (scene === 'explanation') {
    const c = data.candidates.find((c) => c.rank === 1)!;
    const metrics = ['interceptions', 'tackles', 'long_passes'] as const;
    let s =
      text(mobile ? 40 : 75, mobile ? 75 : 105, 'Kadeisha Buchanan', 'r-name') +
      text(
        mobile ? 15 : 45,
        mobile ? 125 : 170,
        number(c.score),
        'r-big-number',
      ) +
      text(
        mobile ? 160 : 270,
        mobile ? 125 : 163,
        'CB brief score / 100',
        'r-label',
      );
    metrics.forEach((m, i) => {
      const part = c.components[m],
        y = (mobile ? 185 : 230) + i * (mobile ? 67 : 98),
        x = mobile ? 15 : 45,
        barWidth = ((w - (mobile ? 85 : 180)) * part.contribution) / 100;
      s +=
        text(x, y, m.replace('_', ' '), 'r-label') +
        text(
          w - (mobile ? 15 : 45),
          y,
          number(part.percentile) + ' × ' + number(part.normalized_weight, 3),
          'r-equation',
          'end',
        );
      s +=
        `<rect x="${x}" y="${y + 16}" width="${barWidth}" height="${mobile ? 7 : 18}" class="r-contribution"/>` +
        text(
          w - (mobile ? 15 : 45),
          y + 32,
          '+' + number(part.contribution),
          'r-value',
          'end',
        );
    });
    s +=
      line(mobile ? 15 : 45, h - 70, w - (mobile ? 15 : 45), h - 70) +
      text(mobile ? 15 : 45, h - 35, '49.22 + 32.81 + 9.64 = 91.67', 'r-sum');
    return s;
  }
  let s = '';
  const labels = [
    'Pinned data',
    'Validated minutes',
    '41 metrics',
    '303 profiles',
    'Similarity',
    'Brief + ranking',
    'Saved artifacts',
    'Local API',
  ];
  const nodes = labels.map((label, i) =>
    mobile
      ? { x: i % 2 ? 285 : 95, y: 55 + Math.floor(i / 2) * 100, label }
      : { x: 130 + (i % 4) * 210, y: i < 4 ? 190 : 400, label },
  );
  const edges = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [3, 5],
    [4, 6],
    [5, 6],
    [6, 7],
  ];
  edges.forEach(([a, b]) => {
    const dx = nodes[b].x - nodes[a].x,
      dy = nodes[b].y - nodes[a].y,
      length = Math.hypot(dx, dy),
      gap = mobile ? 9 : 14;
    s += line(
      nodes[a].x + (dx / length) * gap,
      nodes[a].y + (dy / length) * gap,
      nodes[b].x - (dx / length) * gap,
      nodes[b].y - (dy / length) * gap,
      'r-flow-line',
    );
  });
  nodes.forEach(
    (n, i) =>
      (s +=
        `<circle cx="${n.x}" cy="${n.y}" r="${mobile ? 7 : 11}" class="r-system-node" style="--flow-delay:${i * 70}ms"/>` +
        text(
          n.x,
          n.y + (mobile ? 25 : 38),
          n.label,
          mobile ? 'r-system-mobile' : 'r-group',
          'middle',
        )),
  );
  if (!mobile)
    s +=
      text(
        w / 2,
        565,
        '220 frozen tests + 6 export checks / 2 clean rebuilds',
        'r-label',
        'middle',
      ) +
      text(
        w / 2,
        610,
        'Decision support. Independent scouting and predictive validation pending.',
        'r-label',
        'middle',
      );
  return s;
}
export function renderScene(scene: Scene, mobile = false, mounted = false) {
  const { w, h } = frame(mobile, scene),
    nodes = marks(scene, mobile),
    config = sceneById(scene);
  const circles = nodes
    .map((n, i) =>
      n.opacity || mounted
        ? `<circle data-profile="${i}" class="r-player r-${n.kind}" cx="0" cy="0" r="${n.r}" style="transform:translate(${n.x}px,${n.y}px);opacity:${n.opacity}"/>`
        : '',
    )
    .join('');
  const layers = (mounted ? scenes.map((s) => s.id) : [scene])
    .map(
      (id) =>
        `<g data-layer="${id}" style="opacity:${id === scene ? 1 : 0}" aria-hidden="${id !== scene}">${overlay(id, mobile)}</g>`,
    )
    .join('');
  const candidates =
    mounted || scene === 'brief' || scene === 'ranking'
      ? `<g data-candidates style="opacity:${scene === 'brief' || scene === 'ranking' ? 1 : 0}" aria-hidden="${scene !== 'brief' && scene !== 'ranking'}">${candidateRows(scene, mobile)}</g>`
      : '';
  const arrow = 'recruitment-arrow-' + (mounted ? 'stage' : scene);
  const connectedLayers = layers.replaceAll(
    'class="r-flow-line"',
    `class="r-flow-line" marker-end="url(#${arrow})"`,
  );
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${escape(config.title)}" class="recruitment-svg" ${mounted ? 'data-recruitment-canvas' : ''}><title>${escape(config.title)}</title><desc>${escape(config.caption)}</desc><defs><marker id="${arrow}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10" fill="var(--muted)"/></marker></defs>${connectedLayers}<g class="r-players">${circles}</g>${candidates}</svg>`;
}
export function renderUniverse() {
  const nodes = marks('universe');
  return `<svg viewBox="0 0 900 660" preserveAspectRatio="xMidYMid slice" class="recruitment-svg">${nodes.map((n) => `<circle cx="${n.x}" cy="${n.y}" r="${n.r}" class="r-player r-${n.kind}" opacity="${n.opacity}"/>`).join('')}</svg>`;
}
