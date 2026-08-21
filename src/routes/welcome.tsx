import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera, Code2, FileText, Languages, Megaphone, PenTool, Search, ShieldCheck, Star, Zap } from "lucide-react";

import { PoppyLogo } from "@/components/poppy/PoppyLogo";
import { Button } from "@/components/ui/button";
import welcomeHero from "@/assets/marketing/welcome-hero.webp";

export const Route = createFileRoute("/welcome")({
  head: () => ({
    meta: [
      { title: "Poppy — Trabalho freelance e micro tarefas em Angola" },
      {
        name: "description",
        content: "Crie a sua conta gratuita em Poppy e comece a ganhar hoje com micro tarefas e trabalhos freelance.",
      },
    ],
  }),
  component: WelcomePage,
});

const categoryPills = [
  { label: "Design", icon: PenTool },
  { label: "Programação", icon: Code2 },
  { label: "Marketing", icon: Megaphone },
  { label: "Tradução", icon: Languages },
  { label: "Fotografia", icon: Camera },
  { label: "Micro tarefas", icon: Zap },
];

function WelcomePage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-6 pb-10 pt-8">
      <div className="flex items-center justify-between">
        <PoppyLogo size={30} withText />
        <Button asChild variant="ghost" size="sm" className="text-sm font-semibold">
          <Link to="/login">Entrar</Link>
        </Button>
      </div>

      {/* Hero */}
      <section className="mt-4 flex items-end justify-between gap-4">
        <div className="pb-2">
          <h1 className="font-display text-[2rem] font-bold leading-[1.05] text-foreground">
            O trabalho certo,
            <br />
            <span className="text-primary">a pessoa certa.</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Milhares de tarefas e trabalhos freelance em Angola à espera de si — desde já.
          </p>
        </div>
        <img
          src={welcomeHero}
          alt="Pessoa a trabalhar com o portátil, pronta para começar em Poppy"
          className="w-32 shrink-0 -translate-y-1"
        />
      </section>

      {/* Busca — visual, leva ao registo */}
      <Link
        to="/signup"
        className="mt-6 flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3.5 text-sm text-muted-foreground shadow-card"
      >
        <Search className="size-4 shrink-0" /> O que precisa hoje?
      </Link>

      <div className="no-scrollbar -mx-6 mt-3 flex gap-2 overflow-x-auto px-6">
        {categoryPills.map(({ label, icon: Icon }) => (
          <Link
            key={label}
            to="/signup"
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-2 text-xs font-semibold"
          >
            <Icon className="size-3.5 text-primary" /> {label}
          </Link>
        ))}
      </div>

      {/* CTAs */}
      <div className="mt-7 space-y-2.5">
        <Button asChild size="lg" className="w-full rounded-xl text-base">
          <Link to="/signup">Criar conta gratuita</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="w-full rounded-xl text-base">
          <Link to="/login">Já tenho conta</Link>
        </Button>
      </div>

      {/* Prova social direta, sem números inventados */}
      <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
        <div className="flex -space-x-1">
          {[1, 2, 3].map((i) => (
            <span
              key={i}
              className="size-6 rounded-full border-2 border-background bg-primary-soft"
            />
          ))}
        </div>
        <span>Junte-se a quem já está a trabalhar em Angola através da Poppy.</span>
      </div>

      {/* Como funciona — curto e direto */}
      <section className="mt-9">
        <h2 className="font-display text-lg font-bold">Como funciona</h2>
        <div className="mt-4 grid grid-cols-3 gap-3">
          <StepCard n={1} title="Registe-se" text="Grátis, em minutos." />
          <StepCard n={2} title="Trabalhe" text="Escolha uma tarefa." />
          <StepCard n={3} title="Receba" text="Direto na carteira." />
        </div>
      </section>

      {/* Confiança */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-border bg-card p-4">
          <ShieldCheck className="size-5 text-primary" />
          <p className="mt-2 text-xs font-semibold">Contas verificadas</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">BI e identidade confirmados.</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <Star className="size-5 text-primary" />
          <p className="mt-2 text-xs font-semibold">Avaliações reais</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">De quem já trabalhou consigo.</p>
        </div>
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        <FileText className="mb-0.5 mr-1 inline size-3.5" />
        Ao continuar, aceita os nossos termos e a política de privacidade.
      </p>
    </main>
  );
}

function StepCard({ n, title, text }: { n: number; title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3 text-center">
      <span className="font-display mx-auto flex size-7 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
        {n}
      </span>
      <p className="mt-2 text-xs font-bold">{title}</p>
      <p className="mt-0.5 text-[11px] text-muted-foreground">{text}</p>
    </div>
  );
}
