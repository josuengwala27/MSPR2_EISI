import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { DashboardPage } from "./pages/DashboardPage";
import { PaysListPage, CountryLotsPage } from "./pages/PaysPage";
import { LotDetailPage } from "./pages/LotDetailPage";
import { AlertesPage } from "./pages/AlertesPage";
import { IotPage } from "./pages/IotPage";
import { IotDetailPage } from "./pages/IotDetailPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="pays" element={<PaysListPage />} />
          <Route path="pays/:code" element={<CountryLotsPage />} />
          <Route path="pays/:code/lots/:lotId" element={<LotDetailPage />} />
          <Route path="iot" element={<IotPage />} />
          <Route path="iot/:code" element={<IotDetailPage />} />
          <Route path="alertes" element={<AlertesPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
