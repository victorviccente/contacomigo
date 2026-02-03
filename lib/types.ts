export enum AppTab {
  HOME = 'home',
  MISSIONS = 'missions',
  PROGRESS = 'progress',
  COMMUNITY = 'community',
  PROFILE = 'profile'
}

export type TransactionType = 'income' | 'expense'

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  description: string
  category: string
  date: string
  createdAt: string
}

export interface User {
  name: string
  level: number
  xp: number
  xpToNextLevel: number
  streak: number
  balance: number
  totalIncome: number
  totalExpenses: number
  badges: Badge[]
}

export interface Badge {
  id: string
  name: string
  icon: string
  unlocked: boolean
  description: string
  condition: string
}

export interface Mission {
  id: string
  title: string
  description: string
  xp: number
  status: 'available' | 'completed' | 'locked'
  type: 'daily' | 'path'
  completedAt?: string
}

export interface CommunityPost {
  id: string
  userName: string
  action: string
  timestamp: string
  likes: number
  reactionType: 'clap' | 'fire' | 'heart'
  isUserPost?: boolean
}

export interface UserProgress {
  totalXP: number
  highestStreak: number
  totalTransactions: number
  completedMissions: number
  firstAccessDate: string
  lastActivityDate: string
  lastDailyReset: string
  consciousDays: number
}

export interface AppSettings {
  notifications: boolean
  darkMode: boolean
}

export const EXPENSE_CATEGORIES = [
  { id: 'alimentacao', name: 'Alimentação', icon: '🍔' },
  { id: 'transporte', name: 'Transporte', icon: '🚗' },
  { id: 'lazer', name: 'Lazer', icon: '🎮' },
  { id: 'saude', name: 'Saúde', icon: '💊' },
  { id: 'educacao', name: 'Educação', icon: '📚' },
  { id: 'moradia', name: 'Moradia', icon: '🏠' },
  { id: 'compras', name: 'Compras', icon: '🛒' },
  { id: 'outros', name: 'Outros', icon: '📦' },
] as const

export const INCOME_CATEGORIES = [
  { id: 'salario', name: 'Salário', icon: '💼' },
  { id: 'freelance', name: 'Freelance', icon: '💻' },
  { id: 'investimentos', name: 'Investimentos', icon: '📈' },
  { id: 'presente', name: 'Presente', icon: '🎁' },
  { id: 'bonus', name: 'Bônus', icon: '🎯' },
  { id: 'outros', name: 'Outros', icon: '💰' },
] as const
