import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Headset } from "lucide-react";
import { useEffect, useState } from "react";

import { Screen } from "@/components/poppy/Screen";
import { getCurrentUser } from "@/lib/auth";
import { getNotifications, getSupportMessages, unreadNotificationsCount } from "@/lib/notifications";

export const Route = createFileRoute("/messages/")({
  head: () => ({
    meta: [
      { title: "Mensagens — Poppy" },
      {
        name: "description",
        content: "Fale com o Suporte Poppy e veja todas as notificações da sua conta num só lugar.",
      },
    ],
  }),
  component: MessagesPage,
});

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return "agora";
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d} d`;
  return new Date(iso).toLocaleDateString("pt-PT", { day: "2-digit", month: "short" });
}

function MessagesPage() {
  const [account] = useState(() => getCurrentUser());
  const [unread, setUnread] = useState(0);
  const [lastSupport, setLastSupport] = useState<{ text: string; createdAt: string; from: string } | null>(null);
  const [notificationsCount, setNotificationsCount] = useState(0);

  useEffect(() => {
    if (!account) return;
    setUnread(unreadNotificationsCount(account.id));
    setNotificationsCount(getNotifications(account.id).length);
    const support = getSupportMessages(account.id);
    const last = support[support.length - 1];
    if (last) setLastSupport(last);
  }, [account]);

  return (
    <Screen>
      <header className="sticky top-0 z-20 -mx-4 mb-4 border-b border-border/70 bg-background/85 px-4 py-3 backdrop-blur-lg">
        <h1 className="text-base font-bold">Mensagens</h1>
        <p className="text-xs text-muted-foreground">Suporte e notificações da sua conta</p>
      </header>

      <div className="space-y-2.5">
        {/* Suporte Poppy — sempre disponível */}
        <Link
          to="/messages/support"
          className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3.5 transition-colors hover:bg-secondary"
        >
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
            <Headset className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-sm font-bold">Suporte Poppy</p>
              {lastSupport && (
                <span className="shrink-0 text-[10px] text-muted-foreground">{timeAgo(lastSupport.createdAt)}</span>
              )}
            </div>
            <p className="truncate text-xs text-muted-foreground">
              {lastSupport ? lastSupport.text : "Fale connosco sempre que precisar de ajuda"}
            </p>
          </div>
        </Link>

        {/* Notificações automáticas do site */}
        <Link
          to="/messages/notifications"
          className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3.5 transition-colors hover:bg-secondary"
        >
          <span className="relative flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary">
            <Bell className="size-5" />
            {unread > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
                {unread}
              </span>
            )}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold">Notificações</p>
            <p className="truncate text-xs text-muted-foreground">
              {notificationsCount > 0
                ? "Verificação, pagamentos e novidades da Poppy"
                : "Ainda sem notificações"}
            </p>
          </div>
        </Link>
      </div>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Quando enviar uma proposta ou receber um convite, a conversa com o cliente aparece aqui também.
      </p>
    </Screen>
  );
}
