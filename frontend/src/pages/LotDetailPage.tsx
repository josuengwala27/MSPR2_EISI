import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Thermometer, Droplets, Mail, Clock } from "lucide-react";
import { api } from "../api/client";
import type { Alerte, Lot, Mesure } from "../types";
import { COUNTRY_META } from "../types";
import { BreadcrumbLink, PageHeader } from "../components/Layout";
import { MesuresChart } from "../components/MesuresChart";
import { StatusBadge } from "../components/StatusBadge";

export function LotDetailPage() {
  const { code, lotId } = useParams<{ code: string; lotId: string }>();
  const [lot, setLot] = useState<Lot | null>(null);
  const [mesures, setMesures] = useState<Mesure[]>([]);
  const [alertes, setAlertes] = useState<Alerte[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!code || !lotId) return;
    Promise.all([
      api.getLot(code, lotId),
      api.getMesures(code, lotId),
      api.getAlertesPays(code),
    ])
      .then(([l, m, a]) => {
        setLot(l);
        setMesures(m);
        setAlertes(a.filter((al) => al.lot_id === lotId));
      })
      .finally(() => setLoading(false));
  }, [code, lotId]);

  const meta = code ? COUNTRY_META[code] : null;
  const derniere = mesures.length > 0 ? mesures[mesures.length - 1] : null;

  if (loading) {
    return <div className="h-96 animate-pulse rounded-2xl bg-white/5" />;
  }

  if (!lot) {
    return <p className="text-stone-500">Lot introuvable</p>;
  }

  return (
    <div className="space-y-6">
      <BreadcrumbLink to={`/pays/${code}`} label={`Lots ${code}`} />

      <PageHeader
        title={lot.id}
        subtitle={`${meta?.flag} ${lot.exploitation} · ${lot.entrepot}`}
        action={<StatusBadge statut={lot.statut} />}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={<Thermometer className="h-5 w-5 text-amber-400" />}
          label="Temperature"
          value={derniere ? `${derniere.temperature} °C` : "—"}
        />
        <MetricCard
          icon={<Droplets className="h-5 w-5 text-sky-400" />}
          label="Humidite"
          value={derniere ? `${derniere.humidite} %` : "—"}
        />
        <MetricCard
          icon={<Clock className="h-5 w-5 text-stone-400" />}
          label="En stock depuis"
          value={new Date(lot.date_stockage).toLocaleDateString("fr-FR")}
        />
        <MetricCard
          icon={<Mail className="h-5 w-5 text-rose-400" />}
          label="Alertes lot"
          value={String(alertes.length)}
        />
      </div>

      <div className="glass-card p-4 sm:p-6">
        <h2 className="mb-4 font-display text-lg font-semibold text-white">
          Historique temperature & humidite
        </h2>
        <p className="mb-6 text-sm text-stone-500">
          Mesures IoT depuis la date de stockage du lot
        </p>
        <MesuresChart mesures={mesures} />
      </div>

      {alertes.length > 0 && (
        <div className="glass-card p-4 sm:p-6">
          <h2 className="mb-4 font-display text-lg font-semibold text-white">Alertes associees</h2>
          <div className="space-y-3">
            {alertes.map((a) => (
              <div key={a.id} className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-rose-400">{a.type}</p>
                <p className="mt-2 text-sm text-stone-300">{a.message}</p>
                <p className="mt-2 text-xs text-stone-500">
                  {new Date(a.created_at).toLocaleString("fr-FR")}
                  {a.email_envoye && " · Email envoye"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="glass-card p-4 sm:p-5">
      <div className="flex items-center gap-3">
        {icon}
        <p className="text-xs font-medium uppercase tracking-wider text-stone-500">{label}</p>
      </div>
      <p className="mt-3 font-display text-2xl font-bold text-white">{value}</p>
    </div>
  );
}
