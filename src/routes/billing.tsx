import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDownToLine,
  Banknote,
  CheckCircle2,
  ChevronLeft,
  Clock,
  FileText,
  Plus,
  ShieldCheck,
  Trash2,
  Wallet,
} from "lucide-react";
import { useMemo, useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  addPaymentMethod,
  getCurrentUser,
  removePaymentMethod,
  requestWithdrawal,
  verifyPaymentMethod,
  type PaymentMethod,
  type PaymentMethodType,
  type PoppyUser,
  type Withdrawal,
} from "@/lib/auth";
import { formatKz, me } from "@/lib/poppy-data";
import { maskAccount, paymentMethodInfo, paymentMethodOrder } from "@/lib/payment-methods";

export const Route = createFileRoute("/billing")({
  head: () => ({
    meta: [
      { title: "Faturamento e pagamento — Poppy" },
      { name: "description", content: "Carteira Poppy, métodos de pagamento e levantamentos." },
    ],
  }),
  component: BillingPage,
});

function isAvailable(w: Withdrawal) {
  return new Date() >= new Date(w.availableAt);
}

function hoursLeft(w: Withdrawal) {
  const ms = new Date(w.availableAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (60 * 60 * 1000)));
}

function BillingPage() {
  const [account, setAccount] = useState<PoppyUser | null>(() => getCurrentUser());
  const [addOpen, setAddOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<PaymentMethod | null>(null);
  const [verifyTarget, setVerifyTarget] = useState<PaymentMethod | null>(null);
  const [receipt, setReceipt] = useState<Withdrawal | null>(null);

  const methods = account?.paymentMethods ?? [];
  const verifiedMethods = methods.filter((m) => m.verified);
  const withdrawals = account?.withdrawals ?? [];

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
          <h1 className="truncate text-base font-bold">Carteira</h1>
          <p className="truncate text-xs text-muted-foreground">Saldo, levantamentos e métodos de pagamento</p>
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
        <Button
          onClick={() => setWithdrawOpen(true)}
          className="mt-4 w-full gap-1.5 rounded-xl bg-primary-foreground text-primary hover:bg-primary-foreground/90"
        >
          <ArrowDownToLine className="size-4" /> Retirar
        </Button>
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
              <div key={m.id} className="rounded-2xl border border-border bg-card p-3.5">
                <div className="flex items-center gap-3">
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
                <div className="mt-2.5 border-t border-border/70 pt-2.5">
                  {m.verified ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-success">
                      <CheckCircle2 className="size-3.5" /> Verificado para levantamentos
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setVerifyTarget(m)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary"
                    >
                      <ShieldCheck className="size-3.5" /> Verificar método
                    </button>
                  )}
                </div>
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
        Verifique um método pelo menos uma vez para poder usá-lo em levantamentos — depois é só escolher entre
        eles sem introduzir os dados de novo.
      </p>

      {/* Transações */}
      <SectionTitle>Transações</SectionTitle>
      {withdrawals.length > 0 ? (
        <div className="space-y-2.5">
          {withdrawals.map((w) => {
            const available = isAvailable(w);
            return (
              <button
                key={w.id}
                onClick={() => setReceipt(w)}
                className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-3.5 text-left transition-colors hover:bg-secondary"
              >
                <span className="bg-primary-soft flex size-10 shrink-0 items-center justify-center rounded-xl text-primary">
                  <Banknote className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">Levantamento — {paymentMethodInfo[w.methodType].label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {new Date(w.requestedAt).toLocaleDateString("pt-PT", { day: "2-digit", month: "short", year: "numeric" })}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-bold">{formatKz(w.amount)}</p>
                  {w.status === "rejeitado" ? (
                    <Badge variant="destructive" className="mt-1 rounded-full text-[10px]">
                      Rejeitado
                    </Badge>
                  ) : available ? (
                    <Badge className="mt-1 rounded-full bg-success text-success-foreground text-[10px] hover:bg-success">
                      Disponível
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="mt-1 gap-1 rounded-full text-[10px]">
                      <Clock className="size-3" /> Pendente
                    </Badge>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border p-6 text-center">
          <p className="text-sm text-muted-foreground">Ainda não fez nenhum levantamento.</p>
        </div>
      )}

      {account && (
        <AddPaymentMethodDialog open={addOpen} onOpenChange={setAddOpen} account={account} onSaved={setAccount} />
      )}

      {account && (
        <WithdrawDialog
          open={withdrawOpen}
          onOpenChange={setWithdrawOpen}
          account={account}
          verifiedMethods={verifiedMethods}
          onWithdrawn={(user, withdrawal) => {
            setAccount(user);
            setReceipt(withdrawal);
          }}
          onGoVerify={() => {
            setWithdrawOpen(false);
            if (methods.length === 0) setAddOpen(true);
          }}
        />
      )}

      {account && (
        <VerifyMethodDialog
          method={verifyTarget}
          onOpenChange={(open) => !open && setVerifyTarget(null)}
          account={account}
          onVerified={(user) => {
            setAccount(user);
            setVerifyTarget(null);
          }}
        />
      )}

      <ReceiptDialog withdrawal={receipt} onOpenChange={(open) => !open && setReceipt(null)} />

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
      toast.success("Método de pagamento guardado. Verifique-o para poder levantar.");
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

function VerifyMethodDialog({
  method,
  onOpenChange,
  account,
  onVerified,
}: {
  method: PaymentMethod | null;
  onOpenChange: (open: boolean) => void;
  account: PoppyUser;
  onVerified: (user: PoppyUser) => void;
}) {
  const [confirmed, setConfirmed] = useState(false);
  const [saving, setSaving] = useState(false);

  function handleClose(open: boolean) {
    if (!open) setConfirmed(false);
    onOpenChange(open);
  }

  function handleVerify() {
    if (!method || !confirmed) return;
    setSaving(true);
    const updated = verifyPaymentMethod(account.id, method.id);
    setSaving(false);
    if (updated) {
      onVerified(updated);
      toast.success("Método verificado. Já pode usá-lo em levantamentos.");
    }
  }

  return (
    <Dialog open={!!method} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm rounded-2xl">
        <DialogHeader>
          <DialogTitle>Verificar método de levantamento</DialogTitle>
        </DialogHeader>
        {method && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-secondary/60 p-3">
              <img
                src={paymentMethodInfo[method.type].logo}
                alt={paymentMethodInfo[method.type].label}
                className="size-11 shrink-0 rounded-xl border border-border object-cover"
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold">{paymentMethodInfo[method.type].label}</p>
                <p className="text-xs text-muted-foreground">{method.accountName}</p>
                <p className="text-xs font-medium">{maskAccount(method.iban ?? method.phone ?? "")}</p>
              </div>
            </div>
            <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-border p-3 text-xs">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="mt-0.5 size-4 shrink-0 accent-primary"
              />
              <span className="text-muted-foreground">
                Confirmo que esta conta me pertence e que os dados acima estão corretos.
              </span>
            </label>
            <DialogFooter>
              <Button variant="outline" onClick={() => handleClose(false)} className="rounded-xl">
                Cancelar
              </Button>
              <Button onClick={handleVerify} disabled={!confirmed || saving} className="rounded-xl">
                {saving ? "A verificar..." : "Verificar"}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function WithdrawDialog({
  open,
  onOpenChange,
  account,
  verifiedMethods,
  onWithdrawn,
  onGoVerify,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: PoppyUser;
  verifiedMethods: PaymentMethod[];
  onWithdrawn: (user: PoppyUser, withdrawal: Withdrawal) => void;
  onGoVerify: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [methodId, setMethodId] = useState<string | null>(verifiedMethods[0]?.id ?? null);
  const [submitting, setSubmitting] = useState(false);

  const numericAmount = useMemo(() => Number(amount.replace(/[^\d]/g, "")), [amount]);

  function reset() {
    setAmount("");
    setMethodId(verifiedMethods[0]?.id ?? null);
  }

  function handleClose(open: boolean) {
    if (!open) reset();
    onOpenChange(open);
  }

  function handleSubmit() {
    if (!methodId) {
      toast.error("Escolha um método verificado.");
      return;
    }
    if (!numericAmount || numericAmount <= 0) {
      toast.error("Indique um valor válido.");
      return;
    }
    if (numericAmount > me.balance) {
      toast.error("Saldo insuficiente para este levantamento.");
      return;
    }
    setSubmitting(true);
    const result = requestWithdrawal(account.id, numericAmount, methodId);
    setSubmitting(false);
    if (result) {
      onWithdrawn(result.user, result.withdrawal);
      toast.success("Levantamento solicitado. Aguarde até 48 horas.");
      handleClose(false);
    } else {
      toast.error("Não foi possível concluir o levantamento.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm rounded-2xl">
        <DialogHeader>
          <DialogTitle>Retirar</DialogTitle>
        </DialogHeader>

        {verifiedMethods.length === 0 ? (
          <div className="space-y-3 text-center">
            <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-secondary text-muted-foreground">
              <ShieldCheck className="size-6" />
            </span>
            <p className="text-sm font-semibold">Verifique um método para retirar</p>
            <p className="text-xs text-muted-foreground">
              Precisa de pelo menos um método de pagamento verificado antes de pedir um levantamento.
            </p>
            <Button onClick={onGoVerify} className="w-full rounded-xl">
              {account.paymentMethods?.length ? "Ver métodos de pagamento" : "Adicionar método de pagamento"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount">Valor a retirar</Label>
              <Input
                id="amount"
                inputMode="numeric"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="mt-2 rounded-xl"
              />
              <p className="mt-1 text-xs text-muted-foreground">Saldo disponível: {formatKz(me.balance)}</p>
            </div>

            <div>
              <Label className="text-xs font-bold">Método verificado</Label>
              <div className="mt-2 space-y-2">
                {verifiedMethods.map((m) => {
                  const info = paymentMethodInfo[m.type];
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMethodId(m.id)}
                      className={
                        "flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors " +
                        (methodId === m.id ? "border-primary bg-primary-soft/40" : "border-border bg-card")
                      }
                    >
                      <img src={info.logo} alt={info.label} className="size-9 shrink-0 rounded-lg border border-border object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{info.label}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {maskAccount(m.iban ?? m.phone ?? "")}
                        </p>
                      </div>
                      <CheckCircle2
                        className={"size-4 shrink-0 " + (methodId === m.id ? "text-primary" : "text-transparent")}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="rounded-xl bg-secondary/60 px-3 py-2 text-[11px] text-muted-foreground">
              Depois de confirmar, o levantamento fica pendente e disponível em até 48 horas. Vai receber um
              comprovativo na carteira.
            </p>

            <Button onClick={handleSubmit} disabled={submitting} className="w-full rounded-xl">
              {submitting ? "A processar..." : "Confirmar levantamento"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function ReceiptDialog({
  withdrawal,
  onOpenChange,
}: {
  withdrawal: Withdrawal | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={!!withdrawal} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="size-4" /> Comprovativo de levantamento
          </DialogTitle>
        </DialogHeader>
        {withdrawal && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-dashed border-border p-4 text-center">
              <p className="text-xs text-muted-foreground">Valor levantado</p>
              <p className="font-display mt-1 text-2xl font-bold text-primary">{formatKz(withdrawal.amount)}</p>
              {withdrawal.status === "rejeitado" ? (
                <Badge variant="destructive" className="mt-2 rounded-full">
                  Rejeitado
                </Badge>
              ) : isAvailable(withdrawal) ? (
                <Badge className="mt-2 rounded-full bg-success text-success-foreground hover:bg-success">
                  Disponível
                </Badge>
              ) : (
                <Badge variant="outline" className="mt-2 gap-1 rounded-full">
                  <Clock className="size-3" /> Pendente — disponível em até {hoursLeft(withdrawal)}h
                </Badge>
              )}
            </div>

            <div className="divide-y divide-border rounded-2xl border border-border">
              <ReceiptRow label="Referência" value={withdrawal.reference} />
              <ReceiptRow label="Método" value={paymentMethodInfo[withdrawal.methodType].label} />
              <ReceiptRow label="Conta" value={maskAccount(withdrawal.methodAccount)} />
              <ReceiptRow
                label="Pedido em"
                value={new Date(withdrawal.requestedAt).toLocaleString("pt-PT", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              />
              <ReceiptRow
                label="Disponível em"
                value={new Date(withdrawal.availableAt).toLocaleString("pt-PT", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function ReceiptRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between p-3 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  );
}
