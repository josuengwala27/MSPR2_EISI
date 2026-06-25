import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, AlertTriangle, Globe2, Activity, ArrowRight } from "lucide-react";
import { api } from "../api/client";
import type { AlertesConsolidees, PaysResume, StocksConsolides } from "../types";
import { COUNTRY_META } from "../types";
import { KpiCard } from "../components/KpiCard";
import { PageHeader } from "../components/Layout";
import { StatusBadge } from "../components/StatusBadge";

export function DashboardPage() {
  const [pays, setPays] = useState<PaysResume[]>([]);
  const [stocks, setStocks] = useState<StocksConsolides | null>(null);
  const [alertes, setAlertes] = useState<AlertesConsolidees | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api.getPays(), api.getStocks(), api.getAlertes()])
      .then(([p, s, a]) => {
        setPays(p);
        setStocks(s);
        setAlertes(a);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorState message={error} />;

  const alertesActives = alertes?.alertes.filter((a) => !a.resolue).length ?? 0;
  const lotsAlerte = stocks?.lots.filter((l) => l.statut === "alerte").length ?? 0;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Tableau de bord"
        subtitle="Vue consolidee des stocks cafe vert et conditions de stockage IoT sur 3 pays."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Lots en stock" value={stocks?.total_lots ?? 0} subtitle="3 pays actifs" icon={<Package className="h-6 w-6" />} />
        <KpiCard title="Alertes actives" value={alertesActives} subtitle={`${lotsAlerte} lots en alerte`} icon={<AlertTriangle className="h-6 w-6" />} accent="from-rose-500/20" />
        <KpiCard title="Pays connectes" value={pays.filter((p) => p.disponible).length} subtitle={`sur ${pays.length} configures`} icon={<Globe2 className="h-6 w-6" />} accent="from-emerald-500/20" />
        <KpiCard title="Sources IoT" value="Live + Mock" subtitle="Colombie temps reel" icon={<Activity className="h-6 w-6" />} accent="from-sky-500/20" />
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-white">Pays</h2>
          <Link to="/pays" className="btn-ghost text-xs">
            Voir tout <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {pays.map((p) => {
            const meta = COUNTRY_META[p.code] ?? { flag: "🌎", gradient: "", seuils: "" };
            return (
              <Link
                key={p.code}
                to={`/pays/${p.code}`}
                className={`glass-card-hover group relative overflow-hidden p-5 sm:p-6`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${meta.gradient} to-transparent`} />
                <div className="relative">
                  <div className="flex items-start justify-between">
                    <span className="text-3xl">{meta.flag}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                        p.statut_backend === "complet"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-sky-500/20 text-sky-300"
                      }`}
                    >
                      {p.statut_backend}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-xl font-bold text-white group-hover:text-coffee-300 transition">
                    {p.nom}
                  </h3>
                  <p className="mt-1 text-sm text-stone-500">{meta.seuils}</p>
                  <p className="mt-3 text-sm text-stone-400">
                    {stocks?.par_pays[p.code] ?? 0} lots · {alertes?.par_pays[p.code] ?? 0} alertes
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${p.disponible ? "bg-emerald-400" : "bg-rose-400"}`} />
                    <span className="text-xs text-stone-500">{p.disponible ? "En ligne" : "Indisponible"}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-display text-xl font-semibold text-white">Derniers lots (FIFO)</h2>
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/5 text-xs uppercase tracking-wider text-stone-500">
                  <th className="px-4 py-3 sm:px-6">Lot</th>
                  <th className="px-4 py-3">Pays</th>
                  <th className="px-4 py-3">Entrepot</th>
                  <th className="px-4 py-3">Stockage</th>
                  <th className="px-4 py-3 sm:px-6">Statut</th>
                </tr>
              </thead>
              <tbody>
                {stocks?.lots.slice(0, 6).map((lot) => (
                  <tr key={lot.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                    <td className="px-4 py-3 font-medium text-white sm:px-6">
                      <Link to={`/pays/${lot.pays}/lots/${lot.id}`} className="hover:text-coffee-400">
                        {lot.id}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-stone-400">{lot.pays_nom}</td>
                    <td className="px-4 py-3 text-stone-400">{lot.entrepot}</td>
                    <td className="px-4 py-3 text-stone-400">
                      {new Date(lot.date_stockage).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-4 py-3 sm:px-6">
                      <StatusBadge statut={lot.statut} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="h-10 w-64 rounded-lg bg-white/5" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 rounded-2xl bg-white/5" />
        ))}
      </div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="glass-card flex flex-col items-center justify-center p-12 text-center">
      <AlertTriangle className="h-12 w-12 text-rose-400" />
      <p className="mt-4 font-medium text-white">Impossible de charger les donnees</p>
      <p className="mt-2 text-sm text-stone-500">{message}</p>
      <p className="mt-4 text-xs text-stone-600">Verifiez que docker compose est lance (backend siege :8000)</p>
    </div>
  );
}
