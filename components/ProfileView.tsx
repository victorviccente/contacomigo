'use client'

import { Award, Shield, ChevronRight, LogOut, Sparkles, CreditCard, Bell, Key } from 'lucide-react'
import { User } from '@/lib/types'

interface ProfileViewProps {
  user: User
  avatarUrl?: string
  username?: string
}

export default function ProfileView({ user, avatarUrl, username }: ProfileViewProps) {
  const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`

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
              <p className="text-[10px] lg:text-xs font-bold text-gray-400 uppercase tracking-widest">Membro desde Nov 2023</p>
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
          </div>
        </div>

        <div className="bg-white rounded-[40px] p-6 lg:p-8 shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg mb-6">Conquistas Desbloqueadas</h3>
          <div className="grid grid-cols-3 gap-3 lg:gap-4">
            {user.badges.map((badge) => (
              <div key={badge.id} className={`group cursor-help relative ${!badge.unlocked ? 'opacity-20 grayscale' : ''}`}>
                <div className="aspect-square bg-[#F7F9FC] rounded-[20px] lg:rounded-[24px] flex items-center justify-center text-xl lg:text-2xl shadow-sm border border-gray-100 group-hover:scale-105 transition-transform">
                  {badge.icon}
                </div>
                <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[8px] py-1 px-2 rounded-lg whitespace-nowrap transition-opacity pointer-events-none z-10">
                  {badge.name}
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
            <h3 className="text-xl font-black">Configurações da Conta</h3>
            <button className="text-xs lg:text-sm font-bold text-[#1F7A8C] hover:underline flex items-center gap-1">
              Editar Perfil <ChevronRight size={16} />
            </button>
          </div>

          <div className="space-y-6 lg:space-y-8">
            <section className="space-y-4">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Preferências de App</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { Icon: Bell, label: 'Notificações de Streak', sub: 'Receber lembretes diários' },
                  { Icon: Shield, label: 'Privacidade Social', sub: 'Quem vê suas conquistas' },
                  { Icon: CreditCard, label: 'Categorias de Gastos', sub: 'Gerenciar tags personalizadas' },
                  { Icon: Key, label: 'Segurança & Biometria', sub: 'Acesso seguro por digital' },
                ].map((item, i) => (
                  <button key={i} className="flex items-center gap-4 p-4 lg:p-5 rounded-[24px] lg:rounded-[28px] border border-gray-100 hover:bg-[#F7F9FC] transition-all text-left group">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-[#1F7A8C]/10 text-[#1F7A8C] flex items-center justify-center group-hover:bg-[#1F7A8C] group-hover:text-white transition-colors">
                      <item.Icon size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-xs lg:text-sm text-[#0B1320]">{item.label}</p>
                      <p className="text-[10px] lg:text-xs text-gray-400 font-medium">{item.sub}</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-4 pt-4 border-t border-gray-50">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Sua Assinatura</h4>
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-[28px] lg:rounded-[32px] p-6 lg:p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4 lg:gap-5">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-white/10 rounded-2xl flex items-center justify-center text-2xl lg:text-3xl">💎</div>
                  <div>
                    <h5 className="text-base lg:text-lg font-black">Plano Mestre Vitalício</h5>
                    <p className="text-white/60 text-[10px] lg:text-sm font-medium">Todos os recursos liberados</p>
                  </div>
                </div>
                <button className="w-full md:w-auto bg-[#F4C430] text-gray-900 px-6 lg:px-8 py-3 rounded-xl lg:rounded-2xl font-black text-[10px] lg:text-sm hover:scale-105 transition-transform shadow-xl shadow-[#F4C430]/20">
                  GERENCIAR
                </button>
              </div>
            </section>

            <div className="pt-4">
              <button className="flex items-center gap-2 text-[#E63946] font-black text-xs lg:text-sm hover:bg-[#E63946]/5 px-6 py-3 rounded-xl lg:rounded-2xl transition-all">
                <LogOut size={18} />
                Encerrar Sessão
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
