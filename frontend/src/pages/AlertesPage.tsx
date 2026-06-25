import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Mail, Filter } from "lucide-react";
import { api } from "../api/client";
import type { Alerte } from "../types";
import { COUNTRY_META } from "../types";
import { PageHeader } from "../components/Layout";

export function AlertesPage() {
  const [alertes, setAlertes] = useState<Alerte[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getAlertes()
      .then((data) => setAlertes(data.alertes))
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    filter === "all" ? alertes : alertes.filter((a) => a.pays === filter);

  const paysCodes = [...new Set(alertes.map((a) => a.pays))];

  return (
    <div>
      <PageHeader
        title="Centre d'alertes"
        subtitle="Alertes conditions et peremption consolidees sur les 3 pays."
      />

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Filter className="h-4 w-4 text-stone-500" />
        <FilterBtn active={filter === "all"} onClick={() => setFilter("all")} label="Tous" />
        {paysCodes.map((code) => (
          <FilterBtn
            key={code}
            active={filter === code}
            onClick={() => setFilter(code)}
            label={`${COUNTRY_META[code]?.flag ?? ""} ${code}`}
          />
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-white/5" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card flex flex-col items-center py-16 text-center">
          <Bell className="h-12 w-12 text-stone-600" />
          <p className="mt-4 text-stone-400">Aucune alerte active</p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filtered.map((a) => (
            <div
              key={`${a.pays}-${a.id}`}
              className={`glass-card overflow-hidden border-l-4 p-5 ${
                a.type === "peremption" ? "border-l-rose-500" : "border-l-amber-500"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                    {COUNTRY_META[a.pays]?.flag} {a.pays_nom ?? a.pays}
                  </span>
                  <h3 className="mt-1 font-semibold text-white">
                    <Link to={`/pays/${a.pays}/lots/${a.lot_id}`} className="hover:text-coffee-400">
                      {a.lot_id}
                    </Link>
                  </h3>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                    a.type === "peremption"
                      ? "bg-rose-500/20 text-rose-300"
                      : "bg-amber-500/20 text-amber-300"
                  }`}
                >
                  {a.type.replace("_", " ")}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-stone-400">{a.message}</p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-stone-500">
                <span>{new Date(a.created_at).toLocaleString("fr-FR")}</span>
                {a.email_envoye && (
                  <span className="inline-flex items-center gap-1 text-emerald-500">
                    <Mail className="h-3.5 w-3.5" /> Email envoye
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterBtn({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
        active
          ? "bg-coffee-500/20 text-coffee-300 ring-1 ring-coffee-500/30"
          : "bg-white/5 text-stone-400 hover:bg-white/10"
      }`}
    >
      {label}
    </button>
  );
}
