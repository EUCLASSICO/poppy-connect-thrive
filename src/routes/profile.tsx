import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  AlertOctagon,
  Bell,
  Camera,
  ChevronRight,
  Loader2,
  LogOut,
  Mail,
  MapPin,
  Pencil,
  Settings,
  ShieldCheck,
  Star,
  Trash2,
  Wallet,
} from "lucide-react";
import { useRef, useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Screen, SectionTitle } from "@/components/poppy/Screen";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { SuccessRateRing } from "@/components/poppy/SuccessRateRing";
import { deleteAccount, getCurrentUser, logout, updateProfile, type KycStatus, type PoppyUser } from "@/lib/auth";
import { resizeImageToDataUrl } from "@/lib/image";
import { formatKz, levels, me, successRateRules } from "@/lib/poppy-data";

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
  const [account, setAccount] = useState<PoppyUser | null>(() => getCurrentUser());
  const name = account?.fullName ?? me.name;
  const levelIndex = Math.max(levels.indexOf(me.level), 0);
  const [deleting, setDeleting] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [bioDraft, setBioDraft] = useState(account?.bio ?? "");
  const [bioOpen, setBioOpen] = useState(false);
  const [savingBio, setSavingBio] = useState(false);

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

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !account) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Escolha um ficheiro de imagem.");
      return;
    }

    setUploadingPhoto(true);
    try {
      const dataUrl = await resizeImageToDataUrl(file);
      const updated = updateProfile(account.id, { avatarUrl: dataUrl });
      if (updated) {
        setAccount(updated);
        toast.success("Foto de perfil atualizada.");
      }
    } catch {
      toast.error("Não foi possível processar a imagem.");
    } finally {
      setUploadingPhoto(false);
    }
  }

  function handleSaveBio() {
    if (!account) return;
    setSavingBio(true);
    const updated = updateProfile(account.id, { bio: bioDraft.trim() });
    setSavingBio(false);
    if (updated) {
      setAccount(updated);
      setBioOpen(false);
      toast.success("Biografia atualizada.");
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
          <div className="relative shrink-0">
            <Avatar className="size-16 border border-border">
              {account?.avatarUrl && <AvatarImage src={account.avatarUrl} alt={name} />}
              <AvatarFallback className="bg-primary-soft text-xl font-bold text-primary">
                {initials(name)}
              </AvatarFallback>
            </Avatar>
            {account && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto}
                aria-label="Alterar foto de perfil"
                className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full border-2 border-card bg-primary text-primary-foreground"
              >
                {uploadingPhoto ? (
                  <Loader2 className="size-3 animate-spin" />
                ) : (
                  <Camera className="size-3" />
                )}
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </div>
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

      {/* Avaliação — sempre visível, em estrelas */}
      <SectionTitle>Avaliação</SectionTitle>
      <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
        <div className="flex shrink-0 items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <Star
              key={n}
              className={
                "size-5 " +
                (n <= Math.round(me.rating) ? "fill-warning text-warning" : "fill-transparent text-border")
              }
            />
          ))}
        </div>
        <div className="min-w-0">
          {me.reviews > 0 ? (
            <>
              <p className="text-sm font-bold">{me.rating.toFixed(1)} de 5</p>
              <p className="text-xs text-muted-foreground">Com base em {me.reviews} avaliações</p>
            </>
          ) : (
            <>
              <p className="text-sm font-bold">Ainda sem avaliações</p>
              <p className="text-xs text-muted-foreground">
                A sua avaliação aparece aqui depois do primeiro trabalho concluído.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Taxa de sucesso — reputação do trabalhador. Sobe quando uma tarefa é
          aprovada; desce com tarefas não aprovadas ou tarefas acumuladas por
          confirmar. Abaixo de 50% a conta fica temporariamente impedida de
          aceitar novas tarefas, até a taxa recuperar. */}
      <SectionTitle>Taxa de sucesso</SectionTitle>
      <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
        <SuccessRateRing value={me.successRate} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">
            {me.successRate <= successRateRules.minToAcceptTasks
              ? "Conta temporariamente limitada"
              : me.successRate >= 90
                ? "Excelente reputação"
                : "Boa reputação"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {me.successRate <= successRateRules.minToAcceptTasks
              ? `Abaixo de ${successRateRules.minToAcceptTasks}% não é possível aceitar novas tarefas. Conclua as tarefas pendentes para recuperar.`
              : "Sobe quando uma tarefa é aprovada e desce com tarefas não aprovadas ou acumuladas por confirmar."}
          </p>
        </div>
      </div>

      {/* Estatísticas */}
      <section className="mt-3 grid grid-cols-2 gap-2">
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
      <SectionTitle
        action={
          <Link to="/billing" className="text-xs font-semibold text-primary">
            Ver tudo
          </Link>
        }
      >
        Carteira
      </SectionTitle>
      <Link
        to="/billing"
        className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-secondary"
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
        <div className="flex items-center gap-1">
          <p className="font-display text-base font-bold">{formatKz(me.balance)}</p>
          <ChevronRight className="size-4 text-muted-foreground" />
        </div>
      </Link>

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
      <SectionTitle
        action={
          account && (
            <Dialog
              open={bioOpen}
              onOpenChange={(open) => {
                setBioOpen(open);
                if (open) setBioDraft(account.bio ?? "");
              }}
            >
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-auto gap-1 px-2 py-1 text-xs font-semibold text-primary">
                  <Pencil className="size-3" /> Editar
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm rounded-2xl">
                <DialogHeader>
                  <DialogTitle>Biografia</DialogTitle>
                </DialogHeader>
                <Textarea
                  value={bioDraft}
                  onChange={(e) => setBioDraft(e.target.value)}
                  placeholder="Conte às empresas o que sabe fazer..."
                  maxLength={300}
                  rows={5}
                  className="rounded-xl"
                />
                <p className="text-right text-[11px] text-muted-foreground">{bioDraft.length}/300</p>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setBioOpen(false)} className="rounded-xl">
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveBio} disabled={savingBio} className="rounded-xl">
                    {savingBio ? "A guardar..." : "Guardar"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )
        }
      >
        Sobre
      </SectionTitle>
      <div className="rounded-2xl border border-border bg-card p-4">
        <p className="text-sm text-muted-foreground">
          {account?.bio ||
            me.bio ||
            "Ainda não escreveu uma biografia. Conte às empresas o que sabe fazer para receber mais convites."}
        </p>
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

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 p-4">
      <Icon className="size-4 shrink-0 text-muted-foreground" />
      <p className="text-sm font-semibold">{label}</p>
      <p className="min-w-0 flex-1 truncate text-right text-sm text-muted-foreground">{value}</p>
    </div>
  );
}
