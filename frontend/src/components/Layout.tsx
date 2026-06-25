import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Radio,
  Bell,
  Menu,
  X,
  Coffee,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const nav = [
  { to: "/", icon: LayoutDashboard, label: "Tableau de bord", short: "Accueil" },
  { to: "/pays", icon: Package, label: "Stocks", short: "Stocks" },
  { to: "/iot", icon: Radio, label: "Capteurs", short: "Capteurs" },
  { to: "/alertes", icon: Bell, label: "Alertes", short: "Alertes" },
];

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex min-h-dvh">
      {sidebarOpen && (
        <button
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={closeSidebar}
          aria-label="Fermer le menu"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/5 bg-surface/95 backdrop-blur-xl transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/5 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-coffee-500 to-coffee-700 shadow-glow">
              <Coffee className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-display text-lg font-bold text-white">FutureKawa</p>
              <p className="text-xs text-stone-500">Suivi café vert</p>
            </div>
          </div>
          <button className="rounded-lg p-2 text-stone-400 hover:bg-white/5 lg:hidden" onClick={closeSidebar}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {nav.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-coffee-500/15 text-coffee-300 shadow-inner"
                    : "text-stone-400 hover:bg-white/5 hover:text-stone-200"
                }`
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/5 p-4">
          <div className="rounded-xl bg-gradient-to-br from-coffee-900/40 to-transparent p-4">
            <p className="text-xs font-medium text-coffee-300">Traçabilite multi-sites</p>
            <p className="mt-1 text-xs text-stone-500">Colombie · Brésil · Équateur</p>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-white/5 bg-[#0a0908]/80 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
          <button
            className="rounded-xl border border-white/10 p-2.5 text-stone-300 hover:bg-white/5 lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Ouvrir le menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-stone-500">
              FutureKawa / <span className="text-stone-300">{breadcrumb(location.pathname)}</span>
            </p>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

        <nav className="fixed bottom-0 left-0 right-0 z-30 flex border-t border-white/10 bg-surface/95 backdrop-blur-xl lg:hidden">
          {nav.map(({ to, icon: Icon, short }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex flex-1 flex-col items-center gap-1 py-3 text-[10px] font-medium ${
                  isActive ? "text-coffee-400" : "text-stone-500"
                }`
              }
            >
              <Icon className="h-5 w-5" />
              <span>{short}</span>
            </NavLink>
          ))}
        </nav>
        <div className="h-16 lg:hidden" />
      </div>
    </div>
  );
}

function breadcrumb(path: string): string {
  if (path === "/") return "Tableau de bord";
  if (path.startsWith("/iot/")) return "Fiche entrepôt";
  if (path === "/iot") return "Capteurs";
  if (path.startsWith("/pays/") && path.split("/").length > 3) return "Détail du lot";
  if (path.startsWith("/pays/")) return "Lots";
  if (path === "/pays") return "Stocks";
  if (path === "/alertes") return "Alertes";
  return "Accueil";
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="animate-fade-in">
        <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
          {title}
        </h1>
        {subtitle && <p className="mt-2 max-w-2xl text-sm text-stone-400 sm:text-base">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function BreadcrumbLink({ to, label }: { to: string; label: string }) {
  return (
    <NavLink to={to} className="mb-4 inline-flex items-center gap-1 text-sm text-coffee-400 hover:text-coffee-300">
      <ChevronRight className="h-4 w-4 rotate-180" />
      {label}
    </NavLink>
  );
}
