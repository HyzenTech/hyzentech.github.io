# Recruitment scrollytelling redesign — review handoff

Implemented locally on 2 October 2026. The canonical article remains `/writing/football-recruitment-intelligence-engine/`. No push or deployment has occurred.

## A. What changed

A single, persistent SVG stage replaces the right-hand visualization card. Its ordinary desktop scenes occupy approximately 60% of the canvas width and the viewport height. Eight short narrative steps change the stage through native scrolling. The opening, recruitment brief, and architecture use full-width compositions.

Primary chapter prose decreased from 392 to 310 words (about 21%), excluding optional technical notes and headings. The formulas, data provenance, validation boundaries, and five-candidate table remain available through native disclosures. One actual application screenshot appears only after the analytical story.

A source-hash comparison confirms that the homepage, About, Work, global layouts/styles/scripts, and other article content were preserved. Existing implementation changes are confined to this article, its route selection, and the rendered-site test; README and handoff documentation are updated. The external review handoff includes the scope-hash evidence.

## B–C. Storyboard and real data

| Chapter | Question / key idea | Visual encoding and actual input | Transition |
| --- | --- | --- | --- |
| Opening | Similar to whom; suitable for what? | 303 real profile marks; 295 players; 495,189 events. Opening positions are illustrative. | Introduces the profile population. |
| 1. Population | How does a season become a search space? | Position groups from largest observed exposure; 139 eligible profiles remain bright, with excluded profiles dim. | Groups organize the search space. |
| 2. Profiles | Does a shared position imply a shared profile? | Eligible CB profiles scatter by actual long passes and interceptions per 90. | Other positions fade; the same CB marks redistribute. |
| 3. Evidence | Where does a profile come from? | Schematic event flow; verified 132 matches and event count; Veje’s actual per-90 rates. | Veje stays selected while evidence converges into a profile. |
| 4. Similarity | What does closest mean? | 31 complete peers; horizontal position is actual standardized Euclidean distance from Veje. Vertical packing has no analytical meaning. | Peer marks move into a distance field. |
| 5. Brief | Is the closest profile the best brief fit? | Five real candidates in similarity order; stored CB brief weights 3:2:1; actual brief scores. | The stage expands and the same examples become candidate rows. |
| 6. Ranking | What changes when priorities change? | Full-reference ranks from the 32-candidate CB benchmark, including real rank gaps. | The same five rows and marks reorder smoothly. |
| 7. Explanation | Why does Buchanan rank first? | Actual weighted-percentile contributions: 49.22 + 32.81 + 9.64 = 91.67, displayed rounded. | Buchanan is isolated; the contribution bars grow into view. |
| 8. System | How does the method become a product? | Released data/minutes/41-metric/profile pipeline, similarity, ranking, saved artifacts, local API, and recorded validation checks. | The stage expands into a directed architecture map, then releases into the product payoff. |

The data comes from the frozen V1 reproduction receipt and its referenced profile, similarity-query, and ranking artifacts. The pinned StatsBomb revision is `4b73468fc5b0f1950f9f66fada70ad3a4f9327cb`. Manifest and artifact SHA-256 hashes were checked before export. All ten stored nearest neighbors were replayed from the saved twelve-feature scaler within 1e-10; every selected candidate’s contributions sum to its stored score within 1e-10. Complete hashes are in src/data/scrolly/recruitment-data.json and the article’s Data note.

| Example | Similarity rank | Brief rank | Brief score / 100 |
| --- | ---: | ---: | ---: |
| Josie Green | 1 | 10 | 57.29 |
| Julie Thibaud | 7 | 2 | 87.50 |
| Kadeisha Buchanan | 14 | 1 | 91.67 |
| Niamh Fahey | 18 | 5 | 76.04 |
| Naomi Layzell | 30 | 3 | 78.65 |

These are selected historical examples, not a fabricated shortlist. Profile activity is not a learned tactical role. There is no dimensionality reduction, fake weight slider, or transfer-success claim. StatsBomb attribution and logo remain visible; no raw events or complete derived profile tables are served.

## D. Motion

303 profile marks remain mounted. Position changes use 850ms easing; the shared five candidate rows use 950ms. Irrelevant marks fade while retained players move to the next encoding. Annotation layers crossfade over 450ms. Event particles converge once on pipeline entry; contribution bars grow once per explanation entry; system nodes appear progressively. The brief and system reframe the same stage instead of replacing it with screenshots.

