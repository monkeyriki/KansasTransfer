"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  LayoutDashboard,
  MapPin,
  Settings,
  Sparkles,
  Zap,
} from "lucide-react";

const nav: { href: string; label: string; icon: typeof LayoutDashboard }[] = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/gap-analysis", label: "Gap Analysis", icon: MapPin },
  { href: "/energy", label: "Energy", icon: Zap },
  { href: "/ai-insights", label: "AI Insights", icon: Sparkles },
  { href: "/anomalies", label: "Anomalies", icon: AlertTriangle },
  { href: "/settings", label: "Settings", icon: Settings },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <aside className="flex w-56 shrink-0 flex-col border-r border-slate-800 bg-slate-900/80">
        <div className="flex items-center gap-2 border-b border-slate-800 px-4 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400">
            <Activity className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
              KS Transit
            </p>
            <p className="text-sm font-semibold text-slate-100">Intelligence</p>
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 p-2">
          {nav.map((item) => {
            const active = isActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors " +
                  (active
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                    : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200")
                }
              >
                <Icon className="h-4 w-4 shrink-0 opacity-90" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-slate-800 p-4">
          <p className="text-[10px] leading-relaxed text-slate-500">
            Powered by FASTSim + Claude AI
          </p>
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[10px] font-medium text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            NREL Partnership
          </div>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
