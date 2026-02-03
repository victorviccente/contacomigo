import { AppTab } from './types'

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

export const MOCK_USER = {
  name: 'Usuário',
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  streak: 0,
  balance: 0.00,
  badges: [
    { id: '1', name: '7 Dias', icon: '🔥', unlocked: false, description: 'Registrou gastos por uma semana inteira.' },
    { id: '2', name: 'Poupador', icon: '💰', unlocked: false, description: 'Primeira reserva de emergência criada.' },
    { id: '3', name: 'Mestre', icon: '💎', unlocked: false, description: 'Chegue ao nível 20.' },
  ]
}

export const MOCK_MISSIONS = [
  { id: 'm1', title: 'Registrar gasto', description: 'Adicione qualquer transação hoje', xp: 50, status: 'available' as const, type: 'daily' as const },
  { id: 'm2', title: 'Revisar dia', description: 'Confirme suas categorias do dia', xp: 30, status: 'available' as const, type: 'daily' as const },
  { id: 'p1', title: 'Fundamentos', description: 'Entenda custos fixos e variáveis', xp: 100, status: 'available' as const, type: 'path' as const },
  { id: 'p2', title: 'Controle de Gastos', description: 'Defina limites semanais', xp: 150, status: 'locked' as const, type: 'path' as const },
  { id: 'p3', title: 'Reserva Segura', description: 'Crie seu primeiro objetivo', xp: 200, status: 'locked' as const, type: 'path' as const },
]

export const MOCK_COMMUNITY = [
  { id: 'c1', userName: 'Maria', action: 'subiu para o nível 5!', timestamp: '2h atrás', likes: 12, reactionType: 'clap' as const },
  { id: 'c2', userName: 'João', action: 'completou sua primeira missão!', timestamp: '5h atrás', likes: 24, reactionType: 'fire' as const },
]
