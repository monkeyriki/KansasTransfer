"use client";

import { AlertTriangle, CircleAlert, X } from "lucide-react";

import type { AnomalyLevel } from "@/lib/anomalies-data";

const rowStyles: Record<
  AnomalyLevel,
  { bar: string; icon: typeof CircleAlert; iconClass: string }
> = {
  critical: {
    bar: "border border-red-900/50 bg-red-950/55 text-red-100 shadow-sm shadow-red-950/40",
    icon: CircleAlert,
    iconClass: "text-red-400",
  },
  warning: {
    bar: "border border-amber-800/45 bg-amber-950/40 text-amber-50 shadow-sm shadow-amber-950/30",
    icon: AlertTriangle,
    iconClass: "text-amber-400",
  },
};

type Props = {
  level: AnomalyLevel;
  title: string;
  description: string;
  onDismiss: () => void;
};

export function AnomalyAlertRow({ level, title, description, onDismiss }: Props) {
  const s = rowStyles[level];
  const Icon = s.icon;
  return (
    <div
      className={
        "flex items-start gap-3 rounded-xl px-4 py-3.5 " + s.bar
      }
    >
      <Icon className={"mt-0.5 h-5 w-5 shrink-0 " + s.iconClass} aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-100">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-slate-400">{description}</p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 rounded-lg p-1 text-slate-500 transition-colors hover:bg-black/20 hover:text-slate-200"
        aria-label="Dismiss alert"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
