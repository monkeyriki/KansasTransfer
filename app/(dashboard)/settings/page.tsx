"use client";

import { Bell, Loader2, RefreshCw, Settings as SettingsIcon } from "lucide-react";
import { useMemo, useState } from "react";

const dataSources = [
  { label: "GTFS Feeds", value: "Connected · 12 agencies" },
  { label: "Census ACS API", value: "Connected" },
  { label: "FASTSim Engine", value: "v3.0.2" },
  { label: "Anthropic Claude", value: "claude sonnet 4" },
] as const;

export default function SettingsPage() {
  const [running, setRunning] = useState(false);

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
            disabled={running}
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
        <div className="flex flex-wrap items-center gap-2">
          <SettingsIcon className="h-6 w-6 text-slate-500" aria-hidden />
          <h2 className="text-xl font-semibold text-white">Settings</h2>
        </div>

        <section className="max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/40 p-5 shadow-xl shadow-black/20">
          <h3 className="text-base font-semibold text-white">Data Sources</h3>
          <ul className="mt-4 divide-y divide-slate-800/80">
            {dataSources.map((row) => (
              <li
                key={row.label}
                className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0"
              >
                <span className="text-sm text-slate-300">{row.label}</span>
                <span className="text-sm font-medium text-emerald-400">{row.value}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
