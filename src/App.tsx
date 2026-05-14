import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { DashboardPage } from "./features/dashboard/pages/DashboardPage";
import { RunDetailPage } from "./features/runs/pages/RunDetailPage";
import { RunsListPage } from "./features/runs/pages/RunsListPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/runs" element={<RunsListPage />} />
        <Route path="/runs/:id" element={<RunDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
