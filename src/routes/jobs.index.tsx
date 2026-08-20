import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";

import { JobCard } from "@/components/poppy/JobCard";
import { Screen } from "@/components/poppy/Screen";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { categories, formatKz, jobs } from "@/lib/poppy-data";

type Search = { category?: string };

export const Route = createFileRoute("/jobs/")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    category: typeof search.category === "string" ? search.category : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Trabalhos disponíveis — Poppy" },
      {
        name: "description",
        content: "Marketplace de trabalhos Poppy: filtre por categoria, valor, distância, prazo e nível de experiência.",
      },
      { property: "og:title", content: "Trabalhos disponíveis — Poppy" },
      { property: "og:description", content: "Encontre trabalhos remotos e presenciais e envie a sua proposta." },
    ],
  }),
  component: JobsPage,
});

const types = ["Todos", "Remoto", "Presencial", "Híbrido"] as const;
const levels = ["Todos", "Iniciante", "Intermediário", "Avançado"] as const;
const deadlines = ["Qualquer", "Até 7 dias", "Até 15 dias", "Mais de 15 dias"] as const;

function JobsPage() {
  const { category } = Route.useSearch();
  const navigate = useNavigate({ from: "/jobs" });
  const [query, setQuery] = useState("");
  const [type, setType] = useState<(typeof types)[number]>("Todos");
  const [level, setLevel] = useState<(typeof levels)[number]>("Todos");
  const [deadline, setDeadline] = useState<(typeof deadlines)[number]>("Qualquer");
  const [minBudget, setMinBudget] = useState(0);
  const [maxDistance, setMaxDistance] = useState(50);

  const results = useMemo(
    () =>
      jobs.filter((j) => {
        if (category && j.category !== category) return false;
        if (query && !`${j.title} ${j.client} ${j.skills.join(" ")}`.toLowerCase().includes(query.toLowerCase()))
          return false;
        if (type !== "Todos" && j.type !== type) return false;
        if (level !== "Todos" && j.level !== level) return false;
        if (j.budget < minBudget) return false;
        if (j.distanceKm && j.distanceKm > maxDistance) return false;
        if (deadline !== "Qualquer") {
          const days = parseInt(j.deadline, 10);
          if (!Number.isNaN(days)) {
            if (deadline === "Até 7 dias" && days > 7) return false;
            if (deadline === "Até 15 dias" && days > 15) return false;
            if (deadline === "Mais de 15 dias" && days <= 15) return false;
          }
        }
        return true;
      }),
    [category, query, type, level, deadline, minBudget, maxDistance],
  );

  const activeCategory = categories.find((c) => c.id === category);

  return (
    <Screen>
      <header className="sticky top-0 z-20 -mx-4 border-b border-border/70 bg-background/85 px-4 py-3 backdrop-blur-lg">
        <div className="flex items-center gap-2">
          <h1 className="flex-1 text-lg font-bold">Trabalhos</h1>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="rounded-full">
                <SlidersHorizontal className="size-4" /> Filtros
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-3xl">
              <SheetHeader>
                <SheetTitle>Filtrar trabalhos</SheetTitle>
              </SheetHeader>
              <div className="space-y-5 px-4 pb-8">
                <FilterGroup label="Tipo de trabalho">
                  {types.map((t) => (
                    <Chip key={t} active={t === type} onClick={() => setType(t)}>
                      {t}
                    </Chip>
                  ))}
                </FilterGroup>
                <FilterGroup label="Nível de experiência">
                  {levels.map((l) => (
                    <Chip key={l} active={l === level} onClick={() => setLevel(l)}>
                      {l}
                    </Chip>
                  ))}
                </FilterGroup>
                <FilterGroup label="Prazo">
                  {deadlines.map((d) => (
                    <Chip key={d} active={d === deadline} onClick={() => setDeadline(d)}>
                      {d}
                    </Chip>
                  ))}
                </FilterGroup>
                <div>
                  <Label className="text-xs font-bold">Valor mínimo: {formatKz(minBudget)}</Label>
                  <Slider
                    className="mt-3"
                    value={[minBudget]}
                    max={1000000}
                    step={20000}
                    onValueChange={(v) => setMinBudget(v[0])}
                  />
                </div>
                <div>
                  <Label className="text-xs font-bold">Distância máxima: {maxDistance} km</Label>
                  <Slider
                    className="mt-3"
                    value={[maxDistance]}
                    max={50}
                    step={1}
                    onValueChange={(v) => setMaxDistance(v[0])}
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Procurar por título, empresa ou habilidade"
          className="mt-3 rounded-xl"
        />
      </header>

      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {results.length} trabalho{results.length === 1 ? "" : "s"} encontrado{results.length === 1 ? "" : "s"}
        </p>
      </div>


      <div className="space-y-3">
        {results.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
        {results.length === 0 && jobs.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center">
            <p className="text-sm font-semibold">Ainda não há trabalhos publicados</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Assim que uma empresa publicar uma vaga, ela aparece aqui. Também pode publicar um trabalho.
            </p>
            <Button asChild size="sm" className="mt-4 rounded-xl">
              <Link to="/post">Publicar um trabalho</Link>
            </Button>
          </div>
        )}
        {results.length === 0 && jobs.length > 0 && (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center">
            <p className="text-sm font-semibold">Nenhum trabalho corresponde aos filtros</p>
            <p className="mt-1 text-xs text-muted-foreground">Ajuste os filtros para ver mais resultados.</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 rounded-xl"
              onClick={() => navigate({ search: {} })}
            >
              Limpar filtros
            </Button>
          </div>
        )}
      </div>
    </Screen>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-xs font-bold">{label}</Label>
      <div className="mt-2 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors " +
        (active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:text-foreground")
      }
    >
      {children}
    </button>
  );
}
