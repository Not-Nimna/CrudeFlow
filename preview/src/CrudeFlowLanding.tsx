import { useEffect, useRef } from "react";
import { CheckCircle2, Droplets, ShieldCheck, BarChart3, Database, Workflow, GitBranch, Play } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CrudeFlowLanding = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Ensure video metadata is loaded so GSAP knows the duration
    const setupScroll = () => {
      gsap.to(video, {
        currentTime: video.duration || 10,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1, // Smoothness of the scrub
        },
      });
    };

    if (video.readyState >= 2) {
      setupScroll();
    } else {
      video.addEventListener("loadedmetadata", setupScroll);
    }

    return () => {
      video.removeEventListener("loadedmetadata", setupScroll);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="bg-slate-950 text-slate-100 font-sans">
      {/* Background Video Layer */}
      <video
        ref={videoRef}
        className="fixed inset-0 w-full h-full object-cover opacity-40 pointer-events-none"
        muted
        playsInline
        preload="auto"
      >
        <source src="/pipeline-bg-scrub.mp4" type="video/mp4" />
      </video>

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-4">
        <div className="z-10 bg-slate-950/50 p-8 rounded-xl backdrop-blur-sm border border-slate-800">
          <div className="flex items-center justify-center mb-4 text-orange-500">
            <Droplets size={48} />
          </div>
          <h1 className="text-6xl font-extrabold tracking-tighter mb-4 bg-gradient-to-r from-orange-400 to-yellow-200 bg-clip-text text-transparent">
            CRUDEFLOW
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            A regulatory-grade pipeline data platform engineered for
            high-integrity midstream reporting.
          </p>
          <div className="mt-8 flex gap-4 justify-center">
            <a href="#sprints" className="bg-orange-600 hover:bg-orange-700 px-6 py-3 rounded-lg font-bold transition">
              View Build Plan
            </a>
            <button className="flex items-center gap-2 border border-slate-700 bg-slate-900/80 px-6 py-3 rounded-lg hover:bg-slate-800 transition">
              <GitBranch size={20} /> GitHub Repo
            </button>
          </div>
        </div>
        <div className="absolute bottom-10 animate-bounce">
          <p className="text-sm uppercase tracking-widest text-slate-500">Scroll to Explore</p>
        </div>
      </section>

      {/* The "Medallion" Mapping Section */}
      <section className="relative min-h-screen py-24 px-8 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 border-l-4 border-orange-500 pl-4">The Requirement-to-Proof Mapping</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { req: "Build & maintain data pipelines", proof: "Bronze → Silver → Gold, orchestrated end to end" },
            { req: "Data validation & quality", proof: "Quality gate that quarantines bad rows" },
            { req: "Regulatory reporting", proof: "Gold marts shaped for CER filings" },
            { req: "Governance concepts", proof: "Unity Catalog lineage + classification" },
          ].map((item, i) => (
            <div key={i} className="bg-slate-900/60 p-6 rounded-lg border border-slate-800 backdrop-blur-md">
              <p className="text-orange-400 text-sm font-mono mb-2 uppercase tracking-tighter italic">Job Description Requirement</p>
              <h3 className="text-xl font-bold mb-3">{item.req}</h3>
              <p className="text-slate-400 text-sm italic">Project Implementation:</p>
              <p className="text-emerald-400 font-medium">✓ {item.proof}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Scroll-Scrubbed Sprint Journey */}
      <div ref={containerRef} className="relative">
        {/* Sprint 1 */}
        <section className="h-[150vh] relative px-8">
          <div className="sticky top-1/4 max-w-lg bg-slate-950/80 p-8 rounded-2xl border border-slate-700 shadow-2xl backdrop-blur-xl">
            <span className="text-orange-500 font-mono font-bold uppercase tracking-widest">Sprint 01</span>
            <h2 className="text-4xl font-bold mt-2 mb-4 italic underline decoration-orange-500">The Skeleton</h2>
            <p className="text-slate-300 mb-6">Building the end-to-end spine using Databricks Free Edition and dbt-databricks.</p>
            <ul className="space-y-3">
              <li className="flex gap-3 text-sm items-center"><Database size={16} className="text-orange-400"/> Ingesting telemetry & reference data</li>
              <li className="flex gap-3 text-sm items-center"><Workflow size={16} className="text-orange-400"/> First Gold-layer throughput mart</li>
              <li className="flex gap-3 text-sm items-center"><BarChart3 size={16} className="text-orange-400"/> Power BI connection established</li>
            </ul>
          </div>
        </section>

        {/* Sprint 2 */}
        <section className="h-[150vh] relative px-8 flex justify-end">
          <div className="sticky top-1/4 max-w-lg bg-slate-950/80 p-8 rounded-2xl border border-slate-700 shadow-2xl backdrop-blur-xl text-right">
            <span className="text-orange-500 font-mono font-bold uppercase tracking-widest">Sprint 02</span>
            <h2 className="text-4xl font-bold mt-2 mb-4 italic underline decoration-orange-500">Quality & Monitoring</h2>
            <p className="text-slate-300 mb-6">Turning scripts into a production pipeline with automated "circuit breakers".</p>
            <ul className="space-y-3">
              <li className="flex gap-3 text-sm items-center justify-end">Great Expectations data validation <ShieldCheck size={16} className="text-orange-400"/></li>
              <li className="flex gap-3 text-sm items-center justify-end">Automated quarantine for bad rows <ShieldCheck size={16} className="text-orange-400"/></li>
              <li className="flex gap-3 text-sm items-center justify-end">Failure alerts & freshness checks <ShieldCheck size={16} className="text-orange-400"/></li>
            </ul>
          </div>
        </section>

        {/* Sprint 3 */}
        <section className="h-[150vh] relative px-8">
          <div className="sticky top-1/4 max-w-lg bg-slate-950/80 p-8 rounded-2xl border border-slate-700 shadow-2xl backdrop-blur-xl">
            <span className="text-orange-500 font-mono font-bold uppercase tracking-widest">Sprint 03</span>
            <h2 className="text-4xl font-bold mt-2 mb-4 italic underline decoration-orange-500">Governance & Personas</h2>
            <p className="text-slate-300 mb-6">Tailoring data for Operations, Finance, and Regulatory auditors.</p>
            <ul className="space-y-3">
              <li className="flex gap-3 text-sm items-center font-bold text-emerald-400"><CheckCircle2 size={16}/> Pressure-drop anomaly detection</li>
              <li className="flex gap-3 text-sm items-center font-bold text-emerald-400"><CheckCircle2 size={16}/> Unity Catalog data lineage</li>
              <li className="flex gap-3 text-sm items-center font-bold text-emerald-400"><CheckCircle2 size={16}/> Confidential column tagging</li>
            </ul>
          </div>
        </section>

        {/* Sprint 4 */}
        <section className="h-[150vh] relative px-8 flex justify-end">
          <div className="sticky top-1/4 max-w-lg bg-slate-950/80 p-8 rounded-2xl border border-slate-700 shadow-2xl backdrop-blur-xl text-right">
            <span className="text-orange-500 font-mono font-bold uppercase tracking-widest">Sprint 04</span>
            <h2 className="text-4xl font-bold mt-2 mb-4 italic underline decoration-orange-500">The Handover</h2>
            <p className="text-slate-300 mb-6">Proving portability and documenting for the engineering team.</p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-slate-900 p-4 rounded border border-slate-800">
                <p className="text-xs text-slate-500 uppercase">Portability</p>
                <p className="text-sm font-bold">DuckDB Fallback</p>
              </div>
              <div className="bg-slate-900 p-4 rounded border border-slate-800">
                <p className="text-xs text-slate-500 uppercase">Docs</p>
                <p className="text-sm font-bold">Data Dictionary</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Call to Action Section */}
      <section className="relative py-32 text-center bg-slate-950 px-4">
        <h2 className="text-5xl font-bold mb-8 italic">Ready for Audit.</h2>
        <p className="text-slate-400 max-w-xl mx-auto mb-12 text-lg">
          Explore the full architecture, view the dashboards, and browse the source code on GitHub.
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          <button className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 px-8 py-4 rounded-full font-bold transition transform hover:scale-105">
            <Play size={20} /> Watch Loom Demo
          </button>
          <button className="flex items-center gap-3 bg-slate-800 hover:bg-slate-700 px-8 py-4 rounded-full font-bold transition transform hover:scale-105 border border-slate-600">
            <BarChart3 size={20} /> Open Power BI Mart
          </button>
        </div>
        <footer className="mt-32 text-slate-600 text-sm font-mono tracking-tighter">
          &copy; 2024 CRUDEFLOW // BUILT FOR REGULATORY COMPLIANCE
        </footer>
      </section>
    </div>
  );
};

export default CrudeFlowLanding;
