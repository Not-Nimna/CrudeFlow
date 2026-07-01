# CrudeFlow — build plan

A regulatory-grade pipeline data platform, built to match the Trans Mountain **Data Engineer** posting. Everything below runs on a **$0 stack**. The plan is organized as four one-week sprints so the work itself demonstrates the Agile/SCRUM experience the job asks for. Pace it however you like — the sequence matters more than the calendar.

---

## The one thing to keep in mind

Every task below exists to let you say a sentence from the job description in an interview and point at proof. Keep this mapping visible while you build:

| Their requirement | Your proof |
|---|---|
| Build & maintain data pipelines that move/transform data | Bronze → Silver → Gold, orchestrated end to end |
| Monitor jobs; escalate failures/delays/bad output | Scheduled runs + failure alerts + freshness check |
| Data validation & quality checks | Quality gate that quarantines bad rows and fails the run |
| Clean data for reports & dashboards | Three Power BI dashboards on the gold layer |
| Operational, financial **and regulatory** reporting | Three gold marts, one per persona |
| Data governance concepts | Unity Catalog lineage + column classification + data dictionary |
| ETL/ELT, SQL, Python | dbt (SQL) + Python ingestion, medallion ELT |
| Agile SCRUM | GitHub Projects board run as the four sprints below |

---

## Locked free-tier stack

| Layer | Tool | Free because |
|---|---|---|
| Data generation | Python (reuse the RailSight simulator) | runs anywhere |
| Landing / lake + compute | **Databricks Free Edition** | no-cost, serverless, includes Unity Catalog |
| Transform + tests | **dbt** (`dbt-databricks`) | open source |
| Warehouse / serving | Databricks SQL (Free Edition) | included |
| Portable fallback | **DuckDB** (`dbt-duckdb`) | same dbt models run locally if you hit quota |
| Quality | dbt tests + Great Expectations | open source |
| Catalog / lineage | Unity Catalog (or dbt docs) | included |
| Dashboards | **Power BI Desktop** | free to build & record; you don't need Pro for a portfolio |
| Orchestration | Databricks Workflows (or GitHub Actions for the DuckDB path) | included / free |
| CI + board | GitHub Actions + GitHub Projects | free |

**Key design choice:** write the dbt project so the *same models* run on Databricks **or** DuckDB by swapping the dbt profile. That protects you against Free Edition quota limits and is itself a strong engineering talking point (warehouse-agnostic transforms).

---

## Repo structure (create this on day one)

```
crudeflow/
├── README.md                  # architecture diagram + how to run
├── docs/
│   ├── data_dictionary.md
│   ├── runbook.md             # how to run, how to recover a failed load
│   └── adr/0001-medallion.md  # why medallion, why dbt
├── simulator/
│   ├── generate.py            # emits telemetry + reference data
│   └── config.py              # segments, product grades, tariffs
├── ingest/
│   └── land_to_bronze.py      # writes raw batches + load metadata
├── transform/                 # dbt project
│   ├── dbt_project.yml
│   ├── profiles/              # databricks + duckdb profiles
│   ├── models/
│   │   ├── bronze/            # sources + raw views
│   │   ├── silver/            # cleaned, typed, deduped, conformed
│   │   └── gold/              # ops / financial / regulatory marts
│   └── tests/                 # custom data tests
├── quality/
│   └── expectations/          # Great Expectations suites
├── dashboards/
│   └── crudeflow.pbix         # Power BI Desktop file + screenshots
├── .github/workflows/ci.yml   # runs dbt build + GE on every push
└── casestudy.md               # one-pager mapping project → JD
```

---

## Data model (build to this spec)

