'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import {
  Transaction,
  User,
  Mission,
  CommunityPost,
  UserProgress,
  AppSettings,
  Badge
} from './types'
import {
  MOCK_USER,
  MOCK_MISSIONS,
  MOCK_COMMUNITY,
  DEFAULT_BADGES,
  DEFAULT_DAILY_MISSIONS,
  XP_CONFIG,
  getLeague
} from './constants'

const STORAGE_KEYS = {
  transactions: 'contacomigo_transactions',
  user: 'contacomigo_user',
  missions: 'contacomigo_missions',
  community: 'contacomigo_community',
  progress: 'contacomigo_progress',
  settings: 'contacomigo_settings',
}

interface DataContextType {
  // Data
  transactions: Transaction[]
  user: User
  missions: Mission[]
  communityPosts: CommunityPost[]
  progress: UserProgress
  settings: AppSettings

  // Transaction actions
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void
  deleteTransaction: (id: string) => void

  // User actions
  addXP: (amount: number) => void
  updateUser: (updates: Partial<User>) => void

  // Mission actions
  completeMission: (id: string) => void
  resetDailyMissions: () => void

  // Community actions
  addCommunityPost: (action: string) => void
  likePost: (id: string) => void

  // Settings actions
  updateSettings: (updates: Partial<AppSettings>) => void
  resetAllData: () => void

  // Computed
  isLoading: boolean
  league: string
  monthlyIncome: number
  monthlyExpenses: number
  weeklyExpenses: { day: string; amount: number }[]
}

const DataContext = createContext<DataContextType | null>(null)

const getInitialProgress = (): UserProgress => ({
  totalXP: 0,
  highestStreak: 0,
  totalTransactions: 0,
  completedMissions: 0,
  firstAccessDate: new Date().toISOString(),
  lastActivityDate: new Date().toISOString(),
  lastDailyReset: new Date().toISOString().split('T')[0],
  consciousDays: 0,
})

const getInitialSettings = (): AppSettings => ({
  notifications: true,
  darkMode: false,
})

