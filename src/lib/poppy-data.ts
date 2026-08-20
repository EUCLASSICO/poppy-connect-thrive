export type JobType = "Remoto" | "Presencial" | "Híbrido";

export type JobTier = "Iniciante" | "Bronze" | "Prata" | "Ouro" | "Profissional";

export type Job = {
  id: string;
  title: string;
  client: string;
  clientRating: number;
  clientJobs: number;
  budget: number;
  budgetType: "fixo" | "hora";
  deadline: string;
  type: JobType;
  location?: string;
  proposals: number;
  skills: string[];
  category: string;
  level: "Iniciante" | "Intermediário" | "Avançado";
  distanceKm?: number;
  featured?: boolean;
  /** Trabalho expresso: pagamento e aprovação mais rápidos. */
  express?: boolean;
  /** Nível mínimo do trabalhador exigido para aceitar o trabalho. */
  tier?: JobTier;
  /** Vagas/posições disponíveis para este trabalho (micro tarefas com várias vagas). */
  slotsTotal?: number;
  slotsRemaining?: number;
  /** Rótulo curto do ritmo de pagamento, ex: "taxa diária", "por tarefa". */
  rateLabel?: string;
  description: string;
  requirements: string[];
};

/** Sigla curta do nível para exibir em selo, ex: "INI", "INT", "AVA". */
export const levelCode = (level: Job["level"]) =>
  ({ Iniciante: "INI", Intermediário: "INT", Avançado: "AVA" })[level];

export const categories = [
  { id: "design", name: "Design", icon: "PenTool" },
  { id: "programacao", name: "Programação", icon: "Code2" },
  { id: "marketing", name: "Marketing", icon: "Megaphone" },
  { id: "traducao", name: "Tradução", icon: "Languages" },
  { id: "escrita", name: "Escrita", icon: "FileText" },
  { id: "fotografia", name: "Fotografia", icon: "Camera" },
  { id: "video", name: "Vídeo", icon: "Video" },
  { id: "atendimento", name: "Atendimento", icon: "Headphones" },
  { id: "administracao", name: "Administração", icon: "ClipboardList" },
  { id: "rapidos", name: "Micro tarefas", icon: "Zap" },
  { id: "outros", name: "Outros", icon: "MoreHorizontal" },
];

// Sem trabalhos de exemplo — a lista deve refletir apenas publicações reais
// feitas por empresas na plataforma. Quando a integração com o Supabase
// estiver ligada, este array é substituído pela consulta real.
export const jobs: Job[] = [];

export type QuickJob = {
  id: string;
  title: string;
  reward: number;
  minutes: number;
  requirements: string;
  tag: string;
};

// Idem: sem micro tarefas de exemplo. Estado inicial honesto até existirem
// tarefas reais publicadas.
export const quickJobs: QuickJob[] = [];

export const levels = ["Novato", "Bronze", "Prata", "Ouro", "Profissional"] as const;

// Perfil de um utilizador novo, sem histórico. Os valores reais (saldo,
// avaliações, tarefas concluídas) devem vir da conta ligada ao Supabase
// quando essa integração existir — por agora, estado inicial honesto.
export const me = {
  name: "Utilizador Poppy",
  role: "Membro Poppy",
  level: "Novato" as const,
  levelProgress: 0,
  rating: 0,
  reviews: 0,
  completion: 0,
  completed: 0,
  balance: 0,
  pending: 0,
  earnings: 0,
  bio: "",
  skills: [] as string[],
  // Taxa de sucesso: começa em 100 (sem incidentes). Sobe quando uma tarefa
  // é aprovada; desce quando uma tarefa não é aprovada ou quando há muitas
  // tarefas acumuladas por confirmar. A partir do Supabase, isto deve ser
  // calculado no servidor a cada mudança de estado de uma tarefa.
  successRate: 100,
};

/** Regras da taxa de sucesso — usar sempre que uma tarefa mudar de estado. */
export const successRateRules = {
  onTaskApproved: 4,
  onTaskRejected: -12,
  onTasksBacklog: -6, // aplicado quando há tarefas acumuladas por confirmar
  minToAcceptTasks: 50,
};

export const formatKz = (value: number) =>
  `${new Intl.NumberFormat("pt-AO", { maximumFractionDigits: 0 }).format(Math.abs(value))} Kz`;
