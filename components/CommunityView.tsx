'use client'

import { CommunityPost } from '@/lib/types'
import { Heart, MessageCircle, Award, Zap, Flame, Users, TrendingUp, Star } from 'lucide-react'
import { useData } from '@/lib/data-context'

interface CommunityViewProps {
  posts: CommunityPost[]
  onLike: (id: string) => void
}

export default function CommunityView({ posts, onLike }: CommunityViewProps) {
  const { user, progress, league } = useData()

  // Get time ago string
  const getTimeAgo = (timestamp: string) => {
    if (timestamp === 'Agora') return timestamp

    // For mock posts, return as is
    if (timestamp.includes('atrás')) return timestamp

    // For real timestamps
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()

    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Agora'
    if (minutes < 60) return `${minutes}m atras`
    if (hours < 24) return `${hours}h atras`
    return `${days}d atras`
  }

  // User's ranking based on XP (simulated)
  const userRanking = Math.max(1, Math.min(100, 100 - Math.floor(progress.totalXP / 100)))

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 animate-in">
      {/* Left Column: Feed */}
      <div className="xl:col-span-8 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl lg:text-2xl font-bold">Feed Global</h2>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-[#1F7A8C] text-white text-[10px] lg:text-xs font-bold rounded-xl shadow-md">Populares</button>
            <button className="px-4 py-2 bg-white text-gray-400 text-[10px] lg:text-xs font-bold rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">Recentes</button>
          </div>
        </div>

        <div className="space-y-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className={`bg-white rounded-[32px] p-6 lg:p-8 shadow-sm border transition-shadow group ${post.isUserPost ? 'border-[#1F7A8C]/30 ring-2 ring-[#1F7A8C]/10' : 'border-gray-100 hover:shadow-md'
                }`}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-2xl flex items-center justify-center text-lg lg:text-xl font-bold shadow-inner ${post.isUserPost ? 'bg-[#1F7A8C]/10 text-[#1F7A8C]' : 'bg-[#F7F9FC] text-[#1F7A8C]'
                  }`}>
                  {post.userName[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-base lg:text-lg text-[#0B1320]">{post.userName}</h4>
                    {post.isUserPost && (
                      <span className="bg-[#1F7A8C]/10 text-[#1F7A8C] text-[8px] font-black px-2 py-0.5 rounded-full">VOCE</span>
                    )}
                  </div>
                  <p className="text-[10px] lg:text-xs text-gray-400 font-bold uppercase tracking-wider">{getTimeAgo(post.timestamp)}</p>
                </div>
                <div className="ml-auto">
                  <div className={`p-2 lg:p-2.5 rounded-xl transition-transform group-hover:scale-110 ${post.reactionType === 'fire' ? 'bg-[#E63946]/10 text-[#E63946]' :
                      post.reactionType === 'heart' ? 'bg-[#E63946]/10 text-[#E63946]' :
                        'bg-[#F4C430]/10 text-[#F4C430]'
                    }`}>
                    {post.reactionType === 'fire' ? <Flame size={20} className="lg:w-6 lg:h-6" fill="currentColor" /> :
                      post.reactionType === 'heart' ? <Heart size={20} className="lg:w-6 lg:h-6" fill="currentColor" /> :
                        <Award size={20} className="lg:w-6 lg:h-6" />}
                  </div>
                </div>
              </div>

              <div className={`p-5 lg:p-6 rounded-2xl mb-6 border ${post.isUserPost ? 'bg-[#1F7A8C]/5 border-[#1F7A8C]/10' : 'bg-[#F7F9FC] border-gray-50'
                }`}>
                <p className="text-[#0B1320] text-base lg:text-lg leading-relaxed font-medium">
                  <span className={`font-black ${post.isUserPost ? 'text-[#1F7A8C]' : 'text-[#1F7A8C]'}`}>{post.userName}</span> {post.action}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <div className="flex items-center gap-4 lg:gap-6">
                  <button
                    onClick={() => onLike(post.id)}
                    className="flex items-center gap-2 text-xs lg:text-sm font-bold text-gray-400 hover:text-[#E63946] transition-colors"
                  >
                    <Heart size={20} className="text-[#E63946]" fill="currentColor" />
                    {post.likes} Reacoes
                  </button>
                  <button className="flex items-center gap-2 text-xs lg:text-sm font-bold text-gray-400 hover:text-[#1F7A8C] transition-colors">
                    <MessageCircle size={20} />
                    <span className="hidden sm:inline">Comentar</span>
                  </button>
                </div>
                <button className="flex items-center gap-2 text-[10px] lg:text-sm font-black text-[#1F7A8C] hover:bg-[#1F7A8C]/5 px-4 py-2 rounded-xl transition-all">
                  <Zap size={18} />
                  INCENTIVAR
                </button>
              </div>
            </div>
          ))}

          {posts.length === 0 && (
            <div className="bg-white rounded-[32px] p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users size={32} className="text-gray-300" />
              </div>
              <p className="text-gray-400 font-medium">Nenhuma atividade ainda</p>
              <p className="text-xs text-gray-300 mt-1">Registre transacoes para ver suas conquistas aqui</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Sidebar SaaS Content */}
      <div className="xl:col-span-4 space-y-8">
        {/* User Stats Widget */}
        <div className="bg-white rounded-[40px] p-6 lg:p-8 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-[#1F7A8C]/10 flex items-center justify-center text-xl font-bold text-[#1F7A8C]">
              {user.name[0]}
            </div>
            <div>
              <h4 className="font-bold text-lg text-[#0B1320]">{user.name}</h4>
              <p className="text-xs text-[#1F7A8C] font-bold">{league}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#F7F9FC] p-4 rounded-2xl text-center">
              <p className="text-2xl font-black text-[#1F7A8C]">#{userRanking}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Ranking</p>
            </div>
            <div className="bg-[#F7F9FC] p-4 rounded-2xl text-center">
              <p className="text-2xl font-black text-[#E63946]">{user.streak}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Streak</p>
            </div>
          </div>
        </div>

        {/* Challenge Widget */}
        <div className="bg-gradient-to-br from-[#1F7A8C] to-[#4CAF50] rounded-[40px] p-6 lg:p-8 text-white shadow-xl shadow-[#1F7A8C]/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-2">
              <Flame size={20} fill="currentColor" className="text-[#F4C430]" />
              <span className="text-[10px] font-black tracking-widest uppercase">Desafio Ativo</span>
            </div>
            <div>
              <h2 className="text-xl lg:text-2xl font-black leading-tight">Sem Delivery por 7 Dias</h2>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => <div key={i} className="w-5 h-5 rounded-full border-2 border-[#1F7A8C] bg-gray-200"></div>)}
                </div>
                <span className="text-[10px] font-bold text-white/80">+1.2k participando</span>
              </div>
            </div>
            <button className="w-full bg-white text-[#1F7A8C] py-4 rounded-2xl font-black text-sm shadow-xl hover:scale-105 transition-transform active:scale-95 uppercase tracking-widest">
              Aceitar Desafio
            </button>
          </div>
        </div>

        {/* Trending Categories */}
        <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 hidden xl:block">
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-[#1F7A8C]" />
            Em Destaque
          </h3>
          <div className="space-y-4">
            {[
              { label: '#ReservaDeEmergencia', users: '2.4k' },
              { label: '#InvestindoDoZero', users: '1.8k' },
              { label: '#MinhaPrimeiraAcao', users: '950' },
              { label: '#SemGastosExtras', users: '3.1k' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-2xl hover:bg-[#F7F9FC] transition-colors cursor-pointer group">
                <span className="text-sm font-bold text-[#1F7A8C] group-hover:underline">{item.label}</span>
                <span className="text-[10px] font-bold text-gray-400">{item.users} posts</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Contributors */}
        <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 hidden xl:block">
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
            <Users size={20} className="text-[#1F7A8C]" />
            Mestres da Semana
          </h3>
          <div className="space-y-5">
            {[
              { name: 'Ana Silva', level: 42, icon: '🌟' },
              { name: 'Marcos P.', level: 38, icon: '🔥' },
              { name: 'Clara G.', level: 35, icon: '💎' },
            ].map((topUser, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#F7F9FC] flex items-center justify-center text-lg">{topUser.icon}</div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-[#0B1320]">{topUser.name}</h4>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">LVL {topUser.level}</p>
                </div>
                <div className={`text-xs font-black ${i === 0 ? 'text-[#F4C430]' : 'text-gray-300'}`}>#{i + 1}</div>
              </div>
            ))}

            {/* Show user's position if they have XP */}
            {progress.totalXP > 0 && (
              <>
                <div className="border-t border-gray-100 pt-4 mt-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#1F7A8C]/10 flex items-center justify-center text-lg font-bold text-[#1F7A8C]">
                      {user.name[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-[#0B1320]">{user.name}</h4>
                        <span className="bg-[#1F7A8C]/10 text-[#1F7A8C] text-[8px] font-black px-1.5 py-0.5 rounded">VOCE</span>
                      </div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">LVL {user.level}</p>
                    </div>
                    <div className="text-xs font-black text-[#1F7A8C]">#{userRanking}</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