Scrolling remains native, with no snap or scroll lock. Active steps are selected near the middle of the viewport; the two full-width moments use their own entry threshold to avoid heading/chart overlap. Passive scroll events schedule one animation frame. There is no continuous particle loop or added visualization dependency.

## E. Architecture

| Responsibility | Source |
| --- | --- |
| Narrative and optional technical depth | `src/content/writing/football-recruitment-intelligence-engine.mdx` |
| Verified derived data | `src/data/scrolly/recruitment-data.json` |
| Scene IDs, labels, captions | `src/data/scrolly/recruitment-story.ts` |
| Layout, step, stage, readable evidence | `RecruitmentLayout.astro`, components in `src/components/scrolly/` |
| Coordinates, ordering, shared SVG rendering | `src/visual/recruitment/state.ts` and `renderer.ts` |
| Scroll state, progress, responsive/reduced-motion selection | `src/scripts/recruitment-scrolly.ts` |
| Scoped presentation and transitions | `src/styles/recruitment.css` |

The reference was audited from opening to footer before coding and compared again after implementation. The observed dominant stage, focused pacing, changing visual forms, and subtle progress informed this composition. The portfolio keeps its own typography and palette. Mobile uses inline simplified states in place of the reference’s visualization drawer. [Visual reference](https://www.raihankalla.id/media-effects-election#section-context), [architecture reference](https://www.raihankalla.id/create-scrollytelling).

## F. Screenshots

The screenshot gallery is delivered separately beside the portfolio packages. It includes the desktop opening, population, profiles, pipeline, similarity, brief, ranking, explanation, architecture, 390-pixel examples, all eight 320-pixel graphics, and the reduced-motion review fixture. Still images show states; use the local preview to experience transitions.

## G. Verification

| Check | Result |
| --- | --- |
| Production build | PASS: 29 pages; 8 authored search entries |
| Astro check | PASS: 57 files; zero errors, warnings, or hints |
| Formatting lint | PASS |
| Tests | PASS: 14; includes population, actual ranking contrast, contribution arithmetic, and complete article fallbacks |
| Internal links | PASS: 608 references, zero errors |
| Browser console errors | None observed in the reviewed article |
| Whole-story responsive review | 1440×900, 1280×800, 768×1024, 390×844, 320×780 |
| Horizontal overflow | None at the five target widths |
| Mobile SVG labels | No labels extend beyond their canvases at 768, 390, or 320 |
| Native scrolling / reverse transition | Reviewed; shared marks and candidate rows remain mounted |
| Keyboard and reading depth | Native disclosure opened with Enter in the script-free fixture; Story/Technical opens and closes the eight notes; 320-pixel evidence table fits |
| No JavaScript | Script-free generated-page fixture: all eight text steps and inline figures remain visible; JS-only reading buttons hidden |
| Reduced motion | Forced reduced-motion CSS fixture: eight inline states remain visible; animations disabled and transitions zero. Media-query and client preference branch inspected. OS preference was not emulated. |
| Source scope | Protected site areas unchanged by hash comparison |

Browser measurements accompany the external review handoff. Browser review also caught and corrected axis/legend crowding, full-width heading overlap, full-width grid sizing, cramped phone population labels, and fallback SVG typography. Temporary QA pages are excluded from the final build and packages.

## H. Actual limitations

The website replays a curated frozen analysis; it does not run the engine or offer live recruitment queries. The five displayed candidates are a selected subset of the full reference populations. Opening placement, cluster packing, event particles, and architecture spacing are explanatory layouts rather than statistical results.

The engine’s 220 frozen tests plus six export checks and two rebuilds establish software behavior and reproducibility, not football accuracy. CASE-03 remains a limited review with 30 sampled observations and unknown continuous viewing duration. Expert/scout and predictive validation remain unperformed. Price, contracts, age, injury, availability, and team-context adjustments remain outside V1.

Browser checks used the available in-app browser; an operating-system reduced-motion preference and other browser engines were not exercised. The previously documented four dependency warnings under the Astro 5 constraint remain outside this scoped redesign. [Existing dependency review](DEPENDENCY_REVIEW.md).

The original portfolio backup is preserved. Source and static-site packages have been refreshed for this local revision; publication remains pending your review.
