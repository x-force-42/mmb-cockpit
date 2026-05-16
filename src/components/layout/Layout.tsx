import { ThemeProvider } from "next-themes";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

// Sidebar fixa (sem drawer mobile no MVP): cockpit é ferramenta interna
// de desktop; F3+ revisita responsividade se aparecer caso real.
export function Layout() {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="light"
      enableSystem={false}
      themes={["light", "dark"]}
      storageKey="mmb-theme"
      disableTransitionOnChange
    >
      <div className="grid min-h-screen grid-cols-[14rem_1fr] grid-rows-[auto_1fr] bg-muted/30">
        <div className="col-span-2">
          <Header />
        </div>
        <aside className="border-r bg-background">
          <Sidebar />
        </aside>
        <main className="p-6">
          <Outlet />
        </main>
        <Toaster richColors position="top-right" />
      </div>
    </ThemeProvider>
  );
}
