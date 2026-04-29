"use client";

import { KpiRing } from "@/components/kpi-ring";
import {
  Clock,
  Footprints,
  Loader2,
  MapPin,
  Network,
  RefreshCw,
  Sparkles,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

const KPIS = [
  { key: "geo", label: "Geographic Coverage", value: 67, trend: "up" as const, tone: "warning" as const, icon: MapPin },
  { key: "freq", label: "Service Frequency", value: 43, trend: "down" as const, tone: "destructive" as const, icon: Clock },
  { key: "conn", label: "Connectivity", value: 71, trend: "stable" as const, tone: "success" as const, icon: Network },
  { key: "need", label: "Population Need Index", value: 58, trend: "up" as const, tone: "warning" as const, icon: Users },
  { key: "fmile", label: "First/Last Mile", value: 39, trend: "down" as const, tone: "destructive" as const, icon: Footprints },
];

const INSIGHTS = [
  {
    id: 1,
    priority: "High" as const,
    title: "Sedgwick County Alert",
    body: "12,400 seniors live >3km from nearest stop. Route 14 extension recommended.",
    population: 12400,
  },
  {
    id: 2,
    priority: "High" as const,
    title: "Johnson County",
    body: "Zero service detected on weekends for Routes 7, 12, 19. Affects 8,200 residents.",
    population: 8200,
  },
  {
    id: 3,
    priority: "Medium" as const,
    title: "Riley County",
    body: "Service frequency dropped 60% vs monthly average. Anomaly detected Tuesday–Thursday.",
    population: 3400,
  },
];

type Layer = "stops" | "gaps" | "demographics" | "energy";

export default function OverviewPage() {
  const [running, setRunning] = useState(false);
  const [layers, setLayers] = useState<Record<Layer, boolean>>({
    stops: true,
    gaps: true,
    demographics: false,
    energy: false,
  });
  const [regen, setRegen] = useState(false);

  const lastUpdated = useMemo(() => {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date());
  }, []);

  const runAnalysis = () => {
    setRunning(true);
    window.setTimeout(() => setRunning(false), 2000);
  };

  const regenerate = () => {
    setRegen(true);
    window.setTimeout(() => setRegen(false), 1500);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-slate-800 bg-slate-950/80 px-6 py-4 backdrop-blur">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-semibold text-white sm:text-xl">
                Kansas Transit Intelligence Platform
              </h1>
              <span className="rounded-md bg-blue-600/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-300">
                POC V1.0
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">Last updated {lastUpdated}</p>
          </div>
          <button
            type="button"
            onClick={runAnalysis}
            disabled={running}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue-900/40 hover:bg-blue-500 disabled:opacity-70"
          >
            {running ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Run Full Analysis
          </button>
        </div>
      </header>

      <main className="flex-1 space-y-6 p-6">
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {KPIS.map((k) => (
            <KpiRing
              key={k.key}
              label={k.label}
              value={k.value}
              tone={k.tone}
              trend={k.trend}
              icon={k.icon}
            />
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40">
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 p-3">
              {(["stops", "gaps", "demographics", "energy"] as Layer[]).map((layer) => (
                <button
                  key={layer}
                  type="button"
                  onClick={() => setLayers((prev) => ({ ...prev, [layer]: !prev[layer] }))}
                  className={
                    "rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors " +
                    (layers[layer]
                      ? "bg-blue-600 text-white"
                      : "border border-slate-700 bg-slate-800/80 text-slate-400 hover:text-white")
                  }
                >
                  {layer}
                </button>
              ))}
            </div>
            <div className="relative h-[min(420px,55vh)] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
              <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_2px_2px,#334155_1px,transparent_0)] [background-size:24px_24px]" />
              {layers.gaps && (
                <>
                  <div
                    className="absolute rounded-full border-2 border-red-500/50 bg-red-500/25"
                    style={{ left: "18%", top: "38%", width: "22%", height: "35%" }}
                  />
                  <div
                    className="absolute rounded-full border-2 border-amber-500/50 bg-amber-500/20"
                    style={{ left: "48%", top: "22%", width: "18%", height: "28%" }}
                  />
                  <div
                    className="absolute rounded-full border-2 border-emerald-500/50 bg-emerald-500/15"
                    style={{ left: "62%", top: "48%", width: "16%", height: "22%" }}
                  />
                </>
              )}
              {layers.stops &&
                [
                  { l: "32%", t: "44%" },
                  { l: "55%", t: "36%" },
                  { l: "72%", t: "52%" },
                ].map((p, i) => (
                  <div
                    key={i}
                    className="absolute h-3 w-3 rounded-full border-2 border-sky-300 bg-sky-400 shadow-lg shadow-sky-900/50"
                    style={{ left: p.l, top: p.t }}
                  />
                ))}
              {layers.demographics && (
                <div
                  className="absolute rounded-full border border-dashed border-purple-400/50 bg-purple-500/10"
                  style={{ left: "25%", top: "28%", width: "45%", height: "50%" }}
                />
              )}
              {layers.energy && (
                <div
                  className="absolute rounded-full border border-cyan-400/40 bg-cyan-500/15"
                  style={{ left: "40%", top: "40%", width: "35%", height: "40%" }}
                />
              )}
              <p className="absolute bottom-3 left-3 rounded bg-black/50 px-2 py-1 text-[10px] text-slate-400">
                Kansas — demo layers (Leaflet map can replace this panel)
              </p>
            </div>
          </div>

          <div className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">AI-Powered Insights</h2>
                <p className="text-[9px] font-medium uppercase tracking-widest text-slate-500">
                  Updated by Claude
                </p>
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-2">
              {INSIGHTS.map((ins) => {
                const high = ins.priority === "High";
                return (
                  <div
                    key={ins.id}
                    className={
                      "rounded-lg border p-3 " +
                      (high
                        ? "border-l-4 border-l-red-500 border-slate-700/80 bg-slate-800/40"
                        : "border-l-4 border-l-amber-500 border-slate-700/80 bg-slate-800/40")
                    }
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-white">{ins.title}</span>
                      <span
                        className={
                          "shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase " +
                          (high ? "bg-red-500/20 text-red-300" : "bg-amber-500/20 text-amber-300")
                        }
                      >
                        {ins.priority}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-slate-400">{ins.body}</p>
                    <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-300">
                      <Users className="h-3 w-3" />
                      <span className="font-medium tabular-nums">{ins.population.toLocaleString()}</span>
                      <span className="text-slate-500">affected</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              type="button"
              onClick={regenerate}
              disabled={regen}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800/60 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 disabled:opacity-60"
            >
              {regen ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
              {regen ? "Regenerating…" : "Regenerate Insights"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
