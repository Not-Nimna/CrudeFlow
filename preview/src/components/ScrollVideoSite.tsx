import { useEffect, useRef, useState } from "react";
import { GitBranch } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import bgVideo from "@/assets/pipeline-bg-scrub.mp4";

gsap.registerPlugin(ScrollTrigger);

function PipelineMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none">
      <defs>
        <linearGradient
          id="pipeline-mark"
          x1="4"
          y1="4"
          x2="20"
          y2="20"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#ff9f2f" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <path
        d="M6 15c0-2.2 1.8-4 4-4h8"
        stroke="url(#pipeline-mark)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M10 7h6c2.2 0 4 1.8 4 4s-1.8 4-4 4h-2"
        stroke="url(#pipeline-mark)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <circle cx="6" cy="7" r="2" fill="#ff9f2f" />
      <circle cx="18" cy="11" r="2" fill="#7c3aed" />
    </svg>
  );
}

const marts = [
  {
    tag: "mart_operations",
    tone: "bronze",
    title: "Operations",
    desc: 'Hourly and daily throughput, average/max pressure, and utilization per segment - plus a pressure-drop signature flagged as a leak-detection proxy, because on a pipeline, "the numbers look fine" is not good enough.',
  },
  {
    tag: "mart_financial",
    tone: "gold",
    title: "Financial",
    desc: "Daily revenue reconstructed from delivered volume x tariff, broken out by product grade (WCS, Dilbit, Synthetic) and segment - auditable back to the batch it came from.",
  },
  {
    tag: "mart_regulatory",
    tone: "silver",
    title: "Regulatory",
    desc: "Monthly movement summaries and incident counts shaped for CER-style filing, with every figure traceable to its source file. Built for someone who has to defend the number, not just report it.",
  },
];

const sprints = [
  {
    n: "01",
    effort: "Week 1",
    title: "Skeleton",
    body: "Stand up the lakehouse, seed telemetry and reference data, and get one path - bronze to silver to gold - running end to end before anything else.",
  },
  {
    n: "02",
    effort: "Week 2",
    title: "Quality & Monitoring",
    body: "Add the quality gate: dbt tests, Great Expectations suites, quarantine tables, freshness checks, and failure alerts. This is where the pipeline stops trusting its own input.",
  },
  {
    n: "03",
    effort: "Week 3",
    title: "Governance and Personas",
    body: "Tag sensitive columns, document lineage, and build out the three gold marts so each one is dashboard-ready on its own.",
  },
  {
    n: "04",
    effort: "Week 4",
    title: "Handover",
    body: "Add the DuckDB fallback, write the runbooks, capture the dashboards, and make the repo something a stranger can understand in five minutes.",
  },
];

const stack = [
  ["Databricks Free Edition", "Lakehouse + Unity Catalog"],
  ["dbt (databricks + duckdb)", "Warehouse-agnostic transforms"],
  ["Great Expectations", "Silver-layer quality suite"],
  ["Databricks Workflows", "Orchestration + alerts"],
  ["Power BI Desktop", "Three persona dashboards"],
  ["GitHub Actions", "CI: dbt build + tests on every push"],
];

