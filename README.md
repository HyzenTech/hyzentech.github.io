# Muhammad Hafiz — Portfolio V2

Astro 5 static portfolio. All four Writing articles are scrollytelling; the separate Visual section is merged into Writing. Production target: [hyzentech.github.io](https://hyzentech.github.io/). The existing GitHub Pages workflow builds the site and deploys pushes to `main`. Run the release checks below before publishing and verify the live site afterward.

## Run

Use Node 20.19+ or 22.12+.

```sh
npm ci
npm run dev
```

Production search is generated during the build:

```sh
npm run build
npm run preview
npm run lint
npm run check
npm test
npm run check:links
```

Build before tests and link checks. Lint checks formatting; Astro check supplies typed diagnostics.

## Content

- src/content/{work,writing,notes}: collection-driven source MDX.
- src/components/writing and src/layouts/VisualWritingLayout.astro: shared visual article shell, chapters, stage, reading depth, fallback figures and sources.
- src/scripts/writing/controller.ts: one native-scroll lifecycle used by all four articles.
- src/visual/writing and src/data/writing: custom Thermal, Tracking and BADI scenes, persistent states and source-labelled evidence.
- src/layouts/RecruitmentLayout.astro, src/data/scrolly and src/visual/recruitment: approved Recruitment design retained through the shared engine.
- src/pages/previews: static SVG previews generated from the same scene renderers/data as each story.
- scripts/new-story.mjs and templates/visual-story: registered draft starter (`npm run new:story -- my-investigation`).
- src/scripts/site.ts: themes, navigation, reading depth, filters, lazy search, and About typing.
- SkillsTicker.astro: vertical CV-sourced skills. Motion defaults on and honors device reduced-motion settings.
- public/resume: unchanged user-supplied PDF and rendered preview; View and Download links work.

Pagefind indexes eight authored Work, Writing, and Notes pages. Ctrl/Cmd+K opens grouped search. Use the production preview for search. Old Blog, project, and Visual URLs forward to current destinations.

Self-hosted Inter and JetBrains Mono use Fontsource Latin variable subsets; OFL licenses are in public/fonts.

## Boundaries

Research and football claims keep their original evidence limitations. The thermal validation discrepancy remains explicitly unresolved. Visual schematics are labeled, not fabricated datasets. Build Logs and Future Projects remain empty. The dependency audit still flags four packages; see docs/DEPENDENCY_REVIEW.md for scope and upgrade requirements. Astro 5 is retained as requested.

See [WRITING_SYSTEM.md](WRITING_SYSTEM.md) for architecture, evidence boundaries and the exact authoring workflow. See docs/UNIVERSAL_VISUAL_WRITING.md for the latest four-article migration report. docs/SCROLLYTELLING_REDESIGN.md records the approved Recruitment benchmark. See docs/PORTFOLIO_V2.md for current feedback changes, routes, checks, and delivery details. PORTFOLIO_V2_PHASE1A.md is historical.
