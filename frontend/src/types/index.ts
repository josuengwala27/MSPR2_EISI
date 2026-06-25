export type StatutLot = "conforme" | "alerte" | "perime";
export type StatutBackend = "complet" | "mock" | "indisponible";

export interface PaysResume {
  code: string;
  nom: string;
  statut_backend: StatutBackend;
  url_backend: string;
  disponible: boolean;
  message_erreur?: string | null;
}

export interface Lot {
  id: string;
  pays: string;
  exploitation: string;
  entrepot: string;
  date_stockage: string;
  statut: StatutLot;
}

export interface LotConsolide extends Lot {
  pays_nom: string;
  source: StatutBackend;
}

export interface Mesure {
  id?: number;
  entrepot: string;
  lot_id?: string | null;
  temperature: number;
  humidite: number;
  horodatage: string;
  device_id?: string | null;
}

export interface Alerte {
  id: number;
  type: string;
  lot_id: string;
  pays: string;
  message: string;
  created_at: string;
  resolue: boolean;
  email_envoye?: boolean;
  pays_nom?: string;
}

export interface StocksConsolides {
  total_lots: number;
  par_pays: Record<string, number>;
  lots: LotConsolide[];
}

export interface AlertesConsolidees {
  total: number;
  par_pays: Record<string, number>;
  alertes: Alerte[];
}

export const COUNTRY_META: Record<string, { flag: string; gradient: string; seuils: string }> = {
  CO: { flag: "🇨🇴", gradient: "from-amber-500/20 to-yellow-600/5", seuils: "23–29 °C · 78–82 %" },
  BR: { flag: "🇧🇷", gradient: "from-emerald-500/20 to-green-600/5", seuils: "26–32 °C · 53–57 %" },
  EC: { flag: "🇪🇨", gradient: "from-sky-500/20 to-blue-600/5", seuils: "28–34 °C · 58–62 %" },
};
