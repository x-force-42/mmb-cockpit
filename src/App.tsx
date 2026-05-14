import { Route, Routes } from "react-router-dom";
import Hello from "./pages/Hello";
import RunsList from "./pages/RunsList";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Hello />} />
      <Route path="/runs" element={<RunsList />} />
    </Routes>
  );
}
