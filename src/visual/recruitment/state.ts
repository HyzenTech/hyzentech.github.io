import data from '../../data/scrolly/recruitment-data.json';
import type { Scene } from '../../data/scrolly/recruitment-story';
export { data };
export const positions = ['GK', 'CB', 'FB', 'DM', 'CM', 'AM', 'W', 'ST'];
export interface Mark {
  x: number;
  y: number;
  r: number;
  opacity: number;
  kind: string;
}
export const frame = (mobile = false, scene?: Scene | 'universe') => ({
  w: mobile ? 380 : 900,
  h: mobile ? (scene === 'population' ? 540 : 460) : 660,
});
export const number = (value: number, digits = 2) =>
  value.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
export function candidateOrder(scene: Scene) {
  return [...data.candidates].sort((a, b) =>
    scene === 'brief' ? a.distance - b.distance : a.rank - b.rank,
  );
}
export function rowY(index: number, mobile = false) {
  return (mobile ? 120 : 160) + index * (mobile ? 56 : 78);
}
export function marks(scene: Scene | 'universe', mobile = false): Mark[] {
  const { w, h } = frame(mobile, scene);
  const offsets: Record<string, number> = {};
  const maxDistance =
    Math.ceil(Math.max(...data.peers.map((p) => p.distance)) / 2) * 2;
  const maxLong =
    Math.ceil(Math.max(...data.points.map((p) => p.longPasses || 0)) / 5) * 5;
  const maxInt = Math.ceil(
    Math.max(...data.points.map((p) => p.interceptions || 0)),
  );
  const ordered =
    scene === 'brief' || scene === 'ranking' ? candidateOrder(scene) : [];
  return data.points.map((p, i) => {
    const selected = p.id === data.target.id;
    const candidate = data.candidates.find((c) => c.id === p.id);
    const kind = selected
      ? 'target'
      : candidate?.rank === 1
        ? 'winner'
        : candidate?.similarityRank === 1
          ? 'nearest'
          : 'neutral';
    let x = w / 2,
      y = h / 2,
      r = mobile ? 2.2 : 3.1,
      opacity = 0;
    if (scene === 'universe') {
      const a = i * 2.39996;
      const radius = 0.26 + 0.2 * Math.sqrt(i / data.points.length);
      x = w / 2 + Math.cos(a) * w * radius;
      y = h / 2 + Math.sin(a) * h * radius;
      r = selected ? 6 : mobile ? 1.8 : 2.9;
      opacity = selected ? 1 : 0.34;
    } else if (scene === 'population') {
      const group = positions.indexOf(p.group || 'CM');
      const n = offsets[p.group || 'CM'] || 0;
      offsets[p.group || 'CM'] = n + 1;
      const cols = mobile ? 2 : 4;
      const cellW = w / cols;
      const cellH = mobile ? 118 : 250;
      const cx = cellW * ((group % cols) + 0.5),
        cy = (mobile ? 80 : 180) + Math.floor(group / cols) * cellH;
      const radius = Math.sqrt(n) * (mobile ? 4.5 : 9);
      x = cx + Math.cos(n * 2.39996) * radius;
      y = cy + Math.sin(n * 2.39996) * radius;
      opacity = p.eligible ? 1 : 0.08;
      r = selected ? 7 : mobile ? 2.2 : 3.5;
    } else if (
      scene === 'profiles' &&
      p.eligible &&
      p.group === 'CB' &&
      p.longPasses !== null &&
      p.interceptions !== null
    ) {
      x = 55 + (p.longPasses / maxLong) * (w - 100);
      y =
        h -
        (mobile ? 85 : 110) -
        (p.interceptions / maxInt) * (h - (mobile ? 180 : 205));
      r = selected ? 8 : candidate ? 6 : 4;
      opacity = candidate || selected ? 1 : 0.38;
    } else if (scene === 'pipeline' && selected) {
      x = mobile ? 190 : 740;
      y = mobile ? 355 : 430;
      r = 9;
      opacity = 1;
    } else if (scene === 'similarity') {
      const peer = data.peers.find((n) => n.id === p.id);
      if (selected) {
        x = mobile ? 35 : 80;
        y = mobile ? 155 : 260;
        r = 9;
        opacity = 1;
      }
      if (peer) {
        x =
          (mobile ? 35 : 80) +
          (peer.distance / maxDistance) * (w - (mobile ? 70 : 160));
        y =
          (mobile ? 125 : 175) + (peer.similarityRank % 7) * (mobile ? 22 : 32);
        r = candidate ? 7 : 4;
        opacity = candidate ? 1 : 0.3;
      }
    } else if (scene === 'brief' || scene === 'ranking') {
      const n = ordered.findIndex((c) => c.id === p.id);
      if (n >= 0) {
        x = mobile ? 15 : 35;
        y = rowY(n, mobile) + 10;
        r = 5;
        opacity = 1;
      }
    } else if (scene === 'explanation' && candidate?.rank === 1) {
      x = mobile ? 20 : 45;
      y = mobile ? 68 : 95;
      r = 9;
      opacity = 1;
    } else if (scene === 'system' && selected) {
      x = mobile ? 190 : 770;
      y = mobile ? 350 : 400;
      r = 8;
      opacity = 1;
    }
    return { x, y, r, opacity, kind };
  });
}
export function axisLimits() {
  return {
    distance: Math.ceil(Math.max(...data.peers.map((p) => p.distance)) / 2) * 2,
    long:
      Math.ceil(Math.max(...data.points.map((p) => p.longPasses || 0)) / 5) * 5,
    interceptions: Math.ceil(
      Math.max(...data.points.map((p) => p.interceptions || 0)),
    ),
  };
}
