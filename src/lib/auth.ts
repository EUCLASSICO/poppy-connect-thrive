import { supabase } from "@/integrations/supabase/client";
import { checkIdentifierAvailable, signInWithIdentifier } from "@/lib/auth.functions";
import { addNotification, ensureSupportThread } from "@/lib/notifications";

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

export type PaymentMethodType = "paypay" | "unitel_money" | "bank_transfer";

const paymentMethodLabels: Record<PaymentMethodType, string> = {
  paypay: "PayPay África",
  unitel_money: "Unitel Money",
  bank_transfer: "Transferência bancária",
};

export type PaymentMethod = {
  id: string;
  type: PaymentMethodType;
  accountName: string;
  /** Usado por PayPay África e Transferência bancária */
  iban?: string;
  /** Usado por Unitel Money */
  phone?: string;
  createdAt: string;
  /** Confirmado pelo dono da conta como método válido para levantamentos. */
  verified?: boolean;
};

export type WithdrawalStatus = "pendente" | "rejeitado";

export type Withdrawal = {
  id: string;
  /** Número de referência mostrado no comprovativo. */
  reference: string;
  amount: number;
  methodId: string;
  methodType: PaymentMethodType;
  methodLabel: string;
  methodAccount: string;
  status: WithdrawalStatus;
  requestedAt: string;
  /** requestedAt + 48h — quando o levantamento fica disponível. */
  availableAt: string;
};

export type PoppyUser = {
  /** ID Poppy visível ao utilizador (POP-XXXXXX). */
  id: string;
  /** Identificador interno da conta na base de dados. */
  uid: string;
  fullName: string;
  username: string;
  email: string;
  secondaryEmail?: string;
  country: Country;
  address?: string;
  phone?: string;
  kycStatus: KycStatus;
  kycDocuments?: KycDocuments;
  kycSubmittedAt?: string;
  kycNote?: string;
  avatarUrl?: string;
  bio?: string;
  skills?: string[];
  paymentMethods?: PaymentMethod[];
  withdrawals?: Withdrawal[];
  createdAt?: string;
};

/** Gera um ID único no formato POP-XXXXXX */
export function generateUserId(): string {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `POP-${random}`;
}

export async function isEmailTaken(email: string): Promise<boolean> {
  const { available } = await checkIdentifierAvailable({ data: { kind: "email", value: email } });
  return !available;
}

export async function isUsernameTaken(username: string): Promise<boolean> {
  const { available } = await checkIdentifierAvailable({ data: { kind: "username", value: username } });
  return !available;
}

type ProfileRow = {
  id: string;
  poppy_id: string;
  full_name: string;
  username: string;
  email: string;
  secondary_email: string | null;
  country: string;
  address: string | null;
  phone: string | null;
  kyc_status: string;
  kyc_documents: unknown;
  kyc_submitted_at: string | null;
  kyc_note: string | null;
  avatar_url: string | null;
  bio: string | null;
  skills: string[] | null;
  created_at: string;
};

function mapProfile(
  row: ProfileRow,
  methods: PaymentMethod[] = [],
  withdrawals: Withdrawal[] = [],
): PoppyUser {
  return {
    id: row.poppy_id,
    uid: row.id,
    fullName: row.full_name,
    username: row.username,
    email: row.email,
    secondaryEmail: row.secondary_email ?? undefined,
    country: row.country as Country,
    address: row.address ?? undefined,
    phone: row.phone ?? undefined,
    kycStatus: row.kyc_status as KycStatus,
    kycDocuments: (row.kyc_documents as KycDocuments | null) ?? undefined,
    kycSubmittedAt: row.kyc_submitted_at ?? undefined,
    kycNote: row.kyc_note ?? undefined,
    avatarUrl: row.avatar_url ?? undefined,
    bio: row.bio ?? undefined,
    skills: row.skills ?? [],
    paymentMethods: methods,
    withdrawals,
    createdAt: row.created_at,
  };
}

type MethodRow = {
  id: string;
  type: string;
  account_name: string;
  iban: string | null;
  phone: string | null;
  verified: boolean;
  created_at: string;
};

function mapMethod(row: MethodRow): PaymentMethod {
  return {
    id: row.id,
    type: row.type as PaymentMethodType,
    accountName: row.account_name,
    iban: row.iban ?? undefined,
    phone: row.phone ?? undefined,
    verified: row.verified,
    createdAt: row.created_at,
  };
}

type WithdrawalRow = {
  id: string;
  reference: string;
  amount: number;
  method_id: string | null;
  method_type: string;
  method_label: string;
  method_account: string;
  status: string;
  requested_at: string;
  available_at: string;
};

