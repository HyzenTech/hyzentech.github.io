> Latest Writing revision (3 October 2026): [Universal Visual Writing report](UNIVERSAL_VISUAL_WRITING.md). The earlier portfolio-wide revision below is retained as historical context.

# Portfolio V2 — current review handoff

**Latest scoped revision:** the recruitment article now uses a persistent open SVG stage and verified player results. [Redesign review](SCROLLYTELLING_REDESIGN.md). The rest of this handoff records the earlier portfolio-wide changes.

Prepared 2 October 2026 after the latest ten browser comments. Implemented and verified locally; no commit, push, pull request, or deployment performed. This report supersedes earlier V2 screenshots and descriptions.

## Changes from the comments

| Comment | Final behavior |
| --- | --- |
| 1: remove recruitment demo | Hero demo and unused component removed. |
| 2: center hero | Headline, paragraph, actions, search, and focus labels centered. |
| 3: excessive space | Hero has no viewport minimum height. Section padding reduced; homepage feature images limited to 260px desktop / 220px mobile. |
| 4: ticker before selected work | Animated areas/tools ticker follows the hero, immediately before Selected Work. |
| 5: giant HAFIZ | Striped oversized footer word removed. |
| 6: motion always on | Manual pause button and saved-pause behavior removed. Motion defaults on; device reduced-motion preference remains respected. |
| 7: homepage About snapshot | Snapshot removed. About is available through navigation. |
| 8: About greeting | Modest bold “Hi, I'm Muhammad Hafiz.” types in on arrival. Full accessible text remains available. |
| 9: animated skills | Vertical rotating skills groups sourced from the supplied CV, with a complete accessible list. |
| 10: Why football | Section removed from About. |

Earlier feedback remains applied: header uses only h.; no profile photo; thermal research follows football in the featured position; BADI stays available in Work and Writing but is not a homepage feature.

## All Writing is visual

There is one Writing destination. Each of the four real articles is now a chapter-based visual story:

| Article | Chapters | Visual treatment |
| --- | --- | --- |
| Football recruitment | 8 | Profile population, similarity, weighted contribution arithmetic, system and validation diagrams |
| Thermal classification | 6 | Class balance, CNN → XGBoost method, data split, source-qualified result bars, evaluation boundaries |
| BADI | 5 | Conceptual records → analysis → service → application flow and team integration |
| Football tracking | 6 | Event window, reported centroid endpoints, source measurements and visible missing-data timeline |

All 25 chapters retain the authored explanations and technical disclosures. Desktop uses a sticky illustration that changes as the reading position crosses chapters, with animated panels, nodes/bars, chapter status, and a progress line. Phones and tablets at 768px or narrower use narrative followed by inline visuals; their active diagrams animate into view. Without JavaScript or under reduced motion, all inline figures remain readable. Motion is progressive enhancement, not required to access the content.

The separate Visual navigation, collection, and teaser are removed. Old /visual/ URLs forward to Writing so bookmarks remain useful. On GitHub Pages, these are generated static forwarding pages, not server-issued HTTP 301 responses.

## Resume and About

The unchanged supplied Muhammad_Hafiz_CV_AI_Engineer.pdf is available through View Resume and Download PDF at /resume/. A rendered WebP preview works in browsers that do not display embedded PDFs. SHA-256 comparison verifies the downloadable PDF exactly matches the supplied file. Skills include Python, SQL, ML/DL, vision, NLP, evaluation, data pipelines, TensorFlow/Keras, scikit-learn, XGBoost, FastAPI/Pydantic, sentence-transformers, ChromaDB, Ollama, and development tools from the CV. No new project case study or unsupported proficiency claim was invented.

## Architecture

Astro 5.18.2, MDX 4, static GitHub Pages output, and self-hosted Inter/JetBrains Mono remain. No runtime backend, React, or D3 dependency was introduced.

