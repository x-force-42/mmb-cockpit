import {
  Activity,
  FolderKanban,
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
  { to: "/projetos", label: "Projetos", end: false, icon: FolderKanban },
  { to: "/epicos", label: "Épicos", end: false, icon: Target },
  { to: "/ciclos", label: "Ciclos", end: false, icon: Activity },
];

interface SidebarProps {
  collapsed: boolean;
}

export function Sidebar({ collapsed }: SidebarProps) {
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
            title={collapsed ? item.label : undefined}
            aria-label={collapsed ? item.label : undefined}
            className={({ isActive }) =>
              cn(
                "group relative flex items-center rounded-md py-2 text-sm transition-colors",
                collapsed ? "justify-center px-0" : "gap-2.5 px-2.5",
                isActive
                  ? "bg-primary/10 font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )
            }
          >
            {({ isActive }) => (
              <>
                {!collapsed && (
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-y-1 left-0 w-0.5 rounded-full transition-colors",
                      isActive ? "bg-primary" : "bg-transparent",
                    )}
                  />
                )}
                <Icon
                  className={cn(
                    "size-4 shrink-0 transition-colors",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-foreground",
                  )}
                />
                {!collapsed && <span>{item.label}</span>}
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
