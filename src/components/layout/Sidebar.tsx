import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/epicos", label: "Épicos", end: false },
  { to: "/ciclos", label: "Ciclos", end: false },
] as const;

export function Sidebar() {
  return (
    <nav
      aria-label="Navegação principal"
      className="flex flex-col gap-0.5 px-2 py-3"
    >
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            cn(
              "rounded-md px-2 py-1.5 text-sm transition-colors",
              isActive
                ? "bg-muted font-medium text-foreground"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
            )
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
