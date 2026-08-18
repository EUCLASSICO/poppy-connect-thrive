import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Bell,
  BookOpen,
  Building2,
  Camera,
  ClipboardList,
  Code2,
  FileText,
  Headphones,
  Languages,
  Megaphone,
  MoreHorizontal,
  PenTool,
  Search,
  Shield,
  Sparkles,
  Video,
  Wallet,
  Zap,
} from "lucide-react";

import { Screen, SectionTitle } from "@/components/poppy/Screen";
import { PoppyLogo } from "@/components/poppy/PoppyLogo";
import { JobCard } from "@/components/poppy/JobCard";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { categories, formatKz, jobs, me, projects, quickJobs } from "@/lib/poppy-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Poppy — Encontre trabalho hoje" },
      {
        name: "description",
        content: "Painel Poppy: saldo, ganhos recentes, trabalhos recomendados, trabalhos rápidos e projetos em andamento.",
      },
      { property: "og:title", content: "Poppy — Encontre trabalho hoje" },
      { property: "og:description", content: "Saldo, ganhos, trabalhos recomendados e projetos num só lugar." },
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
  { to: "/quick-jobs", label: "Quick Jobs", icon: Zap },
  { to: "/academy", label: "Academy", icon: BookOpen },
  { to: "/ai", label: "Poppy AI", icon: Sparkles },
  { to: "/business", label: "Business", icon: Building2 },
] as const;

function Home() {
  const recommended = jobs.filter((j) => j.featured);
  const activeProjects = projects.filter((p) => p.status === "Em andamento" || p.status === "Entregue");

  return (
    <Screen>
      <header className="sticky top-0 z-20 -mx-4 flex items-center gap-3 bg-background/85 px-4 py-3 backdrop-blur-lg">
        <PoppyLogo size={28} />
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted-foreground">Bom dia,</p>
          <p className="truncate text-sm font-bold">{me.name}</p>
        </div>
        <Link
          to="/settings"
          className="flex size-9 items-center justify-center rounded-full bg-secondary"
          aria-label="Notificações"
        >
          <span className="relative">
            <Bell className="size-5" />
            <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-accent" />
          </span>
        </Link>
      </header>

      <Link
        to="/jobs"
        className="mt-1 flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground"
      >
        <Search className="size-4" /> Procurar trabalhos, empresas, habilidades
      </Link>

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
          <Link
            to="/wallet"
            className="inline-flex items-center gap-1 rounded-full bg-background/20 px-3 py-2 font-semibold backdrop-blur"
          >
            <Wallet className="size-4" /> Carteira
          </Link>
        </div>
      </section>

      {/* Nível */}
      <section className="shadow-card mt-4 rounded-2xl border border-border/70 bg-card p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold">
            Nível {me.level} <span className="text-muted-foreground">· {me.completed} trabalhos</span>
          </p>
          <Badge className="rounded-full bg-accent-soft text-accent-foreground" variant="secondary">
            {me.rating} ★
          </Badge>
        </div>
        <Progress value={me.levelProgress} className="mt-3 h-2" />
        <p className="mt-2 text-xs text-muted-foreground">
          Faltam 8 projetos aprovados para alcançar o nível Profissional.
        </p>
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
          <Link to="/wallet" className="text-xs font-semibold text-primary">
            Ver tudo
          </Link>
        }
      >
        Ganhos recentes
      </SectionTitle>
      <div className="shadow-card divide-y divide-border/70 rounded-2xl border border-border/70 bg-card">
        {[
          { label: "Landing page institucional", date: "02 Set", value: 340000 },
          { label: "Identidade visual de padaria", date: "26 Ago", value: 150000 },
          { label: "Quick Jobs — 6 tarefas", date: "24 Ago", value: 21500 },
        ].map((e) => (
          <div key={e.label} className="flex items-center justify-between gap-3 p-3.5">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{e.label}</p>
              <p className="text-xs text-muted-foreground">{e.date}</p>
            </div>
            <p className="text-sm font-bold text-success">+{formatKz(e.value)}</p>
          </div>
        ))}
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

      <SectionTitle
        action={
          <Link to="/quick-jobs" className="text-xs font-semibold text-primary">
            Ver tudo
          </Link>
        }
      >
        Trabalhos rápidos
      </SectionTitle>
      <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4">
        {quickJobs.slice(0, 4).map((q) => (
          <Link
            key={q.id}
            to="/quick-jobs"
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
              <span className="text-[10px] text-muted-foreground">{c.jobs} vagas</span>
            </Link>
          );
        })}
      </div>

      <SectionTitle
        action={
          <Link to="/projects" className="text-xs font-semibold text-primary">
            Ver tudo
          </Link>
        }
      >
        Projetos em andamento
      </SectionTitle>
      <div className="space-y-3">
        {activeProjects.map((p) => (
          <Link
            key={p.id}
            to="/projects"
            className="shadow-card flex items-center gap-3 rounded-2xl border border-border/70 bg-card p-4"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">{p.title}</p>
              <p className="text-xs text-muted-foreground">
                {p.client} · entrega {p.due}
              </p>
              <Progress value={p.status === "Entregue" ? 80 : 55} className="mt-2 h-1.5" />
            </div>
            <ArrowUpRight className="size-4 text-muted-foreground" />
          </Link>
        ))}
      </div>

      <SectionTitle>Notificações importantes</SectionTitle>
      <div className="space-y-2">
        <div className="flex gap-3 rounded-2xl border border-border/70 bg-card p-4">
          <Shield className="size-5 shrink-0 text-primary" />
          <div>
            <p className="text-sm font-semibold">Verifique a sua identidade</p>
            <p className="text-xs text-muted-foreground">
              Contas verificadas recebem mais convites e podem aceitar projetos acima de 500.000 Kz.
            </p>
            <Link to="/settings" className="mt-2 inline-block text-xs font-semibold text-primary">
              Verificar agora
            </Link>
          </div>
        </div>
        <div className="flex gap-3 rounded-2xl border border-border/70 bg-card p-4">
          <FileText className="size-5 shrink-0 text-accent" />
          <div>
            <p className="text-sm font-semibold">Proposta em análise</p>
            <p className="text-xs text-muted-foreground">
              A Lumina Legal está a avaliar a sua proposta de tradução técnica.
            </p>
          </div>
        </div>
      </div>
    </Screen>
  );
}
