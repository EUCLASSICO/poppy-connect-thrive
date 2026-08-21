/** Notificações automáticas do site (KYC, pagamentos, boas-vindas...) e o chat com o Suporte Poppy.
 *  Tudo persistido em localStorage, por utilizador, para aparecer centralizado em Mensagens. */

export type SiteNotification = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
};

export type SupportMessage = {
  id: string;
  from: "me" | "support";
  text: string;
  createdAt: string;
};

const NOTIFICATIONS_KEY = "poppy_notifications";
const SUPPORT_KEY = "poppy_support";

function readStore<T>(key: string): Record<string, T[]> {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Record<string, T[]>) : {};
  } catch {
    return {};
  }
}

function writeStore<T>(key: string, store: Record<string, T[]>) {
  window.localStorage.setItem(key, JSON.stringify(store));
}

function uid(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

// ---------- Notificações automáticas ----------

export function getNotifications(userId: string): SiteNotification[] {
  const store = readStore<SiteNotification>(NOTIFICATIONS_KEY);
  return (store[userId] ?? []).slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function addNotification(userId: string, title: string, body: string): SiteNotification {
  const store = readStore<SiteNotification>(NOTIFICATIONS_KEY);
  const notification: SiteNotification = {
    id: uid("nt"),
    title,
    body,
    createdAt: new Date().toISOString(),
    read: false,
  };
  store[userId] = [...(store[userId] ?? []), notification];
  writeStore(NOTIFICATIONS_KEY, store);
  return notification;
}

export function markNotificationsRead(userId: string) {
  const store = readStore<SiteNotification>(NOTIFICATIONS_KEY);
  store[userId] = (store[userId] ?? []).map((n) => ({ ...n, read: true }));
  writeStore(NOTIFICATIONS_KEY, store);
}

export function unreadNotificationsCount(userId: string): number {
  return getNotifications(userId).filter((n) => !n.read).length;
}

// ---------- Chat com o Suporte Poppy ----------

const SUPPORT_AUTO_REPLY =
  "Obrigado pela sua mensagem! A nossa equipa vai responder em breve. Entretanto, pode consultar as Definições para dúvidas comuns sobre verificação e pagamentos.";

export function getSupportMessages(userId: string): SupportMessage[] {
  const store = readStore<SupportMessage>(SUPPORT_KEY);
  return store[userId] ?? [];
}

function pushSupportMessage(userId: string, message: SupportMessage) {
  const store = readStore<SupportMessage>(SUPPORT_KEY);
  store[userId] = [...(store[userId] ?? []), message];
  writeStore(SUPPORT_KEY, store);
}

/** Cria a conversa de suporte com uma primeira mensagem de boas-vindas, se ainda não existir */
export function ensureSupportThread(userId: string, name: string) {
  if (getSupportMessages(userId).length > 0) return;
  pushSupportMessage(userId, {
    id: uid("sp"),
    from: "support",
    text: `Olá, ${name.split(" ")[0]}! 👋 Bem-vindo(a) à Poppy. Escreva aqui sempre que precisar de ajuda com a sua conta, verificação ou pagamentos.`,
    createdAt: new Date().toISOString(),
  });
}

/** Envia uma mensagem para o suporte e simula uma resposta automática */
export function sendSupportMessage(userId: string, text: string): SupportMessage {
  const message: SupportMessage = { id: uid("sp"), from: "me", text, createdAt: new Date().toISOString() };
  pushSupportMessage(userId, message);
  window.setTimeout(() => {
    pushSupportMessage(userId, {
      id: uid("sp"),
      from: "support",
      text: SUPPORT_AUTO_REPLY,
      createdAt: new Date().toISOString(),
    });
    window.dispatchEvent(new CustomEvent("poppy:support-message"));
  }, 900);
  return message;
}
