import { Link } from "@tanstack/react-router";
import { BarChart3, Eye, EyeOff, Lock, SquareArrowOutUpRight } from "lucide-react";
import { useState } from "react";

import { formatKz, levelCode, type Job } from "@/lib/poppy-data";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export function JobCard({ job }: { job: Job }) {
  const [hidden, setHidden] = useState(false);

  const hasSlots = typeof job.slotsTotal === "number" && typeof job.slotsRemaining === "number";
  const slotsPct = hasSlots && job.slotsTotal! > 0 ? (job.slotsRemaining! / job.slotsTotal!) * 100 : 0;

  if (hidden) {
    return (
      <div className="flex items-center justify-between rounded-2xl border border-dashed border-border/70 bg-card/60 px-4 py-3">
        <p className="truncate text-xs text-muted-foreground">Trabalho ocultado: {job.title}</p>
        <button
          onClick={() => setHidden(false)}
          className="shrink-0 text-xs font-semibold text-primary"
        >
          Mostrar
        </button>
      </div>
    );
  }

  return (
    <Link
      to="/jobs/$jobId"
      params={{ jobId: job.id }}
      className="shadow-card group block rounded-2xl border-l-4 border-l-primary border-y border-r border-border/70 bg-card p-4 transition-colors hover:border-l-accent"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[15px] font-bold leading-snug">{job.title}</h3>
        <div className="flex shrink-0 items-center gap-2 text-muted-foreground">
          <SquareArrowOutUpRight className="size-4" />
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setHidden(true);
            }}
            aria-label="Ocultar trabalho"
            className="hover:text-foreground"
          >
            {hidden ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
          </button>
        </div>
      </div>

      {(job.featured || job.express) && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {job.featured && (
            <Badge className="rounded-md bg-primary/90 text-primary-foreground hover:bg-primary/90">DESTAQUE</Badge>
          )}
          {job.express && (
            <Badge className="rounded-md bg-accent text-accent-foreground hover:bg-accent">EXPRESSO</Badge>
          )}
        </div>
      )}

      <div className="mt-2 flex items-center gap-2">
        <span className="rounded-md bg-success/15 px-1.5 py-0.5 text-[11px] font-bold text-success">
          {levelCode(job.level)}
        </span>
        {job.tier && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <BarChart3 className="size-3.5" /> {job.tier}
          </span>
        )}
      </div>

      <div className="mt-2.5 flex flex-col gap-1.5">
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Lock className="size-3.5" /> Requisitos — desbloqueados após aceitar
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Lock className="size-3.5" /> Instruções — desbloqueadas após aceitar
        </span>
      </div>

      <div className="mt-3 flex items-end justify-between gap-3">
        <div className="min-w-0 flex-1">
          {hasSlots ? (
            <>
              <p className="text-xs text-muted-foreground">
                {job.slotsRemaining} de {job.slotsTotal} restantes
              </p>
              <Progress value={slotsPct} className="mt-1.5 h-1.5" />
            </>
          ) : (
            <p className="text-xs text-muted-foreground">{job.proposals} propostas</p>
          )}
        </div>
        <div className="shrink-0 text-right">
          <p className="font-display text-base font-bold text-primary">
            {formatKz(job.budget)}
            {job.budgetType === "hora" && <span className="text-xs font-medium">/h</span>}
          </p>
          <p className="text-[11px] text-muted-foreground">{job.rateLabel ?? job.deadline}</p>
        </div>
      </div>
    </Link>
  );
}
