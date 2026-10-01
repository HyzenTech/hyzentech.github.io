# Recruitment technical article - Stage E

Stage E continues the local Stage D portfolio branch. Nothing has been pushed,
deployed or published. Stage F (evidence-based Skills update) is next.

## Delivered

- New article at `/blog/football-recruitment-intelligence-engine/`, approximately
  2,207 words / 12 minutes, using the existing portfolio layout and themes.
- First blog listing entry and active Case Study links on the homepage and
  dedicated project page; the article links back to that project.
- Data reconstruction, quarantine decisions, normalization, role benchmarks,
  candidate-only statistical similarity, requirement contributions, reproducibility,
  one sampled football review and explicit validation limits.
- Source-derived architecture diagram and an accessible native contribution bar
  with a numerical table. Scrollable tables support keyboard focus.
- Facts verified against the frozen V1 artifacts, including the 32-player CB
  preset and Buchanan's 91.6667 score. No new analytics or reassessment.

## Local review and image boundary

The default build uses the existing empty-search screenshot and architecture SVG.
It contains zero private application screenshots or their asset references.
The article still contains sourced numerical examples: this is a local review
source kit, not a declaration that public data publication is cleared.

A separate private review build includes four genuine application captures
(explorer, comparison, similarity, ranking). They live outside this source tree,
in the adjacent `stage-e-review/app-captures/` review directory. Never place them
inside `public/`: Astro copies that directory even when article conditionals hide
images. The source ZIP excludes those captures, build outputs and private data.

For private review, set `RECRUITMENT_PRIVATE_PREVIEW=1`, build with Astro's
`--outDir` into a separate scratch directory, then copy the four capture JPEGs
into that built directory's `images/recruitment-private/`. Recopy after each build,
since the build may clean its output. Keep the resulting server on loopback only.
For a default build, unset the private-preview variable before `npm run build`.
`ASTRO_TELEMETRY_DISABLED=1` was used for both builds.

## Checks and remaining work

Both variants build nine pages; local links, anchors, image alt text and canonical/
social metadata pass. Desktop, tablet and mobile, light/dark theme, contents links,
reciprocal navigation and keyboard table access were reviewed. Console errors: none.
One existing upstream Astro/Vite unused-import warning remains.

All 65 frozen analytical files remain unchanged. The original 220 checks plus six
export guards passed during Stage C; no analytical tests or calculation code were
changed for this article. The previous three articles, Skills/About, dependency
lock, Astro configuration and shared layout/card components remain preserved.

Provider data, exact derived JSON, data-backed images and this analytical article
still need publication review, source attribution and official logo handling.
MIT covers project code only. Demo/GitHub destinations remain pending; Case Study
is now a working local route. No provider registration or external action occurred.

See `STAGE_E_VALIDATION.json` and `STAGE_E_FACT_CHECK.json` for saved checks.
Historical Stage D handoff remains available as the previous-stage record.
