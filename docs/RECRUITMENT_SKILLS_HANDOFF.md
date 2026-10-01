# Skills update - Stage F

Completed locally; no push, deployment, provider registration or publication.
Based on Stage E commit `48885a6`. Stage G (publication preparation and QA) is next.

## Audit and changes

The original Skills grid contained 19 tags in four categories, with no proficiency
percentages. All 19 remain. Eight demonstrated skills were added, keeping the
existing typography, tag design and responsive grid:

| Added skill | Source evidence in the recruitment repository | Placement |
|---|---|---|
| FastAPI | `pyproject.toml`, `uv.lock`, `src/football_recruitment/api/app.py` | Software Engineering |
| Pydantic | Strict `Contract` model in `src/football_recruitment/domain/models.py`, dependency lock | Software Engineering |
| pytest | `pyproject.toml`, `uv.lock`, `tests/test_api.py`, `tests/test_similarity.py` | Software Engineering |
| uv | `pyproject.toml` tool configuration, `uv.lock`, README reproduction commands | Tools |
| Data Pipelines | `src/football_recruitment/ingestion/pipeline.py`, `features/pipeline.py` | Data Engineering |
| Data Quality | `validation/pipeline.py`, `preprocessing/minutes.py`: explicit diagnostics and quarantine | Data Engineering |
| Football Analytics | `features/metrics.py`, `features/pipeline.py`: event-derived positional player profiles | Specializations |
| Statistical Similarity | `similarity/engine.py`: standard-library scaling and Euclidean retrieval | Specializations |

Paths abbreviated in the last rows are relative to `src/football_recruitment/`.
Evidence file hashes are saved in `STAGE_F_VALIDATION.json`.

Five compact links connect Python/JavaScript, uv, football retrieval, the API/tests
and data-quality work to the existing project page or specific article sections.
`SkillsGrid` accepts an optional evidence link; existing categories without a link
retain their previous rendering. Each link has descriptive text and keyboard focus.

Existing SQL, NumPy, Pandas and Scikit-learn remain as earlier portfolio content;
they are not attributed to this V1. The audited dependency lock and numerical code
do not demonstrate those libraries here. No Docker, trained predictive model,
professional scouting certification, database server or proficiency percentage was
added. The legacy skills were preserved, not independently re-audited.

## Validation and boundary

The default Astro build succeeds with nine pages. Local links and cross-page
anchors resolve, including all five evidence links. Desktop 1440px, tablet 768px
and mobile 390px have no horizontal document overflow. Keyboard focus and an
article evidence navigation were verified. Light/dark rendering was reviewed;
console errors: none. One existing upstream Astro/Vite unused-import warning.

About content outside Skills is unchanged, as are other portfolio pages, shared
layout, dependencies and build/deployment configuration. All 65 frozen analytical
files remain unchanged; this stage adds no analytical functionality or tests.
Private data-backed captures remain outside the source kit and default build.

Stage G must resolve provider-data/derived-payload publication and attribution,
review concrete repository/deployment assets, and obtain explicit publication
approval before any push, public deployment or release.
