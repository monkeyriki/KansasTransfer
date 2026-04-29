export const KANSAS_CENTER: [number, number] = [38.5, -98.0];

/** Table + map circles (severity for styling). Matches PoC prototype. */
export type MapGapZone = {
  id: string;
  county: string;
  severity: "critical" | "moderate" | "covered";
  center: [number, number];
  radiusM: number;
  population: number;
  distanceKm: number;
  needScore: number;
};

/** First seven zones: three critical + four moderate (no “covered” in table). */
export const MAP_GAPS: MapGapZone[] = [
  { id: "g1", county: "Sedgwick", severity: "critical", center: [37.55, -97.45], radiusM: 18000, population: 12400, distanceKm: 3.2, needScore: 92 },
  { id: "g2", county: "Johnson", severity: "critical", center: [38.85, -94.95], radiusM: 14000, population: 8200, distanceKm: 4.1, needScore: 88 },
  { id: "g3", county: "Wyandotte", severity: "critical", center: [39.05, -94.78], radiusM: 9000, population: 6100, distanceKm: 2.8, needScore: 81 },
  { id: "g4", county: "Riley", severity: "moderate", center: [39.25, -96.7], radiusM: 12000, population: 3400, distanceKm: 2.1, needScore: 64 },
  { id: "g5", county: "Saline", severity: "moderate", center: [38.78, -97.7], radiusM: 16000, population: 2900, distanceKm: 2.6, needScore: 58 },
  { id: "g6", county: "Reno", severity: "moderate", center: [38.0, -98.05], radiusM: 18000, population: 2100, distanceKm: 3.0, needScore: 55 },
  { id: "g7", county: "Butler", severity: "moderate", center: [37.78, -96.95], radiusM: 14000, population: 1800, distanceKm: 2.4, needScore: 49 },
];

export type TableSeverity = "Critical" | "Moderate";

export type DetailedGapRow = {
  county: string;
  severity: TableSeverity;
  population: number;
  distanceKm: number;
  needScore: number;
};

/** Same underlying numbers as MAP_GAPS (7 rows for “Detailed Gaps”). */
export const DETAILED_GAPS: DetailedGapRow[] = MAP_GAPS.map((z) => ({
  county: z.county,
  severity: z.severity === "critical" ? "Critical" : "Moderate",
  population: z.population,
  distanceKm: z.distanceKm,
  needScore: z.needScore,
}));

export type TransitStop = { id: string; lat: number; lng: number; name: string; county: string };

/** Stops rendered as blue markers on the gap map (subset across Kansas). */
export const MAP_STOPS: TransitStop[] = [
  { id: "s1", lat: 37.6889, lng: -97.3361, name: "Wichita Downtown Transit Center", county: "Sedgwick" },
  { id: "s5", lat: 39.1142, lng: -94.6275, name: "Kansas City Metro Hub", county: "Wyandotte" },
  { id: "s6", lat: 38.9822, lng: -94.6708, name: "Overland Park Transit", county: "Johnson" },
  { id: "s8", lat: 38.9717, lng: -95.2353, name: "Lawrence Bus Terminal", county: "Douglas" },
  { id: "s3", lat: 39.0558, lng: -95.6753, name: "Topeka Quincy Station", county: "Shawnee" },
  { id: "s12", lat: 38.8403, lng: -97.6114, name: "Salina Transit Center", county: "Saline" },
  { id: "s10", lat: 39.1836, lng: -96.5717, name: "Manhattan Aggieville", county: "Riley" },
  { id: "s13", lat: 38.0608, lng: -97.9298, name: "Hutchinson Main St", county: "Reno" },
];
