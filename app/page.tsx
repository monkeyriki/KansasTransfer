"use client";

import { useEffect, useMemo, useState } from "react";

type Severity = "High" | "Medium" | "Low";
type TimeWindow = "Peak" | "Off-peak" | "Weekend";
type KpiKey =
  | "coverage"
  | "frequency"
  | "connectivity"
  | "populationNeed"
  | "firstLastMile";
type Layer = "stops" | "gaps" | "demographics" | "energy";
type AlertLevel = "critical" | "warning";

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

type Stop = {
  id: string;
  county: string;
  name: string;
  x: number;
  y: number;
  routes: string[];
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

type Anomaly = {
  id: string;
  level: AlertLevel;
  title: string;
  body: string;
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

const stops: Stop[] = [
  { id: "s1", county: "Sedgwick", name: "Wichita Downtown", x: 23, y: 36, routes: ["Route 12", "Route 7"] },
  { id: "s2", county: "Shawnee", name: "Topeka Quincy", x: 53, y: 22, routes: ["Route 4"] },
  { id: "s3", county: "Wyandotte", name: "Kansas City Hub", x: 76, y: 18, routes: ["Route 20", "Route 3"] },
  { id: "s4", county: "Johnson", name: "Overland Transit", x: 72, y: 39, routes: ["Route 3"] },
  { id: "s5", county: "Douglas", name: "Lawrence Terminal", x: 52, y: 44, routes: ["Route 9"] },
];

const baseAnomalies: Anomaly[] = [
  {
    id: "a1",
    level: "critical",
    title: "Zero Service Day Detected",
    body: "Route 7 shows zero scheduled service on Sunday in Sedgwick.",
  },
  {
    id: "a2",
    level: "critical",
    title: "Weekend Coverage Collapse",
    body: "Wyandotte loses 60% of service after 20:00 on Saturday.",
  },
  {
    id: "a3",
    level: "warning",
    title: "Frequency Drop Alert",
    body: "Shawnee off-peak frequency dropped below minimum target.",
  },
];

function severityColor(severity: Severity): string {
  if (severity === "High") return "bg-red-500/20 text-red-700 dark:text-red-300";
  if (severity === "Medium") return "bg-amber-500/20 text-amber-700 dark:text-amber-300";
  return "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300";
}

function levelColor(level: AlertLevel): string {
  if (level === "critical") return "bg-red-500/20 text-red-700 dark:text-red-300";
  return "bg-amber-500/20 text-amber-700 dark:text-amber-300";
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

function AnimatedPercent({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let frame = 0;
    const start = performance.now();
    const duration = 650;
    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <>{display}</>;
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
  const [alerts, setAlerts] = useState<Anomaly[]>(baseAnomalies);
  const [regenerating, setRegenerating] = useState(false);
  const [layers, setLayers] = useState<Record<Layer, boolean>>({
    stops: true,
    gaps: true,
    demographics: true,
    energy: false,
  });

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
          ? `Alta
