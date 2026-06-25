import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Thermometer, Droplets, MapPin, Clock } from "lucide-react";
import { api } from "../api/client";
import type { Lot, Mesure, SurveillanceEntrepot } from "../types";
import { COUNTRY_META } from "../types";
import { BreadcrumbLink, PageHeader } from "../components/Layout";
import { MesuresChart } from "../components/MesuresChart";
import { LastUpdated } from "../components/LastUpdated";
import { formatRelativeTime } from "../utils/labels";

export function IotDetailPage() {
  const { code } = useParams<{ code: string }>();
  const [site, setSite] = useState<SurveillanceEntrepot | null>(null);
  const [mesures, setMesures] = useState<Mesure[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const load = () => {
    if (!code) return;
    setLoading(true);
    api
      .getSurveillancePays(code)
      .then(async (s) => {
        setSite(s);
        const lots = await api.getLots(code);
        const lot = lots.find((l: Lot) => l.statut !== "perime") ?? lots[0];
        if (lot) {
          const m = await api.getMesures(code, lot.id);
          setMesures(m);
        } else {
          setMesures([]);
        }
        setLastUpdate(new Date());
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 60_000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  const meta = code ? COUNTRY_META[code] : null;

  if (loading && !site) return <div className="h-96 animate-pulse rounded-2xl bg-white/5" />;
  if (!site) return <p className="text-stone-500">Entrepôt introuvable</p>;

  const statusLabel =
    site.conditions_ok === true
      ? "Conditions de conservation optimales"
      : site.conditions_ok === false
        ? "Conditions hors plage recommandée"
        : "En attente de données";

  const statusClass =
    site.conditions_ok === true
      ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
      : site.conditions_ok === false
        ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
        : "text-stone-400 bg-stone-500/10 border-stone-500/20";

  return (
    <div className="space-y-6">
      <BreadcrumbLink to="/iot" label="Surveillance entrepôts" />

      <PageHeader
        title={site.entrepot_nom}
        subtitle={`${meta?.flag} ${site.pays_nom} — Suivi capteur température et humidité`}
        action={
          <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
            <span className={`rounded-full border px-4 py-1.5 text-sm font-medium ${statusClass}`}>
              {statusLabel}
            </span>
            <LastUpdated date={lastUpdate} onRefresh={load} />
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <InfoCard
          icon={<Thermometer className="text-amber-400" />}
          label="Température actuelle"
          value={site.temperature != null ? `${site.temperature} °C` : "—"}
          hint={`Plage ${site.seuils_temp}`}
        />
        <InfoCard
          icon={<Droplets className="text-sky-400" />}
          label="Humidité actuelle"
          value={site.humidite != null ? `${site.humidite} %` : "—"}
          hint={`Plage ${site.seuils_hum}`}
        />
        <InfoCard
          icon={<MapPin className="text-stone-400" />}
          label="Site"
          value={site.entrepot_nom}
          hint={site.pays_nom}
        />
        <InfoCard
          icon={<Clock className="text-stone-400" />}
          label="Dernière mesure"
          value={
            site.horodatage
              ? new Date(site.horodatage).toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "—"
          }
          hint={site.horodatage ? formatRelativeTime(site.horodatage) : ""}
        />
      </div>

      <div className="glass-card p-4 sm:p-6">
        <h2 className="font-display text-lg font-semibold text-white">Historique des mesures</h2>
        <p className="mt-1 mb-6 text-sm text-stone-500">
          Évolution de la température et de l'humidité dans l'entrepôt
        </p>
        <MesuresChart mesures={mesures} />
      </div>

      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-white">Plages de conservation</h3>
        <p className="mt-2 text-sm text-stone-400">
          Pour garantir la qualité du café vert, les conditions doivent rester entre{" "}
          <strong className="text-stone-300">{site.seuils_temp}</strong> et{" "}
          <strong className="text-stone-300">{site.seuils_hum}</strong> d'humidité relative.
          Toute déviation déclenche une alerte automatique auprès du responsable du site.
        </p>
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="glass-card p-4 sm:p-5">
      <div className="flex items-center gap-2 text-stone-500">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">{icon}</span>
        <p className="text-xs font-medium uppercase tracking-wider">{label}</p>
      </div>
      <p className="mt-3 font-display text-2xl font-bold text-white">{value}</p>
      {hint && <p className="mt-1 text-xs text-stone-500">{hint}</p>}
    </div>
  );
}
