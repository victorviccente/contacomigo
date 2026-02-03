import { AppTab, Badge, Mission } from './types'

export const COLORS = {
  primary: '#1F7A8C',
  secondary: '#4CAF50',
  accent: '#F4C430',
  backgroundLight: '#F7F9FC',
  backgroundDark: '#0F172A',
  textPrimary: '#0B1320',
  textSecondary: '#6B7280',
  danger: '#E63946',
  info: '#94A3B8',
}

export const NAVIGATION_ITEMS = [
  { id: AppTab.HOME, label: 'Início', icon: 'Home' },
  { id: AppTab.MISSIONS, label: 'Missões', icon: 'Target' },
  { id: AppTab.PROGRESS, label: 'Progresso', icon: 'BarChart2' },
  { id: AppTab.COMMUNITY, label: 'Comunidade', icon: 'Users' },
  { id: AppTab.PROFILE, label: 'Perfil', icon: 'User' },
]

export const DEFAULT_BADGES: Badge[] = [
  { id: 'first_step', name: 'Primeiro Passo', icon: '⭐', unlocked: false, description: 'Registrou sua primeira transação.', condition: 'totalTransactions >= 1' },
  { id: '7_days', name: '7 Dias', icon: '🔥', unlocked: false, description: 'Manteve uma streak de 7 dias.', condition: 'streak >= 7' },
  { id: 'poupador', name: 'Poupador', icon: '💰', unlocked: false, description: 'Acumulou mais de R$ 1.000 de saldo.', condition: 'balance >= 1000' },
  { id: 'registrador', name: 'Registrador', icon: '📝', unlocked: false, description: 'Registrou 50 transações.', condition: 'totalTransactions >= 50' },
  { id: 'focado', name: 'Focado', icon: '🎯', unlocked: false, description: 'Completou 10 missões.', condition: 'completedMissions >= 10' },
  { id: 'mestre', name: 'Mestre', icon: '💎', unlocked: false, description: 'Chegou ao nível 20.', condition: 'level >= 20' },
  { id: 'consistente', name: 'Consistente', icon: '📅', unlocked: false, description: '30 dias conscientes.', condition: 'consciousDays >= 30' },
  { id: 'economista', name: 'Economista', icon: '🏆', unlocked: false, description: 'Gastou menos do que ganhou por 3 meses.', condition: 'monthsPositive >= 3' },
]

export const DEFAULT_DAILY_MISSIONS: Mission[] = [
  { id: 'd1', title: 'Registrar 1 gasto', description: 'Adicione qualquer despesa hoje', xp: 30, status: 'available', type: 'daily' },
  { id: 'd2', title: 'Registrar 1 ganho', description: 'Adicione qualquer receita hoje', xp: 30, status: 'available', type: 'daily' },
  { id: 'd3', title: 'Revisar transações', description: 'Confirme suas transações do dia', xp: 20, status: 'available', type: 'daily' },
  { id: 'd4', title: 'Manter streak', description: 'Mantenha sua sequência ativa', xp: 10, status: 'available', type: 'daily' },
]

export const DEFAULT_PATH_MISSIONS: Mission[] = [
  { id: 'p1', title: 'Fundamentos', description: 'Entenda custos fixos e variáveis', xp: 100, status: 'available', type: 'path' },
  { id: 'p2', title: 'Controle de Gastos', description: 'Defina limites semanais', xp: 150, status: 'locked', type: 'path' },
  { id: 'p3', title: 'Reserva Segura', description: 'Crie seu primeiro objetivo', xp: 200, status: 'locked', type: 'path' },
  { id: 'p4', title: 'Investimentos Básicos', description: 'Aprenda sobre renda fixa', xp: 250, status: 'locked', type: 'path' },
  { id: 'p5', title: 'Liberdade Financeira', description: 'Planeje seu futuro', xp: 300, status: 'locked', type: 'path' },
]

export const MOCK_USER = {
  name: 'Usuário',
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  streak: 0,
  balance: 0.00,
  totalIncome: 0,
  totalExpenses: 0,
  badges: [...DEFAULT_BADGES]
}

export const MOCK_MISSIONS = [...DEFAULT_DAILY_MISSIONS, ...DEFAULT_PATH_MISSIONS]

export const MOCK_COMMUNITY = [
  { id: 'c1', userName: 'Maria', action: 'subiu para o nível 5!', timestamp: '2h atrás', likes: 12, reactionType: 'clap' as const },
  { id: 'c2', userName: 'João', action: 'completou sua primeira missão!', timestamp: '5h atrás', likes: 24, reactionType: 'fire' as const },
  { id: 'c3', userName: 'Ana', action: 'desbloqueou o badge Poupador!', timestamp: '1d atrás', likes: 45, reactionType: 'heart' as const },
  { id: 'c4', userName: 'Pedro', action: 'mantém uma streak de 15 dias!', timestamp: '1d atrás', likes: 32, reactionType: 'fire' as const },
]

export const XP_CONFIG = {
  registerTransaction: 20,
  completeDailyMission: 30,
  completePathMission: 100,
  maintainStreak: 10,
  levelUp: (level: number) => level * 100,
}

export const LEAGUES = [
  { name: 'BRONZE III', minXP: 0 },
  { name: 'BRONZE II', minXP: 500 },
  { name: 'BRONZE I', minXP: 1000 },
  { name: 'PRATA III', minXP: 2000 },
  { name: 'PRATA II', minXP: 3500 },
  { name: 'PRATA I', minXP: 5000 },
  { name: 'OURO III', minXP: 7500 },
  { name: 'OURO II', minXP: 10000 },
  { name: 'OURO I', minXP: 15000 },
  { name: 'PLATINA', minXP: 25000 },
  { name: 'DIAMANTE', minXP: 50000 },
  { name: 'MESTRE', minXP: 100000 },
]

export const getLeague = (totalXP: number) => {
  for (let i = LEAGUES.length - 1; i >= 0; i--) {
    if (totalXP >= LEAGUES[i].minXP) {
      return LEAGUES[i].name
    }
  }
  return LEAGUES[0].name
}
