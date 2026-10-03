import { mountStory, type ChapterConfig } from './controller';
import type { MarkState } from '../../visual/writing/types';
const root = document.querySelector<HTMLElement>('.visual-writing');
if (root) {
  const config = JSON.parse(
    document.querySelector('[data-scene-config]')!.textContent!,
  ) as { chapters: ChapterConfig[]; states: Record<string, MarkState[]> };
  const stage = root.querySelector<SVGSVGElement>('[data-writing-stage] svg')!;
  const layers = [
    ...stage.querySelectorAll<SVGGElement>('[data-visual-layer]'),
  ];
  const marks = new Map(
    [...stage.querySelectorAll<SVGGElement>('[data-shared-mark]')].map((el) => [
      el.dataset.sharedMark!,
      el,
    ]),
  );
  mountStory(root, config.chapters, {
    enter(id) {
      const chapter = config.chapters.find((c) => c.id === id)!;
      stage.querySelector('title')!.textContent = chapter.title;
      stage.querySelector('desc')!.textContent = chapter.caption;
      layers.forEach((layer) => {
        const active = layer.dataset.visualLayer === id;
        layer.style.opacity = active ? '1' : '0';
        layer.setAttribute('aria-hidden', String(!active));
      });
      config.states[id].forEach((p) => {
        const mark = marks.get(p.id);
        if (!mark) return;
        mark.style.transform = `translate(${p.x}px,${p.y}px)`;
        mark.style.opacity = String(p.opacity ?? 1);
        if (p.fill) mark.style.color = p.fill;
      });
    },
  });
}
