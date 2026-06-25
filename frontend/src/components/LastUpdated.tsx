import { RefreshCw } from "lucide-react";

interface Props {
  date: Date | null;
  onRefresh?: () => void;
}

export function LastUpdated({ date, onRefresh }: Props) {
  const label = date
    ? `Mis à jour à ${date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`
    : "Chargement…";

  return (
    <div className="flex items-center gap-2 text-xs text-stone-500">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-soft" />
      <span>{label}</span>
      {onRefresh && (
        <button
          type="button"
          onClick={onRefresh}
          className="ml-1 rounded-lg p-1 text-stone-400 transition hover:bg-white/5 hover:text-stone-200"
          aria-label="Actualiser"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