export function DataProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [user, setUser] = useState<User>(MOCK_USER)
  const [missions, setMissions] = useState<Mission[]>(MOCK_MISSIONS)
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(MOCK_COMMUNITY)
  const [progress, setProgress] = useState<UserProgress>(getInitialProgress())
  const [settings, setSettings] = useState<AppSettings>(getInitialSettings())

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const storedTransactions = localStorage.getItem(STORAGE_KEYS.transactions)
        const storedUser = localStorage.getItem(STORAGE_KEYS.user)
        const storedMissions = localStorage.getItem(STORAGE_KEYS.missions)
        const storedCommunity = localStorage.getItem(STORAGE_KEYS.community)
        const storedProgress = localStorage.getItem(STORAGE_KEYS.progress)
        const storedSettings = localStorage.getItem(STORAGE_KEYS.settings)

        if (storedTransactions) setTransactions(JSON.parse(storedTransactions))
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)
          // Ensure badges array has all default badges
          const mergedBadges = DEFAULT_BADGES.map(defaultBadge => {
            const savedBadge = parsedUser.badges?.find((b: Badge) => b.id === defaultBadge.id)
            return savedBadge ? { ...defaultBadge, unlocked: savedBadge.unlocked } : defaultBadge
          })
          setUser({ ...MOCK_USER, ...parsedUser, badges: mergedBadges })
        }
        if (storedMissions) setMissions(JSON.parse(storedMissions))
        if (storedCommunity) setCommunityPosts(JSON.parse(storedCommunity))
        if (storedProgress) setProgress({ ...getInitialProgress(), ...JSON.parse(storedProgress) })
        if (storedSettings) setSettings({ ...getInitialSettings(), ...JSON.parse(storedSettings) })
      } catch (error) {
        console.error('Error loading data from localStorage:', error)
      }
      setIsLoading(false)
    }

    loadData()
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(transactions))
    }
  }, [transactions, isLoading])

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user))
    }
  }, [user, isLoading])

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEYS.missions, JSON.stringify(missions))
    }
  }, [missions, isLoading])

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEYS.community, JSON.stringify(communityPosts))
    }
  }, [communityPosts, isLoading])

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEYS.progress, JSON.stringify(progress))
    }
  }, [progress, isLoading])

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings))
    }
  }, [settings, isLoading])

  // Check and reset daily missions at midnight
  useEffect(() => {
    if (isLoading) return

    const today = new Date().toISOString().split('T')[0]
    if (progress.lastDailyReset !== today) {
      resetDailyMissions()
      setProgress(prev => ({ ...prev, lastDailyReset: today }))
    }
  }, [isLoading, progress.lastDailyReset])

  // Check streak
  useEffect(() => {
    if (isLoading) return

    const today = new Date().toISOString().split('T')[0]
    const lastActivity = progress.lastActivityDate?.split('T')[0]

    if (lastActivity && lastActivity !== today) {
      const lastDate = new Date(lastActivity)
      const todayDate = new Date(today)
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))

      if (diffDays > 1) {
        // Streak broken
        setUser(prev => ({ ...prev, streak: 0 }))
      }
    }
  }, [isLoading, progress.lastActivityDate])

  // Check and unlock badges
  const checkBadges = useCallback(() => {
    const completedMissionsCount = missions.filter(m => m.status === 'completed').length

    setUser(prev => {
      const updatedBadges = prev.badges.map(badge => {
        if (badge.unlocked) return badge

        let shouldUnlock = false
        switch (badge.id) {
          case 'first_step':
            shouldUnlock = progress.totalTransactions >= 1
            break
          case '7_days':
            shouldUnlock = prev.streak >= 7
            break
          case 'poupador':
            shouldUnlock = prev.balance >= 1000
            break
          case 'registrador':
            shouldUnlock = progress.totalTransactions >= 50
            break
          case 'focado':
            shouldUnlock = completedMissionsCount >= 10
            break
          case 'mestre':
            shouldUnlock = prev.level >= 20
            break
          case 'consistente':
            shouldUnlock = progress.consciousDays >= 30
            break
        }

        if (shouldUnlock && !badge.unlocked) {
          // Add community post for badge unlock
          addCommunityPost(`desbloqueou o badge ${badge.name}!`)
        }

        return shouldUnlock ? { ...badge, unlocked: true } : badge
      })

      return { ...prev, badges: updatedBadges }
    })
  }, [missions, progress.totalTransactions, progress.consciousDays])

  useEffect(() => {
    if (!isLoading) {
      checkBadges()
    }
  }, [isLoading, user.streak, user.balance, user.level, progress.totalTransactions, progress.consciousDays, checkBadges])

  // Add XP with level up logic
  const addXP = useCallback((amount: number) => {
    setUser(prev => {
      let newXP = prev.xp + amount
      let newLevel = prev.level
      let xpToNextLevel = prev.xpToNextLevel

      while (newXP >= xpToNextLevel) {
        newXP -= xpToNextLevel
        newLevel += 1
        xpToNextLevel = XP_CONFIG.levelUp(newLevel)

        // Add community post for level up
        addCommunityPost(`subiu para o nível ${newLevel}!`)
      }

      return { ...prev, xp: newXP, level: newLevel, xpToNextLevel }
    })

    setProgress(prev => ({ ...prev, totalXP: prev.totalXP + amount }))
  }, [])

  // Record activity (for streak and conscious days)
  const recordActivity = useCallback(() => {
    const today = new Date().toISOString().split('T')[0]
    const lastActivity = progress.lastActivityDate?.split('T')[0]

    setProgress(prev => {
      const updates: Partial<UserProgress> = {
        lastActivityDate: new Date().toISOString(),
      }

      if (lastActivity !== today) {
        updates.consciousDays = prev.consciousDays + 1
      }

      return { ...prev, ...updates }
    })

    if (lastActivity !== today) {
      setUser(prev => {
        const newStreak = prev.streak + 1
        const highestStreak = Math.max(newStreak, progress.highestStreak)

        setProgress(p => ({ ...p, highestStreak }))

        if (newStreak % 7 === 0) {
          addCommunityPost(`mantém uma streak de ${newStreak} dias!`)
        }

        return { ...prev, streak: newStreak }
      })
    }
  }, [progress.lastActivityDate, progress.highestStreak])

  // Add transaction
  const addTransaction = useCallback((transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: `t${Date.now()}`,
      createdAt: new Date().toISOString(),
    }

    setTransactions(prev => [newTransaction, ...prev])

    // Update user balance
    setUser(prev => {
      if (transaction.type === 'income') {
        return {
          ...prev,
          balance: prev.balance + transaction.amount,
          totalIncome: prev.totalIncome + transaction.amount,
        }
      } else {
        return {
          ...prev,
          balance: prev.balance - transaction.amount,
          totalExpenses: prev.totalExpenses + transaction.amount,
        }
      }
    })

    // Update progress
    setProgress(prev => ({
      ...prev,
      totalTransactions: prev.totalTransactions + 1,
    }))

    // Award XP
    addXP(XP_CONFIG.registerTransaction)

    // Record activity
    recordActivity()

    // Check mission completion
    const missionId = transaction.type === 'expense' ? 'd1' : 'd2'
    const mission = missions.find(m => m.id === missionId && m.status === 'available')
    if (mission) {
      completeMission(missionId)
    }
  }, [addXP, recordActivity, missions])

  // Delete transaction
  const deleteTransaction = useCallback((id: string) => {
    const transaction = transactions.find(t => t.id === id)
    if (!transaction) return

    setTransactions(prev => prev.filter(t => t.id !== id))

    setUser(prev => {
      if (transaction.type === 'income') {
        return {
          ...prev,
          balance: prev.balance - transaction.amount,
          totalIncome: prev.totalIncome - transaction.amount,
        }
      } else {
        return {
          ...prev,
          balance: prev.balance + transaction.amount,
          totalExpenses: prev.totalExpenses - transaction.amount,
        }
      }
    })
  }, [transactions])

  // Complete mission
  const completeMission = useCallback((id: string) => {
    setMissions(prev => {
      const missionIndex = prev.findIndex(m => m.id === id)
      if (missionIndex === -1) return prev

      const mission = prev[missionIndex]
      if (mission.status !== 'available') return prev

      const updated = [...prev]
      updated[missionIndex] = {
        ...mission,
        status: 'completed',
        completedAt: new Date().toISOString()
      }

      // Unlock next path mission if this is a path mission
      if (mission.type === 'path') {
        const pathMissions = updated.filter(m => m.type === 'path')
        const currentIndex = pathMissions.findIndex(m => m.id === id)

        if (currentIndex < pathMissions.length - 1) {
          const nextMission = pathMissions[currentIndex + 1]
          const nextMissionIndex = updated.findIndex(m => m.id === nextMission.id)
          if (nextMissionIndex !== -1) {
            updated[nextMissionIndex] = { ...updated[nextMissionIndex], status: 'available' }
          }
        }
      }

      return updated
    })

    const mission = missions.find(m => m.id === id)
    if (mission) {
      const xpAmount = mission.type === 'path' ? XP_CONFIG.completePathMission : XP_CONFIG.completeDailyMission
      addXP(xpAmount)

      setProgress(prev => ({
        ...prev,
        completedMissions: prev.completedMissions + 1,
      }))
    }

    recordActivity()
  }, [missions, addXP, recordActivity])

  // Reset daily missions
  const resetDailyMissions = useCallback(() => {
    setMissions(prev => {
      return prev.map(m => {
        if (m.type === 'daily') {
          return { ...m, status: 'available', completedAt: undefined }
        }
        return m
      })
    })
  }, [])

  // Add community post
  const addCommunityPost = useCallback((action: string) => {
    const newPost: CommunityPost = {
      id: `cp${Date.now()}`,
      userName: user.name,
      action,
      timestamp: 'Agora',
      likes: 0,
      reactionType: 'fire',
      isUserPost: true,
    }

    setCommunityPosts(prev => [newPost, ...prev.slice(0, 19)])
  }, [user.name])

  // Like post
  const likePost = useCallback((id: string) => {
    setCommunityPosts(prev =>
      prev.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p)
    )
  }, [])

  // Update user
  const updateUser = useCallback((updates: Partial<User>) => {
    setUser(prev => ({ ...prev, ...updates }))
  }, [])

  // Update settings
  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }))
  }, [])

  // Reset all data
  const resetAllData = useCallback(() => {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key))
    setTransactions([])
    setUser(MOCK_USER)
    setMissions(MOCK_MISSIONS)
    setCommunityPosts(MOCK_COMMUNITY)
    setProgress(getInitialProgress())
    setSettings(getInitialSettings())
  }, [])

  // Computed values
  const league = getLeague(progress.totalXP)

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const monthlyTransactions = transactions.filter(t => new Date(t.date) >= startOfMonth)
  const monthlyIncome = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  const monthlyExpenses = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  // Weekly expenses for chart
  const weekDays = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB']
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    return date
  })

  const weeklyExpenses = last7Days.map(date => {
    const dateStr = date.toISOString().split('T')[0]
    const dayExpenses = transactions
      .filter(t => t.type === 'expense' && t.date === dateStr)
      .reduce((sum, t) => sum + t.amount, 0)

    return {
      day: weekDays[date.getDay()],
      amount: dayExpenses,
    }
  })

  return (
    <DataContext.Provider value={{
      transactions,
      user,
      missions,
      communityPosts,
      progress,
      settings,
      addTransaction,
      deleteTransaction,
      addXP,
      updateUser,
      completeMission,
      resetDailyMissions,
      addCommunityPost,
      likePost,
      updateSettings,
      resetAllData,
      isLoading,
      league,
      monthlyIncome,
      monthlyExpenses,
      weeklyExpenses,
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