function mapWithdrawal(row: WithdrawalRow): Withdrawal {
  return {
    id: row.id,
    reference: row.reference,
    amount: Number(row.amount),
    methodId: row.method_id ?? "",
    methodType: row.method_type as PaymentMethodType,
    methodLabel: row.method_label,
    methodAccount: row.method_account,
    status: row.status as WithdrawalStatus,
    requestedAt: row.requested_at,
    availableAt: row.available_at,
  };
}

/** Lê a conta com sessão ativa, incluindo métodos de pagamento e levantamentos. */
export async function getCurrentUser(): Promise<PoppyUser | null> {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user) return null;

  const [profile, methods, withdrawals] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase.from("payment_methods").select("*").eq("user_id", user.id).order("created_at"),
    supabase.from("withdrawals").select("*").eq("user_id", user.id).order("requested_at", { ascending: false }),
  ]);

  if (!profile.data) return null;
  return mapProfile(
    profile.data as ProfileRow,
    ((methods.data ?? []) as MethodRow[]).map(mapMethod),
    ((withdrawals.data ?? []) as WithdrawalRow[]).map(mapWithdrawal),
  );
}

/** Cria a conta na Cloud (autenticação + perfil) e devolve o utilizador. */
export async function createUser(data: {
  fullName: string;
  username: string;
  email: string;
  country: Country;
  password: string;
}): Promise<{ user: PoppyUser } | { error: string }> {
  const email = data.email.trim().toLowerCase();
  const { data: signUp, error } = await supabase.auth.signUp({
    email,
    password: data.password,
    options: { emailRedirectTo: `${window.location.origin}/` },
  });

  if (error) {
    if (error.message.toLowerCase().includes("already")) {
      return { error: "Já existe uma conta com este Gmail." };
    }
    return { error: error.message };
  }
  const authUser = signUp.user;
  if (!authUser) return { error: "Não foi possível criar a conta. Tente novamente." };

  const poppyId = generateUserId();
  const { data: row, error: profileError } = await supabase
    .from("profiles")
    .insert({
      id: authUser.id,
      poppy_id: poppyId,
      full_name: data.fullName.trim(),
      username: data.username.trim(),
      email,
      country: data.country,
    })
    .select("*")
    .single();

  if (profileError || !row) {
    await supabase.auth.signOut();
    const message = (profileError?.message ?? "").toLowerCase();
    if (message.includes("username")) return { error: "Este nome de usuário já está em uso." };
    return { error: "Não foi possível guardar o perfil. Tente novamente." };
  }

  const user = mapProfile(row as ProfileRow);
  await ensureSupportThread(user.fullName);
  await addNotification(
    "Bem-vindo(a) à Poppy 👋",
    "A sua conta foi criada. Explore tarefas e trabalhos disponíveis.",
  );
  return { user };
}

async function updateProfileRow(patch: Record<string, unknown>): Promise<PoppyUser | null> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;
  const { data: row } = await supabase
    .from("profiles")
    .update(patch)
    .eq("id", auth.user.id)
    .select("*")
    .maybeSingle();
  if (!row) return null;
  return getCurrentUser();
}

/** Atualiza foto de perfil, biografia, nome e/ou habilidades */
export async function updateProfile(
  patch: Partial<Pick<PoppyUser, "avatarUrl" | "bio" | "skills" | "fullName">>,
): Promise<PoppyUser | null> {
  const row: Record<string, unknown> = {};
  if (patch.avatarUrl !== undefined) row["avatar_url"] = patch.avatarUrl;
  if (patch.bio !== undefined) row["bio"] = patch.bio;
  if (patch.skills !== undefined) row["skills"] = patch.skills;
  if (patch.fullName !== undefined) row["full_name"] = patch.fullName;
  return updateProfileRow(row);
}

/** Troca a senha, validando a senha atual */
export async function changePassword(currentPassword: string, newPassword: string): Promise<boolean> {
  const { data: auth } = await supabase.auth.getUser();
  const email = auth.user?.email;
  if (!email) return false;

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password: currentPassword,
  });
  if (signInError) return false;

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return false;
  await addNotification("Senha alterada", "A senha da sua conta Poppy foi atualizada com sucesso.");
  return true;
}

/** Define ou atualiza o Gmail secundário de recuperação */
export async function setSecondaryEmail(secondaryEmail: string): Promise<PoppyUser | null> {
  return updateProfileRow({ secondary_email: secondaryEmail });
}

