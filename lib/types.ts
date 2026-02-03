export enum AppTab {
  HOME = 'home',
  MISSIONS = 'missions',
  PROGRESS = 'progress',
  COMMUNITY = 'community',
  PROFILE = 'profile'
}

export interface User {
  name: string
  level: number
  xp: number
  xpToNextLevel: number
  streak: number
  balance: number
  badges: Badge[]
}

export interface Badge {
  id: string
  name: string
  icon: string
  unlocked: boolean
  description: string
}

export interface Mission {
  id: string
  title: string
  description: string
  xp: number
  status: 'available' | 'completed' | 'locked'
  type: 'daily' | 'path'
}

export interface CommunityPost {
  id: string
  userName: string
  action: string
  timestamp: string
  likes: number
  reactionType: 'clap' | 'fire' | 'heart'
}
