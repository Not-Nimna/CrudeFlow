import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import bgVideo from "@/assets/pipeline-bg-scrub.mp4";

gsap.registerPlugin(ScrollTrigger);

const marts = [
  {
    tag: "mart_operations",
    tone: "bronze",
    title: "Operations",
    desc: "Hourly & daily throughput, avg/max pressure, and utilization per segment — plus a pressure-drop anomaly flag as a leak-detection proxy.",
  },
  {
    tag: "mart_financial",
    tone: "gold",
    title: "Financial",
    desc: "Daily revenue = delivered volume × tariff_per_bbl, sliced by product grade (WCS, Dilbit, Synthetic) and pipeline segment.",
  },
  {
    tag: "mart_regulatory",
    tone: "silver",
    title: "Regulatory",
    desc: "Monthly throughput per segment + reportable incident summary, shaped like a Canada Energy Regulator (CER) filing.",
  },
];

const sprints = [
  {
    n: "01",
    title: "Skeleton that runs end to end",
    body: "Fake data lands, one gold table builds, one chart renders. Prove the spine works before adding rigor.",
    effort: "~8–12h",
  },
  {
    n: "02",
    title: "Quality gate, orchestration, monitoring",
    body: "Idempotent loads, dbt tests + Great Expectations, silver_quarantine, scheduled runs with failure alerts, freshness SLA.",
    effort: "~10–14h",
  },
  {
    n: "03",
    title: "Three reporting personas + governance",
    body: "Financial + Regulatory marts, anomaly flag, Unity Catalog lineage, column classification, data dictionary.",
    effort: "~10–14h",
  },
  {
    n: "04",
    title: "Portability, docs, packaging",
    body: "dbt-duckdb profile so the same models build locally. Runbook, README, case study, 3-minute Loom.",
    effort: "~8–10h",
  },
];

const stack = [
  ["Databricks Free Edition", "Lakehouse + Unity Catalog"],
  ["dbt (databricks + duckdb)", "Warehouse-agnostic transforms"],
  ["Great Expectations", "Silver-layer quality suite"],
  ["Databricks Workflows", "Orchestration + alerts"],
  ["Power BI Desktop", "Three persona dashboards"],
  ["GitHub Actions", "CI: dbt build + GE on every push"],
];

