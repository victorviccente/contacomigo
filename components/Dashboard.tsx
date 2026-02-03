'use client'

import { useState, useEffect } from 'react'
import { Flame, Target, ChevronRight, TrendingUp, TrendingDown, Wallet, Check, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { User, Mission, EXPENSE_CATEGORIES } from '@/lib/types'
import { useData } from '@/lib/data-context'

interface DashboardProps {
  user: User
  missions: Mission[]
  onCompleteMission: (id: string) => void
}

export default function Dashboard({ user, missions, onCompleteMission }: DashboardProps) {
  const { transactions, weeklyExpenses, monthlyIncome, monthlyExpenses } = useData()
  const [tip, setTip] = useState("Carregando sua dose de inspiracao...")

  useEffect(() => {
    const fetchTip = async () => {
      try {
        const res = await fetch('/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            context: `O usuario ${user.name} esta com saldo de R$ ${user.balance.toFixed(2)}, nivel ${user.level}, gastou R$ ${monthlyExpenses.toFixed(2)} este mes e ganhou R$ ${monthlyIncome.toFixed(2)}`
          })
        })
        const data = await res.json()
        setTip(data.tip)
      } catch {
        setTip('Voce esta fazendo um otimo trabalho. Mantenha o foco!')
      }
    }
    fetchTip()
  }, [user.level, user.name, user.balance, monthlyExpenses, monthlyIncome])

  const dailyMissions = missions.filter(m => m.type === 'daily')

  // Calculate max for chart scaling
  const maxWeeklyExpense = Math.max(...weeklyExpenses.map(w => w.amount), 100)

  // Recent transactions
  const recentTransactions = transactions.slice(0, 5)

  // Get category name and icon
  const getCategoryInfo = (categoryId: string) => {
    const category = EXPENSE_CATEGORIES.find(c => c.id === categoryId)
    return category || { name: categoryId, icon: '📦' }
  }

  // Monthly savings
  const monthlySavings = monthlyIncome - monthlyExpenses
  const savingsPercentage = monthlyIncome > 0 ? ((monthlySavings / monthlyIncome) * 100).toFixed(0) : 0

  return (
    <div className="space-y-10 animate-in">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-[#0B1320] tracking-tight">
            Ola, {user.name} <span className="inline-block animate-bounce-subtle">👋</span>
          </h1>
          <p className="text-gray-500 font-medium">Seu progresso financeiro esta excelente hoje.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white p-4 pr-10 rounded-[28px] shadow-sm border border-gray-100 flex items-center gap-4 transition-all hover:shadow-md">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${user.balance >= 0 ? 'bg-[#4CAF50]/10 text-[#4CAF50]' : 'bg-[#E63946]/10 text-[#E63946]'}`}>
              <Wallet size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">Saldo Total</p>
              <p className={`text-xl font-black ${user.balance >= 0 ? 'text-[#0B1320]' : 'text-[#E63946]'}`}>
                R$ <span className="tabular-nums">{user.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Monthly Income */}
        <div className="bg-white rounded-[28px] p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-[#4CAF50]/10 rounded-xl">
              <ArrowUpRight size={20} className="text-[#4CAF50]" />
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase">Este Mes</span>
          </div>
          <p className="text-2xl font-black text-[#0B1320]">
            R$ {monthlyIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-[#4CAF50] font-bold mt-1">Ganhos</p>
        </div>

        {/* Monthly Expenses */}
        <div className="bg-white rounded-[28px] p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-[#E63946]/10 rounded-xl">
              <ArrowDownRight size={20} className="text-[#E63946]" />
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase">Este Mes</span>
          </div>
          <p className="text-2xl font-black text-[#0B1320]">
            R$ {monthlyExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-[#E63946] font-bold mt-1">Gastos</p>
        </div>

        {/* Savings */}
        <div className="bg-white rounded-[28px] p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2.5 rounded-xl ${monthlySavings >= 0 ? 'bg-[#1F7A8C]/10' : 'bg-[#E63946]/10'}`}>
              <TrendingUp size={20} className={monthlySavings >= 0 ? 'text-[#1F7A8C]' : 'text-[#E63946]'} />
            </div>
            <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${monthlySavings >= 0 ? 'bg-[#4CAF50]/10 text-[#4CAF50]' : 'bg-[#E63946]/10 text-[#E63946]'}`}>
              {savingsPercentage}%
            </span>
          </div>
          <p className={`text-2xl font-black ${monthlySavings >= 0 ? 'text-[#0B1320]' : 'text-[#E63946]'}`}>
            R$ {Math.abs(monthlySavings).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className={`text-xs font-bold mt-1 ${monthlySavings >= 0 ? 'text-[#1F7A8C]' : 'text-[#E63946]'}`}>
            {monthlySavings >= 0 ? 'Economia' : 'Deficit'}
          </p>
        </div>

        {/* Streak Card */}
        <div className="bg-white rounded-[28px] p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-[#E63946]/10 rounded-xl group-hover:bg-[#E63946]/20 transition-colors">
              <Flame size={20} className="text-[#E63946]" fill="currentColor" />
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase">Streak</span>
          </div>
          <p className="text-2xl font-black text-[#E63946]">{user.streak} Dias</p>
          <p className="text-xs text-gray-400 font-bold mt-1">Sequencia ativa</p>
        </div>
      </div>

      {/* AI Insight Card */}
      <div className="bg-gradient-to-br from-[#1F7A8C] to-[#134D59] rounded-[40px] p-8 text-white shadow-2xl shadow-[#1F7A8C]/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -mr-40 -mt-40 blur-3xl transition-opacity group-hover:opacity-75"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full -ml-20 -mb-20 blur-2xl"></div>

        <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-start">
          <div className="bg-white/20 p-5 rounded-3xl backdrop-blur-xl shrink-0 shadow-lg border border-white/10">
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 pb-10">
        {/* Left Column: Weekly Chart */}
        <div className="xl:col-span-8 space-y-6">
          <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex justify-between items-center mb-10">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-[#0B1320]">Resumo Semanal</h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Ultimos 7 dias</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold">
                <span className="bg-[#E63946]/10 text-[#E63946] px-3 py-2 rounded-xl">
                  R$ {weeklyExpenses.reduce((sum, w) => sum + w.amount, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-gray-400">total</span>
              </div>
            </div>
            <div className="h-64 flex items-end justify-between gap-3 sm:gap-6 px-2">
              {weeklyExpenses.map((day, i) => {
                const heightPercent = maxWeeklyExpense > 0 ? (day.amount / maxWeeklyExpense) * 100 : 0
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                    <div className="w-full bg-gray-50 rounded-2xl relative overflow-hidden group-hover:bg-gray-100 transition-all h-full">
                      <div
                        className="absolute bottom-0 w-full bg-gradient-to-t from-[#E63946] to-[#ff6b6b] rounded-2xl transition-all duration-1000 ease-out shadow-lg"
                        style={{ height: `${Math.max(heightPercent, 2)}%` }}
                      >
                        {day.amount > 0 && (
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-600 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                            R$ {day.amount.toFixed(0)}
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="text-[10px] sm:text-xs font-black text-gray-400 group-hover:text-[#E63946] transition-colors">
                      {day.day}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Recent Transactions */}
          {recentTransactions.length > 0 && (
            <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-[#0B1320]">Transacoes Recentes</h3>
              </div>
              <div className="space-y-3">
                {recentTransactions.map((transaction) => {
                  const catInfo = getCategoryInfo(transaction.category)
                  return (
                    <div key={transaction.id} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${transaction.type === 'expense' ? 'bg-[#E63946]/10' : 'bg-[#4CAF50]/10'}`}>
                        {catInfo.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[#0B1320] truncate">{transaction.description}</p>
                        <p className="text-xs text-gray-400">{catInfo.name} • {new Date(transaction.date).toLocaleDateString('pt-BR')}</p>
                      </div>
                      <p className={`font-black ${transaction.type === 'expense' ? 'text-[#E63946]' : 'text-[#4CAF50]'}`}>
                        {transaction.type === 'expense' ? '-' : '+'}R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Missions & Tasks */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-[#0B1320]">Missoes Diarias</h3>
              <span className="text-xs font-bold text-gray-400">
                {dailyMissions.filter(m => m.status === 'completed').length}/{dailyMissions.length}
              </span>
            </div>

            <div className="space-y-4">
              {dailyMissions.map((mission) => (
                <button
                  key={mission.id}
                  onClick={() => mission.status === 'available' && onCompleteMission(mission.id)}
                  className={`w-full p-4 rounded-2xl border transition-all flex items-center gap-4 group text-left ${mission.status === 'completed'
                      ? 'bg-[#4CAF50]/5 border-[#4CAF50]/20'
                      : 'bg-white border-gray-100 hover:border-[#1F7A8C]/30 hover:shadow-lg'
                    }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${mission.status === 'completed'
                      ? 'bg-[#4CAF50] text-white'
                      : 'bg-[#1F7A8C]/10 text-[#1F7A8C] group-hover:scale-105'
                    }`}>
                    {mission.status === 'completed' ? <Check size={20} strokeWidth={3} /> : <Target size={20} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-bold text-sm ${mission.status === 'completed' ? 'text-[#4CAF50]' : 'text-[#0B1320]'}`}>{mission.title}</h4>
                    <span className="text-[10px] font-bold text-[#1F7A8C] bg-[#1F7A8C]/5 px-2 py-0.5 rounded-lg mt-1 inline-block">+{mission.xp} XP</span>
                  </div>
                  {mission.status === 'available' && (
                    <ChevronRight size={18} className="text-gray-300 group-hover:text-[#1F7A8C] transition-colors" />
                  )}
                </button>
              ))}
            </div>

            {/* XP Progress */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-gray-400 uppercase">Progresso XP</span>
                <span className="text-xs font-black text-[#1F7A8C]">{user.xp}/{user.xpToNextLevel}</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#1F7A8C] to-[#4CAF50] rounded-full transition-all duration-500"
                  style={{ width: `${(user.xp / user.xpToNextLevel) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">Level {user.level} • {user.xpToNextLevel - user.xp} XP para o proximo nivel</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
