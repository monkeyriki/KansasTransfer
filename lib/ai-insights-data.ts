export type InsightSeverity = "HIGH" | "MEDIUM";

export type AiInsight = {
  id: string;
  title: string;
  severity: InsightSeverity;
  description: string;
  affectedCount: number;
};

export const AI_INSIGHTS: AiInsight[] = [
  {
    id: "sedgwick-seniors",
    title: "Sedgwick County Alert",
    severity: "HIGH",
    description:
      "12,400 seniors live >3km from nearest stop. Route 14 extension recommended.",
    affectedCount: 12_400,
  },
  {
    id: "johnson-weekend",
    title: "Johnson County",
    severity: "HIGH",
    description:
      "Zero service detected on weekends for Routes 7, 12, 19. Affects 8,200 residents.",
    affectedCount: 8_200,
  },
  {
    id: "riley-frequency",
    title: "Riley County",
    severity: "MEDIUM",
    description:
      "Service frequency dropped 60% vs monthly average. Anomaly detected Tuesday-Thursday.",
    affectedCount: 3_400,
  },
];
