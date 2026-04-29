"use client";

import { useMemo, useState } from "react";

type Severity = "High" | "Medium" | "Low";

type Gap = {
  id: string;
  county: string;
  area: string;
  route: string;
  gapType: string;
  severity: Severity;
  population: number;
  energy: number;
  action: string;
};

const DATA: Gap[] = [
  { id: "1", county: "Sedgwick", area: "South Wichita", route: "12", gapType: "No weekend service", severity: "High", population: 12400, energy: 1.46, action: "Weekend feeder pilot" },
  { id: "2", county: "Shawnee", area: "North Topeka", route: "4", gapType: "Low off-peak", severity: "High", population: 9800, energy: 1.58, action: "Add off-peak trips" },
  { id: "3", county: "Wyandotte", area: "Argentine", route: "20", gapType: "Coverage gap", severity: "High", population: 11200, energy: 1.63, action: "New local corridor" },
  { id: "4", county: "Johnson", area: "Overland South", route: "3", gapType: "First/last mile", severity: "Medium", population: 6900, energy: 1.21, action: "Sidewalk gaps" },
  { id: "5", county: "Douglas", area: "Lawrence East", route: "9", gapType: "Evening service", severity: "Low", population: 4300, energy: 1.14, action: "Monitor demand" },
];

function sevBadge(s: Severity): string {
  if (s === "High") return "bg-red-500/15 text-red-700 dark:text-red-300";
  if (s === "Medium") return "bg-amber-500/15 text-amber-700 dark:text-amber-300";
  return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300";
}

const COUNTIES = ["All", "Sedgwick", "Shawnee", "Wyandotte", "Johnson", "Douglas"];

export default function Page() {
  const [county, setCounty] = useState("All");
  const [severity, setSeverity] = useState<"All" | Severity>("All");
  const [pick, setPick] = useState<string | null>(null);

  const rows = useMemo(() => {
    return DATA.filter((g) => {
      const c = county === "All" || g.county === county;
      const s = severity === "All" || g.severity === severity;
      return c && s;
    });
  }, [county, severity]);

  const kpis = useMemo(() => {
    const src = rows.length ? rows : DATA;
    const n = src.length || 1;
    const avgPop = Math.round(src.reduce((a, g) => a + g.population, 0) / n);
    const cov = Math.max(0, 72 - avgPop / 550);
    const freq = Math.min(92, 28 + avgPop / 400);
    return {
      coverage: Math.round(cov),
      frequency: Math.round(freq),
      equity: Math.min(92, Math.round(40 + avgPop / 500)),
      connect: Math.max(44, Math.round(88 - avgPop / 800)),
      lastMile: Math.max(38, Math.round(62 - avgPop / 600)),
    };
  }, [rows]);

  const insights = rows.slice(0, 3);
  const focus = pick ? DATA.find((g) => g.id === pick) ?? null : null;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Kansas Transit Intelligence (PoC)</h1>
        <p className="mt-1 text-sm text-zinc-500">Gaps · equity · energy (demo data)</p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {([
          ["Coverage", kpis.coverage],
          ["Frequency", kpis.frequency],
          ["Population need", kpis.equity],
          ["Connectivity", kpis.connect],
          ["First/last mile", kpis.lastMile],
        ] as const).map(([label, val]) => (
          <div key={label} className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
            <p className="text-xs text-zinc-500">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{val}%</p>
          </div>
        ))}
      </section>

      <section className="flex flex-wrap gap-3 rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
        <label className="text-sm">
          <span className="mr-2 text-zinc-500">County</span>
          <select
            className="rounded border border-zinc-300 bg-white px-2 py-1 text-sm dark:border-zinc-600 dark:bg-zinc-800"
            value={county}
            onChange={(e) => setCounty(e.target.value)}
          >
            {COUNTIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="mr-2 text-zinc-500">Severity</span>
          <select
            className="rounded border border-zinc-300 bg-white px-2 py-1 text-sm dark:border-zinc-600 dark:bg-zinc-800"
            value={severity}
            onChange={(e) => setSeverity(e.target.value as "All" | Severity)}
          >
            <option value="All">All</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </label>
        <button
          type="button"
          className="rounded border border-zinc-300 px-3 py-1 text-sm hover:bg-zinc-50 dark:border-zinc-600 dark:hover:bg-zinc-800"
          onClick={() => {
            setCounty("All");
            setSeverity("All");
            setPick(null);
          }}
        >
          Reset
        </button>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-2 text-sm font-semibold">Map (demo)</h2>
          <div className="relative h-56 rounded-md bg-gradient-to-br from-slate-800 to-slate-600">
            {["Sedgwick", "Johnson", "Wyandotte", "Douglas"].map((name, i) => (
              <button
                key={name}
                type="button"
                onClick={() => setCounty(name)}
                className={
                  "absolute rounded border border-white/40 px-2 py-1 text-xs text-white shadow " +
                  (name === "Sedgwick" || name === "Wyandotte"
                    ? "bg-red-500/80"
                    : name === "Johnson"
                      ? "bg-amber-500/80"
                      : "bg-emerald-500/80")
                }
                style={{ left: `${12 + i * 18}%`, top: `${20 + (i % 2) * 22}%`, width: "22%", height: "28%" }}
              >
                {name}
              </button>
            ))}
            <p className="absolute bottom-2 right-2 rounded bg-black/40 px-2 py-1 text-[10px] text-white">
              Click county to filter
            </p>
          </div>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-2 text-sm font-semibold">Insights</h2>
          <ul className="space-y-2 text-xs text-zinc-700 dark:text-zinc-300">
            {insights.map((g) => (
              <li key={g.id}>
                <button type="button" className="w-full rounded border border-zinc-200 p-2 text-left hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800" onClick={() => setPick(g.id)}>
                  <span className={"rounded px-1 py-0.5 text-[10px] font-medium " + sevBadge(g.severity)}>{g.severity}</span>
                  <p className="mt-1">{g.county}: {g.gapType}</p>
                </button>
              </li>
            ))}
          </ul>
          {focus && (
            <p className="mt-3 rounded border border-indigo-200 bg-indigo-50 p-2 text-xs dark:border-indigo-900 dark:bg-indigo-950">
              Selected: Route {focus.route} — {focus.action} (~{focus.energy} kWh/km)
            </p>
          )}
        </div>
      </section>

      <section className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-2 text-sm font-semibold">Top gaps</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-zinc-500">
              <tr>
                <th className="pb-2 pr-2">County</th>
                <th className="pb-2 pr-2">Route</th>
                <th className="pb-2 pr-2">Type</th>
                <th className="pb-2 pr-2">Sev.</th>
                <th className="pb-2 pr-2">Pop.</th>
                <th className="pb-2">kWh/km</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((g) => (
                <tr
                  key={g.id}
                  className="cursor-pointer border-t border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
                  onClick={() => setPick(g.id)}
                >
                  <td className="py-2 pr-2">{g.county}</td>
                  <td className="py-2 pr-2">{g.route}</td>
                  <td className="py-2 pr-2">{g.gapType}</td>
                  <td className="py-2 pr-2">
                    <span className={"rounded px-1 py-0.5 text-xs " + sevBadge(g.severity)}>{g.severity}</span>
                  </td>
                  <td className="py-2 pr-2">{g.population.toLocaleString()}</td>
                  <td className="py-2">{g.energy.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
