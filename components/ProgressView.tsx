'use client'

import { useMemo } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { TrendingUp, PieChart, ChevronRight, Zap, Target, ArrowUpRight, Calendar, Trophy } from 'lucide-react'
import { useData } from '@/lib/data-context'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/lib/types'

export default function ProgressView() {
  const { transactions, user, progress, league, monthlyIncome, monthlyExpenses } = useData()

  // Calculate budget health
  const budgetHealth = useMemo(() => {
    if (monthlyIncome === 0) return 100
    const savingsRate = ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100
    return Math.max(0, Math.min(100, savingsRate + 50)) // Adjusted to 50-150 range, clamped to 0-100
  }, [monthlyIncome, monthlyExpenses])

  // Monthly data for chart
  const monthlyData = useMemo(() => {
    const months: { [key: string]: { income: number; expense: number } } = {}
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

    // Initialize last 6 months
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${date.getFullYear()}-${date.getMonth()}`
      months[key] = { income: 0, expense: 0 }
    }

    // Populate with transactions
    transactions.forEach(t => {
      const date = new Date(t.date)
      const key = `${date.getFullYear()}-${date.getMonth()}`
      if (months[key]) {
        if (t.type === 'income') {
          months[key].income += t.amount
        } else {
          months[key].expense += t.amount
        }
      }
    })

    return Object.entries(months).map(([key, data]) => {
      const [year, month] = key.split('-').map(Number)
      return {
        name: monthNames[month],
        ganhos: data.income,
        gastos: data.expense,
      }
    })
  }, [transactions])

  // Category breakdown
  const categoryBreakdown = useMemo(() => {
    const breakdown: { [key: string]: number } = {}

    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        breakdown[t.category] = (breakdown[t.category] || 0) + t.amount
      })

    return Object.entries(breakdown)
      .map(([category, amount]) => {
        const cat = EXPENSE_CATEGORIES.find(c => c.id === category) || { name: category, icon: '📦' }
        return { ...cat, amount }
      })
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)
  }, [transactions])

  // Habit health calculations
  const habitHealth = useMemo(() => {
    const now = new Date()
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()

    // Consistency: conscious days / days in month
    const consistency = Math.min(100, Math.round((progress.consciousDays / Math.min(daysInMonth, 30)) * 100))

    // Budget adherence: if spending is under control
    const budgetAdherence = monthlyIncome > 0
      ? Math.min(100, Math.round(((monthlyIncome - monthlyExpenses) / monthlyIncome + 0.5) * 100))
      : 50

    // Savings goal: assuming 20% savings is target
    const savingsGoal = monthlyIncome > 0
      ? Math.min(100, Math.round(((monthlyIncome - monthlyExpenses) / (monthlyIncome * 0.2)) * 100))
      : 0

    // Impulse control: based on transaction frequency
    const avgDailyTransactions = progress.totalTransactions / Math.max(progress.consciousDays, 1)
    const impulseControl = avgDailyTransactions <= 3 ? 100 : Math.max(0, 100 - (avgDailyTransactions - 3) * 20)

    return [
      { label: 'Consistencia Diaria', value: consistency, color: '#4CAF50' },
      { label: 'Aderencia ao Limite', value: budgetAdherence, color: '#1F7A8C' },
      { label: 'Meta de Reserva', value: savingsGoal, color: '#F4C430' },
      { label: 'Controle de Impulso', value: Math.round(impulseControl), color: '#E63946' },
    ]
  }, [progress.consciousDays, progress.totalTransactions, monthlyIncome, monthlyExpenses])

  return (
    <div className="space-y-8 animate-in">
      {/* Header Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex flex-col gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#4CAF50]/10 text-[#4CAF50]">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Saude Orcamentaria</p>
            <h4 className="text-3xl font-black text-[#0B1320] mt-1">{Math.round(budgetHealth)}%</h4>
            <p className="text-[10px] font-bold text-[#4CAF50] mt-1 flex items-center gap-1">
              {budgetHealth >= 70 ? 'Excelente!' : budgetHealth >= 40 ? 'Bom progresso' : 'Precisa de atencao'}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex flex-col gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#F4C430]/10 text-[#F4C430]">
            <Zap size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">XP Acumulado</p>
            <h4 className="text-3xl font-black text-[#0B1320] mt-1">
              {progress.totalXP >= 1000 ? `${(progress.totalXP / 1000).toFixed(1)}k` : progress.totalXP}
            </h4>
            <p className="text-[10px] font-bold text-[#F4C430] mt-1 flex items-center gap-1">
              <Trophy size={12} /> {league}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex flex-col gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#1F7A8C]/10 text-[#1F7A8C]">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Dias Conscientes</p>
            <h4 className="text-3xl font-black text-[#0B1320] mt-1">{progress.consciousDays}</h4>
            <p className="text-[10px] font-bold text-[#1F7A8C] mt-1 flex items-center gap-1">
              Maior streak: {progress.highestStreak} dias
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex flex-col gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${user.balance >= 0 ? 'bg-[#4CAF50]/10 text-[#4CAF50]' : 'bg-[#E63946]/10 text-[#E63946]'}`}>
            <ArrowUpRight size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Economia Real</p>
            <h4 className={`text-3xl font-black mt-1 ${user.balance >= 0 ? 'text-[#0B1320]' : 'text-[#E63946]'}`}>
              R$ {Math.abs(user.balance).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
            </h4>
            <p className={`text-[10px] font-bold mt-1 ${user.balance >= 0 ? 'text-[#4CAF50]' : 'text-[#E63946]'}`}>
              {user.balance >= 0 ? 'Saldo positivo' : 'Saldo negativo'}
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Spending Chart */}
        <div className="xl:col-span-2 bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-bold">Fluxo Mensal</h3>
              <p className="text-sm text-gray-400 font-medium">Ganhos vs Gastos dos ultimos 6 meses</p>
            </div>
          </div>
          <div className="h-80 w-full">
            {transactions.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorGanhos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#4CAF50" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorGastos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E63946" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#E63946" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94A3B8', fontWeight: 600}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94A3B8', fontWeight: 600}} />
                  <Tooltip
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', padding: '12px'}}
                    formatter={(value: number) => [`R$ ${value.toFixed(2)}`, '']}
                  />
                  <Area type="monotone" dataKey="ganhos" stroke="#4CAF50" strokeWidth={3} fillOpacity={1} fill="url(#colorGanhos)" name="Ganhos" />
                  <Area type="monotone" dataKey="gastos" stroke="#E63946" strokeWidth={3} fillOpacity={1} fill="url(#colorGastos)" name="Gastos" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <TrendingUp size={32} className="text-gray-300" />
                  </div>
                  <p className="text-gray-400 font-medium">Sem dados ainda</p>
                  <p className="text-xs text-gray-300 mt-1">Adicione transacoes para ver o grafico</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Categories / Habit Health */}
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 space-y-8">
          <h3 className="text-xl font-bold">Saude dos Habitos</h3>
          <div className="space-y-6">
            {habitHealth.map((item, i) => (
              <div key={i} className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-700">{item.label}</span>
                  <span className="text-sm font-black text-[#0B1320]">{item.value}%</span>
                </div>
                <div className="w-full h-3 bg-gray-50 rounded-full overflow-hidden p-0.5 border border-gray-100">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${item.value}%`, backgroundColor: item.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Category Breakdown */}
          {categoryBreakdown.length > 0 && (
            <div className="pt-6 border-t border-gray-50">
              <h4 className="text-sm font-bold text-gray-700 mb-4">Top Categorias de Gastos</h4>
              <div className="space-y-3">
                {categoryBreakdown.map((cat, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xl">{cat.icon}</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-600">{cat.name}</span>
                        <span className="text-xs font-black text-[#E63946]">
                          R$ {cat.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="bg-gradient-to-r from-[#1F7A8C] to-[#4CAF50] rounded-[40px] p-8 text-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-2">Total Transacoes</p>
            <p className="text-3xl font-black">{progress.totalTransactions}</p>
          </div>
          <div className="text-center">
            <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-2">Missoes Completas</p>
            <p className="text-3xl font-black">{progress.completedMissions}</p>
          </div>
          <div className="text-center">
            <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-2">Nivel Atual</p>
            <p className="text-3xl font-black">{user.level}</p>
          </div>
          <div className="text-center">
            <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-2">Badges</p>
            <p className="text-3xl font-black">{user.badges.filter(b => b.unlocked).length}/{user.badges.length}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
