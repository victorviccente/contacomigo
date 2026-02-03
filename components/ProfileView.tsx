'use client'

import { useState } from 'react'
import { Award, Shield, ChevronRight, LogOut, Sparkles, CreditCard, Bell, Key, Trash2, RotateCcw, Calendar, Target, Zap, Trophy } from 'lucide-react'
import { User } from '@/lib/types'
import { useData } from '@/lib/data-context'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'

interface ProfileViewProps {
  user: User
  avatarUrl?: string
  username?: string
}

export default function ProfileView({ user, avatarUrl, username }: ProfileViewProps) {
  const { progress, settings, updateSettings, resetAllData, league } = useData()
  const { logout } = useAuth()
  const router = useRouter()
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const handleResetData = () => {
    resetAllData()
    setShowResetConfirm(false)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
  }

  // Calculate unlocked badges count
  const unlockedBadges = user.badges.filter(b => b.unlocked).length

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in">
      {/* Left Column: Profile Card & Main Stats */}
      <div className="lg:col-span-4 space-y-8">
        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-[#1F7A8C] to-[#4CAF50]"></div>
          <div className="px-8 pb-8 flex flex-col items-center text-center -mt-16">
            <div className="w-28 h-28 lg:w-32 lg:h-32 rounded-[32px] lg:rounded-[40px] bg-white p-2 shadow-2xl relative">
              <div className="w-full h-full bg-gray-100 rounded-[28px] lg:rounded-[32px] overflow-hidden flex items-center justify-center text-5xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={avatarUrl || defaultAvatar} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-[#F4C430] text-white p-2 lg:p-2.5 rounded-2xl shadow-lg border-4 border-white">
                <Sparkles size={16} fill="currentColor" />
              </div>
            </div>

            <div className="mt-6 space-y-1">
              <h1 className="text-2xl font-black text-[#0B1320]">{user.name}</h1>
              {username && (
                <p className="text-sm font-bold text-[#1F7A8C]">{username}</p>
              )}
              <p className="text-[10px] lg:text-xs font-bold text-gray-400 uppercase tracking-widest">
                Membro desde {formatDate(progress.firstAccessDate)}
              </p>
            </div>

            <div className="w-full grid grid-cols-2 gap-3 mt-8">
              <div className="bg-[#F7F9FC] p-3 lg:p-4 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">LVL Atual</p>
                <p className="text-xl lg:text-2xl font-black text-[#1F7A8C]">{user.level}</p>
              </div>
              <div className="bg-[#F7F9FC] p-3 lg:p-4 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Streak Ativa</p>
                <p className="text-xl lg:text-2xl font-black text-[#E63946]">{user.streak}</p>
              </div>
            </div>

            {/* League Badge */}
            <div className="w-full mt-4 bg-gradient-to-r from-[#1F7A8C]/10 to-[#4CAF50]/10 p-4 rounded-2xl">
              <div className="flex items-center justify-center gap-2">
                <Trophy size={20} className="text-[#F4C430]" />
                <span className="font-black text-[#0B1320]">{league}</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-1">{progress.totalXP.toLocaleString()} XP total</p>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="bg-white rounded-[40px] p-6 lg:p-8 shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg mb-6">Estatisticas</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-[#F7F9FC] rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1F7A8C]/10 flex items-center justify-center">
                  <CreditCard size={18} className="text-[#1F7A8C]" />
                </div>
                <span className="text-sm font-bold text-gray-600">Transacoes</span>
              </div>
              <span className="text-lg font-black text-[#0B1320]">{progress.totalTransactions}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#F7F9FC] rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#4CAF50]/10 flex items-center justify-center">
                  <Target size={18} className="text-[#4CAF50]" />
                </div>
                <span className="text-sm font-bold text-gray-600">Missoes Completas</span>
              </div>
              <span className="text-lg font-black text-[#0B1320]">{progress.completedMissions}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#F7F9FC] rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E63946]/10 flex items-center justify-center">
                  <Zap size={18} className="text-[#E63946]" />
                </div>
                <span className="text-sm font-bold text-gray-600">Maior Streak</span>
              </div>
              <span className="text-lg font-black text-[#0B1320]">{progress.highestStreak} dias</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#F7F9FC] rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F4C430]/10 flex items-center justify-center">
                  <Calendar size={18} className="text-[#F4C430]" />
                </div>
                <span className="text-sm font-bold text-gray-600">Dias Conscientes</span>
              </div>
              <span className="text-lg font-black text-[#0B1320]">{progress.consciousDays}</span>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="bg-white rounded-[40px] p-6 lg:p-8 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">Conquistas</h3>
            <span className="text-xs font-bold text-[#1F7A8C] bg-[#1F7A8C]/10 px-3 py-1 rounded-full">
              {unlockedBadges}/{user.badges.length}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-3 lg:gap-4">
            {user.badges.map((badge) => (
              <div
                key={badge.id}
                className={`group cursor-help relative ${!badge.unlocked ? 'opacity-30 grayscale' : ''}`}
              >
                <div className={`aspect-square rounded-[16px] lg:rounded-[20px] flex items-center justify-center text-xl lg:text-2xl shadow-sm border transition-transform group-hover:scale-105 ${badge.unlocked ? 'bg-[#F7F9FC] border-gray-100' : 'bg-gray-100 border-gray-200'
                  }`}>
                  {badge.icon}
                </div>
                <div className="opacity-0 group-hover:opacity-100 absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[8px] py-2 px-3 rounded-lg whitespace-nowrap transition-opacity pointer-events-none z-10 max-w-[120px] text-center">
                  <p className="font-bold">{badge.name}</p>
                  <p className="text-white/60 mt-0.5">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Settings & Detailed Configs */}
      <div className="lg:col-span-8 space-y-8">
        <div className="bg-white rounded-[40px] p-6 lg:p-10 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-8 lg:mb-10">
            <h3 className="text-xl font-black">Configuracoes da Conta</h3>
          </div>

          <div className="space-y-6 lg:space-y-8">
            <section className="space-y-4">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Preferencias de App</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Notifications Toggle */}
                <div className="flex items-center justify-between p-4 lg:p-5 rounded-[24px] lg:rounded-[28px] border border-gray-100 hover:bg-[#F7F9FC] transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl flex items-center justify-center transition-colors ${settings.notifications ? 'bg-[#1F7A8C] text-white' : 'bg-[#1F7A8C]/10 text-[#1F7A8C]'
                      }`}>
                      <Bell size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-xs lg:text-sm text-[#0B1320]">Notificacoes</p>
                      <p className="text-[10px] lg:text-xs text-gray-400 font-medium">Lembretes de streak</p>
                    </div>
                  </div>
                  <button
                    onClick={() => updateSettings({ notifications: !settings.notifications })}
                    className={`w-12 h-7 rounded-full transition-colors relative ${settings.notifications ? 'bg-[#1F7A8C]' : 'bg-gray-200'
                      }`}
                  >
                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.notifications ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                  </button>
                </div>

                {/* Privacy */}
                <button className="flex items-center gap-4 p-4 lg:p-5 rounded-[24px] lg:rounded-[28px] border border-gray-100 hover:bg-[#F7F9FC] transition-all text-left group">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-[#1F7A8C]/10 text-[#1F7A8C] flex items-center justify-center group-hover:bg-[#1F7A8C] group-hover:text-white transition-colors">
                    <Shield size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-xs lg:text-sm text-[#0B1320]">Privacidade Social</p>
                    <p className="text-[10px] lg:text-xs text-gray-400 font-medium">Quem ve suas conquistas</p>
                  </div>
                </button>

                {/* Categories */}
                <button className="flex items-center gap-4 p-4 lg:p-5 rounded-[24px] lg:rounded-[28px] border border-gray-100 hover:bg-[#F7F9FC] transition-all text-left group">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-[#1F7A8C]/10 text-[#1F7A8C] flex items-center justify-center group-hover:bg-[#1F7A8C] group-hover:text-white transition-colors">
                    <CreditCard size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-xs lg:text-sm text-[#0B1320]">Categorias de Gastos</p>
                    <p className="text-[10px] lg:text-xs text-gray-400 font-medium">Gerenciar tags</p>
                  </div>
                </button>

                {/* Security */}
                <button className="flex items-center gap-4 p-4 lg:p-5 rounded-[24px] lg:rounded-[28px] border border-gray-100 hover:bg-[#F7F9FC] transition-all text-left group">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-[#1F7A8C]/10 text-[#1F7A8C] flex items-center justify-center group-hover:bg-[#1F7A8C] group-hover:text-white transition-colors">
                    <Key size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-xs lg:text-sm text-[#0B1320]">Seguranca</p>
                    <p className="text-[10px] lg:text-xs text-gray-400 font-medium">Acesso seguro</p>
                  </div>
                </button>
              </div>
            </section>

            <section className="space-y-4 pt-4 border-t border-gray-50">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Sua Assinatura</h4>
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-[28px] lg:rounded-[32px] p-6 lg:p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4 lg:gap-5">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-white/10 rounded-2xl flex items-center justify-center text-2xl lg:text-3xl">💎</div>
                  <div>
                    <h5 className="text-base lg:text-lg font-black">Plano Mestre Vitalicio</h5>
                    <p className="text-white/60 text-[10px] lg:text-sm font-medium">Todos os recursos liberados</p>
                  </div>
                </div>
                <button className="w-full md:w-auto bg-[#F4C430] text-gray-900 px-6 lg:px-8 py-3 rounded-xl lg:rounded-2xl font-black text-[10px] lg:text-sm hover:scale-105 transition-transform shadow-xl shadow-[#F4C430]/20">
                  GERENCIAR
                </button>
              </div>
            </section>

            {/* Danger Zone */}
            <section className="space-y-4 pt-4 border-t border-gray-50">
              <h4 className="text-[10px] font-black text-[#E63946] uppercase tracking-[0.2em]">Zona de Perigo</h4>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="flex items-center justify-center gap-2 text-[#E63946] font-bold text-xs lg:text-sm bg-[#E63946]/5 hover:bg-[#E63946]/10 px-6 py-4 rounded-2xl transition-all border border-[#E63946]/20"
                >
                  <RotateCcw size={18} />
                  Resetar Todos os Dados
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 text-gray-500 font-bold text-xs lg:text-sm hover:bg-gray-100 px-6 py-4 rounded-2xl transition-all"
                >
                  <LogOut size={18} />
                  Encerrar Sessao
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0F172A]/60 backdrop-blur-sm" onClick={() => setShowResetConfirm(false)}></div>
          <div className="bg-white rounded-[32px] p-8 w-full max-w-md relative animate-in zoom-in-95">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#E63946]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Trash2 size={32} className="text-[#E63946]" />
              </div>
              <h3 className="text-xl font-black text-[#0B1320] mb-2">Resetar Dados?</h3>
              <p className="text-gray-500 text-sm mb-6">
                Isso vai apagar todas as suas transacoes, progresso, missoes e conquistas. Esta acao nao pode ser desfeita.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-4 rounded-2xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleResetData}
                  className="flex-1 py-4 rounded-2xl font-bold text-white bg-[#E63946] hover:bg-[#c92f3a] transition-colors"
                >
                  Resetar Tudo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
