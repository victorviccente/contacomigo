'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AppTab, EXPENSE_CATEGORIES, INCOME_CATEGORIES, TransactionType } from '@/lib/types'
import { useAuth, getAvatarUrl } from '@/lib/auth-context'
import { useData } from '@/lib/data-context'
import Sidebar from '@/components/Sidebar'
import Dashboard from '@/components/Dashboard'
import MissionsView from '@/components/MissionsView'
import ProgressView from '@/components/ProgressView'
import CommunityView from '@/components/CommunityView'
import ProfileView from '@/components/ProfileView'
import { Search, Bell, Plus, Menu, X, DollarSign, LogOut, TrendingUp, TrendingDown, Calendar } from 'lucide-react'

export default function Home() {
  const { isAuthenticated, isLoading: authLoading, userProfile, logout } = useAuth()
  const {
    user,
    missions,
    communityPosts,
    addTransaction,
    completeMission,
    likePost,
    updateUser,
    isLoading: dataLoading
  } = useData()
  const router = useRouter()

  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.HOME)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  // Form state for new transaction
  const [transactionType, setTransactionType] = useState<TransactionType>('expense')
  const [transactionForm, setTransactionForm] = useState({
    description: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
  })

  const categories = transactionType === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES

  // Update user name from profile
  useEffect(() => {
    if (userProfile) {
      updateUser({ name: userProfile.displayName })
    }
  }, [userProfile, updateUser])

  // Check authentication
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/login')
      } else if (!userProfile?.isProfileSetup) {
        router.push('/setup')
      }
    }
  }, [authLoading, isAuthenticated, userProfile, router])

  const isLoading = authLoading || dataLoading

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

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseFloat(transactionForm.amount)

    if (isNaN(amount) || amount <= 0) return
    if (!transactionForm.category) return

    addTransaction({
      type: transactionType,
      amount,
      description: transactionForm.description,
      category: transactionForm.category,
      date: transactionForm.date,
    })

    // Reset form
    setIsModalOpen(false)
    setTransactionForm({
      description: '',
      amount: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
    })
    setTransactionType('expense')
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const renderView = () => {
    switch (activeTab) {
      case AppTab.HOME:
        return <Dashboard user={user} missions={missions} onCompleteMission={completeMission} />
      case AppTab.MISSIONS:
        return <MissionsView missions={missions} onCompleteMission={completeMission} />
      case AppTab.PROGRESS:
        return <ProgressView />
      case AppTab.COMMUNITY:
        return <CommunityView posts={communityPosts} onLike={likePost} />
      case AppTab.PROFILE:
        return (
          <ProfileView
            user={user}
            avatarUrl={userProfile ? getAvatarUrl(userProfile.avatarId) : undefined}
            username={userProfile?.username}
          />
        )
      default:
        return <Dashboard user={user} missions={missions} onCompleteMission={completeMission} />
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F9FC]">
      {/* Sidebar - Mobile & Desktop */}
      <div
        className={`fixed inset-0 z-[60] lg:relative lg:inset-auto lg:z-0 lg:flex transition-all duration-300 ease-in-out ${isSidebarOpen ? 'bg-black/60 backdrop-blur-sm' : 'bg-transparent pointer-events-none lg:pointer-events-auto'
          }`}
        onClick={() => setIsSidebarOpen(false)}
      >
        <div
          className={`h-full w-72 bg-white shadow-2xl lg:shadow-none transform transition-transform duration-300 ease-in-out pointer-events-auto ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            }`}
          onClick={(e) => e.stopPropagation()}
        >
          <Sidebar
            activeTab={activeTab}
            setActiveTab={(tab) => { setActiveTab(tab); setIsSidebarOpen(false); }}
            user={user}
            avatarUrl={userProfile ? getAvatarUrl(userProfile.avatarId) : undefined}
            username={userProfile?.username}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2.5 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <h2 className="text-lg lg:text-xl font-bold text-[#0B1320] tracking-tight truncate">{getTitle()}</h2>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
            <div className="relative hidden xl:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Pesquisar..."
                className="bg-gray-50 border-transparent focus:bg-white border focus:border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm w-48 focus:ring-4 focus:ring-[#1F7A8C]/5 outline-none transition-all"
              />
            </div>

            <button className="p-2.5 text-gray-400 hover:text-[#1F7A8C] hover:bg-gray-50 rounded-xl transition-all relative">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#E63946] rounded-full ring-2 ring-white"></span>
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#1F7A8C] text-white p-2.5 lg:px-5 lg:py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-[#186170] transition-all shadow-lg shadow-[#1F7A8C]/20 hover:scale-[1.02] active:scale-95"
            >
              <Plus size={18} strokeWidth={3} />
              <span className="hidden sm:inline">Novo Registro</span>
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all"
              >
                <div className="w-9 h-9 rounded-xl overflow-hidden ring-2 ring-transparent group-hover:ring-[#1F7A8C]/20 transition-all">
                  <img
                    src={userProfile ? getAvatarUrl(userProfile.avatarId) : ''}
                    alt="Avatar"
                    className="w-full h-full object-cover bg-gray-50"
                  />
                </div>
              </button>

              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)}></div>
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 bg-gray-50/50 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <img
                          src={userProfile ? getAvatarUrl(userProfile.avatarId) : ''}
                          alt="Avatar"
                          className="w-12 h-12 rounded-xl bg-white shadow-sm border border-gray-100"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-[#0B1320] truncate">{user.name}</p>
                          <p className="text-sm text-[#1F7A8C] truncate">{userProfile?.username}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-3 text-[#E63946] hover:bg-red-50 rounded-xl transition-colors text-left"
                      >
                        <LogOut size={18} />
                        <span className="font-bold text-sm">Sair da conta</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* View Content */}
        <main className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
          <div className="max-w-7xl mx-auto p-4 lg:p-10">
            {renderView()}
          </div>
        </main>
      </div>

      {/* Modal Novo Registro Expandido */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0F172A]/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-[32px] p-6 sm:p-8 w-full max-w-md relative animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 sm:top-6 right-4 sm:right-6 text-gray-400 hover:text-gray-600 transition-colors">
              <X size={20} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${transactionType === 'expense'
                  ? 'bg-[#E63946]/10 text-[#E63946]'
                  : 'bg-[#4CAF50]/10 text-[#4CAF50]'
                }`}>
                {transactionType === 'expense' ? <TrendingDown size={24} /> : <TrendingUp size={24} />}
              </div>
              <div>
                <h3 className="text-xl font-bold">Nova Transacao</h3>
                <p className="text-xs text-gray-400">Registre seu {transactionType === 'expense' ? 'gasto' : 'ganho'}</p>
              </div>
            </div>

            {/* Type Toggle */}
            <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-2xl">
              <button
                type="button"
                onClick={() => {
                  setTransactionType('expense')
                  setTransactionForm(prev => ({ ...prev, category: '' }))
                }}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${transactionType === 'expense'
                    ? 'bg-white text-[#E63946] shadow-sm'
                    : 'text-gray-400 hover:text-gray-600'
                  }`}
              >
                <TrendingDown size={18} />
                Gasto
              </button>
              <button
                type="button"
                onClick={() => {
                  setTransactionType('income')
                  setTransactionForm(prev => ({ ...prev, category: '' }))
                }}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${transactionType === 'income'
                    ? 'bg-white text-[#4CAF50] shadow-sm'
                    : 'text-gray-400 hover:text-gray-600'
                  }`}
              >
                <TrendingUp size={18} />
                Ganho
              </button>
            </div>

            <form onSubmit={handleAddTransaction} className="space-y-5">
              {/* Amount */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Valor (R$)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    required
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={transactionForm.amount}
                    onChange={e => setTransactionForm(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="0,00"
                    className="w-full bg-gray-50 border-none rounded-xl pl-12 pr-4 py-4 text-xl font-bold focus:ring-2 focus:ring-[#1F7A8C]/20 outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Descricao</label>
                <input
                  required
                  type="text"
                  value={transactionForm.description}
                  onChange={e => setTransactionForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder={transactionType === 'expense' ? 'Ex: Almoco no restaurante' : 'Ex: Salario do mes'}
                  className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#1F7A8C]/20 outline-none"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Categoria</label>
                <div className="grid grid-cols-4 gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setTransactionForm(prev => ({ ...prev, category: cat.id }))}
                      className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${transactionForm.category === cat.id
                          ? transactionType === 'expense'
                            ? 'bg-[#E63946]/10 ring-2 ring-[#E63946]/30'
                            : 'bg-[#4CAF50]/10 ring-2 ring-[#4CAF50]/30'
                          : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                    >
                      <span className="text-xl">{cat.icon}</span>
                      <span className="text-[10px] font-bold text-gray-600 truncate w-full text-center">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Data</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    required
                    type="date"
                    value={transactionForm.date}
                    onChange={e => setTransactionForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full bg-gray-50 border-none rounded-xl pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-[#1F7A8C]/20 outline-none"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!transactionForm.category}
                className={`w-full py-4 rounded-2xl font-bold shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed ${transactionType === 'expense'
                    ? 'bg-[#E63946] text-white hover:bg-[#c92f3a]'
                    : 'bg-[#4CAF50] text-white hover:bg-[#43a047]'
                  }`}
              >
                Salvar {transactionType === 'expense' ? 'Gasto' : 'Ganho'}
              </button>
            </form>

            {/* XP Badge */}
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
              <span className="bg-[#1F7A8C]/10 text-[#1F7A8C] px-2 py-1 rounded-lg font-bold">+20 XP</span>
              <span>por registrar transacao</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
