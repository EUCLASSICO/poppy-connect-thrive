import { createFileRoute, Link } from "@tanstack/react-router";
import { CircleUserRound, FileText, ShieldCheck, Wallet, Zap } from "lucide-react";

import { PoppyLogo } from "@/components/poppy/PoppyLogo";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/welcome")({
  head: () => ({
    meta: [
      { title: "Poppy — Micro tarefas e trabalho freelance" },
      {
        name: "description",
        content: "Crie a sua conta gratuita e comece a ganhar com micro tarefas e trabalhos freelance em Poppy.",
      },
    ],
  }),
  component: WelcomePage,
});

const steps = [
  {
    icon: CircleUserRound,
    title: "Crie a sua conta",
    description: "Registo gratuito em poucos minutos, com o seu ID Poppy ou Gmail.",
  },
  {
    icon: Zap,
    title: "Escolha uma tarefa",
    description: "Micro tarefas rápidas ou trabalhos freelance maiores, filtrados por categoria.",
  },
  {
    icon: FileText,
    title: "Envie a sua proposta",
    description: "Candidate-se em segundos e acompanhe o estado de cada trabalho.",
  },
  {
    icon: Wallet,
    title: "Receba o pagamento",
    description: "O valor cai diretamente na sua carteira Poppy assim que o trabalho é aprovado.",
  },
];

function WelcomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col px-6 pb-8 pt-12">
      <PoppyLogo size={40} withText />

      <div className="mt-10">
        <h1 className="font-display text-3xl font-bold leading-tight text-foreground">
          Ganhe dinheiro com micro tarefas e trabalhos freelance
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Poppy junta pessoas e empresas em Angola. Encontre tarefas rápidas ou projetos maiores, envie propostas
          e receba o pagamento na sua carteira.
        </p>
      </div>

      <div className="mt-8 space-y-3">
        <Button asChild size="lg" className="w-full rounded-xl">
          <Link to="/signup">Criar conta gratuita</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="w-full rounded-xl">
          <Link to="/login">Já tenho conta — Entrar</Link>
        </Button>
      </div>

      <div className="mt-10">
        <h2 className="text-sm font-bold tracking-tight">Como funciona</h2>
        <div className="mt-4 space-y-4">
          {steps.map((step, i) => (
            <div key={step.title} className="flex gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <step.icon className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold">
                  {i + 1}. {step.title}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
        <ShieldCheck className="size-5 shrink-0 text-primary" />
        <p className="text-xs text-muted-foreground">
          Contas verificadas com BI e as suas informações protegidas — pagamentos seguros do início ao fim.
        </p>
      </div>
    </main>
  );
}
