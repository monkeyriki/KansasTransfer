"use client";

import { Bell, Loader2, RefreshCw, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

import { InsightCard } from "@/components/insight-card";
import { AI_INSIGHTS, type AiInsight } from "@/lib/ai-insights-data";

export default function AiInsightsPage() {
  const [running, setRunning] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [insights, setInsights] = useState<AiInsight[]>(AI_INSIGHTS);

  const lastUpdated = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date()),
    []
  );

  const runAnalysis = () => {
    setRunning(true);
    window.setTimeout(() => setRunning(false), 1800);
  };

  const regenerate = () => {
    setRegenerating(true);
    window.setTimeout(() => {
      setInsights((prev) => {
        const next = [...prev];
        next.sort(() => Math.random() - 0.5);
        return next;
      });
      setRegenerating(false);
    }, 1400);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 bg-slate-950/80 px-6 py-4 backdrop-blur">
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
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={runAnalysis}
            disabled={running || regenerating}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue-900/30 hover:bg-blue-500 disabled:opacity-70"
          >
            {running ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Run Full Analysis
          </button>
          <button
            type="button"
            className="relative inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800"
          >
            <Bell className="h-4 w-4" />
            Alerts
            <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
              3
            </span>
          </button>
        </div>
      </header>

      <main className="flex-1 space-y-6 p-6">
        <div>
          <h2 className="text-xl font-semibold text-white">AI Insights</h2>
          <p className="mt-1 text-sm text-slate-400">
            Claude generated recommendations from latest pipeline run.
          </p>
        </div>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 shadow-xl shadow-black/20">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <Sparkles className="h-5 w-5 text-blue-400" aria-hidden />
              <h3 className="text-lg font-semibold text-white">AI-Powered Insights</h3>
            </div>
            <span className="rounded-md bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-400 ring-1 ring-inset ring-emerald-500/25">
              Updated by Claude
            </span>
          </div>

          <ul className="space-y-4">
            {insights.map((insight) => (
              <li key={insight.id}>
                <InsightCard
                  title={insight.title}
                  severity={insight.severity}
                  description={insight.description}
                  affectedCount={insight.affectedCount}
                />
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={regenerate}
            disabled={regenerating || running}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/60 py-3.5 text-sm font-medium text-slate-200 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {regenerating ? (
              <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
            ) : (
              <Sparkles className="h-4 w-4 text-blue-400" />
            )}
            Regenerate Insights
          </button>
        </section>
      </main>
    </div>
  );
}
