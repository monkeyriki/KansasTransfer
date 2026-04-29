/** FASTSim-style route energy (demo values, aligned with PoC reference). */

export type RouteEnergy = {
  route: string;
  name: string;
  /** Simulated average daily energy draw for the route (kWh). */
  dailyKwh: number;
  /** km per kWh — higher = more efficient under this model. */
  kmPerKwh: number;
};

export const ROUTE_ENERGY: RouteEnergy[] = [
  { route: "R-01", name: "Route 1 Wichita Express", dailyKwh: 34, kmPerKwh: 1.8 },
  { route: "R-02", name: "Route 5 Manhattan Express", dailyKwh: 78, kmPerKwh: 1.4 },
  { route: "R-03", name: "Route 7 Topeka Connector", dailyKwh: 123, kmPerKwh: 1.0 },
  { route: "R-04", name: "Route 8 Hutch Connector", dailyKwh: 56, kmPerKwh: 1.6 },
  { route: "R-05", name: "Route 9 Lawrence Loop", dailyKwh: 89, kmPerKwh: 1.3 },
  { route: "R-06", name: "Route 11 Salina Hub", dailyKwh: 45, kmPerKwh: 1.7 },
  { route: "R-07", name: "Route 12 KC Metro", dailyKwh: 102, kmPerKwh: 1.1 },
  { route: "R-08", name: "Route 14 South Loop", dailyKwh: 67, kmPerKwh: 1.5 },
];

export function barColorKwh(kwh: number): "green" | "yellow" | "red" {
  if (kwh < 60) return "green";
  if (kwh <= 90) return "yellow";
  return "red";
}

export function totalDailyKwh(rows: RouteEnergy[]): number {
  return rows.reduce((s, r) => s + r.dailyKwh, 0);
}