Corridor: **Edmonton → Kamloops → Burnaby** (Trans Mountain's actual route).

**Sources the simulator emits**

- `telemetry` (streamed/batched events): `segment_id`, `event_ts`, `flow_rate_bbl_d`, `pressure_kpa`, `temperature_c`, `valve_status`, `batch_id`
- `segments` (reference): `segment_id`, `name`, `from_station`, `to_station`, `length_km`, `diameter_in`, `max_pressure_kpa`
- `batches` (reference): `batch_id`, `product_type` (e.g. WCS, Dilbit, Synthetic), `api_gravity`, `tariff_per_bbl`
- `incidents` (occasional): `incident_id`, `segment_id`, `event_ts`, `type`, `severity`

**Layers**

- **Bronze** — raw append of everything above, plus `load_ts` and `source_file`. Immutable; never edited.
- **Silver** — typed, deduped (idempotent on natural key + load window), joined to `segments`/`batches`. Quality gate runs here: not-null keys, `flow_rate_bbl_d >= 0`, `0 <= pressure_kpa <= max_pressure_kpa`, `valve_status in (open, closed, throttled)`, referential integrity to reference tables. Failing rows go to a `silver_quarantine` table, not into the clean model.
- **Gold** — three marts:
  - `mart_operations` — hourly & daily throughput, avg/max pressure, and utilization (throughput ÷ capacity) per segment; plus an **anomaly flag** for a pressure-drop signature (a simple leak-detection proxy — this is your domain-awareness moment).
  - `mart_financial` — daily revenue = delivered volume × `tariff_per_bbl`, by product and segment.
  - `mart_regulatory` — monthly throughput per segment + reportable incident summary, shaped like a Canada Energy Regulator (CER) throughput/incident filing.

---

## Sprint 1 — Skeleton that runs end to end

**Goal:** the thinnest possible pipeline: fake data lands, one gold table builds, one chart renders. Prove the whole spine works before adding rigor.

Tasks
- Create the repo + GitHub Projects board; add every task below as a card.
- Sign up for Databricks Free Edition; create the workspace and a SQL warehouse.
- Adapt the RailSight simulator to emit `telemetry` + the three reference files (start with batch CSV/JSON, not streaming).
- Write `land_to_bronze.py` to push raw files into a Databricks Volume with `load_ts`/`source_file`.
- Stand up the dbt project (`dbt-databricks` profile). Build `bronze` sources → one `silver_telemetry` model → one `mart_operations` daily-throughput table.
- Connect Power BI Desktop to Databricks SQL; build one bar chart of daily throughput by segment.

**Definition of done:** `dbt build` succeeds; one dashboard shows real numbers; you can wipe and rebuild from scratch with two commands. Screenshot it.

---

## Sprint 2 — Quality gate + orchestration + monitoring

**Goal:** turn a script into a *pipeline* — one that catches bad data and tells you when it breaks. This sprint is what separates a data engineer from someone who wrote a transform.

Tasks
- Make loads **idempotent**: re-running the same window must not double-count. (Dedupe on natural key; use dbt incremental models or merge logic.)
- Add the full quality gate: dbt tests for keys/ranges/enums/referential integrity, plus a Great Expectations suite on silver. Route failing rows to `silver_quarantine`.
- Make the gate **fail the run** (or block promotion to gold) when critical tests fail — not just warn.
- Have the simulator inject deliberate bad data (nulls, out-of-range pressure, orphan `batch_id`) so you can *demonstrate* the gate catching it.
- Orchestrate with Databricks Workflows: land → dbt build → tests, on a schedule. Turn on email alerts for job failure.
- Add a **freshness check**: flag if `max(load_ts)` is older than your SLA.
- Wire up `.github/workflows/ci.yml` to run `dbt build` + GE on every push.

**Definition of done:** a run with injected bad data quarantines the bad rows and fails loudly; a green scheduled run appears in Workflows; CI is green on `main`. Record a short clip of a failing run for your case study.

---

## Sprint 3 — The three reporting personas + governance

**Goal:** deliver the operational/financial/regulatory split the JD names, and add the governance story.

Tasks
- Build `mart_financial` (revenue = volume × tariff) and `mart_regulatory` (monthly throughput + incident summary, CER-shaped).
- Add the pressure-drop **anomaly flag** to `mart_operations`.
- Build the two remaining Power BI dashboards (financial, regulatory) + a small **data-quality tile** showing test pass-rate over time.
- Governance: enable Unity Catalog lineage; **classify** the financial/tariff columns (tag as Confidential); write a paragraph on row-level access as the intended access model.
- Write `docs/data_dictionary.md` (every gold column: definition, type, source, owner) and `docs/adr/0001-medallion.md`.

**Definition of done:** three dashboards live; lineage graph screenshot captured; data dictionary complete; sensitive columns tagged.

---

## Sprint 4 — Polish, prove portability, and package

**Goal:** make it reviewable in five minutes by a hiring manager, and bulletproof the "is it real" question.

Tasks
- Prove portability: add the `dbt-duckdb` profile and confirm the *same models* build locally. Document the one-command switch. (This is your answer if Free Edition quota ever locks you out — and a great interview point.)
- Write `docs/runbook.md`: how to run, how to recover a failed/partial load, how to backfill.
- Write the README: embed the architecture diagram, the JD-mapping table, quickstart, and dashboard screenshots.
- Write `casestudy.md` — one page, reusing the JD-mapping table, framed as "the problem, the architecture, the decisions, the result."
- Record a 3-minute Loom: trigger a run, show the quality gate catching bad data, walk the three dashboards, show the lineage graph.
- Pin the repo on your GitHub profile. Link the Loom + a dashboard screenshot from the README.

**Definition of done:** a stranger can understand what it does and why it's well-built in under five minutes, without running anything.

---

## Timeline at a glance

| Sprint | Focus | Rough effort |
|---|---|---|
| 1 | End-to-end skeleton | ~8–12 h |
| 2 | Quality gate + orchestration + monitoring | ~10–14 h |
| 3 | Three marts + governance | ~10–14 h |
| 4 | Portability + docs + packaging | ~8–10 h |

---

## Day-one quickstart

1. `mkdir crudeflow && cd crudeflow && git init` — commit the folder structure above as empty stubs.
2. Create the GitHub repo + a GitHub Projects board; paste every task from Sprints 1–4 as cards, one column per sprint.
3. Sign up for Databricks Free Edition, create a workspace + SQL warehouse, note the connection details.
4. `pip install dbt-databricks dbt-duckdb great-expectations` in a fresh virtualenv.
5. Point the simulator at a local folder first; get `generate.py` producing `telemetry.json` + the three reference files. Once that's clean, wire `land_to_bronze.py` to the Databricks Volume.

Start Sprint 1 the moment `generate.py` produces believable data — don't polish the simulator before the pipeline exists.

---

## Watch-outs

- **Trial expiry / auto-billing:** Databricks Free Edition is genuinely free, but if you ever start the 14-day *trial* instead, it auto-bills on expiry. Stay on Free Edition, and don't attach a payment method you don't need.
- **Free Edition quota:** compute pauses if you blow the daily quota (data is retained). This is exactly why the DuckDB fallback exists — build it in Sprint 4, not when you're already stuck.
- **Scope creep:** streaming ingestion (Event Hubs/Kafka) is a tempting Phase-5 stretch, but only after all four sprints are done and packaged. A finished, well-documented batch pipeline beats a half-built streaming one every time.
