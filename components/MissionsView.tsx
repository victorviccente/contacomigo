'use client'

import { Target, CheckCircle2, Lock, Award, Trophy } from 'lucide-react'
import { Mission } from '@/lib/types'
import { useData } from '@/lib/data-context'

interface MissionsViewProps {
  missions: Mission[]
  onCompleteMission: (id: string) => void
}

export default function MissionsView({ missions, onCompleteMission }: MissionsViewProps) {
  const { league, progress } = useData()

  const pathMissions = missions.filter(m => m.type === 'path')
  const completedPathMissions = pathMissions.filter(m => m.status === 'completed').length
  const remainingPathMissions = pathMissions.length - completedPathMissions

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in">
      {/* SaaS Style Header */}
      <div className="bg-white rounded-[32px] p-6 lg:p-10 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="space-y-2 text-center md:text-left">
          <h1 className="text-2xl lg:text-3xl font-bold">Trilha de Evolucao</h1>
          <p className="text-gray-500 font-medium max-w-md">Complete os modulos para desbloquear novos patamares da sua liberdade financeira.</p>
        </div>

        <div className="flex items-center gap-4 lg:gap-6">
          <div className="text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-widest">Sua Liga</p>
            <div className="bg-[#F7F9FC] p-3 lg:p-4 rounded-2xl border border-gray-100 flex flex-col items-center gap-1 shadow-inner min-w-[100px] lg:min-w-[120px]">
              <Trophy size={20} className="text-[#F4C430]" fill="currentColor" />
              <span className="text-xs lg:text-sm font-black text-[#0B1320]">{league}</span>
            </div>
          </div>
          <div className="w-px h-12 lg:h-16 bg-gray-100"></div>
          <div className="text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-widest">Modulos</p>
            <div className="bg-[#F7F9FC] p-3 lg:p-4 rounded-2xl border border-gray-100 flex flex-col items-center gap-1 shadow-inner min-w-[100px] lg:min-w-[120px]">
              <span className="text-xl lg:text-2xl font-black text-[#1F7A8C]">{String(remainingPathMissions).padStart(2, '0')}</span>
              <span className="text-[10px] font-bold text-gray-400">RESTANTES</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-bold text-gray-600">Progresso da Trilha</span>
          <span className="text-sm font-black text-[#1F7A8C]">{completedPathMissions}/{pathMissions.length}</span>
        </div>
        <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#1F7A8C] to-[#4CAF50] rounded-full transition-all duration-1000"
            style={{ width: `${pathMissions.length > 0 ? (completedPathMissions / pathMissions.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Path Layout adapted for desktop */}
      <div className="relative py-12 flex flex-col items-center overflow-x-hidden lg:overflow-visible">
        {/* Background Decorative Path Line */}
        <div className="absolute top-0 bottom-0 w-2 lg:w-3 bg-gray-100 left-1/2 -translate-x-1/2 rounded-full -z-10">
          <div
            className="w-full bg-gradient-to-b from-[#4CAF50] to-[#1F7A8C] rounded-full transition-all duration-1000"
            style={{ height: `${pathMissions.length > 0 ? (completedPathMissions / pathMissions.length) * 100 : 0}%` }}
          />
        </div>

        <div className="w-full space-y-16 lg:space-y-24">
          {pathMissions.map((mission, index) => {
            const isCompleted = mission.status === 'completed'
            const isLocked = mission.status === 'locked'
            const isCurrent = mission.status === 'available'

            const isLeft = index % 2 === 0

            return (
              <div key={mission.id} className={`flex items-center gap-4 lg:gap-12 w-full ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
                {/* Content Side */}
                <div className={`flex-1 ${isLeft ? 'text-right' : 'text-left'} space-y-1 lg:space-y-2`}>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase ${isCompleted ? 'bg-[#4CAF50]/10 text-[#4CAF50]' :
                      isCurrent ? 'bg-[#1F7A8C]/10 text-[#1F7A8C]' : 'bg-gray-100 text-gray-400'
                    }`}>
                    Modulo {index + 1} • {mission.xp} XP
                  </div>
                  <h3 className="text-base lg:text-xl font-bold truncate">{mission.title}</h3>
                  <p className="text-gray-500 text-[10px] lg:text-sm max-w-[150px] lg:max-w-sm hidden sm:block" style={{ marginLeft: isLeft ? 'auto' : 0, marginRight: isLeft ? 0 : 'auto' }}>
                    {mission.description}
                  </p>
                </div>

                {/* Node Side */}
                <div className="relative shrink-0">
                  <button
                    onClick={() => isCurrent && onCompleteMission(mission.id)}
                    disabled={!isCurrent}
                    className={`w-20 h-20 lg:w-28 lg:h-28 rounded-[32px] lg:rounded-[40px] flex items-center justify-center shadow-xl border-b-[8px] lg:border-b-[10px] transition-all relative z-10 ${isCompleted ? 'bg-[#4CAF50] border-[#388E3C] text-white' :
                        isCurrent ? 'bg-[#1F7A8C] border-[#14515d] text-white ring-4 lg:ring-8 ring-[#1F7A8C]/10 hover:scale-105 active:translate-y-1 active:border-b-0 cursor-pointer' :
                          'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed'
                      }`}
                  >
                    {isCompleted ? <CheckCircle2 size={32} /> : isLocked ? <Lock size={32} /> : <Target size={32} />}
                  </button>

                  {isCurrent && (
                    <div className={`absolute top-1/2 -translate-y-1/2 whitespace-nowrap px-4 py-2 bg-[#0B1320] text-white rounded-xl text-[10px] lg:text-xs font-bold shadow-2xl z-20 ${isLeft ? 'left-24 lg:left-32' : 'right-24 lg:right-32'
                      }`}>
                      CONTINUAR AQUI
                      <div className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-[#0B1320] rotate-45 ${isLeft ? '-left-1' : '-right-1'
                        }`}></div>
                    </div>
                  )}
                </div>

                {/* Spacer Side */}
                <div className="flex-1"></div>
              </div>
            )
          })}

          {/* Bonus Final Section */}
          <div className="flex flex-col items-center pt-10 pb-8">
            <div className={`w-24 h-24 lg:w-32 lg:h-32 rounded-[36px] lg:rounded-[48px] border-b-[10px] lg:border-b-[12px] flex items-center justify-center shadow-2xl transition-transform ${completedPathMissions === pathMissions.length && pathMissions.length > 0
                ? 'bg-gradient-to-br from-[#F4C430] to-[#D4A100] border-[#B8860B] text-white cursor-pointer hover:scale-110 active:scale-95'
                : 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed opacity-50'
              }`}>
              <Award size={48} className="lg:w-16 lg:h-16" />
            </div>
            <p className={`mt-6 text-lg lg:text-xl font-black ${completedPathMissions === pathMissions.length && pathMissions.length > 0 ? 'text-[#D4A100]' : 'text-gray-300'}`}>
              BAU LENDARIO
            </p>
            <p className="text-gray-400 text-[10px] lg:text-sm font-bold mt-1 tracking-widest uppercase">
              {completedPathMissions === pathMissions.length && pathMissions.length > 0
                ? 'Desbloqueado!'
                : `Complete todos os ${pathMissions.length} modulos`}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Footer */}
      <div className="bg-gradient-to-r from-[#1F7A8C] to-[#4CAF50] rounded-[32px] p-6 text-white">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider mb-1">Missoes Completas</p>
            <p className="text-2xl font-black">{progress.completedMissions}</p>
          </div>
          <div>
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider mb-1">XP na Trilha</p>
            <p className="text-2xl font-black">
              {pathMissions.filter(m => m.status === 'completed').reduce((sum, m) => sum + m.xp, 0)}
            </p>
          </div>
          <div>
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider mb-1">Proxima Recompensa</p>
            <p className="text-2xl font-black">
              {pathMissions.find(m => m.status === 'available')?.xp || 0} XP
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
