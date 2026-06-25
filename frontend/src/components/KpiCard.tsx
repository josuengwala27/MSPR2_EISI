import type { ReactNode } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";

interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: "up" | "down" | "neutral";
  accent?: string;
}

export function KpiCard({ title, value, subtitle, icon, trend, accent = "from-coffee-500/20" }: Props) {
  return (
    <div className={`glass-card-hover relative animate-slide-up overflow-hidden p-5 lg:p-6`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${accent} to-transparent opacity-50 pointer-events-none`} />
      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wider text-stone-500">{title}</p>
          <p className="mt-2 font-display text-3xl font-bold tracking-tight text-white lg:text-4xl">
            {value}
          </p>
          {subtitle && <p className="mt-1 truncate text-sm text-stone-400">{subtitle}</p>}
        </div>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/5 text-coffee-400">
          {icon}
        </div>
      </div>
      {trend && trend !== "neutral" && (
        <div className="relative mt-3 flex items-center gap-1 text-xs text-stone-500">
          {trend === "up" ? <TrendingUp className="h-3.5 w-3.5 text-emerald-400" /> : <TrendingDown className="h-3.5 w-3.5 text-rose-400" />}
          <span>vs. periode precedente</span>
        </div>
      )}
    </div>
  );
}
