export type AnomalyLevel = "critical" | "warning";

export type AnomalyAlert = {
  id: string;
  level: AnomalyLevel;
  title: string;
  description: string;
};

export const ANOMALY_ALERTS: AnomalyAlert[] = [
  {
    id: "zero-r7-nov16",
    level: "critical",
    title: "Zero Service Day Detected",
    description:
      "Route 7 Topeka Connector — Sunday Nov 16. No vehicle activity recorded.",
  },
  {
    id: "zero-r19-nov16",
    level: "critical",
    title: "Zero Service Day Detected",
    description: "Route 19 Northland — Sunday Nov 16. Affects Wyandotte commuters.",
  },
  {
    id: "freq-r5",
    level: "warning",
    title: "Frequency Drop Alert",
    description:
      "Route 5 Manhattan Express down 60% Tue-Thu. Investigate scheduling.",
  },
];
