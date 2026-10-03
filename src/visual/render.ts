import { profile, metrics, weightedExample } from '../lib/illustration.mjs';
const text = (x: number, y: number, value: string, size = 15) =>
  `<text x="${x}" y="${y}" fill="currentColor" font-family="Inter, sans-serif" font-size="${size}">${value}</text>`;
const box = (x: number, y: number, w: number, h: number) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="9" fill="none" stroke="currentColor" opacity=".5"/>`;
export function renderVisual(id: string) {
  let body = '';
  if (id === 'population') {
    body =
      Array.from(
        { length: 84 },
        (_, i) =>
          `<circle cx="${28 + (i % 14) * 30}" cy="${40 + Math.floor(i / 14) * 30}" r="5" fill="currentColor" opacity="${i < 38 ? 0.9 : 0.2}"/>`,
      ).join('') + text(24, 254, '303 profiles → 139 eligible', 20);
  } else if (id === 'positions') {
    body =
      ['CB', 'ST', 'GK']
        .map(
          (v, i) =>
            box(20 + i * 145, 62, 126, 94) + text(58 + i * 145, 117, v, 24),
        )
        .join('') +
      text(20, 211, 'Minutes + positional exposure + complete peers', 14) +
      text(20, 247, 'Broad groups, explicit eligibility', 19);
  } else if (id === 'profiles' || id === 'ranking' || id === 'explanation') {
    const values =
      id === 'explanation'
        ? weightedExample(profile, [3, 2, 1]).contributions
        : profile;
    body = metrics
      .map(
        (label, i) =>
          text(20, 34 + i * 76, label, 14) +
          `<rect x="20" y="${45 + i * 76}" width="340" height="12" rx="4" fill="currentColor" opacity=".12"/><rect x="20" y="${45 + i * 76}" width="${values[i] * 3.4}" height="12" rx="4" fill="currentColor" opacity=".8"/>` +
          text(380, 57 + i * 76, String(values[i]), 17),
      )
      .join('');
    if (id === 'ranking')
      body += text(20, 272, 'Weights 3 : 2 : 1 → score 70', 20);
    if (id === 'explanation') body += text(20, 272, '45 + 20 + 5 = 70', 20);
  } else if (id === 'similarity') {
    body =
      `<path d="M35 230H420M35 230V35" stroke="currentColor" opacity=".3"/><path d="M155 150L210 115" stroke="currentColor" stroke-dasharray="5 5"/><circle cx="155" cy="150" r="10" fill="currentColor"/><circle cx="210" cy="115" r="8" fill="currentColor" opacity=".6"/><circle cx="340" cy="60" r="8" fill="currentColor" opacity=".25"/>` +
      text(75, 186, 'Query profile', 13) +
      text(212, 100, 'Nearby', 13) +
      text(330, 90, 'Further', 13) +
      text(45, 270, 'Smaller distance ≠ better recruit', 19);
  } else if (id === 'brief') {
    body =
      box(20, 42, 420, 85) +
      text(40, 78, 'Similarity', 22) +
      text(40, 105, 'Which profiles look alike?', 15) +
      box(20, 154, 420, 85) +
      text(40, 190, 'Recruitment ranking', 22) +
      text(40, 216, 'Which profiles meet this brief?', 15);
  } else {
    body = [
      'Pinned source',
      'Validate + profile',
      'Similarity / ranking',
      'Local interface + evidence',
    ]
      .map(
        (v, i) =>
          box(60, 10 + i * 70, 350, 50) +
          text(80, 42 + i * 70, v, 17) +
          (i < 3 ? text(221, 77 + i * 70, '↓', 17) : ''),
      )
      .join('');
  }
  return `<svg viewBox="0 0 460 300" role="img" aria-label="Illustration: ${id}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
}
