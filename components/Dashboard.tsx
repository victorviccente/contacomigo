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
    <div className="space-y-10 animate-in">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-[#0B1320] tracking-tight">
            Olá, {user.name} <span className="inline-block animate-bounce-subtle">👋</span>
          </h1>
          <p className="text-gray-500 font-medium">Seu progresso financeiro está excelente hoje.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white p-4 pr-10 rounded-[28px] shadow-sm border border-gray-100 flex items-center gap-4 transition-all hover:shadow-md">
            <div className="w-12 h-12 bg-[#4CAF50]/10 text-[#4CAF50] rounded-2xl flex items-center justify-center shadow-inner">
              <Wallet size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">Saldo Total</p>
              <p className="text-xl font-black text-[#0B1320]">
                R$ <span className="tabular-nums">{user.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Streak Card */}
        <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 flex items-center justify-between group hover:border-[#E63946]/30 transition-all cursor-default">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-[#E63946] font-black text-2xl">
              <div className="p-2 bg-[#E63946]/10 rounded-xl group-hover:bg-[#E63946]/20 transition-colors">
                <Flame size={28} fill="currentColor" className="group-hover:scale-110 transition-transform" />
              </div>
              <span>{user.streak} Dias</span>
            </div>
            <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-[180px]">
              Você está sendo consistente!<br />Continue registrando seus gastos.
            </p>
          </div>
          <div className="h-24 w-24 relative flex-shrink-0">
            <svg className="h-full w-full -rotate-90">
              <circle cx="48" cy="48" r="40" fill="transparent" stroke="#F1F5F9" strokeWidth="10" />
              <circle
                cx="48" cy="48" r="40" fill="transparent" stroke="#E63946" strokeWidth="10"
                strokeDasharray={2 * Math.PI * 40}
                strokeDashoffset={2 * Math.PI * 40 * (1 - (user.streak / 30))}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-sm font-black text-[#0B1320]">
              {Math.min(100, Math.round((user.streak / 30) * 100))}%
            </div>
          </div>
        </div>

        {/* AI Insight Card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-[#1F7A8C] to-[#134D59] rounded-[40px] p-8 text-white shadow-2xl shadow-[#1F7A8C]/30 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -mr-40 -mt-40 blur-3xl transition-opacity group-hover:opacity-75"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full -ml-20 -mb-20 blur-2xl"></div>

          <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-start">
            <div className="bg-white/20 p-5 rounded-3xl backdrop-blur-xl shrink-0 shadow-lg border border-white/10 group-hover:scale-105 transition-transform">
              <Target size={32} />
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h3 className="font-black text-lg tracking-tight uppercase tracking-widest">Dica do Mentor</h3>
                <span className="bg-[#F4C430] text-[#0B1320] text-[9px] font-black px-3 py-1 rounded-full uppercase">Gemini 2.5 Flash</span>
              </div>
              <p className="text-white/95 text-xl font-semibold leading-relaxed">
                &ldquo;{tip}&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 pb-10">
        {/* Left Column: Progress Quick View */}
        <div className="xl:col-span-8 space-y-6">
          <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 overflow-hidden h-full">
            <div className="flex justify-between items-center mb-10">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-[#0B1320]">Resumo Semanal</h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Últimos 7 dias</p>
              </div>
              <div className="flex items-center gap-2 text-[#4CAF50] bg-[#4CAF50]/10 px-4 py-2 rounded-2xl text-xs font-black">
                <TrendingUp size={16} />
                +12% vs anterior
              </div>
            </div>
            <div className="h-64 flex items-end justify-between gap-3 sm:gap-6 px-2">
              {[40, 70, 45, 90, 65, 30, 50].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                  <div
                    className="w-full bg-gray-50 rounded-2xl relative overflow-hidden group-hover:bg-gray-100 transition-all h-full"
                  >
                    <div
                      className="absolute bottom-0 w-full bg-gradient-to-t from-[#1F7A8C] to-[#34A0B5] rounded-2xl transition-all duration-1000 ease-out shadow-lg"
                      style={{ height: `${h}%` }}
                    >
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  </div>
                  <span className="text-[10px] sm:text-xs font-black text-gray-400 group-hover:text-[#1F7A8C] transition-colors">
                    {['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Missions & Tasks */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 h-full">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-[#0B1320]">Missões</h3>
              <button className="text-[#1F7A8C] text-sm font-black flex items-center gap-1 hover:gap-2 transition-all group">
                Ver todas <ChevronRight size={18} className="transition-transform" />
              </button>
            </div>

            <div className="space-y-5">
              {dailyMissions.map((mission) => (
                <button
                  key={mission.id}
                  onClick={() => mission.status === 'available' && onCompleteMission(mission.id)}
                  className={`w-full p-5 rounded-3xl border transition-all flex items-center gap-4 group text-left ${mission.status === 'completed'
                      ? 'bg-gray-50/50 border-gray-100 opacity-60'
                      : 'bg-white border-gray-100 hover:border-[#1F7A8C]/30 hover:shadow-xl hover:shadow-[#1F7A8C]/5'
                    }`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${mission.status === 'completed'
                      ? 'bg-[#4CAF50]/10 text-[#4CAF50]'
                      : 'bg-[#1F7A8C]/10 text-[#1F7A8C] group-hover:scale-110 group-hover:rotate-3'
                    }`}>
                    {mission.status === 'completed' ? <Check size={24} strokeWidth={3} /> : <Target size={24} strokeWidth={2.5} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-base text-[#0B1320] truncate">{mission.title}</h4>
                    <span className="text-xs font-black text-[#1F7A8C] bg-[#1F7A8C]/5 px-2 py-0.5 rounded-lg mt-1 inline-block">+{mission.xp} XP</span>
                  </div>
                  {mission.status === 'available' && (
                    <div className="bg-gray-100 text-gray-400 p-2 rounded-xl group-hover:bg-[#1F7A8C] group-hover:text-white transition-all">
                      <ChevronRight size={20} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
