import { Link } from "@tanstack/react-router";
import { Clock, MapPin, Users } from "lucide-react";

import { formatKz, type Job } from "@/lib/poppy-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function JobCard({ job }: { job: Job }) {
  return (
    <article className="shadow-card rounded-2xl border border-border/70 bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[15px] font-bold leading-snug">{job.title}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{job.client}</p>
        </div>
        <Badge variant={job.type === "Remoto" ? "secondary" : "outline"} className="shrink-0 rounded-full">
          {job.type}
        </Badge>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="font-display text-sm font-bold text-primary">
          {formatKz(job.budget)}
          {job.budgetType === "hora" && <span className="text-xs font-medium">/h</span>}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="size-3.5" /> {job.deadline}
        </span>
        {job.location && (
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3.5" /> {job.location}
          </span>
        )}
        <span className="inline-flex items-center gap-1">
          <Users className="size-3.5" /> {job.proposals} propostas
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {job.skills.map((s) => (
          <span key={s} className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-secondary-foreground">
            {s}
          </span>
        ))}
      </div>

      <Button asChild className="mt-4 w-full rounded-xl" size="sm">
        <Link to="/jobs/$jobId" params={{ jobId: job.id }}>
          Ver trabalho
        </Link>
      </Button>
    </article>
  );
}
