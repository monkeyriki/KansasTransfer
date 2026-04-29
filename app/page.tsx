"use client";

import { useMemo, useState } from "react";

type Severity = "High" | "Medium" | "Low";
type TimeWindow = "Peak" | "Off-peak" | "Weekend";
type KpiKey =
  | "coverage"
  | "frequency"
  | "connectivity"
  | "populationNeed"
  | "firstLastMile";

type GapRecord = {
  id: string;
  county: string;
  area: string;
  route: string;
  gapType: string;
  severity: Severity;
  affectedPopulation: number;
  seniorDensity: number;
  noVehicleRate: number;
  lowIncomeRate: number;
  stopDistanceMeters: number;
  tripsPerHourPeak: number;
  tripsPerHourOffpeak: number;
  weekendTripsPerHour: number;
  travelTimeIndex: number;
  energyKwhPerKm: number;
  hasBarrier: boolean;
  recommendation: string;
};

type Zone = {
  id: string;
  county: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

const zones: Zone[] = [
  { id: "sedgwick-central", county: "Sedgwick", label: "Sedgwick", x: 15, y: 20, width: 24, height: 24 },
  { id: "shawnee-north", county: "Shawnee", label: "Shawnee", x: 43, y: 12, width: 20, height: 20 },
  { id: "wyandotte-east", county: "Wyandotte", label: "Wyandotte", x: 67, y: 10, width: 18, height: 18 },
  { id: "johnson-metro", county: "Johnson", label: "Johnson", x: 63, y: 31, width: 22, height: 20 },
  { id: "douglas-corridor", county: "Douglas", label: "Douglas", x: 43, y: 37, width: 18, height: 18 },
];

const initialData: GapRecord[] = [
  {
    id: "g1",
    county: "Sedgwick",
    area: "South Wichita",
    route: "Route 12",
    gapType: "No weekend service",
    severity: "High",
    affectedPopulation: 12400,
    seniorDensity: 0.31,
    noVehicleRate: 0.24,
    lowIncomeRate: 0.29,
    stopDistanceMeters: 980,
    tripsPerHourPeak: 2.1,
    tripsPerHourOffpeak: 1.0,
    weekendTripsPerHour: 0,
    travelTimeIndex: 1.52,
    energyKwhPerKm: 1.46,
    hasBarrier: true,
    recommendation: "Priorita alta: attivare servizio weekend minimo + navette feeder.",
  },
  {
    id: "g2",
    county: "Sedgwick",
    area: "Park City",
    route: "Route 7",
    gapType: "Stop distance > 800m",
    severity: "Medium",
    affectedPopulation: 7600,
    seniorDensity: 0.22,
    noVehicleRate: 0.16,
    lowIncomeRate: 0.21,
    stopDistanceMeters: 860,
    tripsPerHourPeak: 2.5,
    tripsPerHourOffpeak: 1.3,
    weekendTripsPerHour: 0.5,
    travelTimeIndex: 1.38,
    energyKwhPerKm: 1.35,
    hasBarrier: true,
    recommendation: "Nuove fermate intermedie e adeguamento attraversamenti pedonali.",
  },
  {
    id: "g3",
    county: "Shawnee",
    area: "North Topeka",
    route: "Route 4",
    gapType: "Low off-peak frequency",
    severity: "High",
    affectedPopulation: 9800,
    seniorDensity: 0.27,
    noVehicleRate: 0.19,
    lowIncomeRate: 0.25,
    stopDistanceMeters: 700,
    tripsPerHourPeak: 2.8,
    tripsPerHourOffpeak: 0.7,
    weekendTripsPerHour: 0.2,
    travelTimeIndex: 1.61,
    energyKwhPerKm: 1.58,
    hasBarrier: false,
    recommendation: "Aumentare headway off-peak e introdurre express connection.",
  },
  {
    id: "g4",
    county: "Wyandotte",
    area: "Argentine",
    route: "Route 20",
    gapType: "Coverage blind spot",
    severity: "High",
    affectedPopulation: 11200,
    seniorDensity: 0.19,
    noVehicleRate: 0.28,
    lowIncomeRate: 0.34,
    stopDistanceMeters: 1200,
    tripsPerHourPeak: 1.4,
    tripsPerHourOffpeak: 0.5,
    weekendTripsPerHour: 0.1,
    travelTimeIndex: 1.74,
    energyKwhPerKm: 1.63,
    hasBarrier: true,
    recommendation: "Creare nuova linea locale e corridoi pedonali protetti.",
  },
  {
    id: "g5",
    county: "Johnson",
    area: "Overland Park South",
    route: "Route 3",
    gapType: "First/last mile barriers",
    severity: "Medium",
    affectedPopulation: 6900,
    seniorDensity: 0.17,
    noVehicleRate: 0.12,
    lowIncomeRate: 0.14,
    stopDistanceMeters: 640,
    tripsPerHourPeak: 3.2,
    tripsPerHourOffpeak: 1.7,
    weekendTripsPerHour: 1.2,
    travelTimeIndex: 1.28,
    energyKwhPerKm: 1.21,
    hasBarrier: true,
    recommendation: "Migliorare marciapiedi e sicurezza attraversamenti ai nodi.",
  },
  {
    id: "g6",
    county: "Douglas",
    area: "Lawrence East",
    route: "Route 9",
    gapType: "Low evening service",
    severity: "Low",
    affectedPopulation: 4300,
    seniorDensity: 0.14,
    noVehicleRate: 0.11,
    lowIncomeRate: 0.16,
    stopDistanceMeters: 520,
    tripsPerHourPeak: 3.6,
    tripsPerHourOffpeak: 1.9,
    weekendTripsPerHour: 1.1,
    travelTimeIndex: 1.18,
    energyKwhPerKm: 1.14,
    hasBarrier: false,
    recommendation: "Monitorare domanda serale e testare micro-adjustment orari.",
  },
];

function severityColor(severity: Severity): string {
  if (severity === "High") return "bg-red-500/20 text-red-700 dark:text-red-300";
  if (severity === "Medium") return "bg-amber-500/20 text-amber-700 dark:text-amber-300";
  return "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300";
}

function scoreSeverity(gap: GapRecord): number {
  return gap.severity === "High" ? 3 : gap.severity === "Medium" ? 2 : 1;
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function sparkBars(value: number): number[] {
  const base = Math.max(12, Math.min(92, Math.round(value)));
  return [base * 0.5, base * 0.75, base, base * 0.82];
}

export default function HomePage() {
  const counties = useMemo(
    () => ["All counties", ...Array.from(new Set(initialData.map((g) => g.county)))],
    []
  );
  const routes = useMemo(
    () => ["All routes", ...Array.from(new Set(initialData.map((g) => g.route)))],
    []
  );

  const [countyFilter, setCountyFilter] = useState("All counties");
  const [severityFilter, setSeverityFilter] = useState<Severity | "All">("All");
  const [routeFilter, setRouteFilter] = useState("All routes");
  const [timeWindow, setTimeWindow] = useState<TimeWindow>("Peak");
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"severity" | "population">("severity");

  const filteredData = useMemo(() => {
    return initialData.filter((gap) => {
      const matchCounty = countyFilter === "All counties" || gap.county === countyFilter;
      const matchSeverity = severityFilter === "All" || gap.severity === severityFilter;
      const matchRoute = routeFilter === "All routes" || gap.route === routeFilter;
      const matchZone = !selectedZone || gap.id === selectedZone || gap.county === selectedZone;
      return matchCounty && matchSeverity && matchRoute && matchZone;
    });
  }, [countyFilter, severityFilter, routeFilter, selectedZone]);

  const sortedData = useMemo(() => {
    const copy = [...filteredData];
    if (sortBy === "severity") {
      copy.sort((a, b) => {
        const s = scoreSeverity(b) - scoreSeverity(a);
        return s !== 0 ? s : b.affectedPopulation - a.affectedPopulation;
      });
    } else {
      copy.sort((a, b) => b.affectedPopulation - a.affectedPopulation);
    }
    return copy;
  }, [filteredData, sortBy]);

  const kpis = useMemo(() => {
    const sample = filteredData.length > 0 ? filteredData : initialData;
    const coverage = Math.max(0, 100 - average(sample.map((g) => Math.min(100, g.stopDistanceMeters / 12))));
    const frequencyMetric = average(
      sample.map((g) =>
        timeWindow === "Peak"
          ? g.tripsPerHourPeak
          : timeWindow === "Off-peak"
            ? g.tripsPerHourOffpeak
            : g.weekendTripsPerHour
      )
    );
    const frequency = Math.min(100, frequencyMetric * 25);
    const connectivity = Math.max(0, 100 - average(sample.map((g) => g.travelTimeIndex * 28)));
    const populationNeed = Math.min(
      100,
      average(sample.map((g) => (g.seniorDensity + g.noVehicleRate + g.lowIncomeRate) * 100))
    );
    const firstLastMile = Math.max(
      0,
      100 - average(sample.map((g) => (g.hasBarrier ? 40 : 18) + g.stopDistanceMeters / 30))
    );

    return {
      coverage,
      frequency,
      connectivity,
      populationNeed,
      firstLastMile,
    };
  }, [filteredData, timeWindow]);

  const insightItems = useMemo(() => {
    const target = sortedData.slice(0, 3);
    return target.map((gap, index) => ({
      id: gap.id,
      priority: index + 1,
      severity: gap.severity,
      text:
        gap.severity === "High"
          ? `Alta priorita: ${gap.county}, ${gap.area} presenta ${gap.gapType.toLowerCase()} con domanda vulnerabile elevata.`
          : gap.severity === "Medium"
            ? `Priorita media: in ${gap.county} servono miglioramenti su accesso e frequenza per ${gap.route}.`
            : `Priorita bassa: monitoraggio continuo in ${gap.county} (${gap.route}).`,
      action: gap.recommendation,
    }));
  }, [sortedData]);

  const selectedZoneData = useMemo(() => {
    if (!selectedZone) return null;
    return initialData.find((g) => g.id === selectedZone) ?? null;
  }, [selectedZone]);

  const kpiCards: { key: KpiKey; label: string; value: number; delta: string }[] = [
    { key: "coverage", label: "Geographic Coverage", value: kpis.coverage, delta: "-2.4%" },
    { key: "frequency", label: "Service Frequency", value: kpis.frequency, delta: "+1.2%" },
    { key: "connectivity", label: "Travel Time & Connectivity", value: kpis.connectivity, delta: "-1.1%" },
    { key: "populationNeed", label: "Population Need", value: kpis.populationNeed, delta: "+3.5%" },
    { key: "firstLastMile", label: "First/Last Mile", value: kpis.firstLastMile, delta: "-0.7%" },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Kansas Transit Intelligence Platform (PoC)
            </h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Transit gaps, equity needs, and energy readiness
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs dark:border-zinc-700 dark:bg-zinc-800/60">
            <p>Last update: now (mock)</p>
            <p className="text-emerald-600 dark:text-emerald-400">Environment: Demo active</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {kpiCards.map((card) => {
          const bars = sparkBars(card.value);
          const color =
            card.value < 35
              ? "text-red-600 dark:text-red-400"
              : card.value < 60
                ? "text-amber-600 dark:text-amber-400"
                : "text-emerald-600 dark:text-emerald-400";
          return (
            <article
              key={card.key}
              className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/80"
            >
              <p className="text-xs uppercase tracking-wide text-zinc-500">{card.label}</p>
              <p className={`mt-3 text-2xl font-semibold ${color}`}>{Math.round(card.value)}%</p>
              <p className="text-xs text-zinc-500">{card.delta} vs previous window</p>
              <div className="mt-3 flex items-end gap-1.5">
                {bars.map((bar, idx) => (
                  <span
                    key={idx}
                    className="w-2 rounded-sm bg-indigo-500/70"
                    style={{ height: `${Math.max(8, Math.round(bar / 6))}px` }}
                  />
                ))}
              </div>
            </article>
          );
        })}
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="grid gap-3 md:grid-cols-5">
          <label className="text-sm">
            <span className="mb-1 block text-zinc-500">County</span>
            <select
              value={countyFilter}
              onChange={(event) => setCountyFilter(event.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
            >
              {counties.map((county) => (
                <option key={county} value={county}>
                  {county}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-zinc-500">Severity</span>
            <select
              value={severityFilter}
              onChange={(event) => setSeverityFilter(event.target.value as Severity | "All")}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
            >
              <option value="All">All</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-zinc-500">Route</span>
            <select
              value={routeFilter}
              onChange={(event) => setRouteFilter(event.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
            >
              {routes.map((route) => (
                <option key={route} value={route}>
                  {route}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-zinc-500">Time window</span>
            <select
              value={timeWindow}
              onChange={(event) => setTimeWindow(event.target.value as TimeWindow)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
            >
              <option value="Peak">Peak</option>
              <option value="Off-peak">Off-peak</option>
              <option value="Weekend">Weekend</option>
            </select>
          </label>
          <button
            type="button"
            onClick={() => {
              setCountyFilter("All counties");
              setSeverityFilter("All");
              setRouteFilter("All routes");
              setTimeWindow("Peak");
              setSelectedZone(null);
            }}
            className="mt-6 rounded-lg border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            Reset filters
          </button>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="lg:col-span-2 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold">Kansas Layer View (clickable)</h3>
            <div className="flex gap-2 text-xs">
              <span className="rounded px-2 py-1 bg-red-500/20 text-red-700 dark:text-red-300">High</span>
              <span className="rounded px-2 py-1 bg-amber-500/20 text-amber-700 dark:text-amber-300">Medium</span>
              <span className="rounded px-2 py-1 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">Low</span>
            </div>
          </div>
          <div className="relative h-72 rounded-xl border border-zinc-200 bg-gradient-to-br from-slate-900 to-slate-700 p-4 dark:border-zinc-700">
            {zones.map((zone) => {
              const sample = initialData.find((d) => d.county === zone.county);
              const level = sample?.severity ?? "Low";
              const bgClass =
                level === "High"
                  ? "bg-red-500/70"
                  : level === "Medium"
                    ? "bg-amber-500/70"
                    : "bg-emerald-500/70";
              return (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => setSelectedZone(zone.county)}
                  className={`absolute rounded-md border border-white/40 ${bgClass} text-left text-white shadow transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-300`}
                  style={{ left: `${zone.x}%`, top: `${zone.y}%`, width: `${zone.width}%`, height: `${zone.height}%` }}
                >
                  <span className="block px-2 py-1 text-xs font-semibold">{zone.label}</span>
                </button>
              );
            })}
            <p className="absolute bottom-3 right-3 rounded bg-black/35 px-2 py-1 text-xs text-white">
              Tip: clicca una county per filtrare dashboard
            </p>
          </div>
        </article>

        <aside className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="font-semibold">AI Insights & Alerts</h3>
          <div className="mt-3 space-y-3">
            {insightItems.map((insight) => (
              <button
                key={insight.id}
                type="button"
                onClick={() => setSelectedZone(insight.id)}
                className="w-full rounded-lg border border-zinc-200 p-3 text-left hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                <p className={`inline-block rounded px-2 py-0.5 text-xs ${severityColor(insight.severity)}`}>
                  Priority {insight.priority} · {insight.severity}
                </p>
                <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-200">{insight.text}</p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{insight.action}</p>
              </button>
            ))}
          </div>
          {selectedZoneData ? (
            <div className="mt-4 rounded-lg border border-indigo-300/40 bg-indigo-500/10 p-3 text-sm dark:border-indigo-400/30">
              <p className="font-medium">Selected focus: {selectedZoneData.area}</p>
              <p className="mt-1 text-zinc-600 dark:text-zinc-300">
                Estimated energy: {selectedZoneData.energyKwhPerKm.toFixed(2)} kWh/km
              </p>
            </div>
          ) : null}
        </aside>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-semibold">Top Critical Gaps</h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setSortBy("severity")}
              className={`rounded px-3 py-1.5 text-xs ${sortBy === "severity" ? "bg-indigo-600 text-white" : "bg-zinc-100 dark:bg-zinc-800"}`}
            >
              Sort by severity
            </button>
            <button
              type="button"
              onClick={() => setSortBy("population")}
              className={`rounded px-3 py-1.5 text-xs ${sortBy === "population" ? "bg-indigo-600 text-white" : "bg-zinc-100 dark:bg-zinc-800"}`}
            >
              Sort by population
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wide text-zinc-500">
              <tr className="border-b border-zinc-200 dark:border-zinc-800">
                <th className="px-2 py-2">County</th>
                <th className="px-2 py-2">Route/Area</th>
                <th className="px-2 py-2">Gap Type</th>
                <th className="px-2 py-2">Severity</th>
                <th className="px-2 py-2">Affected Pop.</th>
                <th className="px-2 py-2">Energy (kWh/km)</th>
                <th className="px-2 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((gap) => (
                <tr
                  key={gap.id}
                  onClick={() => setSelectedZone(gap.id)}
                  className="cursor-pointer border-b border-zinc-100 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/60"
                >
                  <td className="px-2 py-2">{gap.county}</td>
                  <td className="px-2 py-2">
                    <span className="block font-medium">{gap.route}</span>
                    <span className="text-xs text-zinc-500">{gap.area}</span>
                  </td>
                  <td className="px-2 py-2">{gap.gapType}</td>
                  <td className="px-2 py-2">
                    <span className={`rounded px-2 py-0.5 text-xs ${severityColor(gap.severity)}`}>{gap.severity}</span>
                  </td>
                  <td className="px-2 py-2">{gap.affectedPopulation.toLocaleString()}</td>
                  <td className="px-2 py-2">{gap.energyKwhPerKm.toFixed(2)}</td>
                  <td className="px-2 py-2 text-xs text-zinc-600 dark:text-zinc-300">{gap.recommendation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