- src/content.config.ts: Work, Writing, Notes schemas; Writing requires a story configuration key.
- src/content/work: three case studies. src/content/writing: four visual articles. src/content/notes: one source discrepancy note.
- WritingLayout.astro + StoryChapter/StoryVisual: shared narrative and figure presentation.
- src/visual/stories.ts: four configurations and 25 chapter captions; render.ts and illustrations.ts: original SVG diagrams and source imagery.
- src/scripts/scrolly.ts: passive scroll handler with one scheduled animation frame; selects panels, active links, and progress.
- src/scripts/site.ts: themes, menu, reading controls, filtering, lazy search, entrance effects, and About typing. Clears the obsolete saved motion pause.
- Ambient.astro: original grayscale canvas, capped DPR 1.5 and roughly 25fps; pauses offscreen/hidden and honors reduced motion.
- SkillsTicker.astro and refinement.css: compact homepage, vertical skills, responsive story presentation.
- public/resume: original supplied PDF and rendered preview.

Pagefind indexes eight authored pages across Work, Writing, and Notes, excluding indexes and forwarding pages. Ctrl/Cmd+K opens search; results identify their type. Search is generated by the production build. Use the production preview to review it.

## Routes

21 current destinations + 8 forwarding pages = 29 generated HTML pages.

| Area | Routes |
| --- | --- |
| Main | /, /about/, /contact/, /resume/ |
| Work | /work/, /work/football-recruitment-engine/, /work/breast-thermal-classification/, /work/badi/, /work/future-projects/ |
| Writing | /writing/ plus football-recruitment-intelligence-engine, football-tracking-compactness, breast-thermal-classification, badi-analytics |
| Writing categories | /writing/engineering/, /writing/ml-ai/, /writing/research/, /writing/football-analytics/, /writing/build-logs/ |
| Notes | /notes/, /notes/thermal-metric-reconciliation/ |
| Forwarding | /blog/ and its four former articles; /projects/football-recruitment-intelligence-engine/; /visual/; /visual/football-recruitment-engine/ |

Future Projects and Build Logs remain honest empty states.

## Verification

| Check | Current result |
| --- | --- |
| Production build | PASS, 29 static pages and 8-page search index |
| Formatting lint | PASS |
| Typed diagnostics | PASS, 0 errors / 0 warnings / 0 hints across 47 files |
| Tests | PASS, 11 tests including all four stories, research boundaries, legacy links, search, arithmetic, unchanged resume PDF |
| Internal links/assets/anchors | PASS, 587 references |
| Responsive matrix | PASS, 7 changed destinations × 6 widths = 42 checks |
| Widths | 1440, 1280, 768, 390, 375, 320 |
| Overflow / broken images | None observed in the current matrix |
| Browser interaction | Four desktop stories, native scrolling and chapter links, mobile inline figures, About typing/skills, original resume links, merged search and Escape checked |

Desktop/tablet/mobile checks use the production preview. All four articles show their full 8/6/5/6 inline figures at mobile widths; desktop uses the sticky stage. The browser console result and screenshots are recorded in v2/current. Reduced-motion and no-JavaScript behavior were checked through source and server-rendered content; OS reduced-motion emulation was not performed. These checks are not a complete assistive-technology audit, a Lighthouse score, or validation of the underlying scientific/football conclusions.

## Evidence and boundaries

The football baseline retains source counts, formulas, eligibility, common reference populations, provenance, and separate software/qualitative/expert/predictive validation. Schematic populations and the 90/60/30 example are labeled; the 45/20/5 contributions total 70 and are not a player result. CASE-03 remains LIMITED; expert/scout and predictive validation remain unperformed.

Thermal results preserve the unresolved ResNet50 validation discrepancy: 85.63% in the original article versus 73.17% in the original About source. No test accuracy, patient independence, clinical validation, or external validation was invented. The IEEE link remains document 10882662. BADI diagrams are conceptual, with no invented adoption/performance figures. Tracking shows reported centroid endpoints, not fabricated player positions or interpolated trajectories, and preserves the 1.04-second ball-data gap.

The original resume is now integrated. The remaining package audit flags four packages (Astro critical, sharp high, esbuild low, MDX transitive low). Its applicability is documented separately in DEPENDENCY_REVIEW.md. Current static output uses none of the reviewed server/island/image-ingestion paths, but the installed dependency audit is not clean. A fully patched stack requires the major version upgrades suggested by npm; no force migration was applied under the Astro 5 constraint.

## Delivery

Open http://127.0.0.1:4323/ while the local preview process is running. v2/review.html contains current screenshots only; earlier captures remain historical files outside that gallery. The source ZIP excludes Git internals, dependencies, generated caches/build directories, scratch/private data, and environment files. The static ZIP contains the generated site. package-manifest.json records hashes and integrity checks. No publication has occurred.
