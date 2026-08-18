export type JobType = "Remoto" | "Presencial" | "Híbrido";

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
  description: string;
  requirements: string[];
};

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
};

export const formatKz = (value: number) =>
  `${new Intl.NumberFormat("pt-AO", { maximumFractionDigits: 0 }).format(Math.abs(value))} Kz`;
