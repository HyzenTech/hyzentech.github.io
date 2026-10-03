# Portfolio V2 — Universal Visual Writing implementation

3 October 2026. Implemented and validated locally. All four substantial Writing articles now use one native-scroll system, with 28 chapters and custom visual stories. Notes remain lightweight. No push or deployment has occurred.

## A. Writing system architecture

Narrative and publication metadata live in Astro's Writing collection. MDX contains short chapter prose and native technical disclosures. Sources are authored once in frontmatter; shared endings, index rows and homepage previews read collection metadata.

Small evidence exports live in `src/data/writing/`. Storyboard configuration lives in `stories.json`, separate from article-specific geometry in `src/visual/writing/`. The build-time registry connects article IDs to scenes and checks chapter order. Unregistered scenes or inconsistent metadata fail the build.

`VisualArticleLayout`, `StoryStage` and `StoryStep` own the common reading structure. A single `mountStory` lifecycle manages native scroll, active chapters, progress, responsive mode and reduced motion. The client adapter moves persistent marks and fades annotation layers without replacing the canvas. Full-width comparisons reuse the same stage; expanded technical text reserves additional space.

Recruitment is a compatibility adapter over that engine. Its approved opening, narrative, renderer, coordinate states, data, CSS and ending remain. The previous unused writing engine and its illustration modules were removed.

Desktop above 900 pixels uses a persistent sticky visualization. Tablet and phone show the appropriate figure beside each chapter. JavaScript-free and reduced-motion reading show all static figures, prose, sources and native disclosures. No scroll interception or animation framework was added.

## B. Reusable components

Generalized: `VisualArticleLayout`, `StoryHero`, `StoryProgress`, `StoryStage`, `StoryStep`, `ArticleStep`, `StoryEnding`, `TechnicalDetail` and `SourceNote`. Existing `ReadingMode` and site controls are reused. Recruitment's stage/step wrappers retain approved class names while using the common components.

The lifecycle exposes scene enter, leave, progress, responsive/reduced-motion mode and cleanup. Renderers decide what the visual means and how its geometry changes.

## C. Visualization primitives

Escaped SVG text, line, dot, bar, categorical bars, timeline, discontinuous line path and accessible SVG wrapper. `composeScene` and `markMarkup` keep stable mark identities and persistent annotation layers, with a single-state inline rendering alternative.

Subject-specific diagrams remain custom. There is no large speculative component library.

## D. Custom scenes

- Recruitment: season profiles, event representations, eligibility, similarity, recruitment priorities, changed ranking, score contributions and reproducible system.
- Thermal: schematic relative intensity, balanced dataset splits, feature representation, VGG16/ResNet50 fork, conceptual XGBoost classification, source-labelled results, unknown confusion matrix and research outcome.
- Tracking: observed Home positions, convex hull/centroid, ball-distance disruption, two observed endpoint shapes, missing-data trace and event interpretation.
- BADI: observed monthly example series, 12-step window regrouping, recursive forecast concept, bakery item/basket counts, model/service response boundary and prototype outcome.

## E–F. Migrated Writing and storyboards

