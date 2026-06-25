import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, AlertTriangle, Globe2, Radio, ArrowRight } from "lucide-react";
import { api } from "../api/client";
import type { AlertesConsolidees, PaysResume, StocksConsolides, SurveillanceEntrepot } from "../types";
import { COUNTRY_META } from "../types";
import { KpiCard } from "../components/KpiCard";
import { PageHeader } from "../components/Layout";
import { StatusBadge } from "../components/StatusBadge";
import { formatEntrepot } from "../utils/labels";

export function DashboardPage() {
  const [pays, setPays] = useState<PaysResume[]>([]);
  const [stocks, setStocks] = useState<StocksConsolides | null>(null);
  const [alertes, setAlertes] = useState<AlertesConsolidees | null>(null);
  const [surveillance, setSurveillance] = useState<SurveillanceEntrepot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([api.getPays(), api.getStocks(), api.getAlertes(), api.getSurveillance()])
      .then(([p, s, a, surv]) => {
        setPays(p);
        setStocks(s);
        setAlertes(a);
        setSurveillance(surv);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorState />;

  const alertesActives = alertes?.alertes.filter((a) => !a.resolue).length ?? 0;
  const lotsAlerte = stocks?.lots.filter((l) => l.statut === "alerte").length ?? 0;
  const sitesOk = surveillance.filter((s) => s.conditions_ok === true).length;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Tableau de bord"
        subtitle="Vue d'ensemble de vos stocks de café vert et des conditions de conservation."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Lots en stock" value={stocks?.total_lots ?? 0} subtitle="Sur l'ensemble des sites" icon={<Package className="h-6 w-6" />} />
        <KpiCard title="Alertes en cours" value={alertesActives} subtitle={`${lotsAlerte} lot(s) à surveiller`} icon={<AlertTriangle className="h-6 w-6" />} accent="from-rose-500/20" />
        <KpiCard title="Sites actifs" value={pays.filter((p) => p.disponible).length} subtitle="Colombie, Brésil, Équateur" icon={<Globe2 className="h-6 w-6" />} accent="from-emerald-500/20" />
        <KpiCard title="Entrepôts conformes" value={sitesOk} subtitle="Conditions de conservation OK" icon={<Radio className="h-6 w-6" />} accent="from-sky-500/20" />
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-white">Vos sites</h2>
          <Link to="/pays" className="btn-ghost text-xs">
            Voir les stocks <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {pays.map((p) => {
            const meta = COUNTRY_META[p.code] ?? { flag: "🌎", gradient: "", seuilsLabel: "" };
            const surv = surveillance.find((s) => s.pays === p.code);
            return (
              <Link
                key={p.code}
                to={`/pays/${p.code}`}
                className="glass-card-hover group relative overflow-hidden p-5 sm:p-6"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${meta.gradient} to-transparent`} />
                <div className="relative">
                  <span className="text-3xl">{meta.flag}</span>
                  <h3 className="mt-4 font-display text-xl font-bold text-white group-hover:text-coffee-300 transition">
                    {p.nom}
                  </h3>
                  <p className="mt-1 text-sm text-stone-500">Conservation : {meta.seuilsLabel}</p>
                  <p className="mt-3 text-sm text-stone-400">
                    {stocks?.par_pays[p.code] ?? 0} lots · {alertes?.par_pays[p.code] ?? 0} alertes
                  </p>
                  {surv?.temperature != null && (
                    <p className="mt-2 text-sm text-stone-300">
                      {surv.temperature}°C · {surv.humidite}% d'humidité
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-white">Priorité de sortie des lots</h2>
          <Link to="/iot" className="btn-ghost text-xs">
            Voir les capteurs <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/5 text-xs uppercase tracking-wider text-stone-500">
                  <th className="px-4 py-3 sm:px-6">Lot</th>
                  <th className="px-4 py-3">Pays</th>
                  <th className="px-4 py-3">Entrepôt</th>
                  <th className="px-4 py-3">Date d'entrée</th>
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
                    <td className="px-4 py-3 text-stone-400">{formatEntrepot(lot.entrepot)}</td>
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

function ErrorState() {
  return (
    <div className="glass-card flex flex-col items-center justify-center p-12 text-center">
      <AlertTriangle className="h-12 w-12 text-rose-400" />
      <p className="mt-4 font-medium text-white">Connexion au service indisponible</p>
      <p className="mt-2 text-sm text-stone-500">Veuillez réessayer dans quelques instants.</p>
    </div>
  );
}
