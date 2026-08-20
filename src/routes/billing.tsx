import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, Plus, Trash2, Wallet } from "lucide-react";
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
} from "@/components/ui/alert-dialog";
import { Screen, SectionTitle } from "@/components/poppy/Screen";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addPaymentMethod, getCurrentUser, removePaymentMethod, type PaymentMethod, type PaymentMethodType, type PoppyUser } from "@/lib/auth";
import { formatKz, me } from "@/lib/poppy-data";
import { maskAccount, paymentMethodInfo, paymentMethodOrder } from "@/lib/payment-methods";

export const Route = createFileRoute("/billing")({
  head: () => ({
    meta: [
      { title: "Faturamento e pagamento — Poppy" },
      { name: "description", content: "Carteira Poppy e métodos de pagamento guardados: PayPay África, Unitel Money e transferência bancária." },
    ],
  }),
  component: BillingPage,
});

function BillingPage() {
  const [account, setAccount] = useState<PoppyUser | null>(() => getCurrentUser());
  const [addOpen, setAddOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<PaymentMethod | null>(null);

  const methods = account?.paymentMethods ?? [];

  function handleRemove() {
    if (!account || !pendingDelete) return;
    const updated = removePaymentMethod(account.id, pendingDelete.id);
    if (updated) {
      setAccount(updated);
      toast.success("Método de pagamento removido.");
    }
    setPendingDelete(null);
  }

  return (
    <Screen>
      <header className="sticky top-0 z-20 -mx-4 mb-4 flex items-center gap-3 border-b border-border/70 bg-background/85 px-4 py-3 backdrop-blur-lg">
        <Link
          to="/profile"
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground"
          aria-label="Voltar"
        >
          <ChevronLeft className="size-5" />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-bold">Faturamento e pagamento</h1>
          <p className="truncate text-xs text-muted-foreground">Carteira e métodos de pagamento</p>
        </div>
      </header>

      {/* Carteira */}
      <section className="bg-gradient-primary shadow-float rounded-3xl p-5 text-primary-foreground">
        <div className="flex items-center gap-2 text-xs opacity-85">
          <Wallet className="size-4" /> Saldo disponível
        </div>
        <p className="font-display mt-1 text-3xl font-bold">{formatKz(me.balance)}</p>
        <div className="mt-4 flex items-center gap-6 text-xs">
          <div>
            <p className="opacity-80">Pendente</p>
            <p className="font-semibold">{formatKz(me.pending)}</p>
          </div>
          <div>
            <p className="opacity-80">Ganhos totais</p>
            <p className="font-semibold">{formatKz(me.earnings)}</p>
          </div>
        </div>
      </section>

      {/* Métodos de pagamento */}
      <SectionTitle
        action={
          account && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto gap-1 px-2 py-1 text-xs font-semibold text-primary"
              onClick={() => setAddOpen(true)}
            >
              <Plus className="size-3.5" /> Adicionar
            </Button>
          )
        }
      >
        Métodos de pagamento
      </SectionTitle>

      {methods.length > 0 ? (
        <div className="space-y-2.5">
          {methods.map((m) => {
            const info = paymentMethodInfo[m.type];
            return (
              <div
                key={m.id}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3.5"
              >
                <img
                  src={info.logo}
                  alt={info.label}
                  className="size-11 shrink-0 rounded-xl border border-border object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{info.label}</p>
                  <p className="truncate text-xs text-muted-foreground">{m.accountName}</p>
                  <p className="text-xs font-medium text-foreground">
                    {maskAccount(m.iban ?? m.phone ?? "")}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPendingDelete(m)}
                  aria-label="Remover método"
                  className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Ainda não guardou nenhum método de pagamento.
          </p>
          {account && (
            <Button variant="outline" size="sm" className="mt-3 rounded-xl" onClick={() => setAddOpen(true)}>
              Adicionar método
            </Button>
          )}
        </div>
      )}

      <p className="mt-3 text-xs text-muted-foreground">
        Guarde os seus métodos uma vez e escolha entre eles quando levantar dinheiro — sem ter de introduzir os
        dados sempre.
      </p>

      {account && (
        <AddPaymentMethodDialog
          open={addOpen}
          onOpenChange={setAddOpen}
          account={account}
          onSaved={setAccount}
        />
      )}

      <AlertDialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover este método de pagamento?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete && `${paymentMethodInfo[pendingDelete.type].label} — ${pendingDelete.accountName}`}
              . Pode adicioná-lo novamente mais tarde.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleRemove}
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Screen>
  );
}

function AddPaymentMethodDialog({
  open,
  onOpenChange,
  account,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: PoppyUser;
  onSaved: (user: PoppyUser) => void;
}) {
  const [type, setType] = useState<PaymentMethodType | null>(null);
  const [accountName, setAccountName] = useState("");
  const [value, setValue] = useState(""); // IBAN ou telefone
  const [saving, setSaving] = useState(false);

  function reset() {
    setType(null);
    setAccountName("");
    setValue("");
  }

  function handleClose(open: boolean) {
    if (!open) reset();
    onOpenChange(open);
  }

  function handleSave() {
    if (!type) return;
    if (!accountName.trim() || !value.trim()) {
      toast.error("Preencha todos os campos.");
      return;
    }
    setSaving(true);
    const info = paymentMethodInfo[type];
    const updated = addPaymentMethod(account.id, {
      type,
      accountName: accountName.trim(),
      ...(info.fields === "iban" ? { iban: value.trim() } : { phone: value.trim() }),
    });
    setSaving(false);
    if (updated) {
      onSaved(updated);
      toast.success("Método de pagamento guardado.");
      handleClose(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm rounded-2xl">
        <DialogHeader>
          <DialogTitle>{type ? paymentMethodInfo[type].label : "Adicionar método de pagamento"}</DialogTitle>
        </DialogHeader>

        {!type ? (
          <div className="grid grid-cols-1 gap-2.5">
            {paymentMethodOrder.map((t) => {
              const info = paymentMethodInfo[t];
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 text-left transition-colors hover:border-primary/40 hover:bg-primary-soft/40"
                >
                  <img src={info.logo} alt={info.label} className="size-11 shrink-0 rounded-xl border border-border object-cover" />
                  <p className="text-sm font-semibold">{info.label}</p>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="accountName">
                {paymentMethodInfo[type].fields === "phone" ? "Nome" : "Nome da conta"}
              </Label>
              <Input
                id="accountName"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="Nome completo"
                className="mt-2 rounded-xl"
              />
            </div>
            <div>
              <Label htmlFor="value">
                {paymentMethodInfo[type].fields === "phone" ? "Número de telefone" : "IBAN"}
              </Label>
              <Input
                id="value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={paymentMethodInfo[type].fields === "phone" ? "9XX XXX XXX" : "AO06 0000 0000 ..."}
                className="mt-2 rounded-xl"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setType(null)}>
                Voltar
              </Button>
              <Button className="flex-1 rounded-xl" onClick={handleSave} disabled={saving}>
                {saving ? "A guardar..." : "Guardar"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
