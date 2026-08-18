import { Link, useRouterState } from "@tanstack/react-router";
import { Briefcase, Home, MessageCircle, Plus, User } from "lucide-react";

import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Início", icon: Home },
  { to: "/jobs", label: "Trabalhos", icon: Briefcase },
  { to: "/post", label: "Publicar", icon: Plus, primary: true },
  { to: "/messages", label: "Mensagens", icon: MessageCircle },
  { to: "/profile", label: "Perfil", icon: User },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border/70 bg-background/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl">
      <ul className="mx-auto flex w-full max-w-md items-end justify-between px-3 py-2">
        {items.map(({ to, label, icon: Icon, ...rest }) => {
          const primary = "primary" in rest && rest.primary;
          const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
          if (primary) {
            return (
              <li key={to} className="flex-1">
                <Link to={to} className="flex flex-col items-center gap-1" aria-label={label}>
                  <span className="bg-gradient-accent shadow-float -mt-5 flex size-12 items-center justify-center rounded-2xl text-primary-foreground">
                    <Icon className="size-6" />
                  </span>
                  <span className="text-[10px] font-semibold text-muted-foreground">{label}</span>
                </Link>
              </li>
            );
          }
          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl py-1 transition-colors",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className={cn("size-5", active && "stroke-[2.4]")} />
                <span className="text-[10px] font-semibold">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
