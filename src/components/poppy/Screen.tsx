import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Screen({
  children,
  className,
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <main className={cn("mx-auto w-full max-w-md pb-28", padded && "px-4", className)}>{children}</main>
  );
}

export function ScreenHeader({
  title,
  subtitle,
  back = "/",
  action,
}: {
  title: string;
  subtitle?: string;
  back?: string;
  action?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-20 -mx-4 mb-4 flex items-center gap-3 border-b border-border/70 bg-background/85 px-4 py-3 backdrop-blur-lg">
      <Link
        to={back}
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-colors hover:bg-primary-soft"
        aria-label="Voltar"
      >
        <ChevronLeft className="size-5" />
      </Link>
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-base font-bold">{title}</h1>
        {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </header>
  );
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-3 mt-6 flex items-center justify-between">
      <h2 className="text-sm font-bold tracking-tight">{children}</h2>
      {action}
    </div>
  );
}
