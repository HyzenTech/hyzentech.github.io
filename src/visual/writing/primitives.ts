/** Small editorial SVG primitives shared by real stories. Coordinates remain the scene author's choice. */
export const esc = (value: unknown) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        c
      ]!,
  );
export const text = (
  x: number,
  y: number,
  value: unknown,
  cls = 'v-label',
  anchor = 'start',
) =>
  `<text x="${x}" y="${y}" class="${cls}" text-anchor="${anchor}">${esc(value)}</text>`;
export const line = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  cls = 'v-rule',
) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}"/>`;
export const dot = (x: number, y: number, r = 5, cls = 'v-dot') =>
  `<circle cx="${x}" cy="${y}" r="${r}" class="${cls}"/>`;
export const bar = (
  x: number,
  y: number,
  width: number,
  height = 12,
  cls = 'v-bar',
) =>
  `<rect x="${x}" y="${y}" width="${Math.max(0, width)}" height="${height}" rx="2" class="${cls}"/>`;
export function timeline(
  values: { label: string; value: string }[],
  width: number,
  mobile = false,
) {
  const gap = mobile ? 66 : 75;
  return values
    .map((v, i) => {
      const y = 75 + i * gap;
      return `${i ? line(26, y - gap + 12, 26, y - 10) : ''}${dot(26, y, 5)}${text(48, y + 5, v.value, 'v-strong')}${text(width - 16, y + 5, v.label, 'v-label', 'end')}`;
    })
    .join('');
}
export function svg(
  id: string,
  title: string,
  caption: string,
  body: string,
  mobile = false,
) {
  const w = mobile ? 380 : 900,
    h = mobile ? 480 : 660;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" class="writing-svg" role="img" aria-labelledby="${id}-svg-title ${id}-svg-desc"><title id="${id}-svg-title">${esc(title)}</title><desc id="${id}-svg-desc">${esc(caption)}</desc>${body}</svg>`;
}
export function bars(
  values: { label: string; value: number }[],
  max: number,
  w: number,
  m = false,
  suffix = '',
) {
  const x = m ? 20 : 65,
    y = m ? 70 : 120,
    gap = m ? 70 : 85,
    bw = w - x - (m ? 85 : 120);
  return values
    .map(
      (v, i) =>
        `${text(x, y + i * gap, v.label)}${bar(x, y + i * gap + 16, (bw * v.value) / max)}${text(w - 15, y + i * gap + 31, v.value.toLocaleString('en-US') + suffix, 'v-strong', 'end')}`,
    )
    .join('');
}
export function linePath(
  points: [number, number][],
  breakWhen?: (index: number) => boolean,
) {
  return points
    .map(
      (p, i) =>
        `${!i || breakWhen?.(i) ? 'M' : 'L'}${p[0].toFixed(2)},${p[1].toFixed(2)}`,
    )
    .join(' ');
}
