const themeButton = document.querySelector<HTMLButtonElement>('#theme-button');
function syncTheme() {
  themeButton?.setAttribute(
    'aria-label',
    document.documentElement.dataset.theme === 'dark'
      ? 'Switch to light mode'
      : 'Switch to dark mode',
  );
}
syncTheme();
themeButton?.addEventListener('click', () => {
  const theme =
    document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem('theme', theme);
  } catch {}
  syncTheme();
});
const menuButton = document.querySelector<HTMLButtonElement>('#menu-button');
const nav = document.querySelector<HTMLElement>('#main-nav');
function setMenu(open: boolean) {
  nav?.classList.toggle('open', open);
  menuButton?.setAttribute('aria-expanded', String(open));
  menuButton?.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}
menuButton?.addEventListener('click', () =>
  setMenu(menuButton.getAttribute('aria-expanded') !== 'true'),
);
nav
  ?.querySelectorAll('a')
  .forEach((a) => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('click', (e) => {
  if (
    !nav?.contains(e.target as Node) &&
    !menuButton?.contains(e.target as Node)
  )
    setMenu(false);
});
document.addEventListener('keydown', (e) => {
  if (
    e.key === 'Escape' &&
    menuButton?.getAttribute('aria-expanded') === 'true'
  ) {
    setMenu(false);
    menuButton.focus();
  }
});
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('motion-ready');
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      }),
    { threshold: 0.08 },
  );
  document
    .querySelectorAll('[data-reveal]')
    .forEach((el) => observer.observe(el));
}
const detailSections =
  document.querySelectorAll<HTMLDetailsElement>('details.technical');
const readingButtons =
  document.querySelectorAll<HTMLButtonElement>('[data-reading]');
function setReading(mode: string) {
  detailSections.forEach((d) => (d.open = mode === 'technical'));
  readingButtons.forEach((b) =>
    b.setAttribute('aria-pressed', String(b.dataset.reading === mode)),
  );
}
readingButtons.forEach((b) =>
  b.addEventListener('click', () => setReading(b.dataset.reading || 'story')),
);
const items = document.querySelectorAll<HTMLElement>('[data-filter-item]');
const filterStatus = document.querySelector<HTMLElement>(
  '[data-filter-status]',
);
document
  .querySelectorAll<HTMLButtonElement>('[data-filter]')
  .forEach((button) =>
    button.addEventListener('click', () => {
      const selected = button.dataset.filter;
      let count = 0;
      items.forEach((item) => {
        const match =
          selected === 'All' ||
          item.dataset.domains?.split('|').includes(selected || '');
        item.hidden = !match;
        if (match) count++;
      });
      document
        .querySelectorAll('[data-filter]')
        .forEach((el) =>
          el.setAttribute('aria-pressed', String(el === button)),
        );
      if (filterStatus)
        filterStatus.textContent = count
          ? `${count} ${count === 1 ? 'item' : 'items'}`
          : 'No published items in this category yet.';
    }),
  );
interface SearchItem {
  url: string;
  meta: { title?: string; type?: string };
  excerpt: string;
}
interface SearchHit {
  data: () => Promise<SearchItem>;
}
interface Pagefind {
  search: (query: string) => Promise<{ results: SearchHit[] }>;
  init?: () => Promise<void>;
}
const dialog = document.querySelector<HTMLDialogElement>('#search-dialog');
const input = document.querySelector<HTMLInputElement>('#search-input');
const results = document.querySelector<HTMLElement>('#search-results');
const status = document.querySelector<HTMLElement>('#search-status');
let pagefind: Pagefind | undefined;
let request = 0;
let timer: ReturnType<typeof setTimeout>;
let returnFocus: HTMLElement | null = null;
async function openSearch() {
  if (!dialog || !input) return;
  returnFocus = document.activeElement as HTMLElement;
  dialog.showModal();
  input.focus();
}
document
  .querySelectorAll('[data-search-open]')
  .forEach((el) => el.addEventListener('click', openSearch));
document.addEventListener('keydown', (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    if (dialog?.open) dialog.close();
    else openSearch();
  }
});
document
  .querySelector('[data-search-close]')
  ?.addEventListener('click', () => dialog?.close());
dialog?.addEventListener('close', () => returnFocus?.focus());
dialog?.addEventListener(
  'keydown',
  (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      dialog.close();
    }
  },
  { capture: true },
);
dialog?.addEventListener('click', (e) => {
  if (e.target === dialog) {
    const r = dialog.getBoundingClientRect();
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    )
      dialog.close();
  }
});
input?.addEventListener('input', () => {
  clearTimeout(timer);
  const revision = ++request;
  timer = setTimeout(async () => {
    if (!input || !results || !status) return;
    const query = input.value.trim();
    results.replaceChildren();
    if (!query) {
      status.textContent = 'Search Work, Writing, and Notes.';
      return;
    }
    status.textContent = 'Searching…';
    try {
      if (!pagefind) {
        const path = '/pagefind/pagefind.js';
        pagefind = (await import(/* @vite-ignore */ path)) as Pagefind;
        await pagefind.init?.();
      }
      const response = await pagefind.search(query);
      const matches = await Promise.all(
        response.results.slice(0, 16).map((hit) => hit.data()),
      );
      if (revision !== request) return;
      status.textContent = `${response.results.length} ${response.results.length === 1 ? 'result' : 'results'}`;
      const grouped = new Map<string, HTMLElement>();
      for (const hit of matches) {
        const type = hit.meta.type || 'Content';
        let group = grouped.get(type);
        if (!group) {
          group = document.createElement('section');
          const heading = document.createElement('h3');
          heading.textContent = type;
          group.append(heading);
          results.append(group);
          grouped.set(type, group);
        }
        const a = document.createElement('a');
        a.href = hit.url;
        const title = document.createElement('strong');
        title.textContent = hit.meta.title || 'Untitled';
        const excerpt = document.createElement('p');
        const doc = new DOMParser().parseFromString(hit.excerpt, 'text/html');
        excerpt.textContent = doc.body.textContent || '';
        a.append(title, excerpt);
        group.append(a);
      }
    } catch {
      if (revision !== request) return;
      status.textContent =
        'Search is unavailable in this preview. Explore Work and Writing from the navigation.';
    }
  }, 180);
});
export {};

// Earlier review previews stored a manual pause. Motion now follows only the device preference.
try {
  localStorage.removeItem('motion');
} catch {}
delete document.documentElement.dataset.motion;
const typed = document.querySelector<HTMLElement>('[data-typewriter]');
if (typed && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const full = typed.textContent?.trim() || '';
  const started = performance.now();
  typed.textContent = '';
  typed.classList.add('typing');
  function type(time: number) {
    const count = Math.min(full.length, Math.floor((time - started) / 55));
    if (typed) typed.textContent = full.slice(0, count);
    if (count < full.length) requestAnimationFrame(type);
    else typed?.classList.remove('typing');
  }
  requestAnimationFrame(type);
}
