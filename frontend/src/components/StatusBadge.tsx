import type { StatutLot } from "../types";

const config: Record<StatutLot, { label: string; className: string; dot: string }> = {
  conforme: {
    label: "Conforme",
    className: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    dot: "bg-emerald-400",
  },
  alerte: {
    label: "Alerte",
    className: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    dot: "bg-amber-400 animate-pulse-soft",
  },
  perime: {
    label: "Perime",
    className: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    dot: "bg-rose-400",
  },
};

interface Props {
  statut: StatutLot;
  size?: "sm" | "md";
}

export function StatusBadge({ statut, size = "md" }: Props) {
  const c = config[statut];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${c.className} ${
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-xs"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}
