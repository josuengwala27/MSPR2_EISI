import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import type { Mesure } from "../types";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface Props {
  mesures: Mesure[];
}

export function MesuresChart({ mesures }: Props) {
  const sorted = [...mesures].sort(
    (a, b) => new Date(a.horodatage).getTime() - new Date(b.horodatage).getTime()
  );

  const labels = sorted.map((m) =>
    new Date(m.horodatage).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
  );

  const data = {
    labels,
    datasets: [
      {
        label: "Température (°C)",
        data: sorted.map((m) => m.temperature),
        borderColor: "#f59e0b",
        backgroundColor: "rgba(245, 158, 11, 0.08)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 7,
        yAxisID: "y",
      },
      {
        label: "Humidité (%)",
        data: sorted.map((m) => m.humidite),
        borderColor: "#38bdf8",
        backgroundColor: "rgba(56, 189, 248, 0.06)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 7,
        yAxisID: "y1",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index" as const, intersect: false },
    plugins: {
      legend: {
        position: "top" as const,
        labels: { color: "#a8a29e", usePointStyle: true, padding: 20 },
      },
      tooltip: {
        backgroundColor: "#1c1917",
        borderColor: "rgba(255,255,255,0.1)",
        borderWidth: 1,
        titleColor: "#fafaf9",
        bodyColor: "#d6d3d1",
        padding: 12,
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(255,255,255,0.04)" },
        ticks: { color: "#78716c", maxRotation: 45 },
      },
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        grid: { color: "rgba(255,255,255,0.04)" },
        ticks: { color: "#f59e0b" },
        title: { display: true, text: "C", color: "#78716c" },
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        grid: { drawOnChartArea: false },
        ticks: { color: "#38bdf8" },
        title: { display: true, text: "%", color: "#78716c" },
      },
    },
  };

  if (sorted.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2 text-stone-500">
        <p>Aucune mesure disponible pour le moment.</p>
        <p className="text-xs text-stone-600">Les données apparaîtront dès la prochaine transmission capteur.</p>
      </div>
    );
  }

  return (
    <div className="h-64 sm:h-72 lg:h-80">
      <Line data={data} options={options} />
    </div>
  );
}
