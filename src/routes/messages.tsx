import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";

import { Screen } from "@/components/poppy/Screen";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/messages")({
  head: () => ({
    meta: [
      { title: "Mensagens — Poppy" },
      {
        name: "description",
        content: "Converse com clientes e trabalhadores no Poppy: propostas, detalhes das tarefas e entregas.",
      },
      { property: "og:title", content: "Mensagens — Poppy" },
      { property: "og:description", content: "As suas conversas sobre propostas e tarefas no Poppy." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MessagesPage,
});

function MessagesPage() {
  return (
    <Screen>
      <header className="sticky top-0 z-20 -mx-4 mb-4 border-b border-border/70 bg-background/85 px-4 py-3 backdrop-blur-lg">
        <h1 className="text-base font-bold">Mensagens</h1>
        <p className="text-xs text-muted-foreground">Conversas com clientes e trabalhadores</p>
      </header>

      <div className="rounded-2xl border border-dashed border-border bg-card/60 p-8 text-center">
        <span className="bg-primary-soft mx-auto flex size-12 items-center justify-center rounded-2xl text-primary">
          <MessageCircle className="size-6" />
        </span>
        <p className="mt-4 text-sm font-semibold">Ainda não tem conversas</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Quando enviar uma proposta ou receber um convite, a conversa aparece aqui.
        </p>
        <Button asChild size="sm" className="mt-4 rounded-xl">
          <Link to="/jobs">Ver trabalhos</Link>
        </Button>
      </div>
    </Screen>
  );
}
