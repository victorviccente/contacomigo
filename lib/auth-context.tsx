'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface UserProfile {
  username: string
  displayName: string
  avatarId: string
  isProfileSetup: boolean
}

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  userProfile: UserProfile | null
  login: (email: string, password: string) => boolean
  logout: () => void
  setupProfile: (username: string, avatarId: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Credenciais estáticas para autenticação
const STATIC_CREDENTIALS = {
  email: 'usuario@contacomigo.com',
  password: '123456'
}

// Lista de avatares disponíveis
export const AVATARS = [
  { id: 'avatar1', name: 'Explorador', seed: 'felix', style: 'adventurer' },
  { id: 'avatar2', name: 'Guerreira', seed: 'luna', style: 'adventurer' },
  { id: 'avatar3', name: 'Sábio', seed: 'oliver', style: 'adventurer' },
  { id: 'avatar4', name: 'Mística', seed: 'zara', style: 'adventurer' },
  { id: 'avatar5', name: 'Herói', seed: 'max', style: 'adventurer' },
  { id: 'avatar6', name: 'Fada', seed: 'pixie', style: 'adventurer' },
  { id: 'avatar7', name: 'Ninja', seed: 'shadow', style: 'adventurer' },
  { id: 'avatar8', name: 'Mago', seed: 'merlin', style: 'adventurer' },
  { id: 'avatar9', name: 'Princesa', seed: 'aurora', style: 'adventurer' },
  { id: 'avatar10', name: 'Robô', seed: 'cyber', style: 'bottts' },
]

export function getAvatarUrl(avatarId: string): string {
  const avatar = AVATARS.find(a => a.id === avatarId)
  if (!avatar) return `https://api.dicebear.com/7.x/adventurer/svg?seed=default`
  return `https://api.dicebear.com/7.x/${avatar.style}/svg?seed=${avatar.seed}`
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    // Verificar se há sessão salva no localStorage
    const savedAuth = localStorage.getItem('contacomigo_auth')
    const savedProfile = localStorage.getItem('contacomigo_profile')

    if (savedAuth === 'true') {
      setIsAuthenticated(true)
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile))
      }
    }
    setIsLoading(false)
  }, [])

  const login = (email: string, password: string): boolean => {
    if (email === STATIC_CREDENTIALS.email && password === STATIC_CREDENTIALS.password) {
      setIsAuthenticated(true)
      localStorage.setItem('contacomigo_auth', 'true')

      // Verificar se já tem perfil configurado
      const savedProfile = localStorage.getItem('contacomigo_profile')
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile))
      }
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUserProfile(null)
    localStorage.removeItem('contacomigo_auth')
    localStorage.removeItem('contacomigo_profile')
  }

  const setupProfile = (username: string, avatarId: string) => {
    const profile: UserProfile = {
      username: username.startsWith('@') ? username : `@${username}`,
      displayName: username.replace('@', ''),
      avatarId,
      isProfileSetup: true
    }
    setUserProfile(profile)
    localStorage.setItem('contacomigo_profile', JSON.stringify(profile))
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isLoading,
      userProfile,
      login,
      logout,
      setupProfile
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
