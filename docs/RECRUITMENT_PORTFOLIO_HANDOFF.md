# Football recruitment portfolio integration — Stage D

This is a local branch based on portfolio commit `3edc977`. The public portfolio
has not been modified or deployed. Existing deployment configuration is preserved.
Do not push this branch until the concrete publication plan is approved.

## Implemented

- First featured homepage project, preserving both previous entries.
- `/projects/football-recruitment-intelligence-engine/` page using the existing
  BaseLayout, typography, colors, navigation and theme behavior.
- Actual local V1 empty-search screenshot and source-derived architecture SVG.
  No derived player JSON, data-backed review screenshots or private observations.
- Four product views, engineering evidence, CASE-03 summary, validation limits,
  historical scope and provider-rights/publication status.
- Optional card resources/copy and canonical/social-image metadata. Existing cards
  retain their link text and behavior. Metadata points to intended final URLs;
  it does not assert that the new route is deployed.
- Closed mobile menu no longer extends the page or accepts keyboard focus.
  Toggle exposes its expanded state; Escape closes it and returns focus.
  Shared layout adds a skip link and visible keyboard focus.

## Pending links and stages

Live Demo, GitHub and Case Study are status text until real approved destinations
exist. Do not turn planned URLs into active links to absent resources.
Stage E adds the article to the existing blog; Stage F adds evidence-backed Skills.
Stage G clears attribution/data rights and connects reciprocal links after actual
repository/demo creation, followed by approved publication and live QA.

The current page uses source credit and states unresolved official-logo/registration
and derived-data scope. That is review evidence, not a declaration of compliance.
Public analytical assets need the final documented attribution and rights review.

## Validation

The locked Astro 5.16.6 build succeeds, generating eight pages. Node 24 was used.
Dependencies, lockfile and root base path are unchanged. One upstream build warning
reports unused imported Astro helpers. All local built links and image alt text pass.
Canonical, Open Graph and Twitter metadata match the intended project route/image.
The project/homepage, light/dark themes, desktop, tablet and mobile were inspected.
About and Blog mobile navigation and skip-link focus work. No console errors were
captured in the checked project views. This is not a formal assistive-technology audit.
All original articles, About, blog listing and Contact content are byte-identical.
The separate analytics repository retains all 65 frozen file hashes.

See `STAGE_D_VALIDATION.json`. Private review captures live outside this source kit.
Full remote/history/license/deployment acceptance remains a Stage G responsibility.

## Local preview

Install the locked dependencies with `npm ci`, then run `npm run build` and
`npm run preview -- --host 127.0.0.1 --port 8875`.
The local project route is `/projects/football-recruitment-intelligence-engine/`.
Astro telemetry was disabled for the verification process using
`ASTRO_TELEMETRY_DISABLED=1`; no user-wide settings were changed.
