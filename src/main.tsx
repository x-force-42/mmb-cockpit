import { QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { queryClient } from "./api/queryClient";
import "./index.css";

const root = document.getElementById("root");
if (!root) throw new Error("Elemento #root não encontrado no index.html");

async function enableMocking(): Promise<void> {
  if (import.meta.env.VITE_ENABLE_MSW !== "true") return;
  const { worker } = await import("./api/mocks/browser");
  await worker.start({ onUnhandledRequest: "bypass" });
}

enableMocking().then(() => {
  createRoot(root).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </StrictMode>,
  );
});
