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
  { id: "design", name: "Design", icon: "PenTool", jobs: 128 },
  { id: "programacao", name: "Programação", icon: "Code2", jobs: 214 },
  { id: "marketing", name: "Marketing", icon: "Megaphone", jobs: 96 },
  { id: "traducao", name: "Tradução", icon: "Languages", jobs: 41 },
  { id: "escrita", name: "Escrita", icon: "FileText", jobs: 57 },
  { id: "fotografia", name: "Fotografia", icon: "Camera", jobs: 33 },
  { id: "video", name: "Vídeo", icon: "Video", jobs: 48 },
  { id: "atendimento", name: "Atendimento", icon: "Headphones", jobs: 62 },
  { id: "administracao", name: "Administração", icon: "ClipboardList", jobs: 29 },
  { id: "rapidos", name: "Trabalhos rápidos", icon: "Zap", jobs: 187 },
  { id: "outros", name: "Outros", icon: "MoreHorizontal", jobs: 24 },
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
  { id: "q2", title: "Teste de usabilidade de website", reward: 4500, minutes: 20, requirements: "Computador + microfone", tag: "Teste" },
  { id: "q3", title: "Recolha de 20 contactos de restaurantes", reward: 6000, minutes: 45, requirements: "Excel básico", tag: "Dados" },
  { id: "q4", title: "Criar 3 banners simples para promoção", reward: 8000, minutes: 60, requirements: "Canva ou Figma", tag: "Design" },
  { id: "q5", title: "Revisar texto de 800 palavras", reward: 3000, minutes: 25, requirements: "Português fluente", tag: "Escrita" },
  { id: "q6", title: "Verificar preços em 10 lojas online", reward: 3500, minutes: 30, requirements: "Atenção ao detalhe", tag: "Dados" },
];

export type ProjectStatus = "Em análise" | "Aceito" | "Em andamento" | "Entregue" | "Aprovado" | "Concluído";

export const projectStages: ProjectStatus[] = ["Em análise", "Aceito", "Em andamento", "Entregue", "Aprovado", "Concluído"];

export type Project = {
  id: string;
  title: string;
  client: string;
  value: number;
  status: ProjectStatus;
  due: string;
};

export const projects: Project[] = [
  { id: "p1", title: "Redesign de app de mobilidade", client: "Kubico Studio", value: 480000, status: "Em andamento", due: "12 Set" },
  { id: "p2", title: "Landing page institucional", client: "Grupo Kianda", value: 340000, status: "Entregue", due: "02 Set" },
  { id: "p3", title: "Identidade visual de padaria", client: "Pão da Ilha", value: 150000, status: "Aprovado", due: "28 Ago" },
  { id: "p4", title: "Tradução de manual técnico", client: "Lumina Legal", value: 220000, status: "Em análise", due: "20 Set" },
  { id: "p5", title: "Pacote de social media", client: "Café Baía", value: 120000, status: "Concluído", due: "10 Ago" },
];

export type Conversation = {
  id: string;
  name: string;
  project: string;
  last: string;
  time: string;
  unread: number;
  online: boolean;
  messages: { id: string; from: "me" | "them"; text?: string; file?: string; image?: boolean; time: string }[];
};

export const conversations: Conversation[] = [
  {
    id: "c1",
    name: "Kubico Studio",
    project: "Redesign de app de mobilidade · 480.000 Kz",
    last: "Podemos revisar o fluxo de onboarding amanhã?",
    time: "09:41",
    unread: 2,
    online: true,
    messages: [
      { id: "m1", from: "them", text: "Olá João! Vimos a sua proposta e gostámos muito do portfólio.", time: "09:20" },
      { id: "m2", from: "me", text: "Obrigado! Posso começar já na segunda-feira.", time: "09:25" },
      { id: "m3", from: "them", file: "briefing-onboarding.pdf", time: "09:30" },
      { id: "m4", from: "them", text: "Podemos revisar o fluxo de onboarding amanhã?", time: "09:41" },
    ],
  },
  {
    id: "c2",
    name: "Nzila Fintech",
    project: "API de pagamentos · 950.000 Kz",
    last: "Enviei o acesso ao repositório.",
    time: "Ontem",
    unread: 0,
    online: false,
    messages: [
      { id: "m1", from: "them", text: "Enviei o acesso ao repositório.", time: "18:02" },
      { id: "m2", from: "me", text: "Recebido, começo a análise hoje.", time: "18:20" },
    ],
  },
  {
    id: "c3",
    name: "Café Baía",
    project: "Social media · 120.000 Kz",
    last: "As fotos ficaram excelentes 🙌",
    time: "Seg",
    unread: 0,
    online: true,
    messages: [
      { id: "m1", from: "me", image: true, time: "14:00" },
      { id: "m2", from: "them", text: "As fotos ficaram excelentes 🙌", time: "14:12" },
    ],
  },
];

export const transactions = [
  { id: "t1", label: "Pagamento — Landing page institucional", date: "02 Set", amount: 340000, status: "Concluído" },
  { id: "t2", label: "Levantamento para Banco BAI", date: "28 Ago", amount: -250000, status: "Concluído" },
  { id: "t3", label: "Pagamento — Identidade visual", date: "26 Ago", amount: 150000, status: "Concluído" },
  { id: "t4", label: "Quick Jobs — 6 tarefas", date: "24 Ago", amount: 21500, status: "Concluído" },
  { id: "t5", label: "Pagamento — Redesign de app (1ª fase)", date: "20 Set", amount: 240000, status: "Pendente" },
];

export const courses = [
  { id: "a1", title: "Fundamentos de UI Design", lessons: 12, progress: 75, level: "Iniciante", duration: "3h 20m" },
  { id: "a2", title: "Propostas que ganham projetos", lessons: 8, progress: 40, level: "Intermediário", duration: "1h 45m" },
  { id: "a3", title: "React do zero ao profissional", lessons: 26, progress: 12, level: "Intermediário", duration: "9h 10m" },
  { id: "a4", title: "Gestão financeira para freelancers", lessons: 10, progress: 0, level: "Iniciante", duration: "2h 05m" },
];

export const levels = ["Novato", "Bronze", "Prata", "Ouro", "Profissional"] as const;

export const me = {
  name: "João Almeida",
  role: "Product Designer & Front-end",
  level: "Ouro" as const,
  levelProgress: 68,
  rating: 4.9,
  reviews: 47,
  completion: 98,
  completed: 63,
  balance: 412500,
  pending: 240000,
  earnings: 3184000,
  bio:
    "Designer de produto e desenvolvedor front-end com 6 anos de experiência. Ajudo empresas a lançar apps e sites claros, rápidos e fáceis de usar.",
  skills: ["UI Design", "Figma", "React", "Tailwind", "Design System", "Prototipagem"],
  experience: [
    { role: "Product Designer", company: "Kubico Studio", period: "2023 — atual" },
    { role: "Front-end Developer", company: "Nzila Fintech", period: "2021 — 2023" },
    { role: "Designer Freelancer", company: "Independente", period: "2019 — 2021" },
  ],
  certificates: ["Poppy Academy — UI Design", "Google UX Design", "Scrum Foundations"],
};

export const formatKz = (value: number) =>
  `${new Intl.NumberFormat("pt-AO", { maximumFractionDigits: 0 }).format(Math.abs(value))} Kz`;
