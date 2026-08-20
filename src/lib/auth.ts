export type Country =
  | "Angola"
  | "Brasil"
  | "Portugal"
  | "Moçambique"
  | "Cabo Verde"
  | "Guiné-Bissau"
  | "São Tomé e Príncipe"
  | "Timor-Leste"
  | "Guiné Equatorial";

export const countries: Country[] = [
  "Angola",
  "Brasil",
  "Portugal",
  "Moçambique",
  "Cabo Verde",
  "Guiné-Bissau",
  "São Tomé e Príncipe",
  "Timor-Leste",
  "Guiné Equatorial",
];

export type KycStatus = "não verificado" | "pendente" | "verificado" | "rejeitado";

export type KycDocuments = {
  front: string;
  back: string;
  selfie: string;
  signature: string;
  address: string;
  phone: string;
};

export type PoppyUser = {
  id: string;
  fullName: string;
  username: string;
  email: string;
  secondaryEmail?: string;
  country: Country;
  password: string;
  address?: string;
  phone?: string;
  kycStatus: KycStatus;
  kycDocuments?: KycDocuments;
  kycSubmittedAt?: string;
  kycNote?: string;
};

const USERS_KEY = "poppy_users";
const SESSION_KEY = "poppy_session";

function readUsers(): PoppyUser[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as PoppyUser[]) : [];
  } catch {
    return [];
  }
}

function writeUsers(users: PoppyUser[]) {
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/** Gera um ID único no formato POP-XXXXXX */
export function generateUserId(): string {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `POP-${random}`;
}

export function isEmailTaken(email: string): boolean {
  return readUsers().some((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function isUsernameTaken(username: string): boolean {
  return readUsers().some((u) => u.username.toLowerCase() === username.toLowerCase());
}

export function createUser(data: Omit<PoppyUser, "id" | "kycStatus">): PoppyUser {
  const user: PoppyUser = { ...data, id: generateUserId(), kycStatus: "não verificado" };
  const users = readUsers();
  users.push(user);
  writeUsers(users);
  window.localStorage.setItem(SESSION_KEY, user.id);
  return user;
}

function updateUser(id: string, patch: Partial<PoppyUser>): PoppyUser | null {
  const users = readUsers();
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return null;
  const updated: PoppyUser = { ...(users[index] as PoppyUser), ...patch };
  users[index] = updated;
  writeUsers(users);
  return updated;
}

/** Troca a senha, validando a senha atual */
export function changePassword(id: string, currentPassword: string, newPassword: string): boolean {
  const user = readUsers().find((u) => u.id === id);
  if (!user || user.password !== currentPassword) return false;
  updateUser(id, { password: newPassword });
  return true;
}

/** Define ou atualiza o Gmail secundário de recuperação */
export function setSecondaryEmail(id: string, secondaryEmail: string): PoppyUser | null {
  return updateUser(id, { secondaryEmail });
}

/** Envia os documentos de KYC (BI frente/verso, selfie com BI, assinatura, morada e telefone) — mock, passa a "pendente" */
export function submitKycDocuments(id: string, documents: KycDocuments): PoppyUser | null {
  return updateUser(id, {
    kycStatus: "pendente",
    kycDocuments: documents,
    kycSubmittedAt: new Date().toISOString(),
    address: documents.address,
    phone: documents.phone,
  });
}

/** Apaga definitivamente a conta e a sessão associada */
export function deleteAccount(id: string): boolean {
  const users = readUsers();
  const next = users.filter((u) => u.id !== id);
  if (next.length === users.length) return false;
  writeUsers(next);
  const sessionId = window.localStorage.getItem(SESSION_KEY);
  if (sessionId === id) window.localStorage.removeItem(SESSION_KEY);
  return true;
}

/** Autentica por ID ou por email (Gmail) + senha */
export function login(idOrEmail: string, password: string): PoppyUser | null {
  const value = idOrEmail.trim().toLowerCase();
  const user = readUsers().find(
    (u) => u.id.toLowerCase() === value || u.email.toLowerCase() === value,
  );
  if (!user || user.password !== password) return null;
  window.localStorage.setItem(SESSION_KEY, user.id);
  return user;
}

export function logout() {
  window.localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser(): PoppyUser | null {
  if (typeof window === "undefined") return null;
  const id = window.localStorage.getItem(SESSION_KEY);
  if (!id) return null;
  return readUsers().find((u) => u.id === id) ?? null;
}
