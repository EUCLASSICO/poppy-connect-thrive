import { Megaphone } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Espaço de anúncio nativo — pequeno, discreto, no meio do feed em vez de
 * um banner grande no topo. Por agora é um placeholder de layout: sem
 * fotos de terceiros (direitos de imagem/copyright), pronto para receber
 * a arte de um anunciante real mais tarde.
 */
export function AdSlot({ className }: { className?: string }) {
  return (
    <section className={cn("overflow-hidden rounded-2xl border border-dashed border-border/80 bg-card", className)}>
      <div className="flex items-center gap-3 p-4">
        <span className="bg-accent-soft flex size-11 shrink-0 items-center justify-center rounded-xl text-accent">
          <Megaphone className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Anúncio</p>
          <p className="mt-0.5 truncate text-sm font-semibold">Espaço reservado para um anunciante</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Este espaço mostra a imagem e o link de quem patrocinar.
          </p>
        </div>
      </div>
    </section>
  );
}
