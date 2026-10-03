/** Native-scroll infrastructure. Scenes own visual state, never scrolling. */
export interface ChapterConfig {
  id: string;
  label: string;
  title: string;
  caption: string;
  wide?: boolean;
}
export interface StoryLifecycle {
  enter: (id: string) => void;
  leave?: (id: string) => void;
  progress?: (id: string, fraction: number) => void;
  mode?: (enhanced: boolean, reduced: boolean) => void;
}
export function mountStory(
  root: HTMLElement,
  chapters: readonly ChapterConfig[],
  lifecycle: StoryLifecycle,
  prefix = 'story',
) {
  const run = root.querySelector<HTMLElement>('[data-story-run]')!;
  const steps = [...root.querySelectorAll<HTMLElement>('[data-writing-step]')];
  const links = [
    ...root.querySelectorAll<HTMLAnchorElement>('[data-chapter-nav] a'),
  ];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia('(min-width: 901px)');
  let active: string | undefined,
    pending = false,
    enhanced = false;
  function update() {
    pending = false;
    const line = innerHeight * 0.55;
    let selected = steps[0];
    const pageOffset =
      parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) ||
      0;
    steps.forEach((step) => {
      const wide = step.dataset.wide === 'true';
      const top = (
        wide ? step : step.querySelector<HTMLElement>('[data-story-copy]')!
      ).getBoundingClientRect().top;
      const anchorOffset =
        pageOffset + (parseFloat(getComputedStyle(step).scrollMarginTop) || 0);
      const landedOnAnchor =
        location.hash === '#' + step.id &&
        Math.abs(step.getBoundingClientRect().top - anchorOffset) < 2;
      if (
        top <= (wide ? Math.max(100, anchorOffset + 1) : line) ||
        landedOnAnchor
      )
        selected = step;
    });
    const id = selected.dataset.writingStep!;
    const rect = run.getBoundingClientRect();
    run.classList.toggle(
      'is-running',
      rect.top <= 0 && rect.bottom >= innerHeight,
    );
    const chapter = chapters.find((c) => c.id === id)!;
    run.dataset.scene = id;
    run.dataset.wide = String(!!chapter.wide);
    if (active !== id) {
      if (active && enhanced) lifecycle.leave?.(active);
      active = id;
      steps.forEach((step) =>
        step.classList.toggle('is-active', step === selected),
      );
      links.forEach((link) => {
        if (link.hash === '#' + id) link.setAttribute('aria-current', 'step');
        else link.removeAttribute('aria-current');
      });
      root
        .querySelectorAll('[data-stage-label]')
        .forEach((el) => (el.textContent = chapter.title));
      root
        .querySelectorAll('[data-stage-caption]')
        .forEach((el) => (el.textContent = chapter.caption));
      if (enhanced) lifecycle.enter(id);
    }
    if (enhanced && prefix === 'story' && chapter.wide) {
      const bottom =
        selected
          .querySelector<HTMLElement>('[data-story-copy]')!
          .getBoundingClientRect().bottom + 16;
      const value = `${Math.ceil(bottom)}px`;
      if (run.style.getPropertyValue('--wide-copy-bottom') !== value)
        run.style.setProperty('--wide-copy-bottom', value);
    }
    const stepRect = selected.getBoundingClientRect();
    const fraction = Math.max(
      0,
      Math.min(1, (line - stepRect.top) / stepRect.height),
    );
    const index = chapters.findIndex((c) => c.id === id);
    root
      .querySelectorAll<HTMLElement>('[data-writing-progress]')
      .forEach(
        (el) =>
          (el.style.width = `${(100 * (index + fraction)) / chapters.length}%`),
      );
    if (enhanced && rect.top < innerHeight && rect.bottom > 0)
      lifecycle.progress?.(id, fraction);
  }
  function schedule() {
    if (!pending) {
      pending = true;
      requestAnimationFrame(update);
    }
  }
  function setup() {
    enhanced = desktop.matches && !reduced.matches;
    root.classList.add(prefix + '-ready');
    root.classList.toggle(prefix + '-enhanced', enhanced);
    root.classList.toggle(prefix + '-reduced', reduced.matches);
    lifecycle.mode?.(enhanced, reduced.matches);
    active = undefined;
    schedule();
  }
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      }),
    { threshold: 0.25 },
  );
  root
    .querySelectorAll('[data-writing-inline]')
    .forEach((el) => observer.observe(el));
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  document.addEventListener('readingchange', schedule);
  root.addEventListener('toggle', schedule, true);
  desktop.addEventListener('change', setup);
  reduced.addEventListener('change', setup);
  setup();
  return () => {
    observer.disconnect();
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', schedule);
    document.removeEventListener('readingchange', schedule);
    root.removeEventListener('toggle', schedule, true);
    desktop.removeEventListener('change', setup);
    reduced.removeEventListener('change', setup);
  };
}
