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
  ShieldCheck,
  Sparkles,
  Video,
  Zap,
} from "lucide-react";

import { Screen, SectionTitle } from "@/components/poppy/Screen";
import { PoppyLogo } from "@/components/poppy/PoppyLogo";
import { JobCard } from "@/components/poppy/JobCard";
import { AdSlot } from "@/components/poppy/AdSlot";
import { getCurrentUser } from "@/lib/auth";
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
      { property: "og:description", content: "Micro tarefas, categorias e trabalhos recomendados, tudo num só lugar." },
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
] as const;

function Home() {
  const account = getCurrentUser();
  const firstName = account?.fullName.split(" ")[0] ?? me.name;
  const recommended = jobs.filter((j) => j.featured);

  return (
    <Screen>
      <header className="sticky top-0 z-20 -mx-4 flex items-center gap-3 bg-background/85 px-4 py-3 backdrop-blur-lg">
        <PoppyLogo size={28} />
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted-foreground">Bem-vindo,</p>
          <p className="truncate text-sm font-bold">{firstName}</p>
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

      {/* Saldo — cartão simples, sem gradiente pesado */}
      <section className="mt-4 grid grid-cols-3 divide-x divide-border rounded-2xl border border-border bg-card p-4 text-center">
        <div>
          <p className="font-display text-lg font-bold text-foreground">{formatKz(me.balance)}</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">Saldo</p>
        </div>
        <div>
          <p className="font-display text-lg font-bold text-foreground">{formatKz(me.pending)}</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">Pendente</p>
        </div>
        <div>
          <p className="font-display text-lg font-bold text-primary">{me.completed}</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">Tarefas feitas</p>
        </div>
      </section>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {shortcuts.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card py-2.5 text-xs font-semibold"
          >
            <Icon className="size-4 text-primary" /> {label}
          </Link>
        ))}
      </div>

      {/* Categorias — como numa loja de micro tarefas: navegação por tipo de trabalho */}
      <SectionTitle
        action={
          <Link to="/jobs" className="text-xs font-semibold text-primary">
            Ver tudo
          </Link>
        }
      >
        Categorias
      </SectionTitle>
      <div className="no-scrollbar -mx-4 flex gap-2.5 overflow-x-auto px-4 pb-1">
        {categories.map((c) => {
          const Icon = icons[c.icon] ?? MoreHorizontal;
          const count = jobs.filter((j) => j.category === c.id).length;
          return (
            <Link
              key={c.id}
              to="/jobs"
              search={{ category: c.id }}
              className="flex w-28 shrink-0 flex-col items-start gap-2 rounded-2xl border border-border bg-card p-3"
            >
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary-soft text-primary">
                <Icon className="size-4" />
              </span>
              <span className="text-[11px] font-semibold leading-tight">{c.name}</span>
              <span className="text-[10px] text-muted-foreground">
                {count > 0 ? `${count} vagas` : "Em breve"}
              </span>
            </Link>
          );
        })}
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
      {quickJobs.length > 0 ? (
        <div className="grid grid-cols-2 gap-2.5">
          {quickJobs.map((q) => (
            <Link
              key={q.id}
              to="/jobs"
              search={{ category: "rapidos" }}
              className="rounded-2xl border border-border bg-card p-3.5"
            >
              <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-bold text-accent">{q.tag}</span>
              <p className="mt-2 text-[13px] font-semibold leading-snug">{q.title}</p>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-sm font-bold text-primary">{formatKz(q.reward)}</p>
                <p className="text-[11px] text-muted-foreground">≈{q.minutes} min</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <EmptySection
          icon={Zap}
          text="Ainda não há micro tarefas publicadas. As primeiras aparecem aqui assim que uma empresa publicar."
        />
      )}

      <SectionTitle
        action={
          <Link to="/jobs" className="text-xs font-semibold text-primary">
            Ver todos
          </Link>
        }
      >
        Trabalhos recomendados
      </SectionTitle>
      {recommended.length > 0 ? (
        <div className="space-y-3">
          {recommended.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <EmptySection
          icon={Sparkles}
          text="Sem trabalhos recomendados por agora. Complete o seu perfil para começar a receber sugestões."
        />
      )}

      <AdSlot className="mt-6" />

      <SectionTitle>Como funciona</SectionTitle>
      <div className="space-y-2">
        <div className="flex gap-3 rounded-2xl border border-border bg-card p-4">
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
        <div className="flex gap-3 rounded-2xl border border-border bg-card p-4">
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

function EmptySection({ icon: Icon, text }: { icon: typeof Zap; text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-dashed border-border bg-card/60 p-4">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
        <Icon className="size-4" />
      </span>
      <p className="text-xs text-muted-foreground">{text}</p>
    </div>
  );
}
