"use client";

import { Bell, Loader2, RefreshCw, Zap } from "lucide-react";
import { useMemo, useState } from "react";

import { ROUTE_ENERGY, barColorKwh, totalDailyKwh, type RouteEnergy } from "@/lib/energy-data";

const BAR_CHART_PX = 180;

type Fleet = "electric" | "diesel" | "hybrid";

function scaleRows(rows: RouteEnergy[], fleet: Fleet): RouteEnergy[] {
  const m = fleet === "diesel" ? 1.0 : fleet === "hybrid" ? 0.92 : 1.0;
  const kwhScale = fleet === "diesel" ? 1.45 : fleet === "hybrid" ? 0.88 : 1.0;
  return rows.map((r) => ({
    ...r,
    dailyKwh: Math.round(r.dailyKwh * kwhScale * m),
    kmPerKwh: Number(
      (fleet === "diesel"
        ? r.kmPerKwh * 0.35
        : fleet === "hybrid"
          ? r.kmPerKwh * 0.72
          : r.kmPerKwh
      ).toFixed(2)
    ),
  }));
}

const barTailwind: Record<"green" | "yellow" | "red", string> = {
  green: "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.35)]",
  yellow: "bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.3)]",
  red: "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.35)]",
};

const scatterDot: Record<"green" | "yellow" | "red", string> = {
  green: "bg-emerald-400 ring-emerald-600/50",
  yellow: "bg-amber-400 ring-amber-600/50",
  red: "bg-red-500 ring-red-700/50",
};

export default function EnergyPage() {
  const [fleet, setFleet] = useState<Fleet>("electric");
  const [running, setRunning] = useState(false);

  const lastUpdated = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date()),
    []
  );

  const rows = useMemo(() => scaleRows(ROUTE_ENERGY, fleet), [fleet]);

  const totals = useMemo(() => {
    const total = totalDailyKwh(rows);
    let min = rows[0];
    let max = rows[0];
    for (const r of rows) {
      if (r.dailyKwh < min.dailyKwh) min = r;
      if (r.dailyKwh > max.dailyKwh) max = r;
    }
    const co2TonnesPerDay =
      fleet === "electric" ? 2.4 : fleet === "hybrid" ? 1.1 : undefined;
    return { total, min, max, co2TonnesPerDay };
  }, [rows, fleet]);

  const maxBar = useMemo(
    () => Math.max(...rows.map((r) => r.dailyKwh), 1),
    [rows]
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
        <div>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-white">Route Energy Analysis</h2>
              <p className="mt-1 text-xs text-slate-500">
                FASTSim integration · National Renewable Energy Laboratory (demo)
              </p>
            </div>
            <div className="flex flex-wrap gap-1 rounded-lg border border-slate-700 bg-slate-900/60 p-1">
              {(["electric", "diesel", "hybrid"] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFleet(key)}
                  className={
                    "rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors " +
                    (fleet === key
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white")
                  }
                >
                  {key === "electric" ? "Electric bus" : key === "diesel" ? "Diesel bus" : "Hybrid bus"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
              Total fleet daily
            </p>
            <p className="mt-2 flex items-baseline gap-1 text-2xl font-bold tabular-nums text-white">
              {totals.total}
              <span className="text-sm font-normal text-slate-500">kWh</span>
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
              Most efficient
            </p>
            <p className="mt-2 text-xl font-bold text-emerald-400">
              {totals.min.route}{" "}
              <span className="text-base font-normal text-slate-400">({totals.min.dailyKwh} kWh)</span>
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
              Highest consumption
            </p>
            <p className="mt-2 text-xl font-bold text-red-400">
              {totals.max.route}{" "}
              <span className="text-base font-normal text-slate-400">({totals.max.dailyKwh} kWh)</span>
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
              CO₂ saved vs diesel
            </p>
            <p className="mt-2 flex items-baseline gap-1 text-2xl font-bold tabular-nums text-white">
              {totals.co2TonnesPerDay != null ? String(totals.co2TonnesPerDay) : "—"}
              <span className="text-sm font-normal text-slate-500">
                {fleet !== "diesel" ? "t/day" : "(baseline)"}
              </span>
            </p>
          </div>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold text-white">Energy per route</h3>
              <p className="text-xs text-slate-500">Daily kWh by route (fleet selection updates the model)</p>
            </div>
            <div className="flex flex-wrap gap-3 text-[10px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-4 rounded-sm bg-emerald-500" /> &lt; 60 kWh
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-4 rounded-sm bg-amber-400" /> 60–90 kWh
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-4 rounded-sm bg-red-500" /> &gt; 90 kWh
              </span>
            </div>
          </div>
          <div className="flex h-[220px] items-end justify-between gap-1 border-b border-slate-700/80 px-2 pb-1 pt-2 sm:gap-2">
            {rows.map((r) => {
              const hue = barColorKwh(r.dailyKwh);
              const hPx = Math.max(8, (r.dailyKwh / maxBar) * BAR_CHART_PX);
              return (
                <div key={r.route} className="flex min-h-0 flex-1 flex-col items-center justify-end gap-2">
                  <div
                    className={"w-full max-w-[52px] rounded-t-sm transition-all " + barTailwind[hue]}
                    style={{ height: `${hPx}px` }}
                    title={`${r.name}: ${r.dailyKwh} kWh`}
                  />
                  <span className="text-[10px] font-medium text-slate-400">{r.route}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-2 flex justify-between border-t border-slate-800/80 pt-2 text-[10px] text-slate-600">
            <span>0</span>
            <span>35</span>
            <span>70</span>
            <span>105</span>
            <span>140</span>
          </div>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
          <h3 className="text-sm font-semibold text-white">Efficiency scatter — km/kWh</h3>
          <p className="text-xs text-slate-500">Higher km/kWh = more efficient (vs daily draw on x)</p>
          <div className="relative mt-4 h-52 w-full rounded-lg border border-slate-800/80 bg-slate-950/50">
            {/* grid lines */}
            <div className="absolute inset-4 grid grid-rows-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="border-b border-dashed border-slate-800/60" />
              ))}
            </div>
            <div className="absolute bottom-4 left-4 right-4 top-4">
              {rows.map((r) => {
                const xPct = (r.dailyKwh / 140) * 100;
                const yPct = 100 - (r.kmPerKwh / 2) * 100;
                const hue = barColorKwh(r.dailyKwh);
                return (
                  <div
                    key={r.route}
                    className={
                      "absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 " +
                      scatterDot[hue]
                    }
                    style={{
                      left: `${Math.min(100, Math.max(0, xPct))}%`,
                      top: `${Math.min(100, Math.max(0, yPct))}%`,
                    }}
                    title={`${r.route}: ${r.dailyKwh} kWh/d, ${r.kmPerKwh} km/kWh`}
                  />
                );
              })}
            </div>
            <div className="absolute bottom-0 left-4 right-4 flex justify-between text-[9px] text-slate-600">
              <span>0</span>
              <span>35</span>
              <span>70</span>
              <span>105</span>
              <span>140</span>
            </div>
            <div className="absolute bottom-4 left-0 top-4 flex flex-col justify-between text-[9px] text-slate-600">
              <span>1.8</span>
              <span>1.35</span>
              <span>0.9</span>
              <span>0.45</span>
              <span>0</span>
            </div>
          </div>
        </section>

        <p className="flex items-center gap-2 text-[10px] text-slate-600">
          <Zap className="h-3 w-3 shrink-0 text-amber-500/80" />
          Values are illustrative PoC outputs; production runs will bind to FASTSim + agency telematics.
        </p>
      </main>
    </div>
  );
}