| Article and canonical route | Chapters | Visual progression |
| --- | --- | --- |
| [Football Recruitment Intelligence Engine](http://127.0.0.1:4323/writing/football-recruitment-intelligence-engine/) | 8 | population → profiles → pipeline → similarity → brief → ranking → explanation → system |
| [Breast Thermal Classification](http://127.0.0.1:4323/writing/breast-thermal-classification/) | 8 | heat → dataset → features → extractors → classifier → experiment → confusion → outcome |
| [Football Tracking / Compactness](http://127.0.0.1:4323/writing/football-tracking-compactness/) | 6 | positions → shape → disruption → compactness → gap → interpretation |
| [BADI](http://127.0.0.1:4323/writing/badi-analytics/) | 6 | records → window → forecast → insights → contract → evidence |

These are all substantial existing Writing articles; no additional essay was left on the old format. Existing Blog and Visual redirects remain. The Writing index and category filtering use the same published collection as homepage previews. Meaningful preview SVGs are generated from each story's renderer and evidence at build time. They require no article JavaScript on the homepage/index.

## G–H. Authoring workflow and documentation

[WRITING_SYSTEM.md](../WRITING_SYSTEM.md) describes the architecture, scene lifecycle, evidence boundaries and exact workflow. The [starter directory](../templates/visual-story/) contains MDX, renderer and storyboard templates.

Create a draft with `npm run new:story -- my-investigation`. This generates a registered renderer, chapter configuration and draft MDX. Then:

1. Plan the question, central tension and 4–8 scene storyboard.
2. Fill publication metadata and source links in MDX; match ordered chapter IDs to the storyboard.
3. Write short prose and optional technical disclosures.
4. Export small verified evidence and design subject-specific scene geometry. Replace all illustrative starter marks before publication.
5. Choose the preview scene and test desktop, tablet, mobile, both themes, keyboard controls and fallback reading.
6. Set `draft: false` and `status: Published`, then build and run the documented checks.

A real scaffolded draft passed Astro check and build while remaining excluded from published routes and preview media. It was removed after the smoke check. The automated scaffold test checks registration, draft flags, overwrite protection and reserved routes.

## I. Verification

| Check | Result |
| --- | --- |
| Production build | PASS — 29 HTML pages, 4 generated SVG previews, 8 Pagefind content entries |
| Astro / TypeScript | PASS — 74 files, 0 errors, 0 warnings, 0 hints |
| Formatting | PASS |
| Tests | PASS — 19 tests, 0 failures |
| Internal links / assets / anchors | PASS — 662 references across 29 HTML pages |
| Preview XML and browser images | PASS — all 4 SVGs parse and load |
| Browser console | No captured warnings or errors in the final review |
| Responsive layout | 30 measurements: all 4 articles plus homepage/index at 375, 390, 768, 1280 and 1440 pixels; no horizontal overflow |
| Reading depth | All 28 disclosures open in Technical and close in Story; keyboard Enter verified |
| Native chapter navigation | Full-width targets activate correctly after accounting for page and chapter scroll offsets |
| Wide technical disclosure | BADI canvas settles below the expanded text; no overlap |
| Recruitment transitions | All 8 chapters select correctly; 303 persistent profiles retained |
| No JavaScript | Script-free built-HTML fixtures show all 28 figures and native disclosures |
| Reduced motion | Forced-matchMedia and same-CSS local fixtures show all 28 figures with the stage disabled; OS preference was not changed |
| Scope preservation | 21 protected source/assets unchanged, including Recruitment renderer/data/CSS, global styles, About, Notes and supplied resume; Recruitment prose retained; homepage source change is only the Writing label |

The website browser review covered each custom desktop chapter, plus tablet and phone reading. Automated file-protocol preview of the separate gallery was blocked by browser policy; its 11 image files and relative links were checked directly. Iterations fixed an inherited 300-pixel SVG cap, annotation/mark layering, BADI chart scale, narrow service labels, the standalone Recruitment preview's XML attributes and full-width anchor activation. Tracking's wide comparison now shows the actual start and end shapes together.

Browser measurements, Recruitment scene checks and scope/hash evidence accompany the external review handoff. These are browser and source checks, not a Lighthouse score or independent accessibility certification.

No new dependencies were added. The common scene adapter is about 0.81 kB raw / 0.45 kB gzip; controller 2.68 / 1.15 kB. Recruitment's specialized client is 52.57 / 8.65 kB. Each non-Recruitment page receives only its own state data. Approximate gzip HTML sizes are 31.8 kB Recruitment, 23.9 kB Thermal, 15.8 kB Tracking and 12.8 kB BADI; fallback SVGs are retained deliberately for readable static output.

### Evidence corrections and limits

Recruitment's frozen engine and validation boundaries remain unchanged. Reproducibility is not expert scouting or predictive validation.

Thermal uses the original write-up's counts/results and the inspected [Kaggle notebook](https://www.kaggle.com/code/hyzentech/xgboost-resnet50). The notebook has 17 cells and no saved outputs. Its code uses a fixed XGBoost setup; importing cross-validation does not prove a five-fold experiment was executed. The 85.63% versus 73.17% ResNet50 validation discrepancy remains explicit. No patient image, calibrated temperature, fitted activation map, complete confusion matrix or test accuracy was invented. The [IEEE record](https://ieeexplore.ieee.org/document/10882662) is linked but its full paper was not available to reconcile the figures.

Tracking derives selected coordinates and metrics from the pinned [analysis source](https://github.com/HyzenTech/football-tracking-compactness-analysis/tree/596501b7fcda1c082bf1a0e0bff181c9ea7b9cb0) and [Metrica sample](https://github.com/metrica-sports/sample-data/tree/e706dd506b360d69d9d123d5b8026e7294b13996). The Home CSV hash was verified and endpoints replayed. The 1.04-second gap lies between valid analysis frames at 307.92 and 308.96; interior missing frames are not interpolated. Away recovers at 308.96, correcting the previous Home-regain wording. Morphs explain snapshot changes, not a continuous match replay. Raw CSVs are not included in the website package.

BADI uses pinned [ML](https://github.com/BADI-C22-PS174/C22-PS174-Machine-Learning/tree/9e0c419259badb07f1bb5d36f43e88f54ac9d834) and [Flask](https://github.com/BADI-C22-PS174/Flask-ML/tree/863c1c3cd491cb0a187df054a64a7804f645f498) source. Its example is monthly items sold, not verified customer income. The code's 12-month rollout differs from the legacy day-based description. Bakery counts are direct aggregation. The inspected response returns original records instead of calculated forecasts; the story exposes this implementation boundary. Adoption, deployment and forecasting accuracy are not claimed.

### Preservation and deployment boundary

The previous portfolio source backup and Git history bundle remain. A separate approved Recruitment checkpoint is retained locally under `work/writing-system/approved-recruitment.zip`.

At this writing-system handoff, no commit, push or deployment was made. Source and static exports were refreshed separately from review screenshots and source-audit scratch files. Release inspection later confirmed that the existing GitHub Pages workflow is configured; the earlier description of it as empty was incorrect. The earlier [dependency review](DEPENDENCY_REVIEW.md) still applies to the unchanged Astro 5 lockfile; this writing work does not claim an audit-clean installation.

## J. Screenshots

The separate `outputs/writing-system/review.html` gallery includes representative screenshots for all four stories, the Writing index, phone and tablet reading. Review movement in the local Writing collection. The external delivery also includes browser measurements, scope hashes and package manifests.
