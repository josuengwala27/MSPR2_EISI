/** Libellés métier lisibles — masque les identifiants techniques côté client */

const ENTREPOT_LABELS: Record<string, string> = {
  "ENT-CO-BOGOTA-01": "Hub logistique Bogotá",
  "ENT-BR-SAO-PAULO-01": "Hub logistique São Paulo",
  "ENT-EC-QUITO-01": "Hub logistique Quito",
};

const EXPLOITATION_LABELS: Record<string, string> = {
  "EXP-CO-CUNDINAMARCA-01": "Région Cundinamarca",
  "EXP-CO-ANTIOQUIA-01": "Région Antioquia",
  "EXP-BR-SAO-PAULO-01": "Région São Paulo",
  "EXP-BR-MINAS-01": "Région Minas Gerais",
  "EXP-EC-PICHINCHA-01": "Région Pichincha",
  "EXP-EC-GUAYAS-01": "Région Guayas",
  "EXP-TEST": "Site de démonstration",
};

export function formatEntrepot(id: string): string {
  return ENTREPOT_LABELS[id] ?? "Entrepôt";
}

export function formatExploitation(id: string): string {
  return EXPLOITATION_LABELS[id] ?? "Exploitation";
}

export function formatRelativeTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "À l'instant";
  if (minutes < 60) return `Il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Il y a ${hours} h`;
  return new Date(iso).toLocaleString("fr-FR");
}
