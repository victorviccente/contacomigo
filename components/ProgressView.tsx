'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, PieChart, ChevronRight, Zap, Target, ArrowUpRight } from 'lucide-react'

const monthlyData = [
  { name: 'Jan', valor: 2400 }, { name: 'Fev', valor: 1398 }, { name: 'Mar', valor: 9800 },
  { name: 'Abr', valor: 3908 }, { name: 'Mai', valor: 4800 }, { name: 'Jun', valor: 3800 },
]

export default function ProgressView() {
  return (
    <div className="space-y-8 animate-in">
      {/* Header Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Saúde Orçamentária', value: '85%', sub: '+2% este mês', Icon: TrendingUp, color: '#4CAF50' },
          { label: 'XP Acumulado', value: '14.2k', sub: 'Ranking #12', Icon: Zap, color: '#F4C430' },
          { label: 'Dias Conscientes', value: '24/30', sub: 'Meta: 25 dias', Icon: Target, color: '#1F7A8C' },
          { label: 'Economia Real', value: 'R$ 840', sub: 'Saldo positivo', Icon: ArrowUpRight, color: '#4CAF50' },
        ].map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex flex-col gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${card.color}15`, color: card.color }}>
              <card.Icon size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{card.label}</p>
              <h4 className="text-3xl font-black text-[#0B1320] mt-1">{card.value}</h4>
              <p className="text-[10px] font-bold text-[#4CAF50] mt-1 flex items-center gap-1">
                {card.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Spending Chart */}
        <div className="xl:col-span-2 bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-bold">Fluxo de Gastos</h3>
              <p className="text-sm text-gray-400 font-medium">Visualização detalhada do seu comportamento financeiro</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-[#F7F9FC] text-[#1F7A8C] text-xs font-bold rounded-xl border border-gray-100">Semanal</button>
              <button className="px-4 py-2 bg-white text-gray-400 text-xs font-bold rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">Mensal</button>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1F7A8C" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#1F7A8C" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94A3B8', fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94A3B8', fontWeight: 600}} />
                <Tooltip
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', padding: '12px'}}
                />
                <Area type="monotone" dataKey="valor" stroke="#1F7A8C" strokeWidth={4} fillOpacity={1} fill="url(#colorVal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories / Habit Health */}
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 space-y-8">
          <h3 className="text-xl font-bold">Saúde dos Hábitos</h3>
          <div className="space-y-6">
            {[
              { label: 'Consistência Diária', value: 92, color: '#4CAF50' },
              { label: 'Aderência ao Limite', value: 78, color: '#1F7A8C' },
              { label: 'Meta de Reserva', value: 45, color: '#F4C430' },
              { label: 'Controle de Impulso', value: 60, color: '#E63946' },
            ].map((item, i) => (
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

          <div className="pt-6 border-t border-gray-50">
            <div className="bg-[#F7F9FC] p-4 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <PieChart className="text-[#1F7A8C]" size={20} />
                </div>
                <span className="text-sm font-bold text-gray-700">Explorar Categorias</span>
              </div>
              <ChevronRight size={18} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
