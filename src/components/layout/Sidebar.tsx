import {
  Activity,
  LayoutDashboard,
  type LucideIcon,
  Target,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavItem {
  to: string;
  label: string;
  end: boolean;
  icon: LucideIcon;
}

const NAV_ITEMS: readonly NavItem[] = [
  { to: "/", label: "Dashboard", end: true, icon: LayoutDashboard },
  { to: "/epicos", label: "Épicos", end: false, icon: Target },
  { to: "/ciclos", label: "Ciclos", end: false, icon: Activity },
];

export function Sidebar() {
  return (
    <nav
      aria-label="Navegação principal"
      className="flex flex-col gap-0.5 px-2 py-3"
    >
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                "group relative flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
                isActive
                  ? "bg-primary/10 font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )
            }
          >
            {({ isActive }) => (
              <>
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-y-1 left-0 w-0.5 rounded-full transition-colors",
                    isActive ? "bg-primary" : "bg-transparent",
                  )}
                />
                <Icon
                  className={cn(
                    "size-4 transition-colors",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-foreground",
                  )}
                />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
