# Portfolio V2 — Phase 1A report

Completed locally on October 2, 2026 (Asia/Jakarta). Review build only; no remote push, merge, or deployment was performed. Phase 1B has not been started.

## A. Repository audit

Audited base commit: `02d8c82e6cc9ad488022e56d3b84965443618af0` from `HyzenTech/hyzentech.github.io`.

### Stack and architecture

- Astro 5.16.6, as resolved by the existing package lock; Astro is the only direct application dependency.
- Static HTML generation with Vite and strict Astro TypeScript configuration. No React, client router, CMS, or content collections.
- `src/pages/` contains file-based routes; content is authored directly in `.astro` files. The homepage and blog listing originally held their own arrays.
- `src/layouts/BaseLayout.astro` owns document metadata, fonts, global design tokens, navigation, footer, mobile navigation, and theme behavior.
- Existing components: ProjectCard, ProjectActions, SkillsGrid, SourceCredit, and Timeline.
- Styling uses vanilla CSS: global custom properties in BaseLayout, scoped component/page styles, and previously a separate interactive stylesheet.
- Fonts are DM Sans for headings/UI and Lora for legacy body text, loaded through the existing Google Fonts stylesheet. Images are served directly from `public/images`; there is no existing responsive image processing pipeline.
- Existing responsive layouts use grids, flexbox, and mainly 768 px/480 px breakpoints. The original mobile navigation is a hamburger menu.
- Existing theme handling supports saved light/dark choices and a system fallback. It previously applied the theme after page parsing and hid the body until JavaScript ran.
- `astro.config.mjs`: canonical site `https://hyzentech.github.io`, static output, ignored trailing slash differences, default root base. This is an account-root Pages site, not a repository subpath site.
- `.github/workflows/deploy.yml` builds on Node 20, installs dependencies, builds `dist`, uploads the Pages artifact, and deploys on pushes to `main` or manual dispatch. No deployment configuration changed.
- Package scripts: dev, build, preview, astro. No test suite, lint command, or dedicated typecheck command is configured.

### Existing content locations

| Area | Existing location |
|---|---|
| Homepage / project overview | `src/pages/index.astro` |
| Recruitment engine | `src/pages/projects/football-recruitment-intelligence-engine.astro` |
| Recruitment engineering article | `src/pages/blog/football-recruitment-intelligence-engine.astro` |
| Breast thermal research | `src/pages/blog/breast-thermal-classification.astro` |
| BADI | `src/pages/blog/badi-analytics.astro` |
| Football tracking article | `src/pages/blog/football-tracking-compactness.astro` |
| Blog listing | `src/pages/blog.astro` |
| About / education / experience / skills | `src/pages/about.astro` |
| Contact | `src/pages/contact.astro` |

There is no standalone Work index, resume asset/route, or Visual Essays route. Work continues to lead to the homepage's selected-work section; Writing uses the existing blog destination.

### Findings and safest strategy

The current stack already supports Phase 1A and future content-oriented growth. Retain Astro, static routing, all legacy article/project sources, the dependency lock, and Pages deployment. Add a scoped homepage design and reusable server-rendered components, while keeping the global shell compatible with existing pages.

Migration risks: globally changing CSS variables could alter long-form layouts and theme-adaptive illustrations; renaming URLs could break public links; inventing resume infrastructure could create dead navigation; migrating hard-coded articles now could lose rich figures or provenance. The legacy interactive script also rewrote headings, added parallax/magnetic effects, and ran an ongoing animation loop. Its global loading was removed for readability, performance, and motion compliance. The source files remain available.

