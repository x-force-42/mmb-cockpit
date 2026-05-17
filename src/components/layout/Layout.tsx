import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

// Sidebar fixa (sem drawer mobile no MVP): cockpit é ferramenta interna
// de desktop; F3+ revisita responsividade se aparecer caso real.
export function Layout() {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    return localStorage.getItem("mmb-sidebar-collapsed") === "1";
  });

  useEffect(() => {
    localStorage.setItem("mmb-sidebar-collapsed", collapsed ? "1" : "0");
  }, [collapsed]);

  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="light"
      enableSystem={false}
      themes={["light", "dark"]}
      storageKey="mmb-theme"
      disableTransitionOnChange
    >
      <div
        data-testid="layout-grid"
        className={cn(
          "grid h-screen overflow-hidden grid-rows-[auto_1fr] bg-muted/30",
          collapsed ? "grid-cols-[3rem_1fr]" : "grid-cols-[14rem_1fr]",
        )}
      >
        <div className="col-span-2">
          <Header
            collapsed={collapsed}
            onToggleSidebar={() => setCollapsed((c) => !c)}
          />
        </div>
        <aside className="border-r bg-background overflow-hidden">
          <Sidebar collapsed={collapsed} />
        </aside>
        <main className="overflow-auto p-6">
          <Outlet />
        </main>
        <Toaster richColors position="top-right" />
      </div>
    </ThemeProvider>
  );
}
