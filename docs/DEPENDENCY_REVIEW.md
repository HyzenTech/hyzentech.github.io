# Dependency applicability review — 2 October 2026

The current npm audit reports four vulnerable packages, not four individual advisories: Astro (critical), sharp (high), esbuild (low), and MDX (low, inherited through Astro). The raw normalized evidence is outputs/v2/dependency-audit.json. The installation is **not audit-clean**. npm suggests major upgrades to Astro 7.3.5 and MDX 8.0.2; these were not forced under the requested Astro 5 constraint.

## Current exposure assessment

This assessment is an inference from the reviewed advisories and source inspection, not an exploit test or security guarantee.

| Advisory family | Source conditions | Current application evidence |
| --- | --- | --- |
| Astro / sharp AVIF and image decoder vulnerabilities | Processing attacker-controlled AVIF or other affected image input | No Astro image service import, AVIF/GIF/TIFF/VIPS assets, remote image ingestion, or upload endpoint. Public images are served through ordinary img tags. [Astro advisory](https://github.com/advisories/GHSA-26w7-cxv4-gfx2), [sharp AVIF advisory](https://github.com/advisories/GHSA-rgj7-g3m4-5g8c), [decoder advisory](https://github.com/advisories/GHSA-f88m-g3jw-g9cj). |
| Server-island replay, Host-header SSRF, base middleware bypass | Runtime server islands, SSR error-page fetching, or non-root base plus pathname authorization | output: static; no server adapter/islands/middleware/authentication; root-domain build. [Server islands](https://github.com/advisories/GHSA-xr5h-phrj-8vxv), [SSRF](https://github.com/advisories/GHSA-2pvr-wf23-7pc7), [base routing](https://github.com/advisories/GHSA-376h-93r7-7g6f). |
| Attribute/slot/transition XSS | Untrusted keys or values reaching vulnerable rendering APIs; some also apply at build time | No define:vars, hydrated client directives, Astro transition directives, dynamic slot names, or spread HTML attributes in authored source. Content is local owner-authored MDX; generated SVG HTML uses fixed local configuration. [Spread props](https://github.com/advisories/GHSA-jrpj-wcv7-9fh9), [incomplete fix](https://github.com/advisories/GHSA-f48w-9m4c-m7f5), [slots](https://github.com/advisories/GHSA-8hv8-536x-4wqp), [island transitions](https://github.com/advisories/GHSA-7pw4-f3q4-r2p2), [animation properties](https://github.com/advisories/GHSA-4g3v-8h47-v7g6). |
| esbuild Windows file-serving traversal | esbuild serve API with servedir on Windows | No esbuild serve API use; local review runs Astro's production preview. GitHub Pages receives generated static files, with no Node/esbuild process. [Advisory](https://github.com/advisories/GHSA-g7r4-m6w7-qqqr). |

The reviewed exploit prerequisites were not identified in the current published-static application design. That does not remove vulnerable packages from the build toolchain. Source/asset trust, future CMS/upload/SSR additions, and dependency changes would invalidate parts of this assessment. A patched dependency stack remains the proper long-term resolution; changing major versions needs its own compatibility and regression review.

The define:vars advisory page could not be fetched during this review; its title and affected range come from npm audit, and the source check found no use of that feature. Other listed primary advisories were opened and read. No claim that every possible vulnerability was investigated is made.

## Audit advisory inventory

| Package | Audit advisory |
| --- | --- |
| astro | [Astro: XSS in define:vars via incomplete </script> tag sanitization](https://github.com/advisories/GHSA-j687-52p2-xcff) |
| astro | [Astro: Server island encrypted parameters vulnerable to cross-component replay](https://github.com/advisories/GHSA-xr5h-phrj-8vxv) |
| astro | [Astro: XSS via Unescaped Attribute Names in Spread Props](https://github.com/advisories/GHSA-jrpj-wcv7-9fh9) |
| astro | [Astro: XSS via unescaped spread attribute names in renderHTMLElement (incomplete fix for CVE-2026-54298)](https://github.com/advisories/GHSA-f48w-9m4c-m7f5) |
| astro | [Astro: Cross-site scripting via unescaped transition:* directive values on hydrated islands](https://github.com/advisories/GHSA-7pw4-f3q4-r2p2) |
| astro | [Astro: Reflected XSS via unescaped View Transition animation properties](https://github.com/advisories/GHSA-4g3v-8h47-v7g6) |
| astro | [Astro: Host header SSRF in prerendered error page fetch](https://github.com/advisories/GHSA-2pvr-wf23-7pc7) |
| astro | [Astro: Reflected XSS via unescaped slot name](https://github.com/advisories/GHSA-8hv8-536x-4wqp) |
| astro | [Astro: Remote code execution through AVIF image optimization](https://github.com/advisories/GHSA-26w7-cxv4-gfx2) |
| astro | [Astro: Authorization bypass from missing path-segment boundary check when stripping the configured base](https://github.com/advisories/GHSA-376h-93r7-7g6f) |
| esbuild | [esbuild allows arbitrary file read when running the development server on Windows](https://github.com/advisories/GHSA-g7r4-m6w7-qqqr) |
| sharp | [sharp inherited vulnerabilities in libvips: CVE-2026-33327, CVE-2026-33328, CVE-2026-35590, CVE-2026-35591](https://github.com/advisories/GHSA-f88m-g3jw-g9cj) |
| sharp | [sharp: Vulnerabilities in libheif: GHSA-g89c-p67h-r497 and GHSA-2jg2-4ch7-h545](https://github.com/advisories/GHSA-rgj7-g3m4-5g8c) |
