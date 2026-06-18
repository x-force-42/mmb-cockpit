import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { CicloDetailPage } from "./features/ciclos/pages/CicloDetailPage";
import { CiclosListPage } from "./features/ciclos/pages/CiclosListPage";
import { DashboardPage } from "./features/dashboard/pages/DashboardPage";
import { EpicoDetailPage } from "./features/epicos/pages/EpicoDetailPage";
import { EpicosListPage } from "./features/epicos/pages/EpicosListPage";
import { ProjetoDetailPage } from "./features/projetos/pages/ProjetoDetailPage";
import { ProjetosListPage } from "./features/projetos/pages/ProjetosListPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/epicos" element={<EpicosListPage />} />
        <Route path="/epicos/:id" element={<EpicoDetailPage />} />
        <Route path="/ciclos" element={<CiclosListPage />} />
        <Route path="/ciclos/:id" element={<CicloDetailPage />} />
        <Route path="/projetos" element={<ProjetosListPage />} />
        <Route path="/projetos/:id" element={<ProjetoDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
