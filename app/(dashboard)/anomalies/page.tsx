"use client";

import { AlertTriangle, Bell, Loader2, RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";

import { AnomalyAlertRow } from "@/components/anomaly-alert-row";
import { ANOMALY_ALERTS, type AnomalyAlert } from "@/lib/anomalies-data";

export default function AnomaliesPage() {
  const [running, setRunning] = useState(false);
  const [alerts, setAlerts] = useState<AnomalyAlert[]>(ANOMALY_ALERTS);

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

  const dismiss = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
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
          <h2 className="text-xl font-semibold text-white">Anomaly Detection</h2>
          <p className="mt-1 text-sm text-slate-400">
            Automatic alerts on service drops, zero service days, and frequency anomalies.
          </p>
        </div>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 shadow-xl shadow-black/20">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500" aria-hidden />
              <h3 className="text-lg font-semibold text-white">Anomaly Alerts</h3>
            </div>
            <span className="rounded-md bg-slate-800/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 ring-1 ring-inset ring-slate-700">
              Last 7 days
            </span>
          </div>

          {alerts.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-700 bg-slate-950/40 py-12 text-center text-sm text-slate-500">
              No active anomalies in this window. Run Full Analysis to refresh.
            </p>
          ) : (
            <ul className="space-y-3">
              {alerts.map((alert) => (
                <li key={alert.id}>
                  <AnomalyAlertRow
                    level={alert.level}
                    title={alert.title}
                    description={alert.description}
                    onDismiss={() => dismiss(alert.id)}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