/** Envia os documentos de KYC — passa a "pendente" */
export async function submitKycDocuments(documents: KycDocuments): Promise<PoppyUser | null> {
  const updated = await updateProfileRow({
    kyc_status: "pendente",
    kyc_documents: documents,
    kyc_submitted_at: new Date().toISOString(),
    address: documents.address,
    phone: documents.phone,
  });
  if (updated) {
    await addNotification(
      "Verificação em análise",
      "Recebemos os seus documentos. A verificação de identidade costuma demorar até 48 horas.",
    );
  }
  return updated;
}

/** Apaga os dados da conta e termina a sessão */
export async function deleteAccount(): Promise<boolean> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return false;
  const { error } = await supabase.from("profiles").delete().eq("id", auth.user.id);
  if (error) return false;
  await supabase.auth.signOut();
  return true;
}

/** Autentica por ID Poppy, nome de utilizador ou email (Gmail) + senha */
export async function login(idOrEmail: string, password: string): Promise<PoppyUser | null> {
  const value = idOrEmail.trim();

  if (value.includes("@")) {
    const { error } = await supabase.auth.signInWithPassword({
      email: value.toLowerCase(),
      password,
    });
    if (error) return null;
  } else {
    const result = await signInWithIdentifier({ data: { identifier: value, password } });
    if ("error" in result || !result.accessToken) return null;
    const { error } = await supabase.auth.setSession({
      access_token: result.accessToken,
      refresh_token: result.refreshToken,
    });
    if (error) return null;
  }

  return getCurrentUser();
}

export async function logout() {
  await supabase.auth.signOut();
}

/** Adiciona um método de pagamento à conta */
export async function addPaymentMethod(
  method: Omit<PaymentMethod, "id" | "createdAt">,
): Promise<PoppyUser | null> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;
  const { error } = await supabase.from("payment_methods").insert({
    user_id: auth.user.id,
    type: method.type,
    account_name: method.accountName,
    iban: method.iban ?? null,
    phone: method.phone ?? null,
    verified: method.verified ?? false,
  });
  if (error) return null;
  await addNotification(
    "Método de pagamento adicionado",
    `${paymentMethodLabels[method.type]} foi guardado na sua conta.`,
  );
  return getCurrentUser();
}

/** Remove um método de pagamento guardado */
export async function removePaymentMethod(methodId: string): Promise<PoppyUser | null> {
  const { error } = await supabase.from("payment_methods").delete().eq("id", methodId);
  if (error) return null;
  return getCurrentUser();
}

/** Confirma que o utilizador é dono do método — passa a poder ser usado em levantamentos. */
export async function verifyPaymentMethod(methodId: string): Promise<PoppyUser | null> {
  const { data: row, error } = await supabase
    .from("payment_methods")
    .update({ verified: true })
    .eq("id", methodId)
    .select("*")
    .maybeSingle();
  if (error || !row) return null;
  const method = mapMethod(row as MethodRow);
  await addNotification(
    "Método de pagamento verificado",
    `${paymentMethodLabels[method.type]} já pode ser usado em levantamentos.`,
  );
  return getCurrentUser();
}

/** Gera uma referência de comprovativo, ex: POP-SAQ-482913 */
function generateWithdrawalReference(): string {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `POP-SAQ-${random}`;
}

/** Regista um pedido de levantamento com um método já verificado. Fica "pendente" 48 horas. */
export async function requestWithdrawal(
  amount: number,
  methodId: string,
): Promise<{ user: PoppyUser; withdrawal: Withdrawal } | null> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;

  const { data: methodRow } = await supabase
    .from("payment_methods")
    .select("*")
    .eq("id", methodId)
    .maybeSingle();
  if (!methodRow) return null;
  const method = mapMethod(methodRow as MethodRow);
  if (!method.verified) return null;

  const requestedAt = new Date();
  const availableAt = new Date(requestedAt.getTime() + 48 * 60 * 60 * 1000);
  const { data: row, error } = await supabase
    .from("withdrawals")
    .insert({
      user_id: auth.user.id,
      reference: generateWithdrawalReference(),
      amount,
      method_id: method.id,
      method_type: method.type,
      method_label: method.accountName,
      method_account: method.iban ?? method.phone ?? "",
      status: "pendente",
      requested_at: requestedAt.toISOString(),
      available_at: availableAt.toISOString(),
    })
    .select("*")
    .single();
  if (error || !row) return null;

  const withdrawal = mapWithdrawal(row as WithdrawalRow);
  await addNotification(
    "Levantamento solicitado",
    `Pedido de ${withdrawal.amount.toLocaleString("pt-AO")} Kz via ${paymentMethodLabels[method.type]} — referência ${withdrawal.reference}. Disponível em até 48 horas.`,
  );
  const user = await getCurrentUser();
  if (!user) return null;
  return { user, withdrawal };
}
