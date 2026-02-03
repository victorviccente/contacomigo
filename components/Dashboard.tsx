'use client'

import { useState, useEffect } from 'react'
import { Flame, Target, ChevronRight, TrendingUp, Wallet, Check } from 'lucide-react'
import { User, Mission } from '@/lib/types'

interface DashboardProps {
  user: User
  missions: Mission[]
  onCompleteMission: (id: string) => void
}

export default function Dashboard({ user, missions, onCompleteMission }: DashboardProps) {
  const [tip, setTip] = useState("Carregando sua dose de inspiração...")

  useEffect(() => {
    const fetchTip = async () => {
      try {
        const res = await fetch('/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            context: `O usuário ${user.name} está com saldo de R$ ${user.balance} e nível ${user.level}`
          })
        })
        const data = await res.json()
        setTip(data.tip)
      } catch {
        setTip('Você está fazendo um ótimo trabalho. Mantenha o foco!')
      }
    }
    fetchTip()
  }, [user.level, user.name, user.balance])

  const dailyMissions = missions.filter(m => m.type === 'daily')

  return (
    <div className="space-y-8 animate-in">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#0B1320]">Olá, {user.name} 👋</h1>
          <p className="text-gray-500 mt-1 font-medium">Seu progresso financeiro está excelente hoje.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white p-3 lg:p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3 min-w-[180px]">
            <div className="w-10 h-10 bg-[#4CAF50]/10 text-[#4CAF50] rounded-xl flex items-center justify-center">
              <Wallet size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Saldo Total</p>
              <p className="text-sm lg:text-base font-bold text-[#0B1320]">R$ {user.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Streak Card */}
        <div className="bg-white rounded-[32px] p-6 lg:p-8 shadow-sm border border-gray-100 flex items-center justify-between group hover:border-[#1F7A8C]/30 transition-all">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#E63946] font-bold text-lg lg:text-xl">
              <Flame size={24} fill="currentColor" className="group-hover:scale-110 transition-transform" />
              <span>{user.streak} Dias de Streak</span>
            </div>
            <p className="text-gray-500 text-xs lg:text-sm leading-relaxed">Você está sendo consistente!<br/>Continue registrando seus gastos.</p>
          </div>
          <div className="h-20 w-20 relative">
            <svg className="h-full w-full -rotate-90">
              <circle cx="40" cy="40" r="34" fill="transparent" stroke="#F1F5F9" strokeWidth="8" />
              <circle
                cx="40" cy="40" r="34" fill="transparent" stroke="#E63946" strokeWidth="8"
                strokeDasharray={2 * Math.PI * 34}
                strokeDashoffset={2 * Math.PI * 34 * (1 - (user.streak / 30))}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-700">
              {Math.min(100, Math.round((user.streak / 30) * 100))}%
            </div>
          </div>
        </div>

        {/* AI Insight Card */}
        <div className="lg:col-span-2 bg-[#1F7A8C] rounded-[32px] p-6 lg:p-8 text-white shadow-xl shadow-[#1F7A8C]/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/10 transition-colors"></div>
          <div className="relative z-10 flex gap-4 lg:gap-6 items-start">
            <div className="bg-white/15 p-3 lg:p-4 rounded-2xl backdrop-blur-md shrink-0">
              <Target size={28} className="lg:w-8 lg:h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-base lg:text-lg flex items-center gap-2">
                Dica do Seu Mentor IA
                <span className="bg-white/20 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-tighter hidden sm:inline">Gemini 2.5 Flash</span>
              </h3>
              <p className="text-white/90 text-sm lg:text-lg italic font-medium leading-relaxed">
                &ldquo;{tip}&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Column: Progress Quick View */}
        <div className="xl:col-span-8 space-y-6">
          <div className="bg-white rounded-[32px] p-6 lg:p-8 shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-bold">Resumo Financeiro Semanal</h3>
              <div className="flex items-center gap-2 text-[#4CAF50] bg-[#4CAF50]/10 px-3 py-1 rounded-full text-xs font-bold">
                <TrendingUp size={14} />
                +12% vs semana anterior
              </div>
            </div>
            <div className="h-48 lg:h-64 flex items-end justify-between gap-2 lg:gap-4 px-2">
              {[40, 70, 45, 90, 65, 30, 50].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 lg:gap-3 group">
                  <div
                    className="w-full bg-gray-50 rounded-t-xl relative overflow-hidden group-hover:bg-[#1F7A8C]/5 transition-all"
                    style={{ height: '100%' }}
                  >
                    <div
                      className="absolute bottom-0 w-full bg-[#1F7A8C] rounded-t-xl transition-all duration-1000"
                      style={{ height: `${h}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] lg:text-xs font-bold text-gray-400">
                    {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Missions & Tasks */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-white rounded-[32px] p-6 lg:p-8 shadow-sm border border-gray-100 h-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Missões do Dia</h3>
              <button className="text-[#1F7A8C] text-sm font-bold flex items-center hover:underline">
                Ver todas <ChevronRight size={16} />
              </button>
            </div>

            <div className="space-y-4">
              {dailyMissions.map((mission) => (
                <div
                  key={mission.id}
                  onClick={() => mission.status === 'available' && onCompleteMission(mission.id)}
                  className={`p-4 rounded-2xl border transition-all flex items-center gap-4 group cursor-pointer ${
                    mission.status === 'completed'
                      ? 'bg-gray-50 border-gray-100 opacity-60'
                      : 'bg-white border-gray-100 hover:border-[#1F7A8C]/30 hover:shadow-md'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-active:scale-95 ${
                    mission.status === 'completed' ? 'bg-[#4CAF50]/10 text-[#4CAF50]' : 'bg-[#1F7A8C]/10 text-[#1F7A8C]'
                  }`}>
                    {mission.status === 'completed' ? <Check size={20} /> : <Target size={20} />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm text-[#0B1320]">{mission.title}</h4>
                    <p className="text-xs text-gray-400 font-medium">+{mission.xp} XP</p>
                  </div>
                  {mission.status === 'available' && (
                    <button className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-bold group-hover:bg-[#1F7A8C] group-hover:text-white transition-colors">
                      Concluir
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
