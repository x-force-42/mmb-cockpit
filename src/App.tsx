import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import Hello from "./pages/Hello";
import RunsList from "./pages/RunsList";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Hello />} />
        <Route path="/runs" element={<RunsList />} />
      </Route>
    </Routes>
  );
}
