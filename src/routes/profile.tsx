import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, Bell, Briefcase, Edit3, LogOut, Mail, MapPin, Star, Wallet } from "lucide-react";

import { Screen, SectionTitle } from "@/components/poppy/Screen";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getCurrentUser, logout } from "@/lib/auth";
import { formatKz, levels, me } from "@/lib/poppy-data";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Perfil — Poppy" },
      { name: "description", content: "O seu perfil Poppy: dados da conta, nível, avaliações e habilidades." },
    ],
  }),
  component: ProfilePage,
});

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}

function ProfilePage() {
  const account = getCurrentUser();
  const name = account?.fullName ?? me.name;
  const levelIndex = Math.max(levels.indexOf(me.level), 0);

  return (
    <Screen>
      <header className="sticky top-0 z-20 -mx-4 flex items-center justify-between bg-background/85 px-4 py-3 backdrop-blur-lg">
        <h1 className="text-base font-bold">Perfil</h1>
        <Link
          to="/settings"
          className="flex size-9 items-center justify-center rounded-full bg-secondary"
          aria-label="Configurações"
        >
          <Bell className="size-5" />
        </Link>
      </header>

      {/* Cabeçalho do perfil */}
      <section className="bg-gradient-primary shadow-float mt-1 rounded-3xl p-5 text-primary-foreground">
        <div className="flex flex-col items-center text-center">
          <Avatar className="size-20 border-4 border-primary-foreground/30">
            <AvatarFallback className="bg-primary-foreground/15 text-2xl font-bold text-primary-foreground">
              {initials(name)}
            </AvatarFallback>
          </Avatar>
          <p className="mt-4 text-lg font-bold">{name}</p>
          {account && <Badge className="mt-2 border-transparent bg-primary-foreground/15 text-primary-foreground">{account.id}</Badge>}
          <p className="mt-2 text-sm text-primary-foreground/85">{me.role}</p>
        </div>

        <div className="mt-5 flex items-center justify-between text-xs">
          <span className="font-semibold">Nível {me.level}</span>
          <span className="text-primary-foreground/80">{me.levelProgress}% para o próximo nível</span>
        </div>
        <Progress value={me.levelProgress} className="mt-2 h-2 bg-primary-foreground/20" />
      </section>

      {/* Dados da conta */}
      {account && (
        <section className="mt-4 space-y-2 rounded-2xl border border-border bg-card p-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="size-4 shrink-0" />
            <span className="truncate">{account.email}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="size-4 shrink-0" />
            <span className="truncate">{account.country}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="flex size-4 shrink-0 items-center justify-center text-xs font-bold">@</span>
            <span className="truncate">{account.username}</span>
          </div>
        </section>
      )}

      {/* Estatísticas */}
      <section className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-2xl border border-border bg-card p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-warning">
            <Star className="size-4 fill-current" />
            <span className="font-display text-lg font-bold text-foreground">{me.rating}</span>
          </div>
          <p className="mt-0.5 text-[11px] text-muted-foreground">{me.reviews} avaliações</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-3 text-center">
          <p className="font-display text-lg font-bold text-foreground">{me.completion}%</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">Conclusão</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-3 text-center">
          <p className="font-display text-lg font-bold text-foreground">{me.completed}</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">Trabalhos feitos</p>
        </div>
      </section>

      {/* Carteira */}
      <Link
        to="/wallet"
        className="mt-4 flex items-center justify-between rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-secondary"
      >
        <div className="flex items-center gap-3">
          <span className="bg-primary-soft flex size-10 items-center justify-center rounded-xl text-primary">
            <Wallet className="size-5" />
          </span>
          <div>
            <p className="text-sm font-semibold">Saldo disponível</p>
            <p className="text-xs text-muted-foreground">Pendente: {formatKz(me.pending)}</p>
          </div>
        </div>
        <p className="font-display text-base font-bold">{formatKz(me.balance)}</p>
      </Link>

      {/* Sobre */}
      <SectionTitle>Sobre</SectionTitle>
      <p className="text-sm text-muted-foreground">{me.bio}</p>

      <SectionTitle>Habilidades</SectionTitle>
      <div className="flex flex-wrap gap-2">
        {me.skills.map((skill) => (
          <Badge key={skill} variant="secondary" className="rounded-full px-3 py-1 font-medium">
            {skill}
          </Badge>
        ))}
      </div>

      <SectionTitle>Experiência</SectionTitle>
      <div className="space-y-3">
        {me.experience.map((exp, i) => (
          <div key={i} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-3">
            <span className="bg-secondary flex size-9 shrink-0 items-center justify-center rounded-xl">
              <Briefcase className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{exp.role}</p>
              <p className="truncate text-xs text-muted-foreground">
                {exp.company} · {exp.period}
              </p>
            </div>
          </div>
        ))}
      </div>

      <SectionTitle>Certificados</SectionTitle>
      <div className="space-y-2">
        {me.certificates.map((cert) => (
          <div key={cert} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
            <span className="bg-accent-soft flex size-9 shrink-0 items-center justify-center rounded-xl text-accent">
              <Award className="size-4" />
            </span>
            <p className="truncate text-sm font-medium">{cert}</p>
          </div>
        ))}
      </div>

      {/* Ações */}
      <div className="mt-6 space-y-2">
        <Button asChild variant="outline" className="w-full justify-start gap-2 rounded-xl" size="lg">
          <Link to="/edit-profile">
            <Edit3 className="size-4" /> Editar perfil
          </Link>
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start gap-2 rounded-xl text-destructive hover:text-destructive"
          size="lg"
          onClick={() => {
            logout();
            window.location.href = "/welcome";
          }}
        >
          <LogOut className="size-4" /> Sair da conta
        </Button>
      </div>
    </Screen>
  );
}
