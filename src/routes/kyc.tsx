import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AlertTriangle, Camera, CheckCircle2, Clock, IdCard, ShieldCheck, UserRound } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { SignaturePad } from "@/components/poppy/SignaturePad";
import { Screen, ScreenHeader, SectionTitle } from "@/components/poppy/Screen";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCurrentUser, submitKycDocuments, type KycStatus } from "@/lib/auth";

export const Route = createFileRoute("/kyc")({
  head: () => ({
    meta: [
      { title: "Verificação de identidade — Poppy" },
      { name: "description", content: "Envie o seu BI, selfie, morada, telefone e assinatura para verificar a sua conta Poppy." },
    ],
  }),
  component: KycPage,
});

const statusLabel: Record<KycStatus, string> = {
  "não verificado": "Não verificado",
  pendente: "Em análise",
  verificado: "Verificado",
  rejeitado: "Rejeitado",
};

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Não foi possível ler o ficheiro."));
    reader.readAsDataURL(file);
  });
}

function DocSlot({
  label,
  hint,
  value,
  onPick,
  capture,
}: {
  label: string;
  hint: string;
  value: string | null;
  onPick: (dataUrl: string) => void;
  capture?: "environment" | "user";
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      onPick(await readAsDataUrl(file));
    } catch {
      toast.error("Não foi possível carregar a imagem.");
    }
  }

  return (
    <div>
      <p className="text-sm font-semibold">{label}</p>
      <p className="mb-2 text-xs text-muted-foreground">{hint}</p>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-secondary/40 transition-colors hover:bg-secondary"
      >
        {value ? (
          <img src={value} alt={label} className="size-full object-cover" />
        ) : (
          <span className="flex flex-col items-center gap-1.5 text-muted-foreground">
            <Camera className="size-6" />
            <span className="text-xs font-medium">Tocar para tirar foto</span>
          </span>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture={capture}
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}

function KycPage() {
  const navigate = useNavigate();
  const [account, setAccount] = useState(getCurrentUser());

  const [front, setFront] = useState<string | null>(account?.kycDocuments?.front ?? null);
  const [back, setBack] = useState<string | null>(account?.kycDocuments?.back ?? null);
  const [selfie, setSelfie] = useState<string | null>(account?.kycDocuments?.selfie ?? null);
  const [signature, setSignature] = useState<string | null>(account?.kycDocuments?.signature ?? null);
  const [address, setAddress] = useState(account?.address ?? "");
  const [phone, setPhone] = useState(account?.phone ?? "");
  const [submitting, setSubmitting] = useState(false);

  if (!account) {
    return (
      <Screen>
        <ScreenHeader title="Verificação de identidade" back="/profile" />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Entre na sua conta para verificar a sua identidade.
        </p>
      </Screen>
    );
  }

  const canEdit = account.kycStatus === "não verificado" || account.kycStatus === "rejeitado";
  const isComplete = !!(front && back && selfie && signature && address.trim() && phone.trim());

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!account || !front || !back || !selfie || !signature) {
      toast.error("Carregue as duas faces do BI, a selfie com o BI e assine.");
      return;
    }
    if (!address.trim() || !phone.trim()) {
      toast.error("Preencha a morada e o número de telefone.");
      return;
    }

    setSubmitting(true);
    const updated = submitKycDocuments(account.id, {
      front,
      back,
      selfie,
      signature,
      address: address.trim(),
      phone: phone.trim(),
    });
    setSubmitting(false);

    if (updated) {
      setAccount(updated);
      toast.success("Verificação enviada.", { description: "A sua análise está em curso." });
      navigate({ to: "/settings" });
    } else {
      toast.error("Não foi possível enviar a verificação.");
    }
  }

  return (
    <Screen>
      <ScreenHeader title="Verificação de identidade" subtitle={account.id} back="/settings" />

      {/* Estado atual */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-start gap-3">
          <span className="bg-primary-soft flex size-10 shrink-0 items-center justify-center rounded-xl text-primary">
            <ShieldCheck className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold">Estado da verificação</p>
              <Badge
                variant={
                  account.kycStatus === "verificado"
                    ? "default"
                    : account.kycStatus === "pendente"
                      ? "outline"
                      : account.kycStatus === "rejeitado"
                        ? "destructive"
                        : "secondary"
                }
              >
                {statusLabel[account.kycStatus]}
              </Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {account.kycStatus === "verificado" && "A sua identidade está verificada. Obrigado!"}
              {account.kycStatus === "pendente" && "Estamos a analisar os seus documentos. Isto pode demorar até 48 horas."}
              {account.kycStatus === "não verificado" && "Verifique a sua identidade para aumentar limites de saque e reforçar a confiança de clientes."}
              {account.kycStatus === "rejeitado" && (account.kycNote || "A verificação foi rejeitada. Reveja os documentos e envie novamente.")}
            </p>
          </div>
        </div>
      </div>

      {account.kycStatus === "verificado" && (
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">
          <CheckCircle2 className="size-5 shrink-0 text-primary" />
          A sua conta está totalmente verificada.
        </div>
      )}

      {account.kycStatus === "pendente" && (
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">
          <Clock className="size-5 shrink-0 text-primary" />
          Os documentos enviados estão em análise. Volte aqui mais tarde.
        </div>
      )}

      {canEdit && (
        <form className="space-y-6" onSubmit={handleSubmit}>
          {account.kycStatus === "rejeitado" && account.kycNote && (
            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              <AlertTriangle className="size-5 shrink-0" />
              {account.kycNote}
            </div>
          )}

          <SectionTitle>Documento de identidade (BI)</SectionTitle>
          <div className="grid grid-cols-2 gap-3">
            <DocSlot label="Frente do BI" hint="Foto nítida da frente" value={front} onPick={setFront} capture="environment" />
            <DocSlot label="Verso do BI" hint="Foto nítida do verso" value={back} onPick={setBack} capture="environment" />
          </div>

          <SectionTitle>Selfie com o BI</SectionTitle>
          <DocSlot
            label="Foto segurando o BI"
            hint="Tire uma foto do seu rosto segurando o BI ao lado, ambos visíveis"
            value={selfie}
            onPick={setSelfie}
            capture="user"
          />

          <SectionTitle>Contacto</SectionTitle>
          <div className="space-y-4 rounded-2xl border border-border bg-card p-4">
            <div>
              <Label htmlFor="address" className="flex items-center gap-1.5">
                <IdCard className="size-3.5" /> Endereço
              </Label>
              <Input
                id="address"
                placeholder="Rua, bairro, município, província"
                className="mt-2 rounded-xl"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="phone" className="flex items-center gap-1.5">
                <UserRound className="size-3.5" /> Número de telefone
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+244 9XX XXX XXX"
                className="mt-2 rounded-xl"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <SectionTitle>Assinatura digital</SectionTitle>
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="mb-3 text-xs text-muted-foreground">
              Assine abaixo para confirmar que os dados enviados são verdadeiros e pertencem a si.
            </p>
            <SignaturePad value={signature} onChange={setSignature} />
          </div>

          <Button type="submit" className="w-full rounded-xl" size="lg" disabled={!isComplete || submitting}>
            {submitting ? "A enviar..." : "Enviar verificação"}
          </Button>
        </form>
      )}
    </Screen>
  );
}
