import { Link } from "react-router-dom";
import { Thermometer, Droplets, Radio, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { api } from "../api/client";
import type { SurveillanceEntrepot } from "../types";
import { COUNTRY_META } from "../types";
import { PageHeader } from "../components/Layout";
import { LastUpdated } from "../components/LastUpdated";
import { useAutoRefresh } from "../hooks/useAutoRefresh";
import { formatRelativeTime } from "../utils/labels";

export function IotPage() {
  const { data: sites, loading, lastUpdate, refresh } = useAutoRefresh(() => api.getSurveillance());

  return (
    <div className="space-y-8">
      <PageHeader
        title="Surveillance des entrepôts"
        subtitle="Température et humidité en temps réel dans vos zones de stockage café vert."
        action={<LastUpdated date={lastUpdate} onRefresh={refresh} />}
      />

      {loading && !sites ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-56 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {(sites ?? []).map((site) => (
            <EntrepotCard key={site.pays} site={site} />
          ))}
        </div>
      )}

      <div className="glass-card p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-coffee-500/20">
            <Radio className="h-6 w-6 text-coffee-400" />
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold text-white">Capteurs connectés</h2>
            <p className="mt-2 text-sm leading-relaxed text-stone-400">
              Chaque entrepôt est équipé d'un capteur de température et d'humidité. Les mesures
              sont transmises automatiquement et comparées aux plages de conservation recommandées
              pour le café vert.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function EntrepotCard({ site }: { site: SurveillanceEntrepot }) {
  const meta = COUNTRY_META[site.pays];
  const ok = site.conditions_ok === true;
  const ko = site.conditions_ok === false;

  return (
    <Link
      to={`/iot/${site.pays}`}
      className="glass-card-hover group relative block overflow-hidden p-5 sm:p-6"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${meta?.gradient ?? ""} to-transparent opacity-60`} />
      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-2xl">{meta?.flag}</span>
            <h3 className="mt-2 font-display text-xl font-bold text-white group-hover:text-coffee-300">
              {site.entrepot_nom}
            </h3>
            <p className="text-sm text-stone-500">{site.pays_nom}</p>
          </div>
          {site.actif ? (
            ko ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-medium text-amber-300">
                <AlertCircle className="h-3.5 w-3.5" /> Attention
              </span>
            ) : ok ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5" /> Optimal
              </span>
            ) : null
          ) : (
            <span className="rounded-full bg-stone-700/50 px-2.5 py-1 text-xs text-stone-400">
              Indisponible
            </span>
          )}
        </div>

        {site.actif && site.temperature != null ? (
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-black/20 p-3">
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <Thermometer className="h-4 w-4 text-amber-400" /> Température
              </div>
              <p className="mt-1 font-display text-2xl font-bold text-white">{site.temperature}°C</p>
              <p className="mt-0.5 text-[11px] text-stone-500">Cible {site.seuils_temp}</p>
            </div>
            <div className="rounded-xl bg-black/20 p-3">
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <Droplets className="h-4 w-4 text-sky-400" /> Humidité
              </div>
              <p className="mt-1 font-display text-2xl font-bold text-white">{site.humidite}%</p>
              <p className="mt-0.5 text-[11px] text-stone-500">Cible {site.seuils_hum}</p>
            </div>
          </div>
        ) : (
          <p className="mt-6 text-sm text-stone-500">Données momentanément indisponibles</p>
        )}

        {site.horodatage && (
          <p className="mt-4 text-xs text-stone-600">
            Dernière mesure : {formatRelativeTime(site.horodatage)}
          </p>
        )}

        <span className="mt-4 inline-flex items-center gap-2 text-sm text-coffee-400">
          Voir la fiche <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
