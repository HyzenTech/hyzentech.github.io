import type { APIRoute } from 'astro';
import { publishedWriting } from '../../lib/content';
import { storyFor } from '../../visual/writing/registry';
import { renderScene as renderRecruitment } from '../../visual/recruitment/renderer';
export async function getStaticPaths() {
  return (await publishedWriting()).map((entry) => ({
    params: { slug: entry.id },
    props: { id: entry.data.story.id },
  }));
}
export const GET: APIRoute = ({ props }) => {
  const id = props.id as string;
  let source =
    id === 'football-recruitment-intelligence-engine'
      ? renderRecruitment('ranking', true)
      : storyFor(id).render(storyFor(id).preview, true);
  // The approved inline renderer uses HTML boolean data attributes. Standalone SVG is XML.
  source = source.replace(/\s(data-[\w-]+)(?=\s|>)/g, ' $1=""');
  // Preview media is generated from the same renderer/data, with a stable light canvas.
  source = source.replace(
    '<svg ',
    '<svg style="background:#f5f6f8;--text:#191c23;--muted:#606878;--accent:#8d6b00;--bg:#f5f6f8;--border:#cfd4dc;--bg-alt:#e8ebf1;--r-nearest:#3f8175;--r-target:#8d6b00;--r-context:#bcc2cc;--r-winner:#191c23" ',
  );
  const style =
    '<style>text{font:16px system-ui;fill:var(--text)}.v-small{font-size:13px;fill:var(--muted)}.v-strong{font-weight:600;font-size:18px}.v-light{fill:#111}.v-player-label{font-size:11px}.v-rule,.v-grid{stroke:var(--border)}.v-trace{fill:none;stroke:var(--accent);stroke-width:3}.v-dot,.v-bar{fill:var(--accent)}.v-pitch{fill:none;stroke:var(--border);stroke-width:2}.v-region{fill:var(--accent);fill-opacity:.12;stroke:var(--accent)}.v-centroid{stroke:var(--text)}.v-player-label{font-size:11px}.v-measure{stroke:var(--text);stroke-dasharray:4 4}.r-score-bar{fill:#999}.r-nearest .r-score-bar{fill:#3f8175}.r-winner .r-score-bar{fill:#191c23}.r-label,.r-tick{font-size:14px;fill:#606878}.r-name-mobile{font-size:18px;font-weight:600}.r-value{font-size:16px;font-weight:600}.r-rule{stroke:#cfd4dc}</style>';
  source = source.replace('</svg>', style + '</svg>');
  return new Response(source, { headers: { 'Content-Type': 'image/svg+xml' } });
};
