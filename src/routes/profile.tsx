import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Award,
  AlertOctagon,
  Bell,
  Calendar,
  Camera,
  CheckCircle2,
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
  TrendingUp,
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
          to="/messages"
          className="flex size-9 items-center justify-center rounded-full bg-secondary"
          aria-label="Notificações"
        >
          <Bell className="size-5" />
        </Link>
      </header>

      {/* Cabeçalho do perfil — layout centrado com selo de nível sobre a foto */}
      <section className="shadow-card mt-1 rounded-3xl border border-border bg-card p-6 text-center">
        <div className="relative mx-auto w-fit">
          <Avatar className="size-24 border border-border">
            {account?.avatarUrl && <AvatarImage src={account.avatarUrl} alt={name} />}
            <AvatarFallback className="bg-primary-soft text-2xl font-bold text-primary">
              {initials(name)}
            </AvatarFallback>
          </Avatar>
          {account && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingPhoto}
              aria-label="Alterar foto de perfil"
              className="absolute -left-1 -top-1 flex size-7 items-center justify-center rounded-full border-2 border-card bg-secondary text-secondary-foreground"
            >
              {uploadingPhoto ? <Loader2 className="size-3.5 animate-spin" /> : <Camera className="size-3.5" />}
            </button>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />

          {/* Selo de nível — sobreposto à foto, como no cartão de referência */}
          <div className="absolute -bottom-2 -right-3 flex size-14 flex-col items-center justify-center rounded-full border-4 border-card bg-primary text-center leading-none text-primary-foreground shadow-md">
            <span className="text-[7px] font-bold uppercase tracking-wide">Nível</span>
            <span className="text-[9px] font-extrabold uppercase leading-tight">{me.level}</span>
          </div>
        </div>

        <p className="mt-4 truncate text-lg font-bold">{name}</p>
        <p className="mt-0.5 truncate text-sm text-muted-foreground">
          {account?.skills?.[0] ?? me.role}
        </p>

        <div className="mt-2 flex items-center justify-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                className={
                  "size-4 " +
                  (n <= Math.round(me.rating) ? "fill-warning text-warning" : "fill-transparent text-border")
                }
              />
            ))}
          </div>
          {me.reviews > 0 ? (
            <span className="text-sm font-bold">
              {me.rating.toFixed(1)} <span className="font-normal text-muted-foreground">({me.reviews} avaliações)</span>
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">Ainda sem avaliações</span>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          {account ? (
            <Dialog
              open={bioOpen}
              onOpenChange={(open) => {
                setBioOpen(open);
                if (open) setBioDraft(account.bio ?? "");
              }}
            >
              <DialogTrigger asChild>
                <Button className="flex-1 rounded-xl">Editar perfil</Button>
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
          ) : (
            <Button asChild className="flex-1 rounded-xl">
              <Link to="/login">Editar perfil</Link>
            </Button>
          )}
          <Button asChild variant="outline" className="flex-1 rounded-xl">
            <Link to="/settings">
              <Settings className="size-4" /> Definições
            </Link>
          </Button>
        </div>

        <div className="mt-4 flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="font-semibold text-foreground">Progresso do nível</span>
          <span>{me.levelProgress}% para {levels[Math.min(levelIndex + 1, levels.length - 1)]}</span>
        </div>
        <Progress value={me.levelProgress} className="mt-2 h-2" />

        {/* Verificação — espelha o "Verified by" + selo PRO do cartão de referência */}
        {(account?.kycStatus === "verificado" || account?.skills?.length || levelIndex === levels.length - 1) && (
          <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-left">
            <div className="min-w-0 space-y-1.5">
              {account?.kycStatus === "verificado" && (
                <p className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                  <CheckCircle2 className="size-3.5 shrink-0 text-primary" /> Identidade verificada pela Poppy
                </p>
              )}
              {account?.skills?.[0] && (
                <p className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                  <CheckCircle2 className="size-3.5 shrink-0 text-primary" /> {account.skills[0]}
                </p>
              )}
            </div>
            {levelIndex === levels.length - 1 && (
              <span
                className="flex shrink-0 flex-col items-center gap-0.5 rounded-md bg-foreground px-2 py-1.5 text-card"
                title="Nível máximo Poppy"
              >
                <Award className="size-3.5" />
                <span className="text-[8px] font-bold tracking-wide">PRO</span>
              </span>
            )}
          </div>
        )}

        {/* Informação — mesmo formato de linhas do cartão de referência */}
        <div className="mt-4 space-y-2.5 border-t border-border pt-4 text-left text-xs">
          <InfoRow icon={MapPin} label="De" value={account?.country ?? "—"} />
          <InfoRow
            icon={Calendar}
            label="Membro desde"
            value={
              account?.createdAt
                ? new Date(account.createdAt).toLocaleDateString("pt-PT", { month: "short", year: "numeric" })
                : "—"
            }
          />
          <InfoRow icon={TrendingUp} label="Taxa de sucesso" value={`${me.successRate}%`} />
          <InfoRow icon={CheckCircle2} label="Trabalhos concluídos" value={`${me.completed}`} />
        </div>
      </section>

      {/* Taxa de sucesso — reputação do trabalhador. Sobe quando uma tarefa é
          aprovada; desce com tarefas não aprovadas ou tarefas acumuladas por
          confirmar. Abaixo de 50% a conta fica temporariamente impedida de
          aceitar novas tarefas, até a taxa recuperar. */}
      <SectionTitle>Taxa de sucesso</SectionTitle>
      <div
        className={
          "rounded-2xl border p-4 " +
          (me.successRate <= successRateRules.minToAcceptTasks
            ? "border-destructive/25 bg-destructive/5"
            : "border-border bg-card")
        }
      >
        <div className="flex items-center gap-4">
          <SuccessRateRing value={me.successRate} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <p className="text-sm font-bold">Reputação</p>
              <Badge
                variant={me.successRate <= successRateRules.minToAcceptTasks ? "destructive" : "secondary"}
                className="rounded-full text-[10px]"
              >
                {me.successRate <= successRateRules.minToAcceptTasks
                  ? "Limitada"
                  : me.successRate >= 90
                    ? "Excelente"
                    : "Boa"}
              </Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Sobe com tarefas aprovadas, desce com tarefas não aprovadas.
            </p>
          </div>
        </div>
        {me.successRate <= successRateRules.minToAcceptTasks && (
          <p className="mt-3 rounded-xl bg-destructive/10 px-3 py-2 text-[11px] font-medium text-destructive">
            Abaixo de {successRateRules.minToAcceptTasks}% não pode aceitar novas tarefas até recuperar.
          </p>
        )}
      </div>

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

      {/* Sobre — edição de biografia acontece pelo botão "Editar perfil" no topo */}
      <SectionTitle
        action={
          account && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto gap-1 px-2 py-1 text-xs font-semibold text-primary"
              onClick={() => {
                setBioDraft(account.bio ?? "");
                setBioOpen(true);
              }}
            >
              <Pencil className="size-3" /> Editar
            </Button>
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

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="size-3.5 shrink-0 text-muted-foreground" />
      <span className="text-muted-foreground">{label}</span>
      <span className="ml-auto font-bold text-foreground">{value}</span>
    </div>
  );
}
