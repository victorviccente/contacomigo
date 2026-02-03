'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AppTab, User, Mission, CommunityPost } from '@/lib/types'
import { MOCK_USER, MOCK_MISSIONS, MOCK_COMMUNITY } from '@/lib/constants'
import { useAuth, getAvatarUrl } from '@/lib/auth-context'
import Sidebar from '@/components/Sidebar'
import Dashboard from '@/components/Dashboard'
import MissionsView from '@/components/MissionsView'
import ProgressView from '@/components/ProgressView'
import CommunityView from '@/components/CommunityView'
import ProfileView from '@/components/ProfileView'
import { Search, Bell, Plus, Menu, X, DollarSign, LogOut } from 'lucide-react'

export default function Home() {
  const { isAuthenticated, isLoading, userProfile, logout } = useAuth()
  const router = useRouter()

  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.HOME)
  const [user, setUser] = useState<User>(MOCK_USER)
  const [missions, setMissions] = useState<Mission[]>(MOCK_MISSIONS)
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(MOCK_COMMUNITY)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newExpense, setNewExpense] = useState({ description: '', amount: '' })
  const [showUserMenu, setShowUserMenu] = useState(false)

  // Atualizar user com dados do perfil quando disponível
  useEffect(() => {
    if (userProfile) {
      setUser(prev => ({
        ...prev,
        name: userProfile.displayName
      }))
    }
  }, [userProfile])

  // Verificar autenticação
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login')
      } else if (!userProfile?.isProfileSetup) {
        router.push('/setup')
      }
    }
  }, [isLoading, isAuthenticated, userProfile, router])

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#1F7A8C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Carregando...</p>
        </div>
      </div>
    )
  }

  // Aguardar redirecionamento
  if (!isAuthenticated || !userProfile?.isProfileSetup) {
    return null
  }

  const getTitle = () => {
    switch (activeTab) {
      case AppTab.HOME: return 'Dashboard'
      case AppTab.MISSIONS: return 'Minha Jornada'
      case AppTab.PROGRESS: return 'Análise de Progresso'
      case AppTab.COMMUNITY: return 'Feed da Comunidade'
      case AppTab.PROFILE: return 'Meu Perfil'
      default: return 'ContaComigo'
    }
  }

  const handleAddXP = (amount: number) => {
    setUser(prev => {
      let newXP = prev.xp + amount
      let newLevel = prev.level
      if (newXP >= prev.xpToNextLevel) {
        newXP -= prev.xpToNextLevel
        newLevel += 1
      }
      return { ...prev, xp: newXP, level: newLevel }
    })
  }

  const handleCompleteMission = (id: string) => {
    const mission = missions.find(m => m.id === id)
    if (mission && mission.status === 'available') {
      setMissions(prev => prev.map(m => m.id === id ? { ...m, status: 'completed' as const } : m))
      handleAddXP(mission.xp)
    }
  }

  const handleLikePost = (id: string) => {
    setCommunityPosts(prev => prev.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p))
  }

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault()
    const amountNum = parseFloat(newExpense.amount)
    if (!isNaN(amountNum)) {
      setUser(prev => ({ ...prev, balance: prev.balance - amountNum }))
      handleAddXP(20)
      setIsModalOpen(false)
      setNewExpense({ description: '', amount: '' })

      const regMission = missions.find(m => m.title === 'Registrar gasto')
      if (regMission) handleCompleteMission(regMission.id)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const renderView = () => {
    switch (activeTab) {
      case AppTab.HOME: return <Dashboard user={user} missions={missions} onCompleteMission={handleCompleteMission} />
      case AppTab.MISSIONS: return <MissionsView missions={missions} onCompleteMission={handleCompleteMission} />
      case AppTab.PROGRESS: return <ProgressView />
      case AppTab.COMMUNITY: return <CommunityView posts={communityPosts} onLike={handleLikePost} />
      case AppTab.PROFILE: return <ProfileView user={user} avatarUrl={userProfile ? getAvatarUrl(userProfile.avatarId) : undefined} username={userProfile?.username} />
      default: return <Dashboard user={user} missions={missions} onCompleteMission={handleCompleteMission} />
    }
  }

  return (
    <div className="flex min-h-screen bg-[#F7F9FC]">
      {/* Sidebar Desktop */}
      <div className={`fixed inset-0 z-50 lg:relative lg:block ${isSidebarOpen ? 'block' : 'hidden'}`}>
        <div className="absolute inset-0 bg-black/50 lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => { setActiveTab(tab); setIsSidebarOpen(false); }}
          user={user}
          avatarUrl={userProfile ? getAvatarUrl(userProfile.avatarId) : undefined}
          username={userProfile?.username}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-100 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 text-gray-500" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <h2 className="text-lg lg:text-xl font-bold text-[#0B1320] truncate">{getTitle()}</h2>
          </div>

          <div className="flex items-center gap-3 lg:gap-6">
            <div className="relative hidden xl:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Pesquisar..."
                className="bg-gray-50 border-none rounded-xl pl-10 pr-4 py-2 text-sm w-48 focus:ring-2 focus:ring-[#1F7A8C]/20 outline-none transition-all"
              />
            </div>

            <button className="p-2 text-gray-400 hover:text-[#1F7A8C] transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E63946] rounded-full border-2 border-white"></span>
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#1F7A8C] text-white p-2.5 lg:px-5 lg:py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-[#186170] transition-all shadow-lg shadow-[#1F7A8C]/10"
            >
              <Plus size={18} strokeWidth={3} />
              <span className="hidden sm:inline">Novo Registro</span>
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <img
                  src={userProfile ? getAvatarUrl(userProfile.avatarId) : ''}
                  alt="Avatar"
                  className="w-9 h-9 rounded-xl bg-gray-100"
                />
              </button>

              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)}></div>
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <img
                          src={userProfile ? getAvatarUrl(userProfile.avatarId) : ''}
                          alt="Avatar"
                          className="w-12 h-12 rounded-xl bg-gray-100"
                        />
                        <div>
                          <p className="font-bold text-[#0B1320]">{user.name}</p>
                          <p className="text-sm text-[#1F7A8C]">{userProfile?.username}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-[#E63946] hover:bg-red-50 rounded-xl transition-colors text-left"
                      >
                        <LogOut size={18} />
                        <span className="font-medium">Sair da conta</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* View Content */}
        <main className="flex-1 overflow-y-auto no-scrollbar">
          <div className="max-w-7xl mx-auto p-4 lg:p-8">
            {renderView()}
          </div>
        </main>
      </div>

      {/* Modal Novo Registro */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0F172A]/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-[32px] p-8 w-full max-w-md relative zoom-in-95">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-[#1F7A8C]/10 text-[#1F7A8C] rounded-2xl flex items-center justify-center">
                <DollarSign size={24} />
              </div>
              <h3 className="text-xl font-bold">Novo Gasto</h3>
            </div>
            <form onSubmit={handleAddExpense} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Descrição</label>
                <input
                  required
                  type="text"
                  value={newExpense.description}
                  onChange={e => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Ex: Almoço"
                  className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#1F7A8C]/20 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Valor (R$)</label>
                <input
                  required
                  type="number"
                  step="0.01"
                  value={newExpense.amount}
                  onChange={e => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="0,00"
                  className="w-full bg-gray-50 border-none rounded-xl p-4 text-lg font-bold focus:ring-2 focus:ring-[#1F7A8C]/20 outline-none"
                />
              </div>
              <button type="submit" className="w-full bg-[#1F7A8C] text-white py-4 rounded-2xl font-bold shadow-xl hover:bg-[#186170] transition-all">
                Salvar Registro
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
