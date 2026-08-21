import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bell,
  PlusCircle,
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

  return (
    <Screen>
      <header className="sticky top-0 z-20 -mx-4 flex items-center gap-3 bg-background/85 px-4 py-3 backdrop-blur-lg">
        <PoppyLogo size={30} />
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted-foreground">{greeting()},</p>
          <p className="truncate text-[15px] font-bold">{firstName}</p>
        </div>

        {/* Carteira em resumo — sempre visível no canto, sem cartão grande no corpo da página */}
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

        <Link
          to="/messages"
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-colors hover:bg-primary-soft hover:text-primary"
          aria-label="Notificações"
        >
          <Bell className="size-[18px]" />
        </Link>
      </header>

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
