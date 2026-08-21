import { createFileRoute } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";

import { Screen, ScreenHeader } from "@/components/poppy/Screen";
import { getCurrentUser } from "@/lib/auth";
import { getNotifications, markNotificationsRead, type SiteNotification } from "@/lib/notifications";

export const Route = createFileRoute("/messages/notifications")({
  head: () => ({
    meta: [{ title: "Notificações — Poppy" }],
  }),
  component: NotificationsPage,
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

function NotificationsPage() {
  const [notifications, setNotifications] = useState<SiteNotification[]>([]);

  useEffect(() => {
    const account = getCurrentUser();
    if (!account) return;
    setNotifications(getNotifications(account.id));
    markNotificationsRead(account.id);
  }, []);

  return (
    <Screen>
      <ScreenHeader title="Notificações" back="/messages" />

      {notifications.length > 0 ? (
        <div className="space-y-2.5">
          {notifications.map((n) => (
            <div key={n.id} className="flex gap-3 rounded-2xl border border-border bg-card p-3.5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <Bell className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold">{n.title}</p>
                  <span className="shrink-0 text-[10px] text-muted-foreground">{timeAgo(n.createdAt)}</span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{n.body}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-card/60 p-8 text-center">
          <span className="bg-primary-soft mx-auto flex size-12 items-center justify-center rounded-2xl text-primary">
            <Bell className="size-6" />
          </span>
          <p className="mt-4 text-sm font-semibold">Ainda sem notificações</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Avisos sobre verificação, pagamentos e novidades da Poppy aparecem aqui.
          </p>
        </div>
      )}
    </Screen>
  );
}