Design inspiration was reviewed from [Deep-ML](https://www.deep-ml.com/) and [Raihan Kalla's site](https://www.raihankalla.id/). The [scrollytelling article](https://www.raihankalla.id/create-scrollytelling) informed separation of content and presentation only. No scrollytelling was implemented.

## B. Implementation summary

### Modified files

- `src/pages/index.astro`: replaced the old hero/equal-weight project list with Hero → Selected Work → What I Work On → Latest Writing → About Snapshot.
- `src/layouts/BaseLayout.astro`: HAFIZ/ identity, Work/Writing/About navigation, updated footer copy, Work anchor, navigation current-state attributes, pre-paint theme initialization, safer storage access, accessible theme chooser state/focus/Escape behavior, mobile menu closing on link selection, JavaScript-independent content visibility, no-JavaScript mobile navigation, and reduced-motion handling. Stopped loading the legacy interactive script and stylesheet.
- `README.md`: added the Phase 1A review/build handoff.

### Created files

- `src/components/FeaturedProject.astro`: dominant recruitment project with authentic empty-state application screenshot, existing project route and public source link, stack tags, and explicit historical/local-reproduction scope.
- `src/components/WorkCard.astro`: reusable secondary project/research card; research publication metadata and BADI's capstone context carry different emphasis. The existing ProjectCard component is preserved.
- `src/components/WritingItem.astro`: editorial article rows with existing titles, dates, categories, and routes.
- `src/components/SectionLabel.astro`: restrained technical section labels.
- `src/components/Tag.astro`: compact technology labels.
- `src/components/Metadata.astro`: wrapping metadata lists.
- `src/data/home.ts`: curated writing metadata and four concise technical focus descriptions.
- `src/styles/home-v2.css`: homepage-only tokens, shell refinements, grids, responsive layouts, focus styling, dark/light contrast, and reduced-motion support.
- `docs/PORTFOLIO_V2_PHASE1A.md`: this report.

### Design and architecture decisions

- Neutral dark base (`#090A0C`), elevated cards (`#111318`), readable muted text, and restrained lime accents (`#A4FF4F`). Light mode has a separate neutral palette and a darker green for readable links.
- Existing DM Sans becomes the homepage body/UI font. Technical labels use local system monospace fonts. No new font package or animation dependency.
- Dark is the homepage's initial default; explicitly saved light/dark preferences are respected. Legacy pages retain their system fallback when there is no saved choice.
- Recruitment is the flagship; research is explicitly labeled IEEE CENIM 2024 and visually precedes the smaller BADI card. No new metrics or features were invented.
- Real existing imagery is reused with intrinsic dimensions and lazy loading. No generated project statistics or new visualization assets.
- Writing is a readable list of four existing articles. Reading-time estimates are omitted on the new homepage.
- CSS variables are scoped to `body.portfolio-v2`, preserving legacy page styling. Content and presentation have a small explicit seam for later growth.
- No empty Resume page/link was added because no existing destination is available. Contact, GitHub, LinkedIn, and email remain accessible.

## C. Content preservation

All eight existing non-homepage pages have byte-equivalent normalized main text compared with the separately built original snapshot. Their source content has not been rewritten. The new homepage keeps the same three projects and links to deeper evidence.

Preserved:

- Recruitment system page, technical article, existing architecture diagram, provider attribution, verification evidence, and validation limits.
- Breast thermal research and IEEE reference, including CNN, VGG16, ResNet50, and XGBoost details.
- BADI article and its original project organization link.
- All four blog posts and the existing blog listing.
- About, education, experience, skills, certifications, and Contact.
- All nine routes, existing project/resource URLs, GitHub, LinkedIn, and email destinations.
- Existing public assets, Astro configuration, dependency manifest/lock, and GitHub Actions deployment workflow.

Evidence: `phase1a-content-preservation.json` in the review output folder.

## D. Verification

| Check | Result |
|---|---|
| Original production build | Passed: nine static pages |
| Final Phase 1A production build | Passed: nine static pages |
| Existing website tests | Not configured; no test pass is claimed |
| Existing lint | Not configured |
| Dedicated typecheck | Not configured; Astro build generated types, which is not a full typecheck |
| Route checks | All nine returned HTTP 200 |
| Local links, assets, and anchors | No failed local destinations or missing tested anchors |
| Responsive review | 45 checks across nine routes at 1440, 1280, 768, 390, and 320 px |
| Homepage overflow | None at all five widths |
| Homepage dark/light text contrast | All tested visible text meets the applicable 4.5:1 normal / 3:1 large-text threshold |
| Keyboard / mobile controls | Navigation open/close, Escape, focus return, Work anchor, theme chooser, and skip link passed |
| Theme persistence | Both explicit light and dark choices persisted across reload; homepage fallback is dark |
| Reduced motion | All nine routes remained readable; smooth scrolling disabled |
| JavaScript disabled | Homepage content and mobile navigation remained accessible |
| Browser runtime | No JavaScript errors observed |
| Git diff whitespace | Passed with `core.whitespace=cr-at-eol` for the existing CRLF layout source |
| GitHub Pages | Root-relative links, unchanged static output/site/base/workflow, and complete generated route tree verified locally; no remote deployment performed |

Dependencies were installed from the existing lock without changing package.json or package-lock.json. Windows sandbox restrictions affected the first build attempt; the required-access build passed. No new dependencies were added.

Important external requests returned HTTP 200 for the GitHub profile, recruitment repository/release, tracking-analysis repository, BADI organization, and LinkedIn destination. IEEE Xplore returned HTTP 202: the endpoint was reachable, but full article access was not independently confirmed. The existing publication reference remains unchanged. These are reachability checks, not validation of every external site's content.

The public [recruitment repository](https://github.com/HyzenTech/football-recruitment-intelligence-engine) was also inspected and supports the retained historical pipeline, local FastAPI application, positional profiles, explained similarity, and recruitment-ranking scope.

Evidence: `phase1a-browser-verification.json` and `external-link-verification.json` in the review output folder. Contrast and browser checks support accessibility basics; they are not a comprehensive accessibility certification or a measured user-comprehension study.

## E. Visual review

Review output includes:

- `desktop-homepage.png`: full homepage at 1440 px, dark theme.
- `mobile-homepage.png`: full homepage at 390 px, dark theme.
- `desktop-homepage-light.png`: full homepage in light mode.
- `desktop-first-screen.png` and `mobile-first-screen.png`: readable first-screen captures.

Desktop and mobile hierarchy were visually inspected. Laptop/tablet layouts were also captured and visually inspected, alongside browser viewport checks. Mobile stacks the flagship image and copy, simplifies the status module, uses two-column focus areas, and puts supporting cards in a single column.

## F. Known issues

### Pre-existing

1. The thermal-research article's table causes page-level horizontal overflow at 320 px (379 px document width). The original snapshot reproduces the same dimensions. It passes at 390 px and above. This legacy article layout has not been redesigned during Phase 1A.
2. Astro emits a nonblocking unused-import warning from its own remote-image helper module. The original build emits the same warning.
3. The blog listing calls the recruitment article a local draft despite its public repository linking the article. Existing editorial status text is preserved for user review.
4. No resume destination and no dedicated website test/lint/typecheck commands are configured.

### Phase 1A

No known introduced route, content, homepage overflow, tested contrast, or browser runtime regressions. The IEEE access check remains partial as described above. Remote Pages deployment has not been verified because this phase is a local review deliverable.

## G. Phase 1B recommendation — not implemented

Keep Astro. Next, inventory and standardize Work/Writing metadata, define a project case-study template, reconcile article publication statuses, and add a user-approved resume destination. Decide whether Astro content collections and MDX materially improve authoring before migrating existing articles. Treat the recruitment visual essay as a later isolated architecture exercise; preserve its narrative/data/presentation boundaries, but defer scrollytelling and visualization implementation until explicitly approved.

Phase 1A stops here, pending review and explicit Phase 1B approval.
