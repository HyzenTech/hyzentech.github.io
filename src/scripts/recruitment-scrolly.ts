import { marks, candidateOrder, rowY } from '../visual/recruitment/state';
import {
  scenes,
  sceneById,
  type Scene,
} from '../data/scrolly/recruitment-story';
import { mountStory } from './writing/controller';
const root = document.querySelector<HTMLElement>('[data-recruitment-story]');
if (root) {
  const run = root.querySelector<HTMLElement>('.recruitment-run')!;
  const svg = root.querySelector<SVGSVGElement>('[data-recruitment-canvas]')!;
  const points = [...svg.querySelectorAll<SVGCircleElement>('[data-profile]')];
  const layers = [...svg.querySelectorAll<SVGGElement>('[data-layer]')];
  const rows = [...svg.querySelectorAll<SVGGElement>('[data-candidate]')];
  const candidateLayer = svg.querySelector<SVGGElement>('[data-candidates]')!;
  function apply(scene: Scene) {
    const config = sceneById(scene);
    run.dataset.scene = scene;
    svg.setAttribute('aria-label', config.title);
    svg.querySelector('title')!.textContent = config.title;
    svg.querySelector('desc')!.textContent = config.caption;
    root!.querySelector('[data-stage-label]')!.textContent = config.title;
    root!.querySelector('[data-stage-caption]')!.textContent = config.caption;
    const next = marks(scene);
    points.forEach((point, i) => {
      const n = next[i];
      point.style.transform = `translate(${n.x}px,${n.y}px)`;
      point.style.opacity = String(n.opacity);
      point.setAttribute('r', String(n.r));
    });
    layers.forEach((layer) => {
      const show = layer.dataset.layer === scene;
      layer.style.opacity = show ? '1' : '0';
      layer.setAttribute('aria-hidden', String(!show));
    });
    const show = scene === 'brief' || scene === 'ranking';
    candidateLayer.style.opacity = show ? '1' : '0';
    candidateLayer.setAttribute('aria-hidden', String(!show));
    if (show) {
      const order = candidateOrder(scene);
      rows.forEach((row) => {
        const i = order.findIndex((c) => c.id === row.dataset.candidate);
        row.style.transform = `translateY(${rowY(i)}px)`;
        row.querySelector('.r-label')!.textContent =
          scene === 'brief'
            ? 'similar #' + order[i].similarityRank
            : 'brief #' + order[i].rank;
      });
    }
  }
  mountStory(
    root,
    scenes,
    { enter: (id) => apply(id as Scene) },
    'recruitment',
  );
}
