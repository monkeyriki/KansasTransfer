"use client";

import { Minus, TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";

type Tone = "success" | "warning" | "destructive";

const ringClass: Record<Tone, { stroke: string; text: string; icon: string }> = {
  success: {
    stroke: "stroke-emerald-400",
    text: "text-emerald-400",
    icon: "text-emerald-400",
  },
  warning: {
    stroke: "stroke-amber-400",
    text: "text-amber-400",
    icon: "text-amber-400",
  },
  destructive: {
    stroke: "stroke-red-400",
    text: "text-red-400",
    icon: "text-red-400",
  },
};

type Trend = "up" | "down" | "stable";

export function KpiRing({
  label,
  value,
  tone,
  trend,
  icon: Icon,
}: {
  label: string;
  value: number;
  tone: Tone;
  trend: Trend;
  icon: LucideIcon;
}) {
  const c = ringClass[tone];
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const C = 2 * Math.PI * 26;
  const offset = C - (value / 100) * C;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 shadow-lg shadow-black/20">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-slate-300">
            <Icon className="h-4 w-4" />
          </div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">{label}</p>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-bold tabular-nums text-white">{value}</span>
            <span className="text-sm text-slate-500">%</span>
            <TrendIcon className={"h-3.5 w-3.5 " + c.icon} />
          </div>
        </div>
        <svg width="56" height="56" viewBox="0 0 56 56" className="shrink-0">
          <circle cx="28" cy="28" r="26" fill="none" strokeWidth="5" className="stroke-slate-800" />
          <circle
            cx="28"
            cy="28"
            r="26"
            fill="none"
            strokeWidth="5"
            strokeLinecap="round"
            className={c.stroke}
            strokeDasharray={C}
            strokeDashoffset={offset}
            transform="rotate(-90 28 28)"
          />
        </svg>
      </div>
    </div>
  );
}
