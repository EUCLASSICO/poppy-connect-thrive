import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  AlertOctagon,
  Bell,
  ChevronRight,
  LogOut,
  Mail,
  MapPin,
  Settings,
  ShieldCheck,
  Star,
  Trash2,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Screen, SectionTitle } from "@/components/poppy/Screen";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { deleteAccount, getCurrentUser, logout, type KycStatus } from "@/lib/auth";
import { formatKz, levels, me } from "@/lib/poppy-data";

const kycLabel: Record<KycStatus, string> = {
  "não verificado": "Verificar identidade",
  pendente: "KYC em análise",
  verificado: "Identidade verificada",
  rejeitado: "Verificação rejeitada",
};

const kycVariant: Record<KycStatus, "secondary" | "outline" | "default" | "destructive"> = {
  "não verificado": "secondary",
  pendente: "outline",
  verificado: "default",
  rejeitado: "destructive",
};

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
  const navigate = useNavigate();
  const account = getCurrentUser();
  const name = account?.fullName ?? me.name;
  const levelIndex = Math.max(levels.indexOf(me.level), 0);
  const [deleting, setDeleting] = useState(false);

  function handleDeleteAccount() {
    if (!account) return;
    setDeleting(true);
    const ok = deleteAccount(account.id);
    setDeleting(false);
    if (ok) {
      toast.success("Conta eliminada.", { description: "É uma pena ver-te partir." });
      navigate({ to: "/signup" });
    } else {
      toast.error("Não foi possível eliminar a conta.");
    }
  }

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

      {/* Cabeçalho do perfil — cartão limpo, informação essencial */}
      <section className="shadow-card mt-1 rounded-3xl border border-border bg-card p-5">
        <div className="flex items-center gap-4">
          <Avatar className="size-16 border border-border">
            <AvatarFallback className="bg-primary-soft text-xl font-bold text-primary">
              {initials(name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate text-base font-bold">{name}</p>
              {account?.kycStatus === "verificado" && (
                <span
                  className="stamp-badge size-8 shrink-0 text-[9px] font-bold text-primary"
                  title="Identidade verificada"
                >
                  OK
                </span>
              )}
            </div>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {account ? `@${account.username}` : me.role}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <Badge variant="secondary" className="rounded-full text-[10px]">
                Nível {me.level}
              </Badge>
              {account && (
                <Badge variant="outline" className="rounded-full text-[10px]">
                  {account.kycStatus}
                </Badge>
              )}
            </div>
          </div>
          <Link
            to="/settings"
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground"
            aria-label="Definições"
          >
            <Settings className="size-4" />
          </Link>
        </div>

        <div className="mt-4 flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="font-semibold text-foreground">Progresso do nível</span>
          <span>{me.levelProgress}% para {levels[Math.min(levelIndex + 1, levels.length - 1)]}</span>
        </div>
        <Progress value={me.levelProgress} className="mt-2 h-2" />
      </section>

      {/* Estatísticas */}
      <section className="mt-3 grid grid-cols-3 gap-2">
        <div className="rounded-2xl border border-border bg-card p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-warning">
            <Star className="size-4 fill-current" />
            <span className="font-display text-lg font-bold text-foreground">
              {me.reviews > 0 ? me.rating : "—"}
            </span>
          </div>
          <p className="mt-0.5 text-[11px] text-muted-foreground">{me.reviews} avaliações</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-3 text-center">
          <p className="font-display text-lg font-bold text-foreground">
            {me.completed > 0 ? `${me.completion}%` : "—"}
          </p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">Conclusão</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-3 text-center">
          <p className="font-display text-lg font-bold text-foreground">{me.completed}</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">Trabalhos feitos</p>
        </div>
      </section>

      {/* Carteira */}
      <SectionTitle>Carteira</SectionTitle>
      <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4">
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
      </div>

      {/* Conta */}
      {account && (
        <>
          <SectionTitle>Conta</SectionTitle>
          <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
            <Row icon={Mail} label="Email" value={account.email} />
            <Row icon={MapPin} label="País" value={account.country} />
            <Link to="/kyc" className="flex items-center gap-3 p-4 transition-colors hover:bg-secondary">
              <ShieldCheck className="size-4 shrink-0 text-primary" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{kycLabel[account.kycStatus]}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">BI, selfie, morada, telefone e assinatura</p>
              </div>
              <Badge variant={kycVariant[account.kycStatus]}>{account.kycStatus}</Badge>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
            </Link>
          </div>
        </>
      )}

      {/* Sobre */}
      <SectionTitle>Sobre</SectionTitle>
      <div className="rounded-2xl border border-border bg-card p-4">
        <p className="text-sm text-muted-foreground">
          {me.bio ||
            "Ainda não escreveu uma biografia. Conte às empresas o que sabe fazer para receber mais convites."}
        </p>
        <div className="mt-3 border-t border-border pt-3">
          <p className="text-xs font-bold">Habilidades</p>
          {me.skills.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {me.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="rounded-full px-3 py-1 font-medium">
                  {skill}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="mt-1 text-xs text-muted-foreground">Ainda não adicionou habilidades.</p>
          )}
        </div>
      </div>


      {/* Ações */}
      <div className="mt-6 space-y-2">
        <Button
          variant="outline"
          className="w-full justify-start gap-2 rounded-xl text-destructive hover:text-destructive"
          size="lg"
          onClick={() => {
            logout();
            navigate({ to: "/login" });
          }}
        >
          <LogOut className="size-4" /> Sair da conta
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 rounded-xl border-destructive/40 text-destructive hover:bg-destructive/5 hover:text-destructive"
              size="lg"
              disabled={!account}
            >
              <Trash2 className="size-4" /> Eliminar conta
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertOctagon className="size-5 text-destructive" /> Eliminar conta definitivamente?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. Todos os seus dados, incluindo verificação KYC, saldo e
                histórico de trabalhos, serão permanentemente apagados.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={deleting}
                onClick={handleDeleteAccount}
              >
                {deleting ? "A eliminar..." : "Sim, eliminar conta"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Screen>
  );
}
