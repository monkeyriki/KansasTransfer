"use client";

import { Download } from "lucide-react";
import { useCallback } from "react";

import type { DetailedGapRow } from "@/lib/gap-analysis-data";

function badgeClasses(severity: DetailedGapRow["severity"]) {
  if (severity === "Critical") {
    return "bg-red-600 text-white shadow-sm shadow-red-900/40";
  }
  return "bg-amber-500 text-slate-950 shadow-sm shadow-amber-900/30";
}

function formatPop(n: number) {
  return n.toLocaleString("de-DE");
}

export function DetailedGapsTable({ rows }: { rows: DetailedGapRow[] }) {
  const csv = useCallback(() => {
    const header = "County,Severity,Population,Distance km,Need score\n";
    const body = rows
      .map(
        (r) =>
          `"${r.county}","${r.severity}",${r.population},${r.distanceKm},${r.needScore}`
      )
      .join("\n");
    const blob = new Blob([header + body], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kansas-gaps-detailed-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [rows]);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40">
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
        <h2 className="text-sm font-semibold text-white">
          Detailed Gaps ({rows.length})
        </h2>
        <button
          type="button"
          onClick={csv}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800"
        >
          <Download className="h-3.5 w-3.5" />
          Export CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-4 py-3">County</th>
              <th className="px-4 py-3">Severity</th>
              <th className="px-4 py-3 tabular-nums">Population</th>
              <th className="px-4 py-3 tabular-nums">Distance (km)</th>
              <th className="px-4 py-3 tabular-nums">Need score</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={`${row.county}-${row.needScore}-${index}`}
                className="border-t border-slate-800/80 hover:bg-slate-800/30"
              >
                <td className="px-4 py-3 font-medium text-slate-200">{row.county}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      "inline-block rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide " +
                      badgeClasses(row.severity)
                    }
                  >
                    {row.severity}
                  </span>
                </td>
                <td className="px-4 py-3 tabular-nums text-slate-300">
                  {formatPop(row.population)}
                </td>
                <td className="px-4 py-3 tabular-nums text-slate-300">
                  {row.distanceKm.toFixed(1)}
                </td>
                <td className="px-4 py-3 tabular-nums text-slate-300">{row.needScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
