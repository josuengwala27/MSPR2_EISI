const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api/v1";

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) {
    throw new Error(`API ${response.status}: ${path}`);
  }
  return response.json() as Promise<T>;
}

export const api = {
  getPays: () => fetchJson<import("../types").PaysResume[]>("/pays"),
  getStocks: () => fetchJson<import("../types").StocksConsolides>("/stocks"),
  getAlertes: () => fetchJson<import("../types").AlertesConsolidees>("/alertes/consolidees"),
  getLots: (code: string) => fetchJson<import("../types").Lot[]>(`/pays/${code}/lots`),
  getLot: (code: string, lotId: string) =>
    fetchJson<import("../types").Lot>(`/pays/${code}/lots/${lotId}`),
  getMesures: (code: string, lotId: string) =>
    fetchJson<import("../types").Mesure[]>(`/pays/${code}/lots/${lotId}/mesures`),
  getAlertesPays: (code: string) =>
    fetchJson<import("../types").Alerte[]>(`/pays/${code}/alertes`),
  getSurveillance: () => fetchJson<import("../types").SurveillanceEntrepot[]>("/iot/surveillance"),
  getSurveillancePays: (code: string) =>
    fetchJson<import("../types").SurveillanceEntrepot>(`/iot/surveillance/${code}`),
};
