import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

import { JobCard } from "@/components/poppy/JobCard";
import { PoppyLogo } from "@/components/poppy/PoppyLogo";
import { Screen } from "@/components/poppy/Screen";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { formatKz, jobs, me } from "@/lib/poppy-data";

type Search = { category?: string | undefined };

export const Route = createFileRoute("/jobs/")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    category: typeof search['category'] === "string" ? (search['category'] as string) : undefined,
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
const expressOptions = ["Todos", "Só expresso", "Sem expresso"] as const;
const sortOptions = ["Mais recentes", "Maior valor", "Menor prazo", "Mais propostas"] as const;

// Rótulos das secções de filtro rápido — cada uma abre o painel já na secção certa.
const quickFilters = [
  { id: "level", label: "Nível" },
  { id: "express", label: "Expresso" },
  { id: "category", label: "Subcategoria" },
  { id: "payment", label: "Pagamento" },
  { id: "location", label: "Localização" },
  { id: "stats", label: "Estatísticas" },
] as const;

function JobsPage() {
  const { category } = Route.useSearch();
  const navigate = useNavigate({ from: "/jobs/" });
  const [query, setQuery] = useState("");
  const [type, setType] = useState<(typeof types)[number]>("Todos");
  const [level, setLevel] = useState<(typeof levels)[number]>("Todos");
  const [deadline, setDeadline] = useState<(typeof deadlines)[number]>("Qualquer");
  const [express, setExpress] = useState<(typeof expressOptions)[number]>("Todos");
  const [minBudget, setMinBudget] = useState(0);
  const [maxDistance, setMaxDistance] = useState(50);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState<(typeof sortOptions)[number]>("Mais recentes");
  const [openFilterSection, setOpenFilterSection] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);

  const results = useMemo(() => {
    const filtered = jobs.filter((j) => {
      if (category && j.category !== category) return false;
      if (query && !`${j.title} ${j.client} ${j.skills.join(" ")}`.toLowerCase().includes(query.toLowerCase()))
        return false;
      if (type !== "Todos" && j.type !== type) return false;
      if (level !== "Todos" && j.level !== level) return false;
      if (express === "Só expresso" && !j.express) return false;
      if (express === "Sem expresso" && j.express) return false;
      if (j.budget < minBudget) return false;
      if (j.clientRating < minRating) return false;
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
    });

    const sorted = [...filtered];
    if (sort === "Maior valor") sorted.sort((a, b) => b.budget - a.budget);
    if (sort === "Menor prazo") sorted.sort((a, b) => parseInt(a.deadline, 10) - parseInt(b.deadline, 10));
    if (sort === "Mais propostas") sorted.sort((a, b) => b.proposals - a.proposals);
    return sorted;
  }, [category, query, type, level, express, deadline, minBudget, minRating, maxDistance, sort]);

  const openFilters = (section: string) => {
    setOpenFilterSection(section);
    setSheetOpen(true);
  };

  return (
    <Screen>
      <header className="sticky top-0 z-20 -mx-4 border-b border-border/70 bg-background/85 px-4 py-3 backdrop-blur-lg">
        <div className="flex items-center gap-2">
          <PoppyLogo size={26} withText />
          <div className="flex-1" />

          {/* Carteira em resumo — mesmo padrão da página inicial */}
          <Link
            to="/billing"
            className="flex shrink-0 items-stretch divide-x divide-border overflow-hidden rounded-xl border border-border/70 bg-card"
            aria-label="Carteira"
          >
            <div className="px-2.5 py-1 text-right leading-tight">
              <p className="text-[8px] font-semibold uppercase tracking-wide text-muted-foreground">Pendente</p>
              <p className="text-[11px] font-bold text-foreground">{formatKz(me.pending)}</p>
            </div>
            <div className="px-2.5 py-1 text-right leading-tight">
              <p className="text-[8px] font-semibold uppercase tracking-wide text-muted-foreground">Pago</p>
              <p className="text-[11px] font-bold text-primary">{formatKz(me.balance)}</p>
            </div>
          </Link>

          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 rounded-full">
                <SlidersHorizontal className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-3xl">
              <SheetHeader>
                <SheetTitle>Filtrar trabalhos</SheetTitle>
              </SheetHeader>
              <div className="px-4 pb-8">
                <Accordion
                  type="single"
                  collapsible
                  value={openFilterSection}
                  onValueChange={(v) => setOpenFilterSection(v ?? "")}
                >
                  <AccordionItem value="level">
                    <AccordionTrigger>Nível de trabalho</AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-wrap gap-2">
                        {levels.map((l) => (
                          <Chip key={l} active={l === level} onClick={() => setLevel(l)}>
                            {l}
                          </Chip>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="express">
                    <AccordionTrigger>Trabalho expresso</AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-wrap gap-2">
                        {expressOptions.map((e) => (
                          <Chip key={e} active={e === express} onClick={() => setExpress(e)}>
                            {e}
                          </Chip>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="category">
                    <AccordionTrigger>Subcategoria</AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-wrap gap-2">
                        <Chip
                          active={!category}
                          onClick={() => navigate({ search: { category: undefined } })}
                        >
                          Todas
                        </Chip>
                        {Array.from(new Set(jobs.map((j) => j.category))).map((c) => (
                          <Chip key={c} active={category === c} onClick={() => navigate({ search: { category: c } })}>
                            {c}
                          </Chip>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="payment">
                    <AccordionTrigger>Pagamento</AccordionTrigger>
                    <AccordionContent>
                      <Label className="text-xs font-bold">Valor mínimo: {formatKz(minBudget)}</Label>
                      <Slider
                        className="mt-3"
                        value={[minBudget]}
                        max={1000000}
                        step={20000}
                        onValueChange={(v) => setMinBudget(v[0] ?? 0)}
                      />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="location">
                    <AccordionTrigger>Localização</AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {types.map((t) => (
                          <Chip key={t} active={t === type} onClick={() => setType(t)}>
                            {t}
                          </Chip>
                        ))}
                      </div>
                      <div>
                        <Label className="text-xs font-bold">Distância máxima: {maxDistance} km</Label>
                        <Slider
                          className="mt-3"
                          value={[maxDistance]}
                          max={50}
                          step={1}
                          onValueChange={(v) => setMaxDistance(v[0] ?? 50)}
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-bold">Prazo</Label>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {deadlines.map((d) => (
                            <Chip key={d} active={d === deadline} onClick={() => setDeadline(d)}>
                              {d}
                            </Chip>
                          ))}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="stats">
                    <AccordionTrigger>Estatísticas do empregador</AccordionTrigger>
                    <AccordionContent>
                      <Label className="text-xs font-bold">Avaliação mínima: {minRating.toFixed(1)} ★</Label>
                      <Slider
                        className="mt-3"
                        value={[minRating]}
                        max={5}
                        step={0.5}
                        onValueChange={(v) => setMinRating(v[0] ?? 0)}
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <p className="mt-2 text-center text-xs text-muted-foreground">
          {results.length} resultado{results.length === 1 ? "" : "s"}
        </p>

        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Procurar trabalho e pressionar enter..."
          className="mt-2 rounded-xl"
        />

        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Ordenar por</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="inline-flex items-center gap-1 text-xs font-bold text-accent">
                {sort} <ChevronDown className="size-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {sortOptions.map((s) => (
                <DropdownMenuItem key={s} onClick={() => setSort(s)}>
                  {s}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="-mx-4 mt-2 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
          {quickFilters.map((f) => (
            <button
              key={f.id}
              onClick={() => openFilters(f.id)}
              className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              {f.label} <ChevronDown className="size-3.5" />
            </button>
          ))}
        </div>
      </header>

      <div className="mt-3 space-y-3">
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
              onClick={() => navigate({ search: { category: undefined } })}
            >
              Limpar filtros
            </Button>
          </div>
        )}
      </div>
    </Screen>
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
