import type { ChapterConfig } from '../../scripts/writing/controller';
import type { MarkState } from './types';
import { svg, esc } from './primitives';
export function markMarkup(
  marks: MarkState[],
  mobile = false,
  shape: 'dot' | 'cell' = 'dot',
) {
  return marks
    .map(
      (p) =>
        `<g data-shared-mark="${esc(p.id)}" class="v-shared" style="transform:translate(${p.x}px,${p.y}px);opacity:${p.opacity ?? 1};color:${p.fill ?? 'var(--accent)'}">${shape === 'cell' ? `<rect x="-7" y="-7" width="14" height="14" rx="1" fill="currentColor"/>` : `<circle r="${p.r ?? (mobile ? 5 : 8)}" fill="currentColor"/>`}</g>`,
    )
    .join('');
}
export function composeScene(
  story: string,
  id: string,
  chapters: ChapterConfig[],
  overlay: (id: string, mobile: boolean) => string,
  state: (id: string, mobile: boolean) => MarkState[],
  mobile = false,
  persistent = false,
  shape: 'dot' | 'cell' = 'dot',
) {
  const chapter = chapters.find((c) => c.id === id);
  if (!chapter) throw new Error(`Unknown scene ${story}/${id}`);
  const layers = persistent
    ? chapters
        .map(
          (c) =>
            `<g data-visual-layer="${c.id}" style="opacity:${c.id === id ? 1 : 0}" aria-hidden="${c.id !== id}">${overlay(c.id, mobile)}</g>`,
        )
        .join('')
    : overlay(id, mobile);
  const marks = markMarkup(state(id, mobile), mobile, shape);
  return svg(
    `${story}-${id}-${mobile ? 'inline' : 'stage'}`,
    chapter.title,
    chapter.caption,
    marks + layers,
    mobile,
  );
}