export default function ScrollVideoSite() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();

    let trigger: ScrollTrigger | null = null;

    const setup = () => {
      if (!video.duration || !isFinite(video.duration)) return;
      const tween = gsap.to(video, {
        currentTime: video.duration,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current!,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.4,
        },
      });
      trigger = tween.scrollTrigger ?? null;
    };

    if (video.readyState >= 1 && video.duration) {
      setup();
    } else {
      video.addEventListener("loadedmetadata", setup, { once: true });
    }

    return () => {
      trigger?.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Fixed video background */}
      <video
        ref={videoRef}
        className="fixed inset-0 h-full w-full object-cover"
        style={{ filter: "blur(12px)", transform: "scale(1.08)" }}
        muted
        playsInline
        preload="auto"
        style={{ zIndex: 0 }}
      >
        <source src={bgVideo} type="video/mp4" />
      </video>

      {/* Overlays */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background:
            "linear-gradient(180deg, oklch(0.14 0.015 60 / 0.55) 0%, oklch(0.14 0.015 60 / 0.75) 100%)",
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none grid-lines"
        style={{ zIndex: 1 }}
      />

      {/* Content */}
      <div className="relative" style={{ zIndex: 2 }}>
        {/* Top nav */}
        <header className="fixed top-0 inset-x-0 z-30 px-8 py-5 flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em]">
          <div className="flex items-center gap-2 text-primary">
            <span className="inline-block h-2 w-2 rounded-full bg-primary animate-pulse" />
            CrudeFlow
          </div>
          <div className="hidden md:flex items-center gap-6 text-muted-foreground">
            <a href="#overview" className="hover:text-foreground transition-colors">Overview</a>
            <a href="#medallion" className="hover:text-foreground transition-colors">Pipeline</a>
            <a href="#marts" className="hover:text-foreground transition-colors">Marts</a>
            <a href="#sprints" className="hover:text-foreground transition-colors">Sprints</a>
          </div>
          <div className="text-muted-foreground hidden sm:block">Edmonton → Burnaby</div>
        </header>

        {/* HERO */}
        <section className="min-h-screen flex flex-col justify-between px-8 pt-32 pb-16">
          <div className="max-w-5xl">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-6">
              Regulatory-grade pipeline data platform
            </p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-balance leading-[0.95]">
              Crude<span className="text-primary">Flow</span>.
              <br />
              <span className="text-muted-foreground">Bronze. Silver. Gold.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed">
              A medallion lakehouse simulating the Trans Mountain corridor —
              telemetry, tariffs, and incidents flowing from raw batches to
              three reporting personas: operations, financial, and regulatory.
            </p>
          </div>
          <div className="flex items-end justify-between font-mono text-xs uppercase tracking-widest text-muted-foreground">
            <div>Scroll to trace the pipeline ↓</div>
            <div className="hidden md:block">v1.0 · 4 sprints · $0 stack</div>
          </div>
        </section>

        {/* OVERVIEW */}
        <section id="overview" className="min-h-screen px-8 py-32 flex items-center">
          <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-8">
            <div className="md:col-span-4">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4">
                § 01 — The premise
              </p>
              <h2 className="text-3xl md:text-5xl font-bold leading-tight text-balance">
                A pipeline for a pipeline.
              </h2>
            </div>
            <div className="md:col-span-8 space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                Every task exists to prove a sentence from the Trans Mountain
                Data Engineer posting. Build & maintain pipelines. Monitor jobs
                and escalate failures. Validate data quality. Clean data for
                operational, financial, <em className="text-foreground not-italic">and regulatory</em> reporting.
              </p>
              <p>
                Corridor:{" "}
                <span className="font-mono text-foreground">
                  Edmonton → Kamloops → Burnaby.
                </span>{" "}
                Sources: telemetry, segments, batches, incidents. Layers:
                bronze immutable raw, silver typed and gated, gold three marts
                per persona.
              </p>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                {[
                  ["04", "Sprints"],
                  ["03", "Gold marts"],
                  ["$0", "Stack cost"],
                ].map(([v, l]) => (
                  <div key={l}>
                    <div className="text-3xl md:text-4xl font-bold text-primary font-mono">{v}</div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* MEDALLION */}
        <section id="medallion" className="min-h-screen px-8 py-32">
          <div className="max-w-6xl mx-auto">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4">
              § 02 — The medallion
            </p>
            <h2 className="text-3xl md:text-5xl font-bold mb-16 text-balance">
              Raw batches enter cold.
              <br />
              <span className="text-muted-foreground">Regulatory filings leave clean.</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  layer: "Bronze",
                  color: "var(--bronze)",
                  desc: "Immutable raw append. Every event lands with load_ts and source_file. Nothing is ever edited here.",
                  items: ["telemetry.json", "segments.csv", "batches.csv", "incidents.csv"],
                },
                {
                  layer: "Silver",
                  color: "var(--silver)",
                  desc: "Typed, deduped on natural keys, joined to reference tables. The quality gate quarantines bad rows.",
                  items: ["not-null keys", "0 ≤ pressure ≤ max", "valve_status enum", "referential integrity"],
                },
                {
                  layer: "Gold",
                  color: "var(--gold)",
                  desc: "Three marts. One per persona. Shaped for the dashboard that consumes it — no downstream cleanup required.",
                  items: ["mart_operations", "mart_financial", "mart_regulatory", "+ data-quality tile"],
                },
              ].map((l) => (
                <div
                  key={l.layer}
                  className="relative rounded-lg border border-border bg-card backdrop-blur-md p-6 overflow-hidden group hover:border-primary/50 transition-colors"
                >
                  <div
                    className="absolute top-0 left-0 h-1 w-full"
                    style={{ background: `oklch(${l.color})` }}
                  />
                  <div className="flex items-baseline justify-between mb-4">
                    <h3 className="text-2xl font-bold" style={{ color: `oklch(${l.color})` }}>
                      {l.layer}
                    </h3>
                    <span className="font-mono text-xs text-muted-foreground">
                      layer/{l.layer.toLowerCase()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">{l.desc}</p>
                  <ul className="space-y-1.5 font-mono text-xs">
                    {l.items.map((i) => (
                      <li key={i} className="flex items-center gap-2 text-foreground/80">
                        <span className="text-primary">›</span>
                        {i}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 rounded-lg border border-border bg-card/40 backdrop-blur-md">
              <p className="font-mono text-xs uppercase tracking-widest text-primary mb-3">
                Quality gate
              </p>
              <p className="text-muted-foreground">
                Injected bad data — nulls, out-of-range pressure, orphan batch_ids —
                is caught by dbt tests + Great Expectations at silver.{" "}
                <span className="text-foreground">
                  Failing rows route to <code className="font-mono text-primary">silver_quarantine</code>.
                  Critical failures block promotion to gold and fail the run loudly.
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* MARTS */}
        <section id="marts" className="min-h-screen px-8 py-32">
          <div className="max-w-6xl mx-auto">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4">
              § 03 — Three personas
            </p>
            <h2 className="text-3xl md:text-5xl font-bold mb-16 text-balance">
              One lakehouse.
              <br />
              <span className="text-muted-foreground">Three audiences.</span>
            </h2>
            <div className="space-y-4">
              {marts.map((m, i) => (
                <div
                  key={m.tag}
                  className="group grid md:grid-cols-12 gap-6 items-start p-6 md:p-8 rounded-lg border border-border bg-card/60 backdrop-blur-md hover:bg-card/80 transition-colors"
                >
                  <div className="md:col-span-1 font-mono text-sm text-muted-foreground">
                    0{i + 1}
                  </div>
                  <div className="md:col-span-4">
                    <div
                      className="font-mono text-xs uppercase tracking-widest mb-2"
                      style={{ color: `oklch(var(--${m.tone}))` }}
                    >
                      {m.tag}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold">{m.title}</h3>
                  </div>
                  <p className="md:col-span-7 text-muted-foreground leading-relaxed">
                    {m.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SPRINTS */}
        <section id="sprints" className="min-h-screen px-8 py-32">
          <div className="max-w-6xl mx-auto">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4">
              § 04 — The four sprints
            </p>
            <h2 className="text-3xl md:text-5xl font-bold mb-16 text-balance">
              Agile, on the record.
              <br />
              <span className="text-muted-foreground">One board, four columns.</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {sprints.map((s) => (
                <div
                  key={s.n}
                  className="p-8 rounded-lg border border-border bg-card/60 backdrop-blur-md relative overflow-hidden"
                >
                  <div className="flex items-baseline justify-between mb-4">
                    <span className="font-mono text-5xl font-bold text-primary/30">
                      {s.n}
                    </span>
                    <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                      {s.effort}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STACK */}
        <section className="min-h-screen px-8 py-32 flex items-center">
          <div className="max-w-6xl mx-auto w-full">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4">
              § 05 — The stack
            </p>
            <h2 className="text-3xl md:text-5xl font-bold mb-16 text-balance">
              Free-tier.
              <br />
              <span className="text-muted-foreground">Warehouse-agnostic.</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-2">
              {stack.map(([tool, role], i) => (
                <div
                  key={tool}
                  className="flex items-baseline justify-between gap-6 py-4 border-b border-border"
                >
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-xs text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-lg font-semibold">{tool}</span>
                  </div>
                  <span className="text-sm text-muted-foreground text-right">{role}</span>
                </div>
              ))}
            </div>
            <p className="mt-12 max-w-2xl text-muted-foreground leading-relaxed">
              <span className="text-foreground">Key design choice:</span> the dbt project
              runs on Databricks <em className="not-italic text-foreground">or</em> DuckDB
              by swapping the profile. Free Edition quota is no longer a single point
              of failure — and warehouse-agnostic transforms is a strong interview line.
            </p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="px-8 py-16 border-t border-border">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-3">
                CrudeFlow
              </div>
              <p className="text-2xl md:text-3xl font-bold max-w-md text-balance">
                A finished, well-documented batch pipeline beats a half-built streaming one every time.
              </p>
            </div>
            <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Portfolio · Trans Mountain Data Engineer
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
