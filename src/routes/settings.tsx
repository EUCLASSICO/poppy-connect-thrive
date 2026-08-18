import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AlertOctagon, ChevronRight, Eye, EyeOff, KeyRound, LogOut, Mail, ShieldCheck, Trash2 } from "lucide-react";
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
import { Screen, ScreenHeader, SectionTitle } from "@/components/poppy/Screen";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePassword, deleteAccount, getCurrentUser, logout, setSecondaryEmail, type KycStatus } from "@/lib/auth";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Configurações — Poppy" },
      { name: "description", content: "Verificação KYC, troca de senha e Gmail secundário da sua conta Poppy." },
    ],
  }),
  component: SettingsPage,
});

const kycLabel: Record<KycStatus, string> = {
  "não verificado": "Não verificado",
  pendente: "Em análise",
  verificado: "Verificado",
  rejeitado: "Rejeitado",
};

const kycVariant: Record<KycStatus, "secondary" | "outline" | "default" | "destructive"> = {
  "não verificado": "secondary",
  pendente: "outline",
  verificado: "default",
  rejeitado: "destructive",
};

function SettingsPage() {
  const navigate = useNavigate();
  const [account, setAccount] = useState(getCurrentUser());

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);

  const [secondaryEmail, setSecondaryEmailInput] = useState(account?.secondaryEmail ?? "");
  const [deleting, setDeleting] = useState(false);

  if (!account) {
    return (
      <Screen>
        <ScreenHeader title="Configurações" back="/profile" />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Entre na sua conta para aceder às configurações.
        </p>
      </Screen>
    );
  }

  function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!account) return;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast.error("Preencha todos os campos de senha.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error("A confirmação não coincide com a nova senha.");
      return;
    }

    const ok = changePassword(account.id, currentPassword, newPassword);
    if (!ok) {
      toast.error("Senha atual incorreta.");
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    toast.success("Senha alterada com sucesso.");
  }

  function handleSecondaryEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!account) return;

    const value = secondaryEmail.trim().toLowerCase();
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      toast.error("Introduza um email válido.");
      return;
    }
    if (value === account.email.toLowerCase()) {
      toast.error("O Gmail secundário deve ser diferente do principal.");
      return;
    }

    const updated = setSecondaryEmail(account.id, value);
    if (updated) {
      setAccount(updated);
      toast.success("Gmail secundário atualizado.");
    }
  }

  function handleLogout() {
    logout();
    navigate({ to: "/login" });
  }

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
      <ScreenHeader title="Configurações" subtitle={account.id} back="/profile" />

      {/* Verificação KYC */}
      <SectionTitle>Verificação de identidade</SectionTitle>
      <Link
        to="/kyc"
        className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-secondary"
      >
        <span className="bg-primary-soft flex size-10 shrink-0 items-center justify-center rounded-xl text-primary">
          <ShieldCheck className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold">Verificação KYC</p>
            <Badge variant={kycVariant[account.kycStatus]}>{kycLabel[account.kycStatus]}</Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            BI (frente e verso), selfie com o BI, morada, telefone e assinatura digital.
          </p>
        </div>
        <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
      </Link>

      {/* Trocar senha */}
      <SectionTitle>Trocar senha</SectionTitle>
      <form className="space-y-4 rounded-2xl border border-border bg-card p-4" onSubmit={handleChangePassword}>
        <div className="flex items-center gap-2 text-muted-foreground">
          <KeyRound className="size-4" />
          <p className="text-xs">Escolha uma senha com pelo menos 6 caracteres.</p>
        </div>

        <div>
          <Label htmlFor="currentPassword">Senha atual</Label>
          <Input
            id="currentPassword"
            type={showPasswords ? "text" : "password"}
            className="mt-2 rounded-xl"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        <div>
          <Label htmlFor="newPassword">Nova senha</Label>
          <div className="relative mt-2">
            <Input
              id="newPassword"
              type={showPasswords ? "text" : "password"}
              className="rounded-xl pr-10"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPasswords((v) => !v)}
              className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground"
              aria-label={showPasswords ? "Ocultar senhas" : "Mostrar senhas"}
            >
              {showPasswords ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        <div>
          <Label htmlFor="confirmNewPassword">Confirmar nova senha</Label>
          <Input
            id="confirmNewPassword"
            type={showPasswords ? "text" : "password"}
            className="mt-2 rounded-xl"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>

        <Button type="submit" variant="secondary" className="w-full rounded-xl">
          Guardar nova senha
        </Button>
      </form>

      {/* Gmail secundário */}
      <SectionTitle>Gmail secundário</SectionTitle>
      <form className="space-y-4 rounded-2xl border border-border bg-card p-4" onSubmit={handleSecondaryEmail}>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Mail className="size-4" />
          <p className="text-xs">Use para recuperar o acesso caso perca a senha do Gmail principal.</p>
        </div>

        <div>
          <Label htmlFor="secondaryEmail">Gmail secundário</Label>
          <Input
            id="secondaryEmail"
            type="email"
            placeholder="backup@gmail.com"
            className="mt-2 rounded-xl"
            value={secondaryEmail}
            onChange={(e) => setSecondaryEmailInput(e.target.value)}
          />
        </div>

        <Button type="submit" variant="secondary" className="w-full rounded-xl">
          Guardar Gmail secundário
        </Button>
      </form>

      {/* Conta */}
      <SectionTitle>Conta</SectionTitle>
      <div className="space-y-2 rounded-2xl border border-border bg-card p-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">ID Poppy</span>
          <span className="font-semibold">{account.id}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Nome de usuário</span>
          <span className="font-semibold">@{account.username}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Gmail principal</span>
          <span className="font-semibold">{account.email}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">País</span>
          <span className="font-semibold">{account.country}</span>
        </div>
      </div>

      <div className="mt-6 space-y-2">
        <Button
          variant="outline"
          className="w-full justify-start gap-2 rounded-xl text-destructive hover:text-destructive"
          size="lg"
          onClick={handleLogout}
        >
          <LogOut className="size-4" /> Sair da conta
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 rounded-xl border-destructive/40 text-destructive hover:bg-destructive/5 hover:text-destructive"
              size="lg"
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
