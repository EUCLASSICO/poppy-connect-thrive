import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bell,
  Camera,
  ClipboardList,
  Code2,
  FileText,
  Headphones,
  Languages,
  Megaphone,
  MoreHorizontal,
  PenTool,
  PlusCircle,
  Search,
  Shield,
  ShieldCheck,
  Video,
  Wallet,
  Zap,
} from "lucide-react";

import { Screen, SectionTitle } from "@/components/poppy/Screen";
import { PoppyLogo } from "@/components/poppy/PoppyLogo";
import { PromoBanner } from "@/components/poppy/PromoBanner";
import { JobCard } from "@/components/poppy/JobCard";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { categories, formatKz, jobs, me, quickJobs } from "@/lib/poppy-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Poppy — Micro tarefas e trabalho freelance" },
      {
        name: "description",
        content: "Poppy: encontre micro tarefas rápidas e trabalhos freelance, envie propostas e receba o pagamento na sua carteira.",
      },
      { property: "og:title", content: "Poppy — Micro tarefas e trabalho freelance" },
      { property: "og:description", content: "Micro tarefas, trabalhos recomendados e categorias, tudo num só lugar." },
    ],
  }),
  component: Home,
});

const icons: Record<string, typeof Code2> = {
  PenTool,
  Code2,
  Megaphone,
  Languages,
  FileText,
  Camera,
  Video,
  Headphones,
  ClipboardList,
  Zap,
  MoreHorizontal,
};

const shortcuts = [
  { to: "/jobs", label: "Trabalhos", icon: Zap },
  { to: "/post", label: "Publicar", icon: PlusCircle },
  { to: "/kyc", label: "Verificação", icon: ShieldCheck },
  { to: "/settings", label: "Definições", icon: Shield },
] as const;

function Home() {
  const recommended = jobs.filter((j) => j.featured);

  return (
    <Screen>
      <header className="sticky top-0 z-20 -mx-4 flex items-center gap-3 bg-background/85 px-4 py-3 backdrop-blur-lg">
        <PoppyLogo size={28} />
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted-foreground">Bem-vindo,</p>
          <p className="truncate text-sm font-bold">{me.name}</p>
        </div>
        <Link
          to="/settings"
          className="flex size-9 items-center justify-center rounded-full bg-secondary"
          aria-label="Notificações"
        >
          <Bell className="size-5" />
        </Link>
      </header>

      <Link
        to="/jobs"
        className="mt-1 flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground"
      >
        <Search className="size-4" /> Procurar micro tarefas, trabalhos, habilidades
      </Link>

      <PromoBanner />

      {/* Carteira */}
      <section className="bg-gradient-primary shadow-float mt-4 rounded-3xl p-5 text-primary-foreground">
        <p className="text-xs opacity-80">Saldo disponível</p>
        <p className="font-display mt-1 text-3xl font-bold">{formatKz(me.balance)}</p>
        <div className="mt-4 flex items-center justify-between gap-3 text-xs">
          <div>
            <p className="opacity-80">Pendente</p>
            <p className="font-semibold">{formatKz(me.pending)}</p>
          </div>
          <div>
            <p className="opacity-80">Ganhos totais</p>
            <p className="font-semibold">{formatKz(me.earnings)}</p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-background/20 px-3 py-2 font-semibold backdrop-blur">
            <Wallet className="size-4" /> Carteira
          </span>
        </div>
      </section>

      {/* Nível */}
      <section className="shadow-card mt-4 rounded-2xl border border-border/70 bg-card p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold">
            Nível {me.level} <span className="text-muted-foreground">· {me.completed} tarefas concluídas</span>
          </p>
          {me.reviews > 0 && (
            <Badge className="rounded-full bg-accent-soft text-accent-foreground" variant="secondary">
              {me.rating} ★
            </Badge>
          )}
        </div>
        <Progress value={me.levelProgress} className="mt-3 h-2" />
        <p className="mt-2 text-xs text-muted-foreground">Complete micro tarefas e trabalhos para subir de nível.</p>
      </section>

      <div className="mt-4 grid grid-cols-4 gap-2">
        {shortcuts.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex flex-col items-center gap-2 rounded-2xl border border-border/70 bg-card p-3 text-center"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Icon className="size-4" />
            </span>
            <span className="text-[11px] font-semibold leading-tight">{label}</span>
          </Link>
        ))}
      </div>

      <SectionTitle
        action={
          <Link to="/jobs" search={{ category: "rapidos" }} className="text-xs font-semibold text-primary">
            Ver tudo
          </Link>
        }
      >
        Micro tarefas
      </SectionTitle>
      <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4">
        {quickJobs.map((q) => (
          <Link
            key={q.id}
            to="/jobs"
            search={{ category: "rapidos" }}
            className="shadow-card w-48 shrink-0 rounded-2xl border border-border/70 bg-card p-4"
          >
            <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-bold text-accent">{q.tag}</span>
            <p className="mt-2 text-sm font-semibold leading-snug">{q.title}</p>
            <p className="mt-2 text-sm font-bold text-primary">{formatKz(q.reward)}</p>
            <p className="text-xs text-muted-foreground">≈ {q.minutes} min</p>
          </Link>
        ))}
      </div>

      <SectionTitle>Categorias</SectionTitle>
      <div className="grid grid-cols-3 gap-2">
        {categories.map((c) => {
          const Icon = icons[c.icon] ?? MoreHorizontal;
          return (
            <Link
              key={c.id}
              to="/jobs"
              search={{ category: c.id }}
              className="flex flex-col items-start gap-2 rounded-2xl border border-border/70 bg-card p-3"
            >
              <span className="flex size-8 items-center justify-center rounded-lg bg-secondary text-primary">
                <Icon className="size-4" />
              </span>
              <span className="text-[11px] font-semibold leading-tight">{c.name}</span>
            </Link>
          );
        })}
      </div>

      <SectionTitle
        action={
          <Link to="/jobs" className="text-xs font-semibold text-primary">
            Ver todos
          </Link>
        }
      >
        Trabalhos recomendados
      </SectionTitle>
      <div className="space-y-3">
        {recommended.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      <SectionTitle>Como funciona</SectionTitle>
      <div className="space-y-2">
        <div className="flex gap-3 rounded-2xl border border-border/70 bg-card p-4">
          <ShieldCheck className="size-5 shrink-0 text-primary" />
          <div>
            <p className="text-sm font-semibold">Verifique a sua identidade</p>
            <p className="text-xs text-muted-foreground">
              Contas verificadas recebem mais convites e podem aceitar tarefas com valores mais altos.
            </p>
            <Link to="/kyc" className="mt-2 inline-block text-xs font-semibold text-primary">
              Verificar agora
            </Link>
          </div>
        </div>
        <div className="flex gap-3 rounded-2xl border border-border/70 bg-card p-4">
          <FileText className="size-5 shrink-0 text-accent" />
          <div>
            <p className="text-sm font-semibold">Envie propostas</p>
            <p className="text-xs text-muted-foreground">
              Escolha uma tarefa, envie a sua proposta e acompanhe o estado em "Trabalhos".
            </p>
          </div>
        </div>
      </div>
    </Screen>
  );
}
