import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, Calendar, Warehouse } from "lucide-react";
import { api } from "../api/client";
import type { Lot, PaysResume } from "../types";
import { COUNTRY_META } from "../types";
import { BreadcrumbLink, PageHeader } from "../components/Layout";
import { StatusBadge } from "../components/StatusBadge";

export function PaysListPage() {
  const [pays, setPays] = useState<PaysResume[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPays().then(setPays).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader title="Pays & exploitations" subtitle="Selectionnez un pays pour consulter les lots en FIFO." />
      <div className="grid gap-4 md:grid-cols-3">
        {loading
          ? [1, 2, 3].map((i) => <div key={i} className="h-40 animate-pulse rounded-2xl bg-white/5" />)
          : pays.map((p) => {
              const meta = COUNTRY_META[p.code];
              return (
                <Link key={p.code} to={`/pays/${p.code}`} className="glass-card-hover block p-6">
                  <span className="text-4xl">{meta?.flag}</span>
                  <h2 className="mt-4 font-display text-2xl font-bold text-white">{p.nom}</h2>
                  <p className="mt-2 text-sm text-stone-500">{meta?.seuils}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm text-coffee-400">
                    Explorer <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              );
            })}
      </div>
    </div>
  );
}

export function CountryLotsPage() {
  const { code } = useParams<{ code: string }>();
  const [lots, setLots] = useState<Lot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!code) return;
    api.getLots(code).then(setLots).finally(() => setLoading(false));
  }, [code]);

  const meta = code ? COUNTRY_META[code] : null;

  return (
    <div>
      <BreadcrumbLink to="/pays" label="Tous les pays" />
      <PageHeader
        title={`${meta?.flag ?? ""} Lots — ${code}`}
        subtitle={`Tri FIFO par date de stockage · Seuils ${meta?.seuils}`}
      />

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-white/5" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {lots.map((lot, index) => (
            <Link
              key={lot.id}
              to={`/pays/${code}/lots/${lot.id}`}
              className="glass-card-hover flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-coffee-500/20 font-display text-sm font-bold text-coffee-400">
                  {index + 1}
                </div>
                <div>
                  <p className="font-semibold text-white">{lot.id}</p>
                  <div className="mt-1 flex flex-wrap gap-3 text-xs text-stone-500">
                    <span className="inline-flex items-center gap-1">
                      <Warehouse className="h-3.5 w-3.5" /> {lot.entrepot}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(lot.date_stockage).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 pl-14 sm:pl-0">
                <StatusBadge statut={lot.statut} />
                <ArrowRight className="h-5 w-5 text-stone-600" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
