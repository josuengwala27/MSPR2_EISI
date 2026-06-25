import { useEffect, useState } from "react";

/** Rafraîchissement périodique pour données capteurs (effet temps réel) */
export function useAutoRefresh<T>(
  fetcher: () => Promise<T>,
  intervalMs = 60_000
): { data: T | null; loading: boolean; lastUpdate: Date | null; refresh: () => void } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const refresh = () => {
    fetcher()
      .then((result) => {
        setData(result);
        setLastUpdate(new Date());
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, intervalMs);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intervalMs]);

  return { data, loading, lastUpdate, refresh };
}
