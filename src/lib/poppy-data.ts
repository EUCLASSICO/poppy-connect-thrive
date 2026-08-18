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

export const jobs: Job[] = [
  {
    id: "j1",
    title: "Redesign de app de mobilidade urbana",
    client: "Kubico Studio",
    clientRating: 4.9,
    clientJobs: 34,
    budget: 480000,
    budgetType: "fixo",
    deadline: "14 dias",
    type: "Remoto",
    proposals: 12,
    skills: ["Figma", "UI Design", "Design System"],
    category: "design",
    level: "Avançado",
    featured: true,
    description:
      "Procuramos um designer de produto para redesenhar o fluxo principal do nosso app de mobilidade: onboarding, pedido de viagem e histórico. Entrega em Figma com design system organizado e protótipo navegável.",
    requirements: [
      "Portfólio com pelo menos 2 apps móveis",
      "Domínio de Figma e componentes reutilizáveis",
      "Disponibilidade para 2 reuniões semanais",
    ],
  },
  {
    id: "j2",
    title: "Desenvolvimento de API de pagamentos",
    client: "Nzila Fintech",
    clientRating: 4.7,
    clientJobs: 18,
    budget: 950000,
    budgetType: "fixo",
    deadline: "30 dias",
    type: "Híbrido",
    location: "Luanda, Talatona",
    distanceKm: 6,
    proposals: 27,
    skills: ["Node.js", "PostgreSQL", "Segurança"],
    category: "programacao",
    level: "Avançado",
    featured: true,
    description:
      "Construção de uma API de pagamentos com autenticação, webhooks e reconciliação de transações. Código versionado, testes automatizados e documentação técnica incluídos.",
    requirements: ["Experiência com integrações de pagamento", "Testes automatizados", "Boas práticas de segurança"],
  },
  {
    id: "j3",
    title: "Gestão de redes sociais — 1 mês",
    client: "Café Baía",
    clientRating: 4.5,
    clientJobs: 9,
    budget: 15000,
    budgetType: "hora",
    deadline: "Início imediato",
    type: "Remoto",
    proposals: 41,
    skills: ["Instagram", "Copywriting", "Canva"],
    category: "marketing",
    level: "Intermediário",
    description:
      "Planeamento e publicação de conteúdo em Instagram e TikTok, 12 publicações por mês, relatório de desempenho semanal.",
    requirements: ["Portfólio de contas gerenciadas", "Escrita criativa", "Relatórios simples"],
  },
  {
    id: "j4",
    title: "Tradução técnica PT → EN (40 páginas)",
    client: "Lumina Legal",
    clientRating: 5,
    clientJobs: 52,
    budget: 220000,
    budgetType: "fixo",
    deadline: "10 dias",
    type: "Remoto",
    proposals: 8,
    skills: ["Tradução", "Revisão", "Terminologia jurídica"],
    category: "traducao",
    level: "Intermediário",
    description: "Tradução de contratos e anexos técnicos com revisão final e glossário de termos.",
    requirements: ["Experiência jurídica", "Entrega em Word revisado"],
  },
  {
    id: "j5",
    title: "Fotografia de produto para e-commerce",
    client: "Nova Casa",
    clientRating: 4.6,
    clientJobs: 12,
    budget: 180000,
    budgetType: "fixo",
    deadline: "7 dias",
    type: "Presencial",
    location: "Luanda, Maianga",
    distanceKm: 3,
    proposals: 15,
    skills: ["Fotografia", "Iluminação", "Lightroom"],
    category: "fotografia",
    level: "Intermediário",
    description: "40 produtos fotografados em fundo neutro, 3 ângulos cada, com edição e recorte.",
    requirements: ["Equipamento próprio", "Entrega em 7 dias", "Edição incluída"],
  },
  {
    id: "j6",
    title: "Edição de 8 vídeos curtos para YouTube",
    client: "Canal Ondjaki",
    clientRating: 4.8,
    clientJobs: 63,
    budget: 260000,
    budgetType: "fixo",
    deadline: "12 dias",
    type: "Remoto",
    proposals: 22,
    skills: ["Premiere", "Motion", "Legendas"],
    category: "video",
    level: "Intermediário",
    description: "Edição dinâmica de vídeos de 6 a 9 minutos, com legendas, cortes e pacote gráfico simples.",
    requirements: ["Ritmo de edição rápido", "Legendas em português", "2 rondas de ajustes"],
  },
  {
    id: "j7",
    title: "Landing page institucional",
    client: "Grupo Kianda",
    clientRating: 4.4,
    clientJobs: 7,
    budget: 340000,
    budgetType: "fixo",
    deadline: "15 dias",
    type: "Remoto",
    proposals: 19,
    skills: ["React", "Tailwind", "SEO"],
    category: "programacao",
    level: "Iniciante",
    description: "Página institucional responsiva com formulário de contacto e boas práticas de SEO.",
    requirements: ["Código limpo", "Responsivo", "Publicação incluída"],
  },
  {
    id: "j8",
    title: "Atendimento ao cliente por chat (meio período)",
    client: "Loja Kaya",
    clientRating: 4.3,
    clientJobs: 21,
    budget: 9000,
    budgetType: "hora",
    deadline: "Contínuo",
    type: "Remoto",
    proposals: 55,
    skills: ["Atendimento", "Organização", "Português"],
    category: "atendimento",
    level: "Iniciante",
    description: "Responder mensagens de clientes em horário comercial, registar pedidos e escalar problemas.",
    requirements: ["Boa comunicação escrita", "Internet estável", "4 horas por dia"],
  },
];

export type QuickJob = {
  id: string;
  title: string;
  reward: number;
  minutes: number;
  requirements: string;
  tag: string;
};

export const quickJobs: QuickJob[] = [
  { id: "q1", title: "Pesquisa de opinião sobre transporte", reward: 1500, minutes: 8, requirements: "Ter mais de 18 anos", tag: "Pesquisa" },
  { id: "q2", title: "Teste de usabilidade de um site", reward: 4500, minutes: 20, requirements: "Computador + microfone", tag: "Teste" },
  { id: "q3", title: "Recolha de 20 contactos de restaurantes", reward: 6000, minutes: 45, requirements: "Excel básico", tag: "Dados" },
  { id: "q4", title: "Criar 3 artes simples para redes sociais", reward: 8000, minutes: 60, requirements: "Canva ou Figma", tag: "Design" },
  { id: "q5", title: "Revisar texto de 800 palavras", reward: 3000, minutes: 25, requirements: "Português fluente", tag: "Escrita" },
  { id: "q6", title: "Verificar preços em 10 lojas online", reward: 3500, minutes: 30, requirements: "Atenção ao detalhe", tag: "Dados" },
  { id: "q7", title: "Transcrever áudio de 10 minutos", reward: 2500, minutes: 20, requirements: "Boa audição", tag: "Escrita" },
  { id: "q8", title: "Preencher formulário de cadastro em lote", reward: 2000, minutes: 15, requirements: "Atenção ao detalhe", tag: "Dados" },
];

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
