'use client'

import { AppTab, User } from '@/lib/types'
import { Home, Target, BarChart2, Users, User as UserIcon, Sparkles, LayoutGrid, X } from 'lucide-react'

interface SidebarProps {
  activeTab: AppTab
  setActiveTab: (tab: AppTab) => void
  user: User
  avatarUrl?: string
  username?: string
}

const NAVIGATION_ITEMS = [
  { id: AppTab.HOME, label: 'Início', Icon: Home },
  { id: AppTab.MISSIONS, label: 'Missões', Icon: Target },
  { id: AppTab.PROGRESS, label: 'Progresso', Icon: BarChart2 },
  { id: AppTab.COMMUNITY, label: 'Comunidade', Icon: Users },
  { id: AppTab.PROFILE, label: 'Perfil', Icon: UserIcon },
]

export default function Sidebar({ activeTab, setActiveTab, user, avatarUrl, username }: SidebarProps) {
  return (
    <aside className="w-full h-full bg-white flex flex-col relative">
      {/* Brand Logo */}
      <div className="p-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#1F7A8C] to-[#186170] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#1F7A8C]/20">
            <LayoutGrid size={22} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#0B1320]">ContaComigo</h1>
        </div>
      </div>

      {/* User Mini Profile */}
      {avatarUrl && (
        <div className="px-6 mb-8">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-[24px] border border-gray-100/50">
            <div className="relative">
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-12 h-12 rounded-2xl bg-white shadow-sm"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#4CAF50] rounded-lg border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">
                {user.level}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-[#0B1320] truncate">{user.name}</p>
              <p className="text-xs text-[#1F7A8C] font-semibold truncate">@{username?.replace('@', '')}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1.5">
        {NAVIGATION_ITEMS.map(({ id, label, Icon }) => {
          const isActive = activeTab === id
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-[20px] transition-all duration-300 group ${isActive
                ? 'bg-[#1F7A8C] text-white shadow-xl shadow-[#1F7A8C]/20 translate-x-1'
                : 'text-gray-400 hover:text-[#0B1320] hover:bg-gray-50'
                }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span className={`font-bold text-sm ${isActive ? 'text-white' : ''}`}>
                {label}
              </span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
              )}
            </button>
          )
        })}
      </nav>

      {/* User Progress Footer */}
      <div className="p-6 mt-auto border-t border-gray-50 bg-gray-50/30">
        <div className="bg-white rounded-[24px] p-5 space-y-4 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nível Atual</span>
            <span className="text-xs font-bold text-[#F4C430] bg-[#F4C430]/10 px-2 py-1 rounded-lg flex items-center gap-1.5">
              <Sparkles size={12} fill="currentColor" /> {user.level}
            </span>
          </div>
          <div className="space-y-2">
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#F4C430] to-[#FFD700] transition-all duration-1000 ease-out rounded-full shadow-[0_0_10px_rgba(244,196,48,0.3)]"
                style={{ width: `${(user.xp / user.xpToNextLevel) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center text-[10px] font-bold">
              <span className="text-gray-400">{user.xp} XP</span>
              <span className="text-[#1F7A8C]">{user.xpToNextLevel} XP</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

