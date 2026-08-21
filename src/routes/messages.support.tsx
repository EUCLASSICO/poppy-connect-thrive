import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, Headset, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { getSupportMessages, sendSupportMessage, type SupportMessage } from "@/lib/notifications";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/messages/support")({
  head: () => ({
    meta: [{ title: "Suporte Poppy — Mensagens" }],
  }),
  component: SupportPage,
});

function SupportPage() {
  const [account] = useState(() => getCurrentUser());
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  function refresh() {
    if (!account) return;
    setMessages(getSupportMessages(account.id));
  }

  useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener("poppy:support-message", handler);
    return () => window.removeEventListener("poppy:support-message", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend() {
    if (!account || !text.trim() || sending) return;
    setSending(true);
    sendSupportMessage(account.id, text.trim());
    setText("");
    refresh();
    setSending(false);
  }

  return (
    <div className="mx-auto flex h-screen w-full max-w-md flex-col px-4">
      <header className="sticky top-0 z-20 -mx-4 flex items-center gap-3 border-b border-border/70 bg-background/85 px-4 py-3 backdrop-blur-lg">
        <Link
          to="/messages"
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground"
          aria-label="Voltar"
        >
          <ChevronLeft className="size-5" />
        </Link>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <Headset className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold">Suporte Poppy</p>
          <p className="text-[11px] text-muted-foreground">Normalmente responde em poucas horas</p>
        </div>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto py-4">
        {messages.map((m) => (
          <div key={m.id} className={cn("flex", m.from === "me" ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm",
                m.from === "me"
                  ? "rounded-br-md bg-primary text-primary-foreground"
                  : "rounded-bl-md bg-secondary text-secondary-foreground",
              )}
            >
              {m.text}
              <p
                className={cn(
                  "mt-1 text-[10px]",
                  m.from === "me" ? "text-primary-foreground/70" : "text-muted-foreground",
                )}
              >
                {new Date(m.createdAt).toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="sticky bottom-0 flex items-center gap-2 border-t border-border/70 bg-background py-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Escreva uma mensagem..."
          className="flex-1 rounded-full border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-primary"
        />
        <Button
          size="icon"
          className="size-10 shrink-0 rounded-full"
          onClick={handleSend}
          disabled={!text.trim() || sending}
          aria-label="Enviar"
        >
          <Send className="size-4" />
        </Button>
      </div>
    </div>
  );
}
