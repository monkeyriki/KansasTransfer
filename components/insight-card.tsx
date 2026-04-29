import { Users } from "lucide-react";

import type { InsightSeverity } from "@/lib/ai-insights-data";

const severityStyles: Record<
  InsightSeverity,
  {
    badge: string;
    border: string;
  }
> = {
  HIGH: {
    badge: "bg-red-500/15 text-red-400 ring-1 ring-inset ring-red-500/35",
    border: "border-l-red-500",
  },
  MEDIUM: {
    badge: "bg-amber-500/15 text-amber-400 ring-1 ring-inset ring-amber-500/35",
    border: "border-l-amber-500",
  },
};

type Props = {
  title: string;
  severity: InsightSeverity;
  description: string;
  affectedCount: number;
};

function formatAffected(n: number) {
  return new Intl.NumberFormat("en-US").format(n);
}

export function InsightCard({ title, severity, description, affectedCount }: Props) {
  const s = severityStyles[severity];
  return (
    <article
      className={
        "rounded-xl border border-slate-700/80 bg-slate-900/50 py-4 pl-4 pr-5 border-l-[3px] " +
        s.border
      }
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-base font-semibold text-slate-100">{title}</h3>
        <span
          className={
            "shrink-0 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide " + s.badge
          }
        >
          {severity}
        </span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">{description}</p>
      <p className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-500">
        <Users className="h-3.5 w-3.5 text-slate-500" aria-hidden />
        <span className="text-slate-300">{formatAffected(affectedCount)} affected</span>
      </p>
    </article>
  );
}
