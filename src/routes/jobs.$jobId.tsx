import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Building2, Clock, MapPin, Star, Users } from "lucide-react";

import { Screen, ScreenHeader, SectionTitle } from "@/components/poppy/Screen";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatKz, jobs } from "@/lib/poppy-data";

export const Route = createFileRoute("/jobs/$jobId")({
  loader: ({ params }) => {
    const job = jobs.find((j) => j.id === params.jobId);
    if (!job) throw notFound();
    return { job };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Trabalho indisponível — Poppy" }, { name: "robots", content: "noindex" }] };
    }
    const { job } = loaderData;
    return {
      meta: [
        { title: `${job.title} — Poppy` },
        { name: "description", content: `${job.client} · ${formatKz(job.budget)} · prazo ${job.deadline}.` },
        { property: "og:title", content: `${job.title} — Poppy` },
        { property: "og:description", content: `${job.client} · ${formatKz(job.budget)} · ${job.type}` },
      ],
    };
  },
  component: JobDetail,
});

function JobDetail() {
  const { job } = Route.useLoaderData();

  return (
    <Screen>
      <ScreenHeader title={job.title} subtitle={job.client} back="/jobs" />

      <div className="shadow-card rounded-2xl border border-border/70 bg-card p-4">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <Building2 className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold">{job.client}</p>
            <p className="text-xs text-muted-foreground">
              {job.clientRating} ★ · {job.clientJobs} trabalhos publicados
            </p>
          </div>
          <Badge variant="secondary" className="rounded-full">
            {job.type}
          </Badge>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
          <Info label="Orçamento" value={`${formatKz(job.budget)}${job.budgetType === "hora" ? "/h" : ""}`} />
          <Info label="Prazo" value={job.deadline} icon={<Clock className="size-3.5" />} />
          <Info label="Nível" value={job.level} />
          <Info label="Propostas" value={`${job.proposals}`} icon={<Users className="size-3.5" />} />
          {job.location && <Info label="Localização" value={job.location} icon={<MapPin className="size-3.5" />} />}
        </div>
      </div>

      <SectionTitle>Descrição</SectionTitle>
      <p className="text-sm leading-relaxed text-muted-foreground">{job.description}</p>

      <SectionTitle>Requisitos</SectionTitle>
      <ul className="space-y-2">
        {job.requirements.map((r) => (
          <li key={r} className="flex gap-2 text-sm text-muted-foreground">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
            {r}
          </li>
        ))}
      </ul>

      <SectionTitle>Habilidades necessárias</SectionTitle>
      <div className="flex flex-wrap gap-2">
        {job.skills.map((s) => (
          <span key={s} className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium">
            {s}
          </span>
        ))}
      </div>

      <SectionTitle>Sobre o cliente</SectionTitle>
      <div className="shadow-card rounded-2xl border border-border/70 bg-card p-4">
        <div className="flex items-center gap-1 text-sm font-bold">
          {job.clientRating}
          <Star className="size-4 fill-accent text-accent" />
          <span className="ml-2 text-xs font-medium text-muted-foreground">Avaliação do cliente</span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Pagamentos verificados · resposta média em 4 horas · {job.clientJobs} contratações no Poppy.
        </p>
      </div>

      <div className="fixed inset-x-0 bottom-[76px] z-20 mx-auto max-w-md px-4">
        <Button asChild className="w-full rounded-xl" size="lg">
          <Link to="/jobs/$jobId/proposal" params={{ jobId: job.id }}>
            Enviar proposta
          </Link>
        </Button>
      </div>
    </Screen>
  );
}

function Info({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-secondary/60 p-3">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="mt-0.5 inline-flex items-center gap-1 text-sm font-bold">
        {icon}
        {value}
      </p>
    </div>
  );
}
