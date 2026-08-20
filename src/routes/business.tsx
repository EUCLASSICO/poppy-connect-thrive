import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, Check } from "lucide-react";

import { Screen, SectionTitle } from "@/components/poppy/Screen";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/business")({
  head: () => ({
    meta: [
      { title: "Poppy Business — Contrate talento rapidamente" },
      {
        name: "description",
        content: "Poppy Business: publique tarefas, receba propostas de profissionais verificados e pague com segurança.",
      },
      { property: "og:title", content: "Poppy Business — Contrate talento rapidamente" },
      { property: "og:description", content: "Publique tarefas e contrate profissionais verificados no Poppy." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: BusinessPage,
});

const benefits = [
  "Publique tarefas em minutos, sem custos de anúncio",
  "Receba propostas de profissionais com identidade verificada",
  "Pagamento retido até aprovar a entrega",
  "Histórico e avaliações de cada trabalhador",
];

function BusinessPage() {
  return (
    <Screen>
      <header className="sticky top-0 z-20 -mx-4 mb-4 border-b border-border/70 bg-background/85 px-4 py-3 backdrop-blur-lg">
        <h1 className="text-base font-bold">Poppy Business</h1>
        <p className="text-xs text-muted-foreground">Para empresas e equipas</p>
      </header>

      <section className="shadow-card rounded-3xl border border-border bg-card p-5">
        <span className="bg-primary-soft flex size-12 items-center justify-center rounded-2xl text-primary">
          <Building2 className="size-6" />
        </span>
        <h2 className="mt-4 text-lg font-bold">Contrate talento verificado</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Publique um trabalho ou micro tarefa e escolha entre propostas de profissionais avaliados pela
          comunidade Poppy.
        </p>
        <Button asChild className="mt-4 w-full rounded-xl" size="lg">
          <Link to="/post">Publicar um trabalho</Link>
        </Button>
      </section>

      <SectionTitle>Porquê o Poppy</SectionTitle>
      <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
        {benefits.map((b) => (
          <li key={b} className="flex items-start gap-3 p-4">
            <Check className="mt-0.5 size-4 shrink-0 text-primary" />
            <p className="text-sm">{b}</p>
          </li>
        ))}
      </ul>
    </Screen>
  );
}
