import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase } from "lucide-react";

import { Screen } from "@/components/poppy/Screen";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Os meus projetos — Poppy" },
      {
        name: "description",
        content: "Acompanhe as suas propostas e projetos em curso no Poppy: estado, entregas e pagamentos.",
      },
      { property: "og:title", content: "Os meus projetos — Poppy" },
      { property: "og:description", content: "Propostas enviadas e trabalhos em curso no Poppy." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  return (
    <Screen>
      <header className="sticky top-0 z-20 -mx-4 mb-4 border-b border-border/70 bg-background/85 px-4 py-3 backdrop-blur-lg">
        <h1 className="text-base font-bold">Projetos</h1>
        <p className="text-xs text-muted-foreground">Propostas enviadas e trabalhos em curso</p>
      </header>

      <div className="rounded-2xl border border-dashed border-border bg-card/60 p-8 text-center">
        <span className="bg-primary-soft mx-auto flex size-12 items-center justify-center rounded-2xl text-primary">
          <Briefcase className="size-6" />
        </span>
        <p className="mt-4 text-sm font-semibold">Sem projetos por agora</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Envie uma proposta a um trabalho e acompanhe aqui o estado até ao pagamento.
        </p>
        <Button asChild size="sm" className="mt-4 rounded-xl">
          <Link to="/jobs">Procurar trabalhos</Link>
        </Button>
      </div>
    </Screen>
  );
}