export default function ScrollVideoSite() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isVideoReadyRef = useRef(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    video.pause();

    const loadingTimer = window.setTimeout(() => {
      if (!isVideoReadyRef.current) {
        setShowLoading(true);
      }
    }, 700);

    let tween: gsap.core.Tween | null = null;

    const setup = () => {
      if (!video.duration || !Number.isFinite(video.duration)) return;

      isVideoReadyRef.current = true;
      setIsVideoReady(true);
      setShowLoading(false);

      tween?.kill();
      tween = gsap.to(video, {
        currentTime: video.duration,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.4,
        },
      });
    };

    if (video.readyState >= 1 && video.duration) {
      setup();
    } else {
      video.addEventListener("loadedmetadata", setup, { once: true });
    }

    return () => {
      window.clearTimeout(loadingTimer);
      video.removeEventListener("loadedmetadata", setup);
      tween?.scrollTrigger?.kill();
      tween?.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <video
        ref={videoRef}
        className="fixed inset-0 h-full w-full object-cover"
        style={{ filter: "blur(8px)", transform: "scale(1.06)", zIndex: 0 }}
        muted
        playsInline
        preload="auto"
      >
        <source src={bgVideo} type="video/mp4" />
      </video>

      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background:
            "linear-gradient(180deg, oklch(0.14 0.015 60 / 0.55) 0%, oklch(0.14 0.015 60 / 0.75) 100%)",
        }}
      />
      <div className="fixed inset-0 pointer-events-none grid-lines" style={{ zIndex: 1 }} />

      {showLoading && !isVideoReady && (
        <div
          className="fixed inset-0 z-20 flex items-center justify-center bg-background/70 backdrop-blur-sm"
          aria-live="polite"
          aria-label="Loading background video"
        >
          <div className="flex flex-col items-center gap-4 rounded-lg border border-border bg-card/80 px-6 py-5 shadow-2xl shadow-black/30">
            <div className="h-10 w-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
              Loading atmosphere
            </div>
          </div>
        </div>
      )}

      <div className="relative" style={{ zIndex: 2 }}>
        <header className="fixed top-0 inset-x-0 z-30 px-8 py-5 flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em]">
          <div className="flex items-center gap-2 text-primary">
            <PipelineMark />
          </div>
          <div className="hidden md:flex items-center gap-6 text-muted-foreground">
            <a href="#overview" className="hover:text-foreground transition-colors">
              Overview
            </a>
            <a href="#medallion" className="hover:text-foreground transition-colors">
              Pipeline
            </a>
            <a href="#marts" className="hover:text-foreground transition-colors">
              Marts
            </a>
            <a href="#sprints" className="hover:text-foreground transition-colors">
              Sprints
            </a>
          </div>
        </header>

        <section className="relative min-h-screen flex flex-col justify-center px-8 py-16">
          <div className="mx-auto max-w-4xl text-center">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-6">
              Pipeline data platform
            </p>
            <h1 className="mx-auto max-w-3xl text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-balance leading-[0.95]">
              Crude<span className="text-primary">Flow</span>.
              <br />
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed text-balance">
              A lakehouse for a pipeline. Raw, simulated sensor noise data, refined into three
              things a real operator needs: what is flowing, what it is worth, and what has to be
              filed.
            </p>
            <a
              href="https://github.com/Not-Nimna/CrudeFlow"
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/15 px-5 py-3 font-mono text-xs uppercase tracking-[0.24em] text-primary shadow-lg shadow-black/20 transition-all hover:border-primary/70 hover:bg-primary/20 hover:-translate-y-0.5"
            >
              <GitBranch size={16} />
              GitHub repository
            </a>
          </div>
          <div className="absolute bottom-16 left-8 right-8 flex items-end justify-between font-mono text-xs uppercase tracking-widest text-muted-foreground">
            <div>Scroll to trace the data</div>
            <div className="hidden md:block">v1.0</div>
          </div>
        </section>

        <section id="overview" className="min-h-screen px-8 py-32 flex items-center">
          <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-8">
            <div className="md:col-span-4">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4">
                01 / The premise
              </p>
              <h2 className="text-3xl md:text-5xl font-bold leading-tight text-balance">
                Bad data does not ask permission.
              </h2>
            </div>
            <div className="md:col-span-8 space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                Pipeline telemetry is noisy, high-volume, and unforgiving - a bad sensor reading
                that slips through is not a cosmetic bug, it is a wrong number on a regulatory
                filing. CrudeFlow is a medallion lakehouse built to take that seriously: raw events
                land immutable, get validated and quarantined if they fail, and only clean data
                reaches the people making decisions.
              </p>
              <p>
                Sources: telemetry, segments, batches, incidents. Bronze holds the raw record.
                Silver enforces the truth. Gold speaks three languages.
              </p>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                {[
                  ["04", "Sprints"],
                  ["03", "Gold marts"],
                  ["$0", "Stack cost"],
                ].map(([value, label]) => (
                  <div key={label}>
                    <div className="text-3xl md:text-4xl font-bold text-primary font-mono">
                      {value}
                    </div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="medallion" className="min-h-screen px-8 py-32">
          <div className="max-w-6xl mx-auto">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4">
              02 / The medallion
            </p>
            <h2 className="text-3xl md:text-5xl font-bold mb-16 text-balance">
              Raw batches enter cold.
              <br />
              <span className="text-muted-foreground">Clean numbers leave defensible.</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  layer: "Bronze",
                  color: "var(--bronze)",
                  desc: "The unedited record. Every event lands with load_ts and source_file attached, nothing overwritten, nothing lost. If a downstream number is ever questioned, this is where you go to answer for it.",
                  items: ["telemetry.json", "segments.csv", "batches.csv", "incidents.csv"],
                },
                {
                  layer: "Silver",
                  color: "var(--silver)",
                  desc: "Typed, deduplicated on natural keys, joined against reference data - and gated. This is the layer that decides what is allowed to be true.",
                  items: [
                    "not-null keys",
                    "0 <= pressure <= max",
                    "valve_status enum",
                    "referential integrity",
                  ],
                },
                {
                  layer: "Gold",
                  color: "var(--gold)",
                  desc: "Three marts, one per audience, shaped so each dashboard reads directly off the table with zero cleanup downstream.",
                  items: [
                    "mart_operations",
                    "mart_financial",
                    "mart_regulatory",
                    "+ data-quality tile",
                  ],
                },
              ].map((layer) => (
                <div
                  key={layer.layer}
                  className="relative rounded-lg border border-border bg-card backdrop-blur-md p-6 overflow-hidden group hover:border-primary/50 transition-colors"
                >
                  <div
                    className="absolute top-0 left-0 h-1 w-full"
                    style={{ background: layer.color }}
                  />
                  <div className="flex items-baseline justify-between mb-4">
                    <h3 className="text-2xl font-bold" style={{ color: layer.color }}>
                      {layer.layer}
                    </h3>
                    <span className="font-mono text-xs text-muted-foreground">
                      layer/{layer.layer.toLowerCase()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">{layer.desc}</p>
                  <ul className="space-y-1.5 font-mono text-xs">
                    {layer.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-foreground/80">
                        <span className="text-primary">/</span>
                        {item}
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
                Bad data is injected on purpose - nulls, pressure spikes past max rating, orphaned
                batch IDs - and caught at silver by dbt tests and Great Expectations.{" "}
                <span className="text-foreground">
                  Failing rows route to{" "}
                  <code className="font-mono text-primary">silver_quarantine</code>. Critical
                  failures block promotion to gold and fail the run loudly, not silently.
                </span>
              </p>
            </div>
          </div>
        </section>

        <section id="marts" className="min-h-screen px-8 py-32">
          <div className="max-w-6xl mx-auto">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4">
              03 / Three personas
            </p>
            <h2 className="text-3xl md:text-5xl font-bold mb-16 text-balance">
              One lakehouse.
              <br />
              <span className="text-muted-foreground">
                Three people who never talk to each other.
              </span>
            </h2>
            <div className="space-y-4">
              {marts.map((mart, index) => (
                <div
                  key={mart.tag}
                  className="group grid md:grid-cols-12 gap-6 items-start p-6 md:p-8 rounded-lg border border-border bg-card/60 backdrop-blur-md hover:bg-card/80 transition-colors"
                >
                  <div className="md:col-span-1 font-mono text-sm text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="md:col-span-4">
                    <div
                      className="font-mono text-xs uppercase tracking-widest mb-2"
                      style={{ color: `var(--${mart.tone})` }}
                    >
                      {mart.tag}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold">{mart.title}</h3>
                  </div>
                  <p className="md:col-span-7 text-muted-foreground leading-relaxed">{mart.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="sprints" className="min-h-screen px-8 py-32">
          <div className="max-w-6xl mx-auto">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4">
              04 / The four sprints
            </p>
            <h2 className="text-3xl md:text-5xl font-bold mb-16 text-balance">
              Built in the open,
              <br />
              <span className="text-muted-foreground">one sprint at a time.</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {sprints.map((sprint) => (
                <div
                  key={sprint.n}
                  className="p-8 rounded-lg border border-border bg-card/60 backdrop-blur-md relative overflow-hidden"
                >
                  <div className="flex items-baseline justify-between mb-4">
                    <span className="font-mono text-5xl font-bold text-primary/30">{sprint.n}</span>
                    <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                      {sprint.effort}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{sprint.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{sprint.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="min-h-screen px-8 py-32 flex items-center">
          <div className="max-w-6xl mx-auto w-full">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4">
              05 / The stack
            </p>
            <h2 className="text-3xl md:text-5xl font-bold mb-16 text-balance">
              Free tier.
              <br />
              <span className="text-muted-foreground">Warehouse-agnostic. No excuses.</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-2">
              {stack.map(([tool, role], index) => (
                <div
                  key={tool}
                  className="flex items-baseline justify-between gap-6 py-4 border-b border-border"
                >
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-xs text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-lg font-semibold">{tool}</span>
                  </div>
                  <span className="text-sm text-muted-foreground text-right">{role}</span>
                </div>
              ))}
            </div>
            <p className="mt-12 max-w-2xl text-muted-foreground leading-relaxed">
              <span className="text-foreground">Key design choice:</span> the dbt models run
              unchanged on Databricks or DuckDB - swap the profile, not the code. Free Edition quota
              stops being a single point of failure, and it is a better interview answer than "I
              paid for a bigger warehouse."
            </p>
          </div>
        </section>

        <footer className="px-8 py-16 border-t border-border">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
            <div>
              <div className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-primary">
                <PipelineMark />
                Pipeline platform
              </div>
              <p className="text-2xl md:text-3xl font-bold max-w-md text-balance">
                A finished batch pipeline beats a half-built streaming one.
              </p>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">
                Every layer here exists because a bad number somewhere down the line has a real
                cost: operational, financial, or regulatory. That is the whole design brief.
              </p>
            </div>
            <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              <div>Take a look at the code.</div>
              <a
                href="https://github.com/Not-Nimna/CrudeFlow"
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-sm tracking-[0.22em] text-primary shadow-[0_0_0_1px_rgba(0,0,0,0.15)] transition-all hover:border-primary/70 hover:bg-primary/15 hover:translate-y-[-1px]"
              >
                <GitBranch size={14} />
                GitHub repository
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
