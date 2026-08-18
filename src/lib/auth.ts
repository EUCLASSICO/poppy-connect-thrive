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

export type PoppyUser = {
  id: string;
  fullName: string;
  username: string;
  email: string;
  country: Country;
  password: string;
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

export function createUser(data: Omit<PoppyUser, "id">): PoppyUser {
  const user: PoppyUser = { ...data, id: generateUserId() };
  const users = readUsers();
  users.push(user);
  writeUsers(users);
  window.localStorage.setItem(SESSION_KEY, user.id);
  return user;
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
