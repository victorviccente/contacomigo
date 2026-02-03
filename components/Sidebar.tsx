'use client'

import { AppTab, User } from '@/lib/types'
import { Home, Target, BarChart2, Users, User as UserIcon, Sparkles, LayoutGrid } from 'lucide-react'

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
    <aside className="w-72 h-full bg-white border-r border-gray-100 flex flex-col z-50">
      {/* Brand Logo */}
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-[#1F7A8C] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#1F7A8C]/20">
          <LayoutGrid size={24} />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-[#0B1320]">ContaComigo</h1>
      </div>

      {/* User Mini Profile */}
      {avatarUrl && (
        <div className="px-4 mb-4">
          <div className="flex items-center gap-3 p-3 bg-[#F7F9FC] rounded-2xl">
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-10 h-10 rounded-xl bg-white"
            />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-[#0B1320] truncate">{user.name}</p>
              <p className="text-xs text-[#1F7A8C] truncate">{username}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {NAVIGATION_ITEMS.map(({ id, label, Icon }) => {
          const isActive = activeTab === id
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group ${
                isActive
                  ? 'bg-[#1F7A8C] text-white shadow-md shadow-[#1F7A8C]/20'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`font-semibold ${isActive ? 'text-white' : 'text-gray-600'}`}>
                {label}
              </span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></div>
              )}
            </button>
          )
        })}
      </nav>

      {/* User Progress Footer */}
      <div className="p-6 mt-auto border-t border-gray-50">
        <div className="bg-[#F7F9FC] rounded-2xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Seu Nível</span>
            <span className="text-xs font-bold text-[#F4C430] flex items-center gap-1">
              <Sparkles size={12} fill="currentColor" /> LVL {user.level}
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#F4C430] transition-all duration-500"
              style={{ width: `${(user.xp / user.xpToNextLevel) * 100}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-gray-400 text-center font-medium">
            {user.xp} / {user.xpToNextLevel} XP para subir
          </p>
        </div>
      </div>
    </aside>
  )
}
