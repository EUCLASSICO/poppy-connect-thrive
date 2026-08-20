import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bell,
  FileText,
  PlusCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Wallet,
  Zap,
} from "lucide-react";

import { Screen, SectionTitle } from "@/components/poppy/Screen";
import { PoppyLogo } from "@/components/poppy/PoppyLogo";
import { JobCard } from "@/components/poppy/JobCard";
import { PromoBanner, type PromoSlide } from "@/components/poppy/PromoBanner";
import { getCurrentUser } from "@/lib/auth";
import { formatKz, jobs, me, quickJobs } from "@/lib/poppy-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Poppy — Micro tarefas e trabalho freelance" },
      {
        name: "description",
        content: "Poppy: encontre micro tarefas rápidas e trabalhos freelance, envie propostas e receba o pagamento na sua carteira.",
      },
      { property: "og:title", content: "Poppy — Micro tarefas e trabalho freelance" },
      { property: "og:description", content: "Micro tarefas e trabalhos recomendados, tudo num só lugar." },
    ],
  }),
  component: Home,
});

const shortcuts = [
  { to: "/jobs", label: "Trabalhos", icon: Zap },
  { to: "/post", label: "Publicar", icon: PlusCircle },
  { to: "/kyc", label: "Verificação", icon: ShieldCheck },
] as const;

const promoSlides: PromoSlide[] = [
  {
    id: "quick",
    icon: Zap,
    title: "Micro tarefas em minutos",
    description: "Tarefas rápidas e simples, pagas assim que são aprovadas.",
    to: "/jobs",
  },
  {
    id: "kyc",
    icon: ShieldCheck,
    title: "Conta verificada, mais convites",
    description: "Confirme a sua identidade e destaque-se para quem contrata.",
    to: "/kyc",
  },
  {
    id: "post",
    icon: PlusCircle,
    title: "Precisa de ajuda com algo?",
    description: "Publique um trabalho e comece a receber propostas hoje.",
    to: "/post",
  },
  {
    id: "wallet",
    icon: Wallet,
    title: "Pagamento sempre seguro",
    description: "O valor fica reservado e só é libertado quando aceitar o trabalho.",
  },
];

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 19) return "Boa tarde";
  return "Boa noite";
}

function Home() {
  const account = getCurrentUser();
  const firstName = account?.fullName.split(" ")[0] ?? me.name;
  const recommended = jobs.filter((j) => j.featured);
  const hasActivity = me.balance > 0 || me.pending > 0 || me.completed > 0;

  return (
    <Screen>
      <header className="sticky top-0 z-20 -mx-4 flex items-center gap-3 bg-background/85 px-4 py-3 backdrop-blur-lg">
        <PoppyLogo size={30} />
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted-foreground">{greeting()},</p>
          <p className="truncate text-[15px] font-bold">{firstName}</p>
        </div>
        <Link
          to="/settings"
          className="flex size-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-colors hover:bg-primary-soft hover:text-primary"
          aria-label="Notificações"
        >
          <Bell className="size-[18px]" />
        </Link>
      </header>

      <Link
        to="/jobs"
        className="shadow-card mt-1 flex items-center gap-2.5 rounded-2xl border border-border/70 bg-card px-4 py-3.5 text-sm text-muted-foreground transition-colors hover:border-primary/30"
      >
        <Search className="size-4 shrink-0 text-primary" /> Procurar micro tarefas, trabalhos, habilidades
      </Link>

      {hasActivity ? (
        /* Saldo — cartão com leve destaque verde para se sentir "vivo" sem exagerar */
        <section className="shadow-card bg-primary-soft/60 mt-4 grid grid-cols-3 divide-x divide-primary/15 rounded-2xl border border-primary/15 p-4 text-center">
          <div>
            <p className="font-display text-lg font-bold text-foreground">{formatKz(me.balance)}</p>
            <p className="mt-0.5 text-[11px] font-medium text-muted-foreground">Saldo</p>
          </div>
          <div>
            <p className="font-display text-lg font-bold text-foreground">{formatKz(me.pending)}</p>
            <p className="mt-0.5 text-[11px] font-medium text-muted-foreground">Pendente</p>
          </div>
          <div>
            <p className="font-display text-lg font-bold text-primary">{me.completed}</p>
            <p className="mt-0.5 text-[11px] font-medium text-muted-foreground">Tarefas feitas</p>
          </div>
        </section>
      ) : (
        /* Sem histórico ainda — convite a agir em vez de três zeros vazios */
        <Link
          to="/jobs"
          className="shadow-card mt-4 flex items-center gap-3 rounded-2xl border border-primary/15 bg-primary-soft/60 p-4 transition-colors hover:border-primary/30"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Wallet className="size-[18px]" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">A sua carteira está vazia</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Aceite a primeira tarefa e comece a ganhar</p>
          </div>
          <ArrowRight className="size-4 shrink-0 text-primary" />
        </Link>
      )}

      <div className="mt-3 grid grid-cols-3 gap-2.5">
        {shortcuts.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="shadow-card flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-border/70 bg-card py-3.5 text-center transition-colors hover:border-primary/30 hover:bg-primary-soft/40"
          >
            <span className="bg-primary-soft flex size-9 items-center justify-center rounded-xl text-primary">
              <Icon className="size-4" />
            </span>
            <span className="text-[11px] font-semibold">{label}</span>
          </Link>
        ))}
      </div>

      {/* Banner promocional — pequeno, troca sozinho, arrastável */}
      <PromoBanner slides={promoSlides} className="shadow-card mt-4" />

      <SectionTitle
        action={
          <Link
            to="/jobs"
            search={{ category: "rapidos" }}
            className="inline-flex items-center gap-0.5 text-xs font-semibold text-primary"
          >
            Ver tudo <ArrowRight className="size-3" />
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
              className="shadow-card group rounded-2xl border border-border/70 bg-card p-3.5 transition-colors hover:border-primary/30"
            >
              <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-bold text-accent">{q.tag}</span>
              <p className="mt-2 text-[13px] font-semibold leading-snug group-hover:text-primary">{q.title}</p>
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
          <Link to="/jobs" className="inline-flex items-center gap-0.5 text-xs font-semibold text-primary">
            Ver todos <ArrowRight className="size-3" />
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

      <SectionTitle>Como funciona</SectionTitle>
      <div className="shadow-card divide-y divide-border/70 overflow-hidden rounded-2xl border border-border/70 bg-card">
        <div className="flex gap-3.5 p-4">
          <span className="bg-primary-soft flex size-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-primary">
            1
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-primary" />
              <p className="text-sm font-semibold">Verifique a sua identidade</p>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Contas verificadas recebem mais convites e podem aceitar tarefas com valores mais altos.
            </p>
            <Link
              to="/kyc"
              className="mt-2 inline-flex items-center gap-0.5 text-xs font-semibold text-primary"
            >
              Verificar agora <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>
        <div className="flex gap-3.5 p-4">
          <span className="bg-accent-soft flex size-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-accent">
            2
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <FileText className="size-4 text-accent" />
              <p className="text-sm font-semibold">Envie propostas</p>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
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
