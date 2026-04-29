"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

import { DetailedGapsTable } from "@/components/detailed-gaps-table";
import { DETAILED_GAPS } from "@/lib/gap-analysis-data";

const GapsMap = dynamic(() => import("@/components/gaps-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[min(420px,52vh)] w-full items-center justify-center rounded-b-lg bg-slate-900 text-sm text-slate-500">
      Loading map…
    </div>
  ),
});

export default function GapAnalysisPage() {
  const lastUpdated = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date()),
    []
  );

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-slate-800 bg-slate-950/80 px-6 py-4 backdrop-blur">
        <h1 className="text-lg font-semibold text-white sm:text-xl">
          Kansas Transit Intelligence Platform
        </h1>
        <p className="mt-1 text-xs text-slate-500">Last updated {lastUpdated}</p>
      </header>
      <main className="flex-1 space-y-6 p-6">
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40">
          <div className="border-b border-slate-800 px-4 py-2.5">
            <p className="text-xs font-medium text-slate-400">Spatial gap overlays &amp; transit stops</p>
          </div>
          <GapsMap />
        </div>
        <DetailedGapsTable rows={DETAILED_GAPS} />
      </main>
    </div>
  );
}
